const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');
const asyncHandler = require('../utils/asyncHandler');

const createPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.create(req.body);

  if (payment.entityType === 'customer') {
    await Customer.findByIdAndUpdate(payment.entity, {
      $inc: { outstandingBalance: payment.type === 'incoming' ? -payment.amount : payment.amount }
    });
  } else {
    await Supplier.findByIdAndUpdate(payment.entity, {
      $inc: { accountBalance: payment.type === 'incoming' ? payment.amount : -payment.amount }
    });
  }

  res.status(201).json(payment);
});

const getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find().sort('-paymentDate').lean();
  
  // Get all unique entity IDs by type
  const customerIds = payments.filter(p => p.entityType === 'customer').map(p => p.entity);
  const supplierIds = payments.filter(p => p.entityType === 'supplier').map(p => p.entity);
  
  // Fetch all entities in parallel
  const [customers, suppliers] = await Promise.all([
    Customer.find({ _id: { $in: customerIds } }).lean(),
    Supplier.find({ _id: { $in: supplierIds } }).lean()
  ]);
  
  // Create lookup maps
  const customerMap = new Map(customers.map(c => [c._id.toString(), c]));
  const supplierMap = new Map(suppliers.map(s => [s._id.toString(), s]));
  
  // Populate entities
  const populatedPayments = payments.map(payment => ({
    ...payment,
    entity: payment.entityType === 'customer' 
      ? customerMap.get(payment.entity.toString())
      : supplierMap.get(payment.entity.toString())
  }));
  
  res.json(populatedPayments);
});

module.exports = { createPayment, getPayments };

