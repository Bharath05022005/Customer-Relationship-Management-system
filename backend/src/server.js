import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.routes.js";
import leadsRoutes from "./routes/leads.routes.js";
import contactsRoutes from "./routes/contacts.routes.js";
import dealsRoutes from "./routes/deals.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import segmentsRoutes from "./routes/segments.routes.js";
import proposalsRoutes from "./routes/proposals.routes.js";
import emailRoutes from "./routes/email.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/segments', segmentsRoutes);
app.use('/api/proposals', proposalsRoutes);
app.use('/api/email', emailRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'VAALTIC API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});