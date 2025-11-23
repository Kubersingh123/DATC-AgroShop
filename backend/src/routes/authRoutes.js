const router = require('express').Router();
const { register, login, profile, seedAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, profile);
router.post('/seed-admin', seedAdmin);

module.exports = router;

