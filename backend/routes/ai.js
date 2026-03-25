const router       = require('express').Router();
const adminAuth    = require('../middleware/adminAuth');
const investorAuth = require('../middleware/investorAuth');
const ctrl         = require('../controllers/aiController');

// Admin routes
router.post('/report/:productId',   adminAuth, ctrl.generateReport);
router.post('/forecast/:productId', adminAuth, ctrl.generateForecast);

// Investor routes — investor can only access their own product's AI
router.post('/investor/report',   investorAuth, ctrl.generateInvestorReport);
router.post('/investor/forecast', investorAuth, ctrl.generateInvestorForecast);

module.exports = router;