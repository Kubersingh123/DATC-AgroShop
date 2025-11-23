const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { createSale, getSales } = require('../controllers/salesController');

router.use(protect);

router.route('/')
  .get(getSales)
  .post(createSale);

module.exports = router;

