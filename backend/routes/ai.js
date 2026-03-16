const router    = require('express').Router();
const adminAuth = require('../middleware/adminAuth');
const ctrl      = require('../controllers/aiController');

// Admin must be logged in to use AI features
router.post('/report/:productId',   adminAuth, ctrl.generateReport);
router.post('/forecast/:productId', adminAuth, ctrl.generateForecast);

module.exports = router;