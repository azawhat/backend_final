//server-profile.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('./middleware/authMiddleware');
const winston = require('winston');
const bcrypt = require('bcrypt');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/profileLogs.txt' }),
  ],
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).render('404'); 
    }

    const user = userResult.rows[0];
    res.render('profile', { user }); 
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    res.status(500).render('error', { message: 'Internal Server Error' });
  }
});

router.post('/update-password', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { oldPassword, newPassword } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const user = userResult.rows[0];

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid old password' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, userId]);

    logger.info('Password updated successfully');
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    logger.error('Error updating password:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.post('/update-fullname', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { fullName } = req.body;

  try {
    await pool.query('UPDATE users SET fullname = $1 WHERE id = $2', [fullName, userId]);

    logger.info('Fullname updated successfully');
    res.json({ success: true, message: 'Fullname updated successfully' });
  } catch (error) {
    logger.error('Error updating full name:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


router.post('/logout', (req, res) => {
  res.clearCookie('jwtToken');
  res.redirect('/login');
});

module.exports = router;
