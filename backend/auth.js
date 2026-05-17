// auth.js
import express from 'express';
import { sql, pool } from './db.js';

const router = express.Router();

// 📝 Signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.json({ success: false, message: 'All fields are required' });
  }

  try {
    const request = pool.request();
    request.input('email', sql.VarChar, email);
    const existing = await request.query('SELECT * FROM Salesman WHERE email = @email');

    if (existing.recordset.length > 0) {
      return res.json({ success: false, message: 'User already exists' });
    }

    const insertRequest = pool.request();
    insertRequest.input('username', sql.VarChar, username);
    insertRequest.input('email', sql.VarChar, email);
    insertRequest.input('password', sql.VarChar, password);
    await insertRequest.query(
      'INSERT INTO Salesman (username, email, password) VALUES (@username, @email, @password)'
    );

    res.json({ success: true, message: 'Signup successful' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Database error during signup' });
  }
});

// 🔐 Signin
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: 'Email and password are required' });
  }

  try {
    const request = pool.request();
    request.input('email', sql.VarChar, email);
    request.input('password', sql.VarChar, password);
    const result = await request.query(
      'SELECT id, username FROM Salesman WHERE email = @email AND password = @password'
    );

    if (result.recordset.length > 0) {
      const salesman = result.recordset[0];
      res.json({
        success: true,
        message: `Welcome ${salesman.username}`,
        salesmanId: salesman.id,
        username: salesman.username,
      });
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ success: false, message: 'Database error during signin' });
  }
});

export default router;
