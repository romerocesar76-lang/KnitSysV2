/**
 * KnitSys - Modelo Empresa
 * Operaciones CRUD para la tabla empresas
 */

const db = require('../config/database');

class Empresa {
  /**
   * Obtiene todas las empresas (con paginación opcional)
   * @param {Object} options - Opciones de paginación y filtrado
   * @returns {Promise<Array>} Lista de empresas
   */
  static async findAll(options = {}) {
    const { page = 1, limit = 20, search = '', activo = true } = options;
    const offset = (page - 1) * limit;
    
    let sql = `
      SELECT 
        e.id,
        e.nombre,
        e.cuit_rut_nif,
        e.condicion_fiscal,
        e.actividad_economica,
        e.sitio_web,
        e.country_code,
        e.activo,
        e.creado_en,
        e.actualizado_en,
        u1.nombre_mostrar as creado_por_nombre,
        u2.nombre_mostrar as actualizado_por_nombre,
        COUNT(ec.id_contacto) as cantidad_contactos
      FROM empresas e
      LEFT JOIN usuarios u1 ON e.creado_por = u1.id
      LEFT JOIN usuarios u2 ON e.actualizado_por = u2.id
      LEFT JOIN empresa_contacto ec ON e.id = ec.id_empresa
      WHERE e.borrado_en IS NULL
    `;
    
    const params = [];
    
    if (search) {
      sql += ` AND (e.nombre LIKE ? OR e.cuit_rut_nif LIKE ? OR e.actividad_economica LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (activo !== undefined) {
      sql += ` AND e.activo = ?`;
      params.push(activo ? 1 : 0);
    }
    
    sql += ` GROUP BY e.id`;
    sql += ` ORDER BY e.nombre ASC`;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));
    
    return await db.query(sql, params);
  }

  /**
   * Obtiene una empresa por ID
   * @param {number} id - ID de la empresa
   * @returns {Promise<Object|null>} Empresa encontrada
   */
  static async findById(id) {
    const sql = `
      SELECT 
        e.*,
        u1.nombre_mostrar as creado_por_nombre,
        u2.nombre_mostrar as actualizado_por_nombre
      FROM empresas e
      LEFT JOIN usuarios u1 ON e.creado_por = u1.id
      LEFT JOIN usuarios u2 ON e.actualizado_por = u2.id
      WHERE e.id = ? AND e.borrado_en IS NULL
    `;
    
    const rows = await db.query(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Obtiene los contactos de una empresa
   * @param {number} empresaId - ID de la empresa
   * @returns {Promise<Array>} Lista de contactos
   */
  static async findContactos(empresaId) {
    const sql = `
      SELECT 
        c.id,
        c.nombre,
        c.apellido,
        c.nombre_mostrar,
        tc.etiqueta as tipo_contacto,
        ec.puesto,
        ec.es_principal,
        ec.notas,
        (SELECT GROUP_CONCAT(correo SEPARATOR ', ') 
         FROM contacto_correos WHERE id_contacto = c.id AND es_principal = 1) as email_principal,
        (SELECT GROUP_CONCAT(telefono SEPARATOR ', ') 
         FROM contacto_telefonos WHERE id_contacto = c.id AND es_principal = 1) as telefono_principal
      FROM contactos c
      INNER JOIN empresa_contacto ec ON c.id = ec.id_contacto
      LEFT JOIN tipos_contacto tc ON c.id_tipo_contacto = tc.id
      WHERE ec.id_empresa = ? AND c.borrado_en IS NULL
      ORDER BY ec.es_principal DESC, c.apellido ASC, c.nombre ASC
    `;
    
    return await db.query(sql, [empresaId]);
  }

  /**
   * Crea una nueva empresa
   * @param {Object} data - Datos de la empresa
   * @returns {Promise<number>} ID de la empresa creada
   */
  static async create(data) {
    const {
      nombre,
      cuit_rut_nif,
      condicion_fiscal,
      actividad_economica,
      sitio_web,
      country_code,
      creado_por
    } = data;
    
    const sql = `
      INSERT INTO empresas 
      (nombre, cuit_rut_nif, condicion_fiscal, actividad_economica, sitio_web, country_code, creado_por)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await db.query(sql, [
      nombre,
      cuit_rut_nif || null,
      condicion_fiscal || null,
      actividad_economica || null,
      sitio_web || null,
      country_code || null,
      creado_por || null
    ]);
    
    return result[0].insertId;
  }

  /**
   * Actualiza una empresa
   * @param {number} id - ID de la empresa
   * @param {Object} data - Datos a actualizar
   * @param {number} actualizado_por - ID del usuario que actualiza
   * @returns {Promise<boolean>} True si se actualizó
   */
  static async update(id, data, actualizado_por = null) {
    const {
      nombre,
      cuit_rut_nif,
      condicion_fiscal,
      actividad_economica,
      sitio_web,
      country_code
    } = data;
    
    const sql = `
      UPDATE empresas 
      SET 
        nombre = ?,
        cuit_rut_nif = ?,
        condicion_fiscal = ?,
        actividad_economica = ?,
        sitio_web = ?,
        country_code = ?,
        actualizado_por = ?
      WHERE id = ?
    `;
    
    const result = await db.query(sql, [
      nombre,
      cuit_rut_nif || null,
      condicion_fiscal || null,
      actividad_economica || null,
      sitio_web || null,
      country_code || null,
      actualizado_por || null,
      id
    ]);
    
    return result[0].affectedRows > 0;
  }

  /**
   * Elimina lógicamente una empresa (soft delete)
   * @param {number} id - ID de la empresa
   * @returns {Promise<boolean>} True si se eliminó
   */
  static async delete(id) {
    const sql = `
      UPDATE empresas 
      SET borrado_en = NOW()
      WHERE id = ? AND borrado_en IS NULL
    `;
    
    const result = await db.query(sql, [id]);
    return result[0].affectedRows > 0;
  }

  /**
   * Activa o desactiva una empresa
   * @param {number} id - ID de la empresa
   * @param {boolean} activo - Estado activo/inactivo
   * @returns {Promise<boolean>} True si se actualizó
   */
  static async toggleActivo(id, activo) {
    const sql = `
      UPDATE empresas 
      SET activo = ?
      WHERE id = ? AND borrado_en IS NULL
    `;
    
    const result = await db.query(sql, [activo ? 1 : 0, id]);
    return result[0].affectedRows > 0;
  }

  /**
   * Vincula un contacto a una empresa
   * @param {number} empresaId - ID de la empresa
   * @param {number} contactoId - ID del contacto
   * @param {Object} data - Datos adicionales (puesto, es_principal, notas)
   * @returns {Promise<number>} ID de la relación creada
   */
  static async addContacto(empresaId, contactoId, data = {}) {
    const { puesto = null, es_principal = 0, notas = null, creado_por = null } = data;
    
    const sql = `
      INSERT INTO empresa_contacto 
      (id_empresa, id_contacto, puesto, es_principal, notas, creado_por)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        puesto = VALUES(puesto),
        es_principal = VALUES(es_principal),
        notas = VALUES(notas)
    `;
    
    const result = await db.query(sql, [
      empresaId,
      contactoId,
      puesto,
      es_principal ? 1 : 0,
      notas,
      creado_por
    ]);
    
    // Si es un INSERT, retorna el ID; si es UPDATE, retorna el ID existente
    if (result[0].insertId) {
      return result[0].insertId;
    } else {
      // Para UPDATE, necesitamos obtener el ID existente
      const existing = await db.query(
        'SELECT id FROM empresa_contacto WHERE id_empresa = ? AND id_contacto = ?',
        [empresaId, contactoId]
      );
      return existing[0]?.id;
    }
  }

  /**
   * Desvincula un contacto de una empresa
   * @param {number} empresaId - ID de la empresa
   * @param {number} contactoId - ID del contacto
   * @returns {Promise<boolean>} True si se desvinculó
   */
  static async removeContacto(empresaId, contactoId) {
    const sql = `
      DELETE FROM empresa_contacto 
      WHERE id_empresa = ? AND id_contacto = ?
    `;
    
    const result = await db.query(sql, [empresaId, contactoId]);
    return result[0].affectedRows > 0;
  }
}

module.exports = Empresa;
