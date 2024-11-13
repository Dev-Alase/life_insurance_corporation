import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { email, password, fullName, type, licenseNumber = null } = req.body;

    if (!['policyholder', 'agent'].includes(type)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await connection.query(
      'INSERT INTO users (email, password, full_name, type, license_number) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, fullName, type, licenseNumber]
    );

    // Create database user with proper host specification
    const dbUser = email.split('@')[0];
    const dbPassword = password;
    const role = type === 'agent' ? 'AGENT_ROLE' : 'POLICYHOLDER_ROLE';

    // Create user for both localhost and remote connections
    await connection.query(`CREATE USER IF NOT EXISTS '${dbUser}'@'localhost' IDENTIFIED BY '${dbPassword}'`);
    await connection.query(`CREATE USER IF NOT EXISTS '${dbUser}'@'%' IDENTIFIED BY '${dbPassword}'`);

    // Grant role to user for both connections
    await connection.query(`GRANT ${role} TO '${dbUser}'@'localhost'`);
    await connection.query(`GRANT ${role} TO '${dbUser}'@'%'`);

    // Set default role for both connections
    await connection.query(`ALTER USER '${dbUser}'@'localhost' DEFAULT ROLE ${role}`);
    await connection.query(`ALTER USER '${dbUser}'@'%' DEFAULT ROLE ${role}`);

    // Grant database usage
    await connection.query(`GRANT USAGE ON insurance_db.* TO '${dbUser}'@'localhost'`);
    await connection.query(`GRANT USAGE ON insurance_db.* TO '${dbUser}'@'%'`);

    await connection.query('FLUSH PRIVILEGES');
    
    await connection.commit();

    const token = jwt.sign(
      { id: result.insertId, type, dbUser, dbPassword },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        email,
        fullName,
        type,
        dbUser,
        dbPassword,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);

    if (error.code === 'ER_CANNOT_USER') {
      return res.status(500).json({ message: 'Database user creation failed' });
    }

    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, type: user.type },
      process.env.JWT_SECRET || "secret_key",
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