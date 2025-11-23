const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { createCustomer, getCustomers, updateCustomer, deleteCustomer, getPendingPayments } = require('../controllers/customerController');

router.use(protect);

router.get('/pending-payments', getPendingPayments);

router.route('/')
  .get(getCustomers)
  .post(createCustomer);

router.route('/:id')
  .put(updateCustomer)
  .delete(deleteCustomer);

module.exports = router;

