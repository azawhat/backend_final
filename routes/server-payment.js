// server-payment.js

const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('./middleware/authMiddleware');
const { processPayment } = require('./server-paypal');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const cartItems = await pool.query('SELECT courses.id AS course_id, courses.title, courses.price FROM cart JOIN courses ON cart.course_id = courses.id WHERE cart.user_id = $1', [userId]);
        res.render('payment-page', { cartItems: cartItems.rows });
    } catch (error) {
        console.error('Error rendering payment page:', error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
});

router.get('/paypal', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const cartItems = await pool.query('SELECT courses.id AS course_id, courses.title, courses.price FROM cart JOIN courses ON cart.course_id = courses.id WHERE cart.user_id = $1', [userId]);
        const paymentUrl = await processPayment(userId, cartItems.rows);
        res.redirect(paymentUrl);
    } catch (error) {
        console.error('Error processing PayPal payment:', error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
});

router.get('/success', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const cartItems = await pool.query('SELECT course_id FROM cart WHERE user_id = $1', [userId]);

        // Update payment status for each course in the cart
        for (const item of cartItems.rows) {
            await pool.query('UPDATE courses SET payment_status = true WHERE id = $1', [item.course_id]);
        }

        // Clear the cart after successful payment
        await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);

        res.render('payment-success');
    } catch (error) {
        console.error('Error processing payment success:', error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
});

router.get('/cancel', (req, res) => {
    res.render('payment-cancel'); 
});

module.exports = router;
