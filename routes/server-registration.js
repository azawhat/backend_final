//server-registration.js
const express = require('express');
const pool = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/registrationLogs.txt' }),
  ],
});

router.post('/', async (req, res) => {
  const { fullname, email, password, 'g-recaptcha-response': recaptchaResponse } = req.body;


  logger.info('Data received');
  logger.info('Fullname:', fullname);
  if (!recaptchaResponse) {
    logger.info('reCAPTCHA not completed');
    return res.status(400).json({ error: 'reCAPTCHA not completed' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 7);

    const query = 'INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3) RETURNING id'; 

    const result = await pool.query(query, [fullname, email, hashedPassword]);

    if (result.rows.length > 0) {
      const userId = result.rows[0].id;
      logger.info('User registered successfully');
      return res.status(200).json({ message: 'User registered successfully' });
    } else {
      logger.info('User registration failed');
      return res.status(500).json({ error: 'User registration failed' });
    }
  } catch (error) {
    logger.error('Error registering user:', error);
    return res.status(500).json({ error: 'An error occurred during registration. Please try again.' });
  }
});

module.exports = router;
