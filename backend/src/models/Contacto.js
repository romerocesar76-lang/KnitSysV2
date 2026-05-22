/**
 * KnitSys - Modelo Contacto
 * Operaciones CRUD para la tabla contactos (individuos)
 */

const db = require('../config/database');

class Contacto {
  /**
   * Obtiene todos los contactos (con paginación opcional)
   * @param {Object} options - Opciones de paginación y filtrado
   * @returns {Promise<Array>} Lista de contactos
   */
  static async findAll(options = {}) {
    const { page = 1, limit = 20, search = '', tipoContactoId = null, activo = true } = options;
    const offset = (page - 1) * limit;
    
    let sql = `
      SELECT 
        c.id,
        c.nombre,
        c.apellido,
        c.nombre_mostrar,
        c.resumen_notas,
        c.country_code,
        c.activo,
        c.creado_en,
        c.actualizado_en,
        tc.id as tipo_contacto_id,
        tc.etiqueta as tipo_contacto_etiqueta,
        u1.nombre_mostrar as creado_por_nombre,
        u2.nombre_mostrar as actualizado_por_nombre,
        COUNT(ec.id_empresa) as cantidad_empresas,
        (SELECT GROUP_CONCAT(correo SEPARATOR ', ') 
         FROM contacto_correos WHERE id_contacto = c.id AND es_principal = 1) as email_principal,
        (SELECT GROUP_CONCAT(telefono SEPARATOR ', ') 
         FROM contacto_telefonos WHERE id_contacto = c.id AND es_principal = 1) as telefono_principal
      FROM contactos c
      LEFT JOIN tipos_contacto tc ON c.id_tipo_contacto = tc.id
      LEFT JOIN usuarios u1 ON c.creado_por = u1.id
      LEFT JOIN usuarios u2 ON c.actualizado_por = u2.id
      LEFT JOIN empresa_contacto ec ON c.id = ec.id_contacto
      WHERE c.borrado_en IS NULL
    `;
    
    const params = [];
    
    if (search) {
      sql += ` AND (c.nombre LIKE ? OR c.apellido LIKE ? OR c.nombre_mostrar LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (tipoContactoId) {
      sql += ` AND c.id_tipo_contacto = ?`;
      params.push(tipoContactoId);
    }
    
    if (activo !== undefined) {
      sql += ` AND c.activo = ?`;
      params.push(activo ? 1 : 0);
    }
    
    sql += ` GROUP BY c.id`;
    sql += ` ORDER BY c.apellido ASC, c.nombre ASC`;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));
    
    return await db.query(sql, params);
  }

  /**
   * Obtiene un contacto por ID
   * @param {number} id - ID del contacto
   * @returns {Promise<Object|null>} Contacto encontrado
   */
  static async findById(id) {
    const sql = `
      SELECT 
        c.*,
        tc.id as tipo_contacto_id,
        tc.etiqueta as tipo_contacto_etiqueta,
        tc.descripcion as tipo_contacto_descripcion,
        u1.nombre_mostrar as creado_por_nombre,
        u2.nombre_mostrar as actualizado_por_nombre
      FROM contactos c
      LEFT JOIN tipos_contacto tc ON c.id_tipo_contacto = tc.id
      LEFT JOIN usuarios u1 ON c.creado_por = u1.id
      LEFT JOIN usuarios u2 ON c.actualizado_por = u2.id
      WHERE c.id = ? AND c.borrado_en IS NULL
    `;
    
    const rows = await db.query(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Obtiene los emails de un contacto
   * @param {number} contactoId - ID del contacto
   * @returns {Promise<Array>} Lista de emails
   */
  static async findEmails(contactoId) {
    const sql = `
      SELECT id, correo, tipo, es_principal, verificado, creado_en
      FROM contacto_correos
      WHERE id_contacto = ?
      ORDER BY es_principal DESC, correo ASC
    `;
    
    return await db.query(sql, [contactoId]);
  }

  /**
   * Obtiene los teléfonos de un contacto
   * @param {number} contactoId - ID del contacto
   * @returns {Promise<Array>} Lista de teléfonos
   */
  static async findTelefonos(contactoId) {
    const sql = `
      SELECT id, telefono, country_code, tipo, es_principal, creado_en
      FROM contacto_telefonos
      WHERE id_contacto = ?
      ORDER BY es_principal DESC, telefono ASC
    `;
    
    return await db.query(sql, [contactoId]);
  }

  /**
   * Obtiene las empresas de un contacto
   * @param {number} contactoId - ID del contacto
   * @returns {Promise<Array>} Lista de empresas
   */
  static async findEmpresas(contactoId) {
    const sql = `
      SELECT 
        e.id,
        e.nombre,
        e.cuit_rut_nif,
        ec.puesto,
        ec.es_principal,
        ec.notas
      FROM empresas e
      INNER JOIN empresa_contacto ec ON e.id = ec.id_empresa
      WHERE ec.id_contacto = ? AND e.borrado_en IS NULL
      ORDER BY ec.es_principal DESC, e.nombre ASC
    `;
    
    return await db.query(sql, [contactoId]);
  }

  /**
   * Crea un nuevo contacto
   * @param {Object} data - Datos del contacto
   * @returns {Promise<number>} ID del contacto creado
   */
  static async create(data) {
    const {
      nombre,
      apellido,
      nombre_mostrar,
      id_tipo_contacto,
      resumen_notas,
      country_code,
      creado_por
    } = data;
    
    const sql = `
      INSERT INTO contactos 
      (nombre, apellido, nombre_mostrar, id_tipo_contacto, resumen_notas, country_code, creado_por)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await db.query(sql, [
      nombre || null,
      apellido || null,
      nombre_mostrar || null,
      id_tipo_contacto || null,
      resumen_notas || null,
      country_code || null,
      creado_por || null
    ]);
    
    return result[0].insertId;
  }

  /**
   * Actualiza un contacto
   * @param {number} id - ID del contacto
   * @param {Object} data - Datos a actualizar
   * @param {number} actualizado_por - ID del usuario que actualiza
   * @returns {Promise<boolean>} True si se actualizó
   */
  static async update(id, data, actualizado_por = null) {
    const {
      nombre,
      apellido,
      nombre_mostrar,
      id_tipo_contacto,
      resumen_notas,
      country_code
    } = data;
    
    const sql = `
      UPDATE contactos 
      SET 
        nombre = ?,
        apellido = ?,
        nombre_mostrar = ?,
        id_tipo_contacto = ?,
        resumen_notas = ?,
        country_code = ?,
        actualizado_por = ?
      WHERE id = ?
    `;
    
    const result = await db.query(sql, [
      nombre || null,
      apellido || null,
      nombre_mostrar || null,
      id_tipo_contacto || null,
      resumen_notas || null,
      country_code || null,
      actualizado_por || null,
      id
    ]);
    
    return result[0].affectedRows > 0;
  }

  /**
   * Elimina lógicamente un contacto (soft delete)
   * @param {number} id - ID del contacto
   * @returns {Promise<boolean>} True si se eliminó
   */
  static async delete(id) {
    const sql = `
      UPDATE contactos 
      SET borrado_en = NOW()
      WHERE id = ? AND borrado_en IS NULL
    `;
    
    const result = await db.query(sql, [id]);
    return result[0].affectedRows > 0;
  }

  /**
   * Activa o desactiva un contacto
   * @param {number} id - ID del contacto
   * @param {boolean} activo - Estado activo/inactivo
   * @returns {Promise<boolean>} True si se actualizó
   */
  static async toggleActivo(id, activo) {
    const sql = `
      UPDATE contactos 
      SET activo = ?
      WHERE id = ? AND borrado_en IS NULL
    `;
    
    const result = await db.query(sql, [activo ? 1 : 0, id]);
    return result[0].affectedRows > 0;
  }

  /**
   * Agrega un email a un contacto
   * @param {number} contactoId - ID del contacto
   * @param {Object} data - Datos del email
   * @returns {Promise<number>} ID del email creado
   */
  static async addEmail(contactoId, data) {
    const { correo, tipo = 'personal', es_principal = 0, verificado = 0 } = data;
    
    // Si es principal, desmarcar los demás
    if (es_principal) {
      await db.query(
        'UPDATE contacto_correos SET es_principal = 0 WHERE id_contacto = ?',
        [contactoId]
      );
    }
    
    const sql = `
      INSERT INTO contacto_correos 
      (id_contacto, correo, tipo, es_principal, verificado)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await db.query(sql, [
      contactoId,
      correo,
      tipo,
      es_principal ? 1 : 0,
      verificado ? 1 : 0
    ]);
    
    return result[0].insertId;
  }

  /**
   * Elimina un email de un contacto
   * @param {number} contactoId - ID del contacto
   * @param {number} emailId - ID del email
   * @returns {Promise<boolean>} True si se eliminó
   */
  static async removeEmail(contactoId, emailId) {
    const sql = `
      DELETE FROM contacto_correos 
      WHERE id_contacto = ? AND id = ?
    `;
    
    const result = await db.query(sql, [contactoId, emailId]);
    return result[0].affectedRows > 0;
  }

  /**
   * Agrega un teléfono a un contacto
   * @param {number} contactoId - ID del contacto
   * @param {Object} data - Datos del teléfono
   * @returns {Promise<number>} ID del teléfono creado
   */
  static async addTelefono(contactoId, data) {
    const { telefono, country_code = null, tipo = 'movil', es_principal = 0 } = data;
    
    // Si es principal, desmarcar los demás
    if (es_principal) {
      await db.query(
        'UPDATE contacto_telefonos SET es_principal = 0 WHERE id_contacto = ?',
        [contactoId]
      );
    }
    
    const sql = `
      INSERT INTO contacto_telefonos 
      (id_contacto, telefono, country_code, tipo, es_principal)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await db.query(sql, [
      contactoId,
      telefono,
      country_code,
      tipo,
      es_principal ? 1 : 0
    ]);
    
    return result[0].insertId;
  }

  /**
   * Elimina un teléfono de un contacto
   * @param {number} contactoId - ID del contacto
   * @param {number} telefonoId - ID del teléfono
   * @returns {Promise<boolean>} True si se eliminó
   */
  static async removeTelefono(contactoId, telefonoId) {
    const sql = `
      DELETE FROM contacto_telefonos 
      WHERE id_contacto = ? AND id = ?
    `;
    
    const result = await db.query(sql, [contactoId, telefonoId]);
    return result[0].affectedRows > 0;
  }
}

module.exports = Contacto;