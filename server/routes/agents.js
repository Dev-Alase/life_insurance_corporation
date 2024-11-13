import express from 'express';
import pool from '../config/database.js';
import { isPolicyHolder,isAgent } from '../middleware/auth.js';

const router = express.Router();

// Get all agents
router.get('/', isPolicyHolder, async (req, res) => {
  try {
    const [agents] = await pool.query(
      `SELECT id, full_name, license_number, 
              (SELECT COUNT(*) FROM policies WHERE agent_id = users.id) as total_policies,
              (SELECT AVG(rating) FROM agent_ratings WHERE agent_id = users.id) as rating
       FROM users 
       WHERE type = 'agent'`
    );

    res.json(agents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate an agent
router.post('/:id/rate', isPolicyHolder, async (req, res) => {
  try {
    const { rating } = req.body;
    
    // Verify policyholder has a policy with this agent
    const [policies] = await pool.query(
      'SELECT * FROM policies WHERE agent_id = ? AND policyholder_id = ?',
      [req.params.id, req.user.id]
    );

    if (policies.length === 0) {
      return res.status(403).json({ message: 'You can only rate agents you have worked with' });
    }

    await pool.query(
      `INSERT INTO agent_ratings (agent_id, policyholder_id, rating) 
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = ?`,
      [req.params.id, req.user.id, rating, rating]
    );

    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/approvals', isAgent, async (req, res) => {
  try {
    const agentId = req.user.id; // Assuming `agent_id` is stored in `req.user`

    // Query to get pending policies for the agent
    const [pendingPolicies] = await pool.query(
      `
      SELECT 
        p.*
      FROM 
        policies as p
      WHERE 
        agent_id = ? 
        AND status = 'pending'
      `,
      [agentId]
    );

    // Query to get pending claims related to the agent's policies
    const [pendingClaims] = await pool.query(
      `
      SELECT 
        c.*
      FROM 
        claims c
      JOIN 
        policies p ON p.id = c.policy_id
      WHERE 
        p.agent_id = ? 
        AND c.status = 'pending'
      `,
      [agentId]
    );

    // Combine the results into a single response
    res.json({
      pendingPolicies,
      pendingClaims,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/send-email', async (req, res) => {
  try {
    const { message } = req.body;

    // Simulate email sending logic
    console.log(`Email sent to agent ${req.params.id}: ${message}`);

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while sending email' });
  }
});



export default router;