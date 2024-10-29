import express from 'express';
import pool from '../config/database.js';
import { isAgent, isPolicyHolder } from '../middleware/auth.js';

const router = express.Router();

// Get all policies (filtered by user type)
router.get('/', async (req, res) => {
  try {
    let query;
    const params = [];

    if (req.user.type === 'policyholder') {
      query = `
        SELECT p.*, u.full_name as agent_name 
        FROM policies p
        LEFT JOIN users u ON p.agent_id = u.id
        WHERE p.policyholder_id = ?
      `;
      params.push(req.user.id);
    } else {
      query = `
        SELECT p.*, u.full_name as policyholder_name 
        FROM policies p
        LEFT JOIN users u ON p.policyholder_id = u.id
        WHERE p.agent_id = ?
      `;
      params.push(req.user.id);
    }

    const [policies] = await pool.query(query, params);
    res.json(policies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new policy request
router.post('/', isPolicyHolder, async (req, res) => {
  try {
    const { type, agentId } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO policies (type, status, policyholder_id, agent_id) 
       VALUES (?, 'pending', ?, ?)`,
      [type, req.user.id, agentId]
    );

    res.status(201).json({
      id: result.insertId,
      type,
      status: 'pending',
      policyholder_id: req.user.id,
      agent_id: agentId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update policy status (agents only)
router.patch('/:id', isAgent, async (req, res) => {
  try {
    const { status, premium, expiryDate } = req.body;
    
    await pool.query(
      `UPDATE policies 
       SET status = ?, premium = ?, expiry_date = ? 
       WHERE id = ? AND agent_id = ?`,
      [status, premium, expiryDate, req.params.id, req.user.id]
    );

    res.json({ message: 'Policy updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;