import express from 'express';
import pool from '../config/database.js';
import { isAgent, isPolicyHolder } from '../middleware/auth.js';

const router = express.Router();

// Get claims (filtered by user type)
router.get('/', async (req, res) => {
  try {
    let query;
    const params = [];

    if (req.user.type === 'policyholder') {
      query = `
        SELECT c.*, p.type as policy_type 
        FROM claims c
        JOIN policies p ON c.policy_id = p.id
        WHERE p.policyholder_id = ?
      `;
      params.push(req.user.id);
    } else {
      query = `
        SELECT c.*, p.type as policy_type, u.full_name as policyholder_name
        FROM claims c
        JOIN policies p ON c.policy_id = p.id
        JOIN users u ON p.policyholder_id = u.id
        WHERE p.agent_id = ?
      `;
      params.push(req.user.id);
    }

    const [claims] = await pool.query(query, params);
    res.json(claims);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit new claim
router.post('/', isPolicyHolder, async (req, res) => {
  try {
    const { policyId, amount, description } = req.body;
    
    // Verify policy belongs to user
    const [policies] = await pool.query(
      'SELECT * FROM policies WHERE id = ? AND policyholder_id = ?',
      [policyId, req.user.id]
    );

    if (policies.length === 0) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    const [result] = await pool.query(
      `INSERT INTO claims (policy_id, amount, description, status) 
       VALUES (?, ?, ?, 'pending')`,
      [policyId, amount, description]
    );

    res.status(201).json({
      id: result.insertId,
      policy_id: policyId,
      amount,
      description,
      status: 'pending'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update claim status (agents only)
router.patch('/:id', isAgent, async (req, res) => {
  try {
    const { status } = req.body;
    
    await pool.query(
      `UPDATE claims c
       JOIN policies p ON c.policy_id = p.id
       SET c.status = ?
       WHERE c.id = ? AND p.agent_id = ?`,
      [status, req.params.id, req.user.id]
    );

    res.json({ message: 'Claim updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;