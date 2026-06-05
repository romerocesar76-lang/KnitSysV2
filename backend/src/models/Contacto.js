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
    const { page = 1, limit = 20, search = '', tipoContactoId = null } = options;
    const offset = (page - 1) * limit;
    
    let sql = `
      SELECT 
        c.id_contacto AS id,
        c.nombre,
        c.apellido,
        c.notas,
        c.creado_en,
        tc.id_tipo_contacto AS tipo_contacto_id,
        tc.etiqueta AS tipo_contacto_etiqueta,
        (SELECT COUNT(*) FROM empresa_contacto ec_cnt WHERE ec_cnt.id_contacto = c.id_contacto) as cantidad_empresas,
        (SELECT GROUP_CONCAT(correo SEPARATOR ', ')
         FROM correos WHERE id_contacto = c.id_contacto AND es_principal = 1) as email_principal,
        (SELECT GROUP_CONCAT(telefono SEPARATOR ', ')
         FROM telefonos WHERE id_contacto = c.id_contacto AND es_principal = 1) as telefono_principal,
        (SELECT e.nombre
         FROM empresas e
         INNER JOIN empresa_contacto ec_pr ON e.id_empresa = ec_pr.id_empresa
         WHERE ec_pr.id_contacto = c.id_contacto
         ORDER BY ec_pr.es_principal DESC, e.nombre ASC
         LIMIT 1) as empresa_principal
      FROM contactos c
      LEFT JOIN tipos_contacto tc ON c.id_tipo_contacto = tc.id_tipo_contacto
      WHERE 1 = 1
    `;
    
    const params = [];
    
    if (search) {
      sql += ` AND (c.nombre LIKE ? OR c.apellido LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    if (tipoContactoId) {
      sql += ` AND c.id_tipo_contacto = ?`;
      params.push(tipoContactoId);
    }
    
    const safeLimit = Math.max(1, parseInt(limit, 10) || 20);
    const safeOffset = Math.max(0, parseInt(offset, 10) || 0);
    sql += ` ORDER BY c.apellido ASC, c.nombre ASC`;
    sql += ` LIMIT ${safeLimit} OFFSET ${safeOffset}`;

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
        c.id_contacto AS id,
        c.nombre,
        c.apellido,
        c.notas,
        c.creado_en,
        tc.id_tipo_contacto AS tipo_contacto_id,
        tc.etiqueta AS tipo_contacto_etiqueta,
        tc.descripcion AS tipo_contacto_descripcion
      FROM contactos c
      LEFT JOIN tipos_contacto tc ON c.id_tipo_contacto = tc.id_tipo_contacto
      WHERE c.id_contacto = ?
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
      SELECT id_correo AS id, correo, tipo, es_principal, creado_en
      FROM correos
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
      SELECT id_telefono AS id, telefono, country_code, tipo, es_principal, creado_en
      FROM telefonos
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
        e.id_empresa AS id,
        e.nombre,
        e.cuit_rut_nif,
        ec.puesto,
        ec.es_principal,
        ec.notas
      FROM empresas e
      INNER JOIN empresa_contacto ec ON e.id_empresa = ec.id_empresa
      WHERE ec.id_contacto = ?
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
    const { nombre, apellido, id_tipo_contacto, notas } = data;
    const sql = `
      INSERT INTO contactos
      (nombre, apellido, id_tipo_contacto, notas)
      VALUES (?, ?, ?, ?)
    `;

    const result = await db.query(sql, [
      nombre || null,
      apellido || null,
      id_tipo_contacto || null,
      notas || null
    ]);

    return db.getInsertId(result);
  }

  static async update(id, data) {
    const { nombre, apellido, id_tipo_contacto, notas } = data;
    const sql = `
      UPDATE contactos
      SET
        nombre = ?,
        apellido = ?,
        id_tipo_contacto = ?,
        notas = ?
      WHERE id_contacto = ?
    `;

    const result = await db.query(sql, [
      nombre || null,
      apellido || null,
      id_tipo_contacto || null,
      notas || null,
      id
    ]);

    return db.getAffectedRows(result) > 0;
  }

  static async delete(id) {
    const sql = `
      DELETE FROM contactos
      WHERE id_contacto = ?
    `;

    const result = await db.query(sql, [id]);
    return db.getAffectedRows(result) > 0;
  }

  static async toggleActivo(id, activo) {
    return false;
  }

  /**
   * Agrega un email a un contacto
   * @param {number} contactoId - ID del contacto
   * @param {Object} data - Datos del email
   * @returns {Promise<number>} ID del email creado
   */
  static async addEmail(contactoId, data) {
    const { correo, tipo = 'personal', es_principal = 0 } = data;
    
    if (es_principal) {
      await db.query(
        'UPDATE correos SET es_principal = 0 WHERE id_contacto = ?',
        [contactoId]
      );
    }
    
    const sql = `
      INSERT INTO correos
      (id_contacto, correo, tipo, es_principal)
      VALUES (?, ?, ?, ?)
    `;
    
    const result = await db.query(sql, [
      contactoId,
      correo,
      tipo,
      es_principal ? 1 : 0
    ]);
    
    return db.getInsertId(result);
  }

  /**
   * Elimina un email de un contacto
   * @param {number} contactoId - ID del contacto
   * @param {number} emailId - ID del email
   * @returns {Promise<boolean>} True si se eliminó
   */
  static async removeEmail(contactoId, emailId) {
    const sql = `
      DELETE FROM correos
      WHERE id_contacto = ? AND id_correo = ?
    `;
    
    const result = await db.query(sql, [contactoId, emailId]);
    return db.getAffectedRows(result) > 0;
  }

  /**
   * Agrega un teléfono a un contacto
   * @param {number} contactoId - ID del contacto
   * @param {Object} data - Datos del teléfono
   * @returns {Promise<number>} ID del teléfono creado
   */
  static async addTelefono(contactoId, data) {
    const { telefono, country_code = null, tipo = 'movil', es_principal = 0 } = data;
    
    if (es_principal) {
      await db.query(
        'UPDATE telefonos SET es_principal = 0 WHERE id_contacto = ?',
        [contactoId]
      );
    }
    
    const sql = `
      INSERT INTO telefonos
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
    
    return db.getInsertId(result);
  }

  /**
   * Elimina un teléfono de un contacto
   * @param {number} contactoId - ID del contacto
   * @param {number} telefonoId - ID del teléfono
   * @returns {Promise<boolean>} True si se eliminó
   */
  static async removeTelefono(contactoId, telefonoId) {
    const sql = `
      DELETE FROM telefonos
      WHERE id_contacto = ? AND id_telefono = ?
    `;
    
    const result = await db.query(sql, [contactoId, telefonoId]);
    return db.getAffectedRows(result) > 0;
  }
}

module.exports = Contacto;