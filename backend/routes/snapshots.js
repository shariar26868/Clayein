const router    = require('express').Router();
const adminAuth = require('../middleware/adminAuth');
const ctrl      = require('../controllers/snapshotController');

router.post('/:productId', adminAuth, ctrl.save);
router.get('/:productId',  adminAuth, ctrl.getByProduct);

module.exports = router;