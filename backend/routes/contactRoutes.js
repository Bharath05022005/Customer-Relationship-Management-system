// backend/routes/contactRoutes.js
import express from 'express';
import { sql, poolPromise } from '../db.js';

const router = express.Router();

// Auto-migration helper to add assignedTo column to Contacts table if it doesn't exist
const ensureAssignedToColumn = async (pool) => {
  try {
    await pool.request().query(`
      IF NOT EXISTS (
        SELECT * FROM sys.columns 
        WHERE object_id = OBJECT_ID('Contacts') AND name = 'assignedTo'
      )
      BEGIN
        ALTER TABLE Contacts ADD assignedTo NVARCHAR(255) NULL;
      END
    `);
  } catch (err) {
    console.error('⚠️ Failed to run migration for Contacts table:', err.message);
  }
};

// ✅ GET all contacts
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    await ensureAssignedToColumn(pool);
    const result = await pool.request().query('SELECT * FROM Contacts ORDER BY id DESC');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Failed to fetch contacts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ POST add new contact
router.post('/', async (req, res) => {
  const { name, email, phone, company, notes, assignedTo } = req.body;

  try {
    const pool = await poolPromise;
    await ensureAssignedToColumn(pool);
    await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('phone', sql.NVarChar, phone)
      .input('company', sql.NVarChar, company)
      .input('notes', sql.NVarChar, notes)
      .input('assignedTo', sql.NVarChar, assignedTo || 'unassigned')
      .query(`INSERT INTO Contacts (name, email, phone, company, notes, assignedTo)
              VALUES (@name, @email, @phone, @company, @notes, @assignedTo)`);

    res.status(201).json({ message: 'Contact saved' });
  } catch (err) {
    console.error('❌ Error saving contact:', err);
    res.status(500).json({ message: 'Failed to save contact' });
  }
});

// ✅ PUT update contact
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, company, notes, assignedTo } = req.body;

  try {
    const pool = await poolPromise;
    await ensureAssignedToColumn(pool);
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('phone', sql.NVarChar, phone)
      .input('company', sql.NVarChar, company)
      .input('notes', sql.NVarChar, notes)
      .input('assignedTo', sql.NVarChar, assignedTo)
      .query(`UPDATE Contacts
              SET name = COALESCE(@name, name), 
                  email = COALESCE(@email, email), 
                  phone = COALESCE(@phone, phone),
                  company = COALESCE(@company, company), 
                  notes = COALESCE(@notes, notes),
                  assignedTo = COALESCE(@assignedTo, assignedTo)
              WHERE id = @id`);

    res.json({ message: 'Contact updated' });
  } catch (err) {
    console.error('❌ Error updating contact:', err);
    res.status(500).json({ message: 'Failed to update contact' });
  }
});

// ✅ DELETE contact
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    await pool.request().input('id', sql.Int, id).query('DELETE FROM Contacts WHERE id = @id');
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    console.error('❌ Error deleting contact:', err);
    res.status(500).json({ message: 'Failed to delete contact' });
  }
});

export default router;
