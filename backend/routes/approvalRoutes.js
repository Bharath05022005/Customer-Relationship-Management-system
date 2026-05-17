// routes/approvalRoutes.js

const express = require('express');
const router = express.Router();
const sql = require('mssql');
const db = require('../db');

// Get all pending approvals
router.get('/pending', async (req, res) => {
  try {
    const result = await db.request()
      .query('SELECT * FROM Approvals WHERE Status = \'Pending\'');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching approvals:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve or reject a request
router.post('/update', async (req, res) => {
  const { approvalId, status, remarks } = req.body;
  try {
    await db.request()
      .input('ApprovalId', sql.Int, approvalId)
      .input('Status', sql.VarChar, status) // 'Approved' or 'Rejected'
      .input('Remarks', sql.VarChar, remarks)
      .query(`UPDATE Approvals 
              SET Status = @Status, Remarks = @Remarks, UpdatedAt = GETDATE()
              WHERE ApprovalId = @ApprovalId`);
    res.json({ message: 'Approval updated' });
  } catch (err) {
    console.error('Error updating approval:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit an approval request (e.g., from quotation)
router.post('/submit', async (req, res) => {
  const { requestType, referenceId, submittedBy } = req.body; // e.g., Quote, Deal
  try {
    await db.request()
      .input('RequestType', sql.VarChar, requestType)
      .input('ReferenceId', sql.VarChar, referenceId)
      .input('SubmittedBy', sql.Int, submittedBy)
      .query(`INSERT INTO Approvals (RequestType, ReferenceId, SubmittedBy, Status, SubmittedAt)
              VALUES (@RequestType, @ReferenceId, @SubmittedBy, 'Pending', GETDATE())`);
    res.json({ message: 'Approval submitted' });
  } catch (err) {
    console.error('Error submitting approval:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
