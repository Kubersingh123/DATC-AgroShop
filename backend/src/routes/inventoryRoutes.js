const router = require('express').Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { logTransaction, getTransactions } = require('../controllers/inventoryController');

router.use(protect);

router.route('/')
  .get(getTransactions)
  .post(authorize('admin', 'manager'), logTransaction);

module.exports = router;

