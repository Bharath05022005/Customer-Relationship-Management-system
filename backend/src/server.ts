import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', require('./routes/leads.routes').default);
app.use('/api/contacts', require('./routes/contacts.routes').default);
app.use('/api/deals', require('./routes/deals.routes').default);
app.use('/api/tasks', require('./routes/tasks.routes').default);
app.use('/api/activity', require('./routes/activity.routes').default);
app.use('/api/segments', require('./routes/segments.routes').default);
app.use('/api/proposals', require('./routes/proposals.routes').default);
app.use('/api/email', require('./routes/email.routes').default);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'VAALTIC API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
