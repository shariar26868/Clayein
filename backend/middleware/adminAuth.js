const jwt = require('jsonwebtoken');

/**
 * Admin JWT guard.
 * Token issued at POST /api/auth/login
 * Frontend stores in localStorage as 'admin_token'
 */
module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Admin login required' });
  try {
    req.admin = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Session expired — please login again' });
  }
};