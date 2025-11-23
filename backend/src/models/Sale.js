const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    rate: Number,
    gstRate: Number,
    gstAmount: Number,
    lineTotal: Number
  }],
  subtotal: Number,
  gstTotal: Number,
  total: Number,
  paymentStatus: { type: String, enum: ['pending', 'paid', 'partial'], default: 'pending' },
  saleDate: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);

