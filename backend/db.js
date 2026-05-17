// db.js
import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();

export const dbConfig = {
  user: process.env.DB_USER || 'your_db_username',
  password: process.env.DB_PASSWORD || 'your_db_password',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'your_database_name',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const pool = new sql.ConnectionPool(dbConfig);
const poolPromise = pool.connect();

async function connectDb() {
  try {
    await pool.connect();
    console.log('📦 Database connected');
  } catch (err) {
    console.error('❌ DB connection error:', err);
    throw err;
  }
}
connectDb();

export { sql, pool, poolPromise };
