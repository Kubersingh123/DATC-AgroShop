const Product = require('../models/Product');
const InventoryTransaction = require('../models/InventoryTransaction');
const asyncHandler = require('../utils/asyncHandler');

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

const getProducts = asyncHandler(async (req, res) => {
  const search = req.query.search;
  const query = search ? { name: new RegExp(search, 'i') } : {};
  const products = await Product.find(query).populate('supplier');
  res.json(products);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product removed' });
});

const adjustStock = asyncHandler(async (req, res) => {
  const { type, quantity, unitCost, note } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  const qty = Number(quantity);
  product.stock = type === 'sale' ? product.stock - qty : product.stock + qty;
  await product.save();

  await InventoryTransaction.create({
    product: product._id,
    type,
    quantity: qty,
    unitCost,
    note,
    createdBy: req.user?._id
  });

  res.json(product);
});

module.exports = { createProduct, getProducts, updateProduct, deleteProduct, adjustStock };

