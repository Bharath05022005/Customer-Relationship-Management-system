import express from 'express';
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// ✅ Database config from .env
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

// Auto-migration helper to add assignedTo column to Quotations table if it doesn't exist
const ensureAssignedToColumn = async (pool) => {
  try {
    await pool.request().query(`
      IF NOT EXISTS (
        SELECT * FROM sys.columns 
        WHERE object_id = OBJECT_ID('Quotations') AND name = 'assignedTo'
      )
      BEGIN
        ALTER TABLE Quotations ADD assignedTo NVARCHAR(255) NULL;
      END
    `);
  } catch (err) {
    console.error('⚠️ Failed to run migration for Quotations table:', err.message);
  }
};

// ✅ [GET] All quotations
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    await ensureAssignedToColumn(pool);
    const result = await pool
      .request()
      .query('SELECT * FROM Quotations ORDER BY createdAt DESC');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Failed to fetch quotations:', err);
    res.status(500).json({ message: 'Failed to fetch quotations' });
  }
});

// ✅ [POST] New quotation
router.post('/', async (req, res) => {
  const { clientName, email, item, price, quantity, assignedTo } = req.body;

  // Validate
  if (!clientName || !email || !item || !price || !quantity) {
    return res
      .status(400)
      .json({ success: false, message: 'All fields are required' });
  }

  try {
    const pool = await sql.connect(dbConfig);
    await ensureAssignedToColumn(pool);
    await pool
      .request()
      .input('clientName', sql.VarChar, clientName)
      .input('email', sql.VarChar, email)
      .input('item', sql.VarChar, item)
      .input('price', sql.Decimal(10, 2), price)
      .input('quantity', sql.Int, quantity)
      .input('assignedTo', sql.VarChar, assignedTo || 'unassigned')
      .query(
        `INSERT INTO Quotations (clientName, email, item, price, quantity, assignedTo, createdAt)
         VALUES (@clientName, @email, @item, @price, @quantity, @assignedTo, GETDATE())`
      );

    res.status(200).json({ success: true, message: 'Quotation saved' });
  } catch (err) {
    console.error('❌ SQL Error saving quotation:', err);
    res.status(500).json({ success: false, message: 'Failed to save quotation' });
  }
});

// ✅ [GET] Quotation preview (PDF-friendly HTML)
router.get('/generate-pdf/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Quotations WHERE id = @id');

    const quote = result.recordset[0];
    if (!quote) {
      return res.status(404).send('Quotation not found');
    }

    // Render PDF preview in browser
    const html = `
      <html>
        <head>
          <title>Quotation PDF</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .container { max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Quotation</h2>
            <p><span class="label">Client:</span> ${quote.clientName}</p>
            <p><span class="label">Email:</span> ${quote.email}</p>
            <p><span class="label">Item:</span> ${quote.item}</p>
            <p><span class="label">Price:</span> ₹${quote.price}</p>
            <p><span class="label">Quantity:</span> ${quote.quantity}</p>
            <p><span class="label">Total:</span> ₹${quote.price * quote.quantity}</p>
            <p><span class="label">Drafted By:</span> ${quote.assignedTo || 'System'}</p>
            <p><span class="label">Date:</span> ${new Date(
              quote.createdAt
            ).toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.error('❌ Error generating PDF:', err);
    res.status(500).send('Failed to generate quotation preview');
  }
});

export default router;
