const router = require('express').Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { createPayment, getPayments } = require('../controllers/paymentController');

router.use(protect);

router.route('/')
  .get(getPayments)
  .post(authorize('admin', 'manager'), createPayment);

module.exports = router;

