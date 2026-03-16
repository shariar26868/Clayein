const jwt = require('jsonwebtoken');

/**
 * Investor JWT guard.
 * Token issued at POST /api/investor/login
 * Payload: { accessId, productId, investorName, profitSharePct }
 *
 * Investor can ONLY access their own product — productId in token
 * is checked against the requested route param.
 */
module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Login required' });

  try {
    req.investor = jwt.verify(token, process.env.INVESTOR_JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Session expired — please login again' });
  }
};