const Customer = require('../models/Customer');
const Sale = require('../models/Sale');
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

const getPendingPayments = asyncHandler(async (req, res) => {
  // Get all pending/partial invoices
  const pendingSales = await Sale.find({
    paymentStatus: { $in: ['pending', 'partial'] },
    customer: { $exists: true, $ne: null }
  }).populate('customer').lean();

  // Calculate total pending per customer
  const customerPendingMap = new Map();
  
  pendingSales.forEach((sale) => {
    if (sale.customer) {
      const customerId = sale.customer._id.toString();
      if (!customerPendingMap.has(customerId)) {
        customerPendingMap.set(customerId, {
          ...sale.customer,
          totalPending: 0,
          invoiceCount: 0
        });
      }
      const customer = customerPendingMap.get(customerId);
      customer.totalPending += sale.total || 0;
      customer.invoiceCount += 1;
    }
  });

  // Convert to array and sort by totalPending
  const customers = Array.from(customerPendingMap.values())
    .sort((a, b) => (b.totalPending || 0) - (a.totalPending || 0));

  res.json(customers);
});

module.exports = { createCustomer, getCustomers, updateCustomer, deleteCustomer, getPendingPayments };

