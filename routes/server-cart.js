//server-cart.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('./middleware/authMiddleware');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/cartLogs.txt' }),
  ],
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const cartItems = await pool.query('SELECT courses.id AS course_id, courses.title, courses.price FROM cart JOIN courses ON cart.course_id = courses.id WHERE cart.user_id = $1', [userId]);
    res.render('cart', { cartItems: cartItems.rows });
  } catch (error) {
    logger.error('Error fetching user cart:', error);
    res.status(500).render('error', { message: 'Internal Server Error' });
  }
});

router.post('/add', authenticateToken, async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.userId;

  try {
    await pool.query('INSERT INTO cart (user_id, course_id) VALUES ($1, $2)', [userId, courseId]);
    logger.info('Course added to cart successfully');
    res.json({ success: true, message: 'Course added to cart successfully' });
  } catch (error) {
    logger.error('Error adding course to cart:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.post('/remove', authenticateToken, async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.userId;

  try {
    await pool.query('DELETE FROM cart WHERE user_id = $1 AND course_id = $2', [userId, courseId]);
    logger.info('Course removed from cart successfully');
    res.json({ success: true, message: 'Course removed from cart successfully' });
  } catch (error) {
    logger.error('Error removing course from cart:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
