// routes/activityRoutes.js
import express from 'express';
import { sql, pool } from '../db.js';

const router = express.Router();

// GET all activities
router.get('/', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM ActivityLog ORDER BY dateTime DESC');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ message: 'Failed to fetch activity log' });
  }
});

// POST new activity
router.post('/', async (req, res) => {
  const { type, subject, description, relatedTo } = req.body;

  if (!type || !subject || !description) {
    return res.status(400).json({ message: 'Type, subject, and description are required' });
  }

  try {
    const request = pool.request();
    request.input('type', sql.VarChar, type);
    request.input('subject', sql.VarChar, subject);
    request.input('description', sql.Text, description);
    request.input('relatedTo', sql.VarChar, relatedTo);

    await request.query(`
      INSERT INTO ActivityLog (type, subject, description, relatedTo, dateTime)
      VALUES (@type, @subject, @description, @relatedTo, GETDATE())
    `);

    res.json({ success: true, message: 'Activity logged successfully!' });
  } catch (err) {
    console.error('Error adding activity:', err);
    res.status(500).json({ message: 'Database error when logging activity' });
  }
});

export default router;
