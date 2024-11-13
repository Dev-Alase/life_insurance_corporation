import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, type, licenseNumber = null } = req.body;

    // Validate user type
    if (!['policyholder', 'agent'].includes(type)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user in the application database
    const [result] = await pool.query(
      'INSERT INTO users (email, password, full_name, type, license_number) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, fullName, type, licenseNumber]
    );

    // Create a database user dynamically
    const dbUser = email.split('@')[0]; // Use the part before '@' as DB username
    const dbPassword = `Db_${Math.random().toString(36).slice(-8)}`; // Generate a random DB password
    const role = type === 'agent' ? 'AGENT_ROLE' : 'POLICYHOLDER_ROLE';

    await pool.query(`CREATE USER '${dbUser}'@'localhost' IDENTIFIED BY '${dbPassword}'`);
    await pool.query(`GRANT ${role} TO '${dbUser}'@'localhost'`);
    await pool.query('FLUSH PRIVILEGES');

    // Generate a JWT token
    const token = jwt.sign(
      { id: result.insertId, type, dbUser, dbPassword }, // Include DB credentials in the token if needed
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );

    // Return the response with token and user details
    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        email,
        fullName,
        type,
        dbUser,
        dbPassword, // Provide DB credentials in response for the user to store securely
      },
    });
  } catch (error) {
    console.error(error);

    if (error.code === 'ER_CANNOT_USER') {
      return res.status(500).json({ message: 'Database user creation failed' });
    }

    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, type: user.type },
      "secret_key",
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        type: user.type
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;