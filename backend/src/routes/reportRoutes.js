const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { getOverview, getSalesByMonth } = require('../controllers/reportController');

router.use(protect);

router.get('/overview', getOverview);
router.get('/sales-by-month', getSalesByMonth);

module.exports = router;

