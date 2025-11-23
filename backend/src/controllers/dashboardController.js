const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');
const asyncHandler = require('../utils/asyncHandler');

const getDashboard = asyncHandler(async (req, res) => {
  const [productCount, saleCount, customerCount, supplierCount, lowStock] = await Promise.all([
    Product.countDocuments(),
    Sale.countDocuments(),
    Customer.countDocuments(),
    Supplier.countDocuments(),
    Product.find({ stock: { $lt: 10 } }).limit(5)
  ]);

  res.json({
    user: req.user,
    stats: { productCount, saleCount, customerCount, supplierCount },
    lowStock
  });
});

module.exports = { getDashboard };

