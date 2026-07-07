/**
 * db.js
 * =====
 * MySQL connection pool and helper functions for calling stored procedures
 * and functions only. The application never sends raw SQL queries.
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'NUTMS',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Call a stored procedure.
 * @param {string} procName - e.g. 'sp_GetVehicles'
 * @param {Array} params - positional parameters
 * @returns {Promise<Array<Array<object>>>} array of result sets (each an array of rows)
 */
async function callProc(procName, params = []) {
  const placeholders = params.map(() => '?').join(', ');
  const sql = `CALL ${procName}(${placeholders})`;
  const [rows] = await pool.query(sql, params);
  // mysql2 returns an array where the last element is metadata (OkPacket);
  // all preceding elements are result sets (each an array of row objects)
  if (Array.isArray(rows)) {
    const resultSets = rows.filter((r) => Array.isArray(r));
    return resultSets;
  }
  return [];
}

/**
 * Call a stored procedure and return only the first result set's rows.
 */
async function callProcSingle(procName, params = []) {
  const resultSets = await callProc(procName, params);
  return resultSets.length > 0 ? resultSets[0] : [];
}

/**
 * Call a stored FUNCTION and return its scalar value.
 * @param {string} funcName - e.g. 'fn_ActiveVehicleCount'
 * @param {Array} params
 */
async function callFunction(funcName, params = []) {
  const placeholders = params.map(() => '?').join(', ');
  const sql = `SELECT ${funcName}(${placeholders}) AS result`;
  const [rows] = await pool.query(sql, params);
  return rows[0] ? rows[0].result : null;
}

module.exports = { pool, callProc, callProcSingle, callFunction };
