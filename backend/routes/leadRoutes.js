import express from 'express';
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// SQL Server Configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// ✅ [1] GET all leads
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM Leads ORDER BY createdAt DESC');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching leads:', err);
    res.status(500).json({ message: 'Failed to fetch leads' });
  }
});

// ✅ [2] POST a new lead
router.post('/', async (req, res) => {
  const {
    name,
    email,
    phone,
    company,
    status,
    source,
    assignedTo,
    lastContact,
    value,
  } = req.body;

  // Validate required fields
  if (!name || !email || !status || !source) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('name', sql.VarChar, name)
      .input('email', sql.VarChar, email)
      .input('phone', sql.VarChar, phone || '')
      .input('company', sql.VarChar, company || '')
      .input('status', sql.VarChar, status)
      .input('source', sql.VarChar, source)
      .input('assignedTo', sql.VarChar, assignedTo || 'unassigned')
      .input('lastContact', sql.DateTime, lastContact ? new Date(lastContact) : null)
      .input('value', sql.Decimal(10, 2), value || 0)
      .query(`
        INSERT INTO Leads (
          name, email, phone, company, status, source, assignedTo, lastContact, value, createdAt
        ) VALUES (
          @name, @email, @phone, @company, @status, @source, @assignedTo, @lastContact, @value, GETDATE()
        )
      `);

    res.status(200).json({ success: true, message: 'Lead saved successfully' });
  } catch (err) {
    console.error('❌ Error inserting lead:', err);
    res.status(500).json({ success: false, message: 'Failed to save lead' });
  }
});

// ✅ [3] GET lead by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Leads WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('❌ Error fetching lead by ID:', err);
    res.status(500).json({ message: 'Failed to fetch lead' });
  }
});

// ✅ [4] PUT update lead (e.g. for Assignment and Status changes like Zoho)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, company, status, source, assignedTo, lastContact, value } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar, name)
      .input('email', sql.VarChar, email)
      .input('phone', sql.VarChar, phone)
      .input('company', sql.VarChar, company)
      .input('status', sql.VarChar, status)
      .input('source', sql.VarChar, source)
      .input('assignedTo', sql.VarChar, assignedTo)
      .input('lastContact', sql.DateTime, lastContact ? new Date(lastContact) : null)
      .input('value', sql.Decimal(10, 2), value)
      .query(`
        UPDATE Leads SET
          name = COALESCE(@name, name),
          email = COALESCE(@email, email),
          phone = COALESCE(@phone, phone),
          company = COALESCE(@company, company),
          status = COALESCE(@status, status),
          source = COALESCE(@source, source),
          assignedTo = COALESCE(@assignedTo, assignedTo),
          lastContact = COALESCE(@lastContact, lastContact),
          value = COALESCE(@value, value)
        WHERE id = @id
      `);

    res.json({ success: true, message: '✅ Lead updated successfully' });
  } catch (err) {
    console.error('❌ Error updating lead:', err);
    res.status(500).json({ success: false, message: 'Failed to update lead' });
  }
});

// ✅ [5] DELETE lead (Admin cleanup like Zoho)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Leads WHERE id = @id');

    res.json({ success: true, message: '🗑️ Lead deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting lead:', err);
    res.status(500).json({ success: false, message: 'Failed to delete lead' });
  }
});

export default router;
