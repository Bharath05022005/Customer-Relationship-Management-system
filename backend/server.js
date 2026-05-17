// server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mssql from 'mssql'; // Make sure mssql is imported here

import authRoutes from './auth.js';
import leadRoutes from './routes/leadRoutes.js';
import dealRoutes from './routes/dealRoutes.js';
import followupRoutes from './routes/followupRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import segmentRoutes from './routes/segmentRoutes.js';
import quotationRoutes from './routes/quotationRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import salesmanDashboardRoutes from './routes/dashboardRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// MS SQL Server Configuration
const dbConfig = { // Renamed to dbConfig for clarity
    user: process.env.DB_USER, // Use environment variables for credentials
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, // e.g., 'localhost' or 'your_server_ip'
    database: process.env.DB_DATABASE, // e.g., 'your_crm_database'
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true', // Use true for Azure SQL Database
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' // Change to false for production, true for self-signed or dev
    }
};

let pool; // Declare a variable to hold the connection pool

// Function to connect to MS SQL Server
async function connectToDatabase() {
    try {
        pool = await mssql.connect(dbConfig);
        console.log('📦 Database connected');
    } catch (err) {
        console.error('❌ Database connection failed!', err.message);
        // Exit process or handle error appropriately if DB connection is critical
        process.exit(1);
    }
}

// Call the connection function immediately
connectToDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to attach the mssql pool to the request object
// This ensures that all routes can access the active database connection.
app.use((req, res, next) => {
    if (!pool || !pool.connected) {
        return res.status(503).json({ success: false, message: 'Database is not connected.' });
    }
    req.db = pool; // Attach the pool to the request object
    next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/followups', followupRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/quotes', quotationRoutes);
app.use('/api/email', emailRoutes);

// Salesman specific routes which will use the attached pool
app.use('/api/salesman', salesmanDashboardRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    if (pool && pool.connected) {
        await pool.close();
        console.log('Database connection closed.');
    }
    process.exit(0);
});