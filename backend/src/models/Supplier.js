const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactPerson: String,
  email: String,
  phone: String,
  address: String,
  gstNumber: String,
  accountBalance: { type: Number, default: 0 },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);

