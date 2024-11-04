import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import policyRoutes from './routes/policies.js';
import claimRoutes from './routes/claims.js';
import paymentRoutes from './routes/payments.js';
import agentRoutes from './routes/agents.js';
import userRoutes from './routes/users.js'
import { verifyToken } from './middleware/auth.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/policies', verifyToken, policyRoutes);
app.use('/api/claims', verifyToken, claimRoutes);
app.use('/api/payments', verifyToken, paymentRoutes);
app.use('/api/agents', verifyToken, agentRoutes);
app.use('/api/users',verifyToken, userRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});