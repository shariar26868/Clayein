const router = require('express').Router();
const ctrl   = require('../controllers/adminAuthController');

router.post('/setup',          ctrl.setup);   // first-time setup only
router.post('/login',          ctrl.login);
router.post('/forgot',         ctrl.forgot);
router.post('/reset/:token',   ctrl.reset);

module.exports = router;