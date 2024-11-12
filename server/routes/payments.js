import express from 'express';
import pool from '../config/database.js';
import { isPolicyHolder } from '../middleware/auth.js';

const router = express.Router();

// Get payment history
router.get('/', async (req, res) => {
  try {
    const [payments] = await pool.query(
      `SELECT py.*, p.type as policy_type
       FROM payments py
       JOIN policies p ON py.policy_id = p.id
       WHERE p.policyholder_id = ?
       ORDER BY py.date DESC`,
      [req.user.id]
    );
    
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Process new payment
router.post('/', isPolicyHolder, async (req, res) => {
  try {
    const { policyId, amount } = req.body;
    
    // Verify policy belongs to user
    const [policies] = await pool.query(
      'SELECT * FROM policies WHERE id = ? AND policyholder_id = ?',
      [policyId, req.user.id]
    );

    if (policies.length === 0) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    // Simulate payment processing
    const status = Math.random() > 0.1 ? 'successful' : 'failed';

    const [result] = await pool.query(
      `INSERT INTO payments (policy_id, amount, status, date) 
       VALUES (?, ?, ?, NOW())`,
      [policyId, amount, status]
    );

    res.status(201).json({
      id: result.insertId,
      policy_id: policyId,
      amount,
      status,
      date: new Date()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;