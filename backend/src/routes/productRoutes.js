const router = require('express').Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  adjustStock
} = require('../controllers/productController');

router.use(protect);

router.route('/')
  .get(getProducts)
  .post(authorize('admin', 'manager'), createProduct);

router.route('/:id')
  .put(authorize('admin', 'manager'), updateProduct)
  .delete(authorize('admin'), deleteProduct);

router.post('/:id/adjust', authorize('admin', 'manager'), adjustStock);

module.exports = router;

