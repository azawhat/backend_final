// server-login.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db');
const winston = require('winston');

const secretKey = 'your-secret-key'; 

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/loginLogs.txt' }),
  ],
});

router.post('/', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user.id }, secretKey);

    res.cookie('jwtToken', token, { httpOnly: true });
    
    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    logger.error('Error during login:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
