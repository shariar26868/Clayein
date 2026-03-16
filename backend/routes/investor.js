const router       = require('express').Router();
const investorAuth = require('../middleware/investorAuth');
const ctrl         = require('../controllers/investorController');

// Public — investor login (no token needed here)
router.post('/login', ctrl.login);

// Protected — investor must be logged in
router.get('/me', investorAuth, ctrl.getMyProduct);

module.exports = router;