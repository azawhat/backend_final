const paypal = require('paypal-rest-sdk');
const pool = require('../db');

paypal.configure({
    mode: 'sandbox',
    client_id: 'AbXRnnr3A0oB-_NQZUXbtYofbY3qFdoRs33-rg3zArh7YniIIy2jIU3J75NYCiFLMP8q-NnIHYNIAbRU',
    client_secret: 'EKzOnP_zXTN149cnQkWe3ToE9ed_Eft6aOtYZoTzu78c6Tbhe3hUrA7ayVTUXuvs7iHoFyoVIKwFRWXV'
});

async function processPayment(userId, cartItems) {
    try {
        let totalAmount = 0;
        for (const item of cartItems) {
            const price = parseFloat(item.price);
            if (!isNaN(price)) {
                totalAmount += price;
            } else {
                throw new Error(`Invalid price value for item: ${JSON.stringify(item)}`);
            }
        }
        const paymentData = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            transactions: [{
                amount: {
                    total: totalAmount.toFixed(2), 
                    currency: 'USD'
                },
                description: 'Payment for courses'
            }],
            redirect_urls: {
                return_url: 'https://a-billion-courses.onrender.com/payment/success',
                cancel_url: 'https://a-billion-courses.onrender.com/payment/cancel'
            }
        };

        const createPayment = await new Promise((resolve, reject) => {
            paypal.payment.create(paymentData, (error, payment) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(payment);
                }
            });
        });

        const paymentId = createPayment.id;
        await pool.query('INSERT INTO payments (user_id, payment_id) VALUES ($1, $2)', [userId, paymentId]);


        const approvalUrl = createPayment.links.find(link => link.rel === 'approval_url');
        if (approvalUrl) {
            return approvalUrl.href;
        } else {
            throw new Error('Approval URL not found in PayPal response');
        }
    } catch (error) {
        throw error;
    }
}

module.exports = { processPayment };
