/**
 * Super Admin guard — no login UI needed.
 * Every admin request must include header:
 *   X-Admin-Key: <ADMIN_SECRET_KEY from .env>
 *
 * Frontend stores this key in localStorage once on first visit.
 * তুমি ছাড়া আর কেউ এই key জানে না।
 */
module.exports = (req, res, next) => {
  const key = req.headers['x-admin-key'];
  if (!key || key !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ error: 'Admin access denied' });
  }
  next();
};