// routes/DashboardRoutes.js
import express from 'express';

import { sql, poolPromise } from '../db.js';

const router = express.Router();

router.get('/summary', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT
        (SELECT COUNT(*) FROM Leads) AS totalLeads,
        (SELECT COUNT(*) FROM Deals WHERE Stage = 'Won') AS closedDeals,
        (SELECT COUNT(*) FROM Deals) AS totalDeals,
        (SELECT SUM(Value) FROM Deals) AS totalPipelineValue
    `);

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching dashboard summary:', err);
    res.status(500).json({ error: 'Dashboard data fetch failed' });
  }
});

export default router; // ✅ Required for ES module
