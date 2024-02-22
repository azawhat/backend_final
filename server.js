//server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const registrationR = require('./routes/server-registration');
const serverLoginR = require('./routes/server-login');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const winston = require('winston');
const profileRouter = require('./routes/server-profile');
const feedbackRouter = require('./routes/server-feedback');
const authenticateToken = require('./routes/middleware/authMiddleware');
const coursesRouter = require('./routes/server-courses');
const cartRouter = require('./routes/server-cart');
const paymentRouter = require('./routes/server-payment');
const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable provided by Render, or default to 3000
require('dotenv').config()

let jwtToken = '';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/logsfile.txt' }),
  ],
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  jwtToken = req.cookies.jwtToken || '';
  res.locals.jwtToken = jwtToken; 
  logger.info(`${req.method} ${req.url}`, { body: req.body, params: req.params });
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/register', registrationR);
app.use('/login', serverLoginR);
app.use('/profile', profileRouter);
app.use('/feedback', feedbackRouter);
app.use('/courses', coursesRouter);
app.use('/cart', cartRouter);
app.use('/payment-page', paymentRouter);

app.get('/', (req, res) => {
  res.render('index', { jwtToken });
});

app.get('/payment/success', (req, res) => {
  res.render('profile');
});

app.get('/payment/cancel', (req, res) => {
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/profile', authenticateToken, (req, res) => {
  res.render('profile');
});


app.get('/courses', (req, res) => {
  res.render('courses');
});
app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/about_us', (req, res) => {
  res.render('about_us');
});
app.get('/payment-page', (req, res) => {
  res.render('payment-page');
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.get('*', (req, res) => {
  res.render('error/404');
});

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
