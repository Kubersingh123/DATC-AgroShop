const Supplier = require('../models/Supplier');
const asyncHandler = require('../utils/asyncHandler');

const createSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.create(req.body);
  res.status(201).json(supplier);
});

const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find().sort('name');
  res.json(suppliers);
});

const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(supplier);
});

const deleteSupplier = asyncHandler(async (req, res) => {
  await Supplier.findByIdAndDelete(req.params.id);
  res.json({ message: 'Supplier removed' });
});

module.exports = { createSupplier, getSuppliers, updateSupplier, deleteSupplier };

