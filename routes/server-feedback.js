// server-feedback.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/submit', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const query = 'INSERT INTO feedback (name, email, message) VALUES ($1, $2, $3)';

        await pool.query(query, [name, email, message]);

        res.status(200).json({ success: true, message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ success: false, error: 'An error occurred while submitting feedback' });
    }
});

module.exports = router;
