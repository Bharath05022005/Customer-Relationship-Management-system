// routes/segmentRoutes.js
import express from 'express';
import { sql, pool } from '../db.js';

const router = express.Router();

// GET all segments
router.get('/', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM CustomerSegments');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching segments:', err);
    res.status(500).json({ message: 'Failed to retrieve customer segments' });
  }
});

// POST new segment
router.post('/', async (req, res) => {
  const { name, region, industry, interest, dealSize } = req.body;

  try {
    const request = pool.request();
    request.input('name', sql.VarChar, name);
    request.input('region', sql.VarChar, region);
    request.input('industry', sql.VarChar, industry);
    request.input('interest', sql.VarChar, interest);
    request.input('dealSize', sql.VarChar, dealSize);

    await request.query(`
      INSERT INTO CustomerSegments (name, region, industry, interest, dealSize)
      VALUES (@name, @region, @industry, @interest, @dealSize)
    `);

    res.json({ success: true, message: 'Segment added successfully' });
  } catch (err) {
    console.error('Error inserting segment:', err);
    res.status(500).json({ message: 'Database error when inserting segment' });
  }
});

export default router;
