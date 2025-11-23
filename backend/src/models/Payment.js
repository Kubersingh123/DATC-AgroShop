const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  type: { type: String, enum: ['incoming', 'outgoing'], required: true },
  entityType: { type: String, enum: ['customer', 'supplier'], required: true },
  entity: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true
  },
  method: { type: String, enum: ['cash', 'bank', 'upi', 'cheque'], default: 'cash' },
  amount: { type: Number, required: true },
  reference: String,
  notes: String,
  paymentDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);

