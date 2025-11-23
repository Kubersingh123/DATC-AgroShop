const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');
const asyncHandler = require('../utils/asyncHandler');

const getDashboard = asyncHandler(async (req, res) => {
  const [productCount, saleCount, customerCount, supplierCount, lowStock, pendingInvoices] = await Promise.all([
    Product.countDocuments(),
    Sale.countDocuments(),
    Customer.countDocuments(),
    Supplier.countDocuments(),
    Product.find({ stock: { $lt: 10 } }).limit(5),
    Sale.aggregate([
      {
        $match: { 
          paymentStatus: { $in: ['pending', 'partial'] },
          customer: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          totalPending: { $sum: '$total' },
          invoiceCount: { $sum: 1 },
          customerIds: { $addToSet: '$customer' }
        }
      }
    ])
  ]);

  const pendingPayments = pendingInvoices && pendingInvoices.length > 0 
    ? { 
        totalPending: pendingInvoices[0].totalPending || 0, 
        customerCount: pendingInvoices[0].customerIds?.length || 0 
      }
    : { totalPending: 0, customerCount: 0 };

  res.json({
    user: req.user,
    stats: { 
      productCount, 
      saleCount, 
      customerCount, 
      supplierCount,
      pendingPaymentsTotal: pendingPayments.totalPending,
      pendingPaymentsCount: pendingPayments.customerCount
    },
    lowStock
  });
});

module.exports = { getDashboard };

