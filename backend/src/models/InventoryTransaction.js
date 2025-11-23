const mongoose = require('mongoose');

const inventoryTransactionSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['purchase', 'sale', 'adjustment'], required: true },
  quantity: { type: Number, required: true },
  unitCost: { type: Number, default: 0 },
  note: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  transactionDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('InventoryTransaction', inventoryTransactionSchema);

