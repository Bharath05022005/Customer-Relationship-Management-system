// followupRoutes.js
import express from 'express';
import { sql, poolPromise } from '../db.js';

const router = express.Router();

// Create follow-up
router.post('/', async (req, res) => {
  try {
    const { title, type, description, dueDate, assignedTo, contactId } = req.body;
    const pool = await poolPromise;

    await pool.request()
      .input('title', sql.NVarChar, title)
      .input('type', sql.NVarChar, type)
      .input('description', sql.NVarChar, description)
      // Handle dueDate: pass null if empty, otherwise parse as DateTime
      .input('dueDate', sql.DateTime, dueDate || null)
      .input('assignedTo', sql.NVarChar, assignedTo)
      // Handle contactId: parse to Int if provided and not empty, otherwise pass null
      .input('contactId', sql.Int, contactId ? parseInt(contactId) : null)
      .query(`
        INSERT INTO FollowUps (title, type, description, dueDate, assignedTo, contactId)
        VALUES (@title, @type, @description, @dueDate, @assignedTo, @contactId)
      `);

    res.json({ success: true, message: 'Follow-up created' });
  } catch (err) {
    console.error('❌ Failed to create follow-up:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all follow-ups
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM FollowUps ORDER BY dueDate ASC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Fetch error' });
  }
});

// Mark as completed
router.put('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request().input('id', sql.Int, id)
      .query('UPDATE FollowUps SET status = \'Completed\' WHERE id = @id');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update error' });
  }
});

export default router;