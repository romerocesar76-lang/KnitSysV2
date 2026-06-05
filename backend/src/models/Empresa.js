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
    const { page = 1, limit = 20, search = '' } = options;
    const offset = (page - 1) * limit;
    
    let sql = `
      SELECT 
        e.id_empresa AS id,
        e.nombre,
        e.actividad_economica,
        -- tipo de contacto representativo (primer contacto principal si existe)
        (SELECT tc.etiqueta
         FROM empresa_contacto ec
         INNER JOIN contactos c ON ec.id_contacto = c.id_contacto
         LEFT JOIN tipos_contacto tc ON c.id_tipo_contacto = tc.id_tipo_contacto
         WHERE ec.id_empresa = e.id_empresa
         ORDER BY ec.es_principal DESC
         LIMIT 1) AS tipo_contacto,
        e.creado_en
      FROM empresas e
      WHERE 1 = 1
    `;
    
    const params = [];
    
    if (search) {
      sql += ` AND (e.nombre LIKE ? OR e.cuit_rut_nif LIKE ? OR e.actividad_economica LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    const safeLimit = Math.max(1, parseInt(limit, 10) || 20);
    const safeOffset = Math.max(0, parseInt(offset, 10) || 0);
    sql += ` ORDER BY e.nombre ASC`;
    sql += ` LIMIT ${safeLimit} OFFSET ${safeOffset}`;

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
        e.id_empresa AS id,
        e.nombre,
        e.cuit_rut_nif,
        e.condicion_fiscal,
        e.actividad_economica,
        e.sitio_web,
        e.creado_en
      FROM empresas e
      WHERE e.id_empresa = ?
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
        c.id_contacto AS id,
        c.nombre,
        c.apellido,
        tc.etiqueta as tipo_contacto,
        ec.puesto,
        ec.es_principal,
        ec.notas,
        (SELECT GROUP_CONCAT(correo SEPARATOR ', ')
         FROM correos WHERE id_contacto = c.id_contacto AND es_principal = 1) as email_principal,
        (SELECT GROUP_CONCAT(telefono SEPARATOR ', ')
         FROM telefonos WHERE id_contacto = c.id_contacto AND es_principal = 1) as telefono_principal
      FROM contactos c
      INNER JOIN empresa_contacto ec ON c.id_contacto = ec.id_contacto
      LEFT JOIN tipos_contacto tc ON c.id_tipo_contacto = tc.id_tipo_contacto
      WHERE ec.id_empresa = ?
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
      sitio_web
    } = data;
    
    const sql = `
      INSERT INTO empresas 
      (nombre, cuit_rut_nif, condicion_fiscal, actividad_economica, sitio_web)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await db.query(sql, [
      nombre,
      cuit_rut_nif || null,
      condicion_fiscal || null,
      actividad_economica || null,
      sitio_web || null
    ]);
    
    return db.getInsertId(result);
  }

  /**
   * Actualiza una empresa
   * @param {number} id - ID de la empresa
   * @param {Object} data - Datos a actualizar
   * @param {number} actualizado_por - ID del usuario que actualiza
   * @returns {Promise<boolean>} True si se actualizó
   */
  static async update(id, data) {
    const {
      nombre,
      cuit_rut_nif,
      condicion_fiscal,
      actividad_economica,
      sitio_web
    } = data;
    
    const sql = `
      UPDATE empresas 
      SET 
        nombre = ?,
        cuit_rut_nif = ?,
        condicion_fiscal = ?,
        actividad_economica = ?,
        sitio_web = ?
      WHERE id_empresa = ?
    `;
    
    const result = await db.query(sql, [
      nombre,
      cuit_rut_nif || null,
      condicion_fiscal || null,
      actividad_economica || null,
      sitio_web || null,
      id
    ]);
    
    return db.getAffectedRows(result) > 0;
  }

  /**
   * Elimina lógicamente una empresa (soft delete)
   * @param {number} id - ID de la empresa
   * @returns {Promise<boolean>} True si se eliminó
   */
  static async delete(id) {
    const sql = `
      DELETE FROM empresas 
      WHERE id_empresa = ?
    `;
    
    const result = await db.query(sql, [id]);
    return db.getAffectedRows(result) > 0;
  }

  static async toggleActivo(id, activo) {
    return false;
  }

  /**
   * Vincula un contacto a una empresa
   * @param {number} empresaId - ID de la empresa
   * @param {number} contactoId - ID del contacto
   * @param {Object} data - Datos adicionales (puesto, es_principal, notas)
   * @returns {Promise<number>} ID de la relación creada
   */
  static async addContacto(empresaId, contactoId, data = {}) {
    const { puesto = null, es_principal = 0, notas = null } = data;
    
    const sql = `
      INSERT INTO empresa_contacto 
      (id_empresa, id_contacto, puesto, es_principal, notas)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await db.query(sql, [
      empresaId,
      contactoId,
      puesto,
      es_principal ? 1 : 0,
      notas
    ]);
    
    return db.getInsertId(result);
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
    return db.getAffectedRows(result) > 0;
  }
}

module.exports = Empresa;
