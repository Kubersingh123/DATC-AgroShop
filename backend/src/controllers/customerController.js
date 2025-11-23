const Customer = require('../models/Customer');
const asyncHandler = require('../utils/asyncHandler');

const createCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.create(req.body);
  res.status(201).json(customer);
});

const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.json(customers);
});

const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(customer);
});

const deleteCustomer = asyncHandler(async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.json({ message: 'Customer deleted' });
});

module.exports = { createCustomer, getCustomers, updateCustomer, deleteCustomer };

