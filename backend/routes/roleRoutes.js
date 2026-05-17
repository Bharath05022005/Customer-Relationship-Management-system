// routes/roleRoutes.js
import express from 'express';
import { sql, poolPromise } from '../db.js';

const router = express.Router();

// Get all roles and permissions
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Roles');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Assign or update a user's role
router.post('/assign', async (req, res) => {
  const { userId, role } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('UserId', sql.Int, userId)
      .input('Role', sql.VarChar, role)
      .query('UPDATE Salesman SET Role = @Role WHERE id = @UserId');
    res.json({ message: 'Role updated successfully' });
  } catch (err) {
    console.error('Error assigning role:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new role
router.post('/create', async (req, res) => {
  const { roleName, permissions } = req.body; // permissions = "lead,deal,email"
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('RoleName', sql.VarChar, roleName)
      .input('Permissions', sql.VarChar, permissions)
      .query('INSERT INTO Roles (RoleName, Permissions) VALUES (@RoleName, @Permissions)');
    res.json({ message: 'Role created successfully' });
  } catch (err) {
    console.error('Error creating role:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
