const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const asyncHandler = require('../utils/asyncHandler');

const getOverview = asyncHandler(async (req, res) => {
  const [salesTotal, paymentsTotal, productCount, recentSales] = await Promise.all([
    Sale.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]),
    Payment.aggregate([
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]),
    Product.countDocuments(),
    Sale.find().sort('-createdAt').limit(5).populate('customer')
  ]);

  res.json({
    salesTotal: salesTotal[0]?.total || 0,
    paymentsTotal,
    productCount,
    recentSales
  });
});

const getSalesByMonth = asyncHandler(async (req, res) => {
  const lastMonths = await Sale.aggregate([
    {
      $group: {
        _id: { year: { $year: '$saleDate' }, month: { $month: '$saleDate' } },
        total: { $sum: '$total' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 }
  ]);

  res.json(lastMonths);
});

module.exports = { getOverview, getSalesByMonth };

