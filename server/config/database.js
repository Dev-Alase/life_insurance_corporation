import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'devendra@2004',
  database: process.env.DB_NAME || 'insurance_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

console.log(pool.getConnection())

const [rows] = await pool.query('SELECT * FROM users');
console.log(rows)

export default pool;