const InventoryTransaction = require('../models/InventoryTransaction');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

const logTransaction = asyncHandler(async (req, res) => {
  const { productId, type, quantity, unitCost, note } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const qty = Number(quantity);
  if (type === 'sale' && product.stock < qty) {
    return res.status(400).json({ message: 'Insufficient stock' });
  }

  product.stock = type === 'sale' ? product.stock - qty : product.stock + qty;
  await product.save();

  const transaction = await InventoryTransaction.create({
    product: productId,
    type,
    quantity: qty,
    unitCost,
    note,
    createdBy: req.user?._id
  });

  res.status(201).json(transaction);
});

const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await InventoryTransaction.find()
    .populate('product')
    .sort('-createdAt');
  res.json(transactions);
});

module.exports = { logTransaction, getTransactions };

