const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { createCustomer, getCustomers, updateCustomer, deleteCustomer } = require('../controllers/customerController');

router.use(protect);

router.route('/')
  .get(getCustomers)
  .post(createCustomer);

router.route('/:id')
  .put(updateCustomer)
  .delete(deleteCustomer);

module.exports = router;

