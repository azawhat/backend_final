//server-courses.js

const express = require('express');
const router = express.Router();
const pool = require('../db');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/coursesLogs.txt' }),
  ],
});

router.get('/', async (req, res) => {
  try {
    const courses = await pool.query('SELECT * FROM courses');
    res.render('courses', { courses: courses.rows });
  } catch (error) {
    logger.error('Error fetching courses:', error);
    res.status(500).render('error', { message: 'Internal Server Error' });
  }
});

module.exports = router;
