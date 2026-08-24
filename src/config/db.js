const mysql = require('mysql2/promise');
const config = require('./env');

let pool = null;
let isConnected = false;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: config.DB_HOST,
      port: config.DB_PORT,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
      waitForConnections: true,
      connectionLimit: 50,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      decimalNumbers: true
    });
  }
  return pool;
}

/**
 * Execute a single query with parameter sanitization
 */
async function query(sql, params = []) {
  const p = getPool();
  try {
    const [rows] = await p.query(sql, params);
    return rows;
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ER_BAD_DB_ERROR') {
      return [];
    }
    throw error;
  }
}

/**
 * Execute an atomic ACID Transaction
 * @param {Function} callback async function(connection)
 */
async function executeTransaction(callback) {
  const p = getPool();
  let connection;
  try {
    connection = await p.getConnection();
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    if (connection) await connection.rollback();
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

/**
 * Test Connection & Verify MySQL 8.0 Status
 */
async function testConnection() {
  try {
    const p = getPool();
    const [result] = await p.query('SELECT 1 + 1 AS solution');
    isConnected = true;
    console.log('✅ MySQL 8.0 Master Database Connected Successfully.');
    return true;
  } catch (error) {
    isConnected = false;
    console.warn('⚠️ MySQL Database offline/waiting for service:', error.message);
    return false;
  }
}

module.exports = {
  getPool,
  query,
  executeTransaction,
  testConnection,
  isDbConnected: () => isConnected
};
