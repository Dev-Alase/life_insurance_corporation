import express from 'express';
import pool from '../config/database.js';
import { isPolicyHolder } from '../middleware/auth.js';


const router = express.Router();


router.get('/sumary', async (req, res) => {
  try {
    const { type, id } = req.user; // Extract user type and ID from request

    // Call the MySQL function
    const [result] = await pool.query('SELECT get_summary(?, ?) AS summary', [
      type,
      id,
    ]);

    // Parse JSON result
    const summary = JSON.parse(result[0].summary);
    res.json(summary); // Send the result as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


























































































































// Get all agents
router.get('/summary', async (req, res) => {
    try {
      let query;
      const params = [];
  
      if (req.user.type === 'policyholder') {
        query = `
          SELECT 
            COUNT(p.id) AS number_of_policies,
            SUM(p.premium) AS total_premium,
            COUNT(DISTINCT p.agent_id) AS number_of_agents,
            COUNT(c.id) AS number_of_claims
          FROM policies p
          LEFT JOIN claims c ON p.id = c.policy_id
          WHERE p.policyholder_id = ?
        `;
        params.push(req.user.id);
      } else {
        query = `
          SELECT 
            COUNT(p.id) AS number_of_policies,
            SUM(p.premium) AS total_premium,
            COUNT(DISTINCT p.policyholder_id) AS number_of_policyholders,
            COUNT(c.id) AS number_of_claims
          FROM policies p
          LEFT JOIN claims c ON p.id = c.policy_id
          WHERE p.agent_id = ?
        `;
        params.push(req.user.id);
      }
  
      const [summary] = await pool.query(query, params);
      res.json(summary[0]); // Send the first row of the result as JSON
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});
  



export default router;