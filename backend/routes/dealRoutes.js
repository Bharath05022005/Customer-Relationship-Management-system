// routes/dealRoutes.js
import express from 'express';
import { sql, poolPromise } from '../db.js';

const router = express.Router();

// Auto-migration helper to add assignedTo column to Deals table if it doesn't exist
const ensureAssignedToColumn = async (pool) => {
  try {
    await pool.request().query(`
      IF NOT EXISTS (
        SELECT * FROM sys.columns 
        WHERE object_id = OBJECT_ID('Deals') AND name = 'assignedTo'
      )
      BEGIN
        ALTER TABLE Deals ADD assignedTo NVARCHAR(255) NULL;
      END
    `);
  } catch (err) {
    console.error('⚠️ Failed to run migration for Deals table:', err.message);
  }
};

// ✅ GET all deals
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    await ensureAssignedToColumn(pool);
    const result = await pool.request().query(`
      SELECT id, dealName, value, stage, expectedCloseDate, contactName, company, assignedTo
      FROM Deals
      ORDER BY id DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Failed to fetch deals:', err);
    res.status(500).json({ message: 'Server error while fetching deals' });
  }
});

// ✅ POST create new deal
router.post('/', async (req, res) => {
  const { dealName, value, stage, expectedCloseDate, contactName, company, assignedTo } = req.body;

  if (!dealName || !value || !stage) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  try {
    const pool = await poolPromise;
    await ensureAssignedToColumn(pool);

    await pool.request()
      .input('dealName', sql.NVarChar, dealName)
      .input('value', sql.Int, value)
      .input('stage', sql.NVarChar, stage)
      .input('expectedCloseDate', sql.Date, expectedCloseDate || null)
      .input('contactName', sql.NVarChar, contactName || null)
      .input('company', sql.NVarChar, company || null)
      .input('assignedTo', sql.NVarChar, assignedTo || 'unassigned')
      .query(`
        INSERT INTO Deals (dealName, value, stage, expectedCloseDate, contactName, company, assignedTo)
        VALUES (@dealName, @value, @stage, @expectedCloseDate, @contactName, @company, @assignedTo)
      `);

    res.status(201).json({ success: true, message: '✅ Deal saved' });
  } catch (err) {
    console.error('❌ Failed to save deal:', err);
    res.status(500).json({ message: 'Server error while saving deal' });
  }
});

// ✅ PUT update a deal
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { dealName, value, stage, expectedCloseDate, contactName, company, assignedTo } = req.body;

  try {
    const pool = await poolPromise;
    await ensureAssignedToColumn(pool);

    await pool.request()
      .input('id', sql.Int, id)
      .input('dealName', sql.NVarChar, dealName)
      .input('value', sql.Int, value)
      .input('stage', sql.NVarChar, stage)
      .input('expectedCloseDate', sql.Date, expectedCloseDate || null)
      .input('contactName', sql.NVarChar, contactName || null)
      .input('company', sql.NVarChar, company || null)
      .input('assignedTo', sql.NVarChar, assignedTo)
      .query(`
        UPDATE Deals SET
          dealName = COALESCE(@dealName, dealName),
          value = COALESCE(@value, value),
          stage = COALESCE(@stage, stage),
          expectedCloseDate = COALESCE(@expectedCloseDate, expectedCloseDate),
          contactName = COALESCE(@contactName, contactName),
          company = COALESCE(@company, company),
          assignedTo = COALESCE(@assignedTo, assignedTo)
        WHERE id = @id
      `);

    res.json({ success: true, message: '✅ Deal updated' });
  } catch (err) {
    console.error('❌ Failed to update deal:', err);
    res.status(500).json({ message: 'Server error while updating deal' });
  }
});

// ✅ DELETE a deal
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM Deals WHERE id = @id`);
    res.json({ success: true, message: '🗑️ Deal deleted' });
  } catch (err) {
    console.error('❌ Failed to delete deal:', err);
    res.status(500).json({ message: 'Server error while deleting deal' });
  }
});

export default router;