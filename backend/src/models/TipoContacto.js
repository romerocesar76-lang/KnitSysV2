/**
 * KnitSys - Modelo TipoContacto
 * Operaciones CRUD para la tabla tipos_contacto
 */

const db = require('../config/database');

class TipoContacto {
  /**
   * Obtiene todos los tipos de contacto
   * @returns {Promise<Array>} Lista de tipos de contacto
   */
  static async findAll() {
    const sql = `
      SELECT 
        id_tipo_contacto AS id,
        etiqueta,
        descripcion
      FROM tipos_contacto
      ORDER BY etiqueta ASC
    `;
    
    return await db.query(sql);
  }

  /**
   * Obtiene un tipo de contacto por ID
   * @param {number} id - ID del tipo de contacto
   * @returns {Promise<Object|null>} Tipo de contacto encontrado
   */
  static async findById(id) {
    const sql = `
      SELECT 
        id_tipo_contacto AS id,
        etiqueta,
        descripcion
      FROM tipos_contacto
      WHERE id_tipo_contacto = ?
    `;
    
    const rows = await db.query(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Crea un nuevo tipo de contacto
   * @param {Object} data - Datos del tipo de contacto
   * @returns {Promise<number>} ID del tipo creado
   */
  static async create(data) {
    const { etiqueta, descripcion = null } = data;
    
    if (!etiqueta || !etiqueta.trim()) {
      throw new Error('La etiqueta es obligatoria');
    }
    
    const sql = `
      INSERT INTO tipos_contacto (etiqueta, descripcion)
      VALUES (?, ?)
    `;
    
    const result = await db.query(sql, [
      etiqueta.trim(),
      descripcion ? descripcion.trim() : null
    ]);
    
    return db.getInsertId(result);
  }

  /**
   * Actualiza un tipo de contacto
   * @param {number} id - ID del tipo de contacto
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<boolean>} True si se actualizó
   */
  static async update(id, data) {
    const { etiqueta, descripcion = null } = data;
    
    if (!etiqueta || !etiqueta.trim()) {
      throw new Error('La etiqueta es obligatoria');
    }
    
    const sql = `
      UPDATE tipos_contacto 
      SET 
        etiqueta = ?,
        descripcion = ?
      WHERE id_tipo_contacto = ?
    `;
    
    const result = await db.query(sql, [
      etiqueta.trim(),
      descripcion ? descripcion.trim() : null,
      id
    ]);
    
    return db.getAffectedRows(result) > 0;
  }

  /**
   * Elimina un tipo de contacto
   * @param {number} id - ID del tipo de contacto
   * @returns {Promise<boolean>} True si se eliminó
   */
  static async delete(id) {
    const sql = `
      DELETE FROM tipos_contacto
      WHERE id_tipo_contacto = ?
    `;
    
    const result = await db.query(sql, [id]);
    return db.getAffectedRows(result) > 0;
  }
}

module.exports = TipoContacto;
