const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Look for the token in the request headers
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format is "Bearer TOKEN"

  // 2. If no token is provided, deny access
  if (token == null) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  // 3. Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }

    // 4. If token is valid, attach the user's info to the request
    // and pass it to the next step in the route
    req.user = user;
    next();
  });
};

module.exports = authMiddleware;