import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../config/database.js';
import { isPolicyHolder, isAgent } from '../middleware/auth.js';

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir); // Directory for storing files
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
      cb(null, uniqueSuffix);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, and PNG are allowed.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

// Create a new policy
router.post('/new', isPolicyHolder, upload.array('documents', 5), async (req, res) => {
  const {
    type,
    agentId,
    premium,
    totalPremiums,
    paymentFrequency,
    claimAmount,
  } = req.body;

  if (!type || !agentId || !premium || !totalPremiums || !paymentFrequency || !claimAmount) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Start a transaction to ensure data consistency
    await pool.query('START TRANSACTION');

    // Insert new policy record into the database
    const [policyResult] = await pool.query(
      `INSERT INTO policies 
       (type, status, premium, total_premiums, payment_frequency, claim_amount, policyholder_id, agent_id) 
       VALUES (?, 'pending', ?, ?, ?, ?, ?, ?)`,
      [
        type,
        premium,
        totalPremiums,
        paymentFrequency,
        claimAmount,
        req.user.id,
        agentId,
      ]
    );

    // Handle file uploads
    const policyId = policyResult.insertId;
    if (req.files.length > 0) {
      const pdfPaths = req.files.map((file) => file.path);
      await pool.query(
        `UPDATE policies 
         SET pdf = ? 
         WHERE id = ?`,
        [pdfPaths.join(','), policyId]
      );
    }

    // Commit the transaction
    await pool.query('COMMIT');

    res.status(201).json({
      id: policyId,
      type,
      status: 'pending',
      premium,
      total_premiums: totalPremiums,
      payment_frequency: paymentFrequency,
      claim_amount: claimAmount,
      policyholder_id: req.user.id,
      agent_id: agentId,
      pdf: req.files.map((file) => file.filename),
    });
  } catch (error) {
    console.error(error);
    // Rollback transaction in case of error
    await pool.query('ROLLBACK');

    res.status(500).json({
      message: 'An error occurred while creating the policy.',
      error: error.message,
    });
  }
});


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

// Update policy status (agents only)
router.patch('/:id', isAgent, async (req, res) => {
  try {
    const { status, premium, expiryDate } = req.body;

    // Validate the status against the allowed values
    const allowedStatuses = ['pending', 'active', 'expired', 'cancelled'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    await pool.query(
      `UPDATE policies 
       SET status = ?, premium = ?, expiry_date = ? 
       WHERE id = ? AND agent_id = ?`,
      [status, premium || null, expiryDate || null, req.params.id, req.user.id]
    );

    res.json({ message: 'Policy updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;