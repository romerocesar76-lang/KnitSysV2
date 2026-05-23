/**
 * KnitSys - Configuración de Base de Datos
 * Conexión a TiDB Cloud usando mysql2
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la conexión
const dbConfig = {
  host: process.env.TIDB_HOST,
  port: parseInt(process.env.TIDB_PORT) || 4000,
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE,
  ssl: process.env.TIDB_SSL === 'true' ? {} : false,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Pool de conexiones
let pool = null;

/**
 * Obtiene el pool de conexiones (lo crea si no existe)
 */
function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    
    // Manejar errores de conexión
    pool.on('error', (err) => {
      console.error('Error en pool de MySQL:', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Conexión perdida. Reconectando...');
        pool = null; // Se recreará en la próxima petición
      }
    });
  }
  return pool;
}

/**
 * Ejecuta una consulta a la base de datos
 * @param {string} sql - Consulta SQL
 * @param {Array} params - Parámetros para la consulta
 * @returns {Promise<Array>} Resultado de la consulta
 */
async function query(sql, params = []) {
  try {
    const connection = await getPool().getConnection();
    try {
      const [rows] = await connection.execute(sql, params);
      return rows;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error ejecutando consulta:', error);
    throw error;
  }
}

/**
 * mysql2 devuelve ResultSetHeader en INSERT/UPDATE/DELETE (no un array).
 */
function getMutationMeta(result) {
  if (result && typeof result.affectedRows === 'number') {
    return result;
  }
  if (Array.isArray(result) && result[0] && typeof result[0].affectedRows === 'number') {
    return result[0];
  }
  return { insertId: 0, affectedRows: 0 };
}

function getInsertId(result) {
  return getMutationMeta(result).insertId || 0;
}

function getAffectedRows(result) {
  return getMutationMeta(result).affectedRows || 0;
}

/**
 * Ejecuta una transacción
 * @param {Function} callback - Función que recibe un connection y retorna una promesa
 * @returns {Promise<any>} Resultado de la transacción
 */
async function transaction(callback) {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Verifica la conexión a la base de datos
 */
async function testConnection() {
  try {
    const connection = await getPool().getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ Conexión a TiDB Cloud establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a TiDB Cloud:', error.message);
    return false;
  }
}

/**
 * Cierra todas las conexiones del pool
 */
async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Pool de conexiones cerrado');
  }
}

module.exports = {
  query,
  transaction,
  testConnection,
  closePool,
  getPool,
  getInsertId,
  getAffectedRows,
};