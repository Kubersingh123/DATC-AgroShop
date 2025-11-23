const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: String,
  unit: { type: String, default: 'kg' },
  description: String,
  image: String,
  costPrice: { type: Number, default: 0 },
  salePrice: { type: Number, default: 0 },
  gstRate: { type: Number, default: 5 },
  stock: { type: Number, default: 0 },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

