// authMiddleware.js
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key'; 

function authenticateToken(req, res, next) {
  const token = req.cookies.jwtToken;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = decoded;
    next();
  });
}

module.exports = authenticateToken;
