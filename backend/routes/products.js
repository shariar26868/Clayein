const router    = require('express').Router();
const adminAuth = require('../middleware/adminAuth');
const ctrl      = require('../controllers/productController');

router.use(adminAuth);

router.get('/',                           ctrl.getAll);
router.get('/:id',                        ctrl.getOne);
router.post('/',                          ctrl.create);
router.put('/:id',                        ctrl.update);
router.delete('/:id',                     ctrl.remove);
router.post('/:id/investors',             ctrl.addInvestor);
router.delete('/:id/investors/:accessId', ctrl.removeInvestor);

module.exports = router;