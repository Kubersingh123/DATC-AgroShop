const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const asyncHandler = require('../utils/asyncHandler');

const generateInvoiceNumber = async () => {
  const count = await Sale.countDocuments();
  return `AGRO-${String(count + 1).padStart(4, '0')}`;
};

const createSale = asyncHandler(async (req, res) => {
  const { customerId, items, paymentStatus, saleDate } = req.body;
  const products = await Product.find({ _id: { $in: items.map(i => i.productId) } });

  const enrichedItems = items.map((item) => {
    const product = products.find(p => p._id.toString() === item.productId);
    const rate = item.rate || product.salePrice;
    const gstRate = item.gstRate ?? product.gstRate ?? 0;
    const lineTotal = rate * item.quantity;
    const gstAmount = lineTotal * (gstRate / 100);
    return {
      product: product._id,
      quantity: item.quantity,
      rate,
      gstRate,
      gstAmount,
      lineTotal: lineTotal + gstAmount
    };
  });

  const subtotal = enrichedItems.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
  const gstTotal = enrichedItems.reduce((sum, item) => sum + item.gstAmount, 0);
  const total = subtotal + gstTotal;

  const sale = await Sale.create({
    invoiceNumber: await generateInvoiceNumber(),
    customer: customerId,
    items: enrichedItems,
    subtotal,
    gstTotal,
    total,
    paymentStatus,
    saleDate,
    createdBy: req.user?._id
  });

  if (customerId) {
    await Customer.findByIdAndUpdate(customerId, { $inc: { outstandingBalance: total } });
  }

  // reduce stock
  await Promise.all(enrichedItems.map(item => Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })));

  res.status(201).json(sale);
});

const getSales = asyncHandler(async (req, res) => {
  const sales = await Sale.find()
    .populate('customer')
    .populate('items.product')
    .sort('-createdAt');
  res.json(sales);
});

module.exports = { createSale, getSales };

