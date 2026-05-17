const express = require('express');
const router = express.Router();
const sql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// MSSQL configuration (set in .env)
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

// Helper to connect
async function getPool() {
  const pool = await sql.connect(dbConfig);
  return pool;
}

// Admin login (credentials stored in env)
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Issue admin token
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

// Salesman signup
router.post('/salesman/signup', async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const pool = await getPool();
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.request()
      .input('Name', sql.NVarChar, name)
      .input('Email', sql.NVarChar, email)
      .input('Password', sql.NVarChar, hashed)
      .query(`INSERT INTO Salesmen (Name, Email, PasswordHash) VALUES (@Name, @Email, @Password)`);
    res.status(201).json({ message: 'Salesman registered' });
  } catch (err) {
    if (err.number === 2627) {
      res.status(409).json({ message: 'Email already in use' });
    } else next(err);
  }
});

// Salesman login
router.post('/salesman/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const pool = await getPool();
    const { recordset } = await pool.request()
      .input('Email', sql.NVarChar, email)
      .query(`SELECT Id, Name, PasswordHash FROM Salesmen WHERE Email = @Email`);
    if (!recordset.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = recordset[0];
    const valid = await bcrypt.compare(password, user.PasswordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ role: 'salesman', id: user.Id, name: user.Name }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
