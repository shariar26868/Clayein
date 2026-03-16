// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name:                { type: String, required: true, trim: true },
//   category:            { type: String, default: 'General' },

//   // Financial figures — admin updates these
//   revenue:             { type: Number, default: 0 },
//   expenses:            { type: Number, default: 0 },
//   stock:               { type: Number, default: 0 },
//   withdrawn:           { type: Number, default: 0 },

//   // Capital — how much the company itself contributed (separate from investors)
//   companyContribution: { type: Number, default: 0 },

//   isActive:            { type: Boolean, default: true },
//   notes:               { type: String, default: '' },
// }, { timestamps: true });

// module.exports = mongoose.model('Product', productSchema);





const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:                { type: String, required: true, trim: true },
  category:            { type: String, default: 'General' },

  // Financial figures — admin updates these
  revenue:             { type: Number, default: 0 },
  expenses:            { type: Number, default: 0 },
  withdrawn:           { type: Number, default: 0 },

  // Inventory — stockQty × stockPrice = stock (auto-calculated)
  stockQty:            { type: Number, default: 0 },  // কতটা product আছে এখন
  stockPrice:          { type: Number, default: 0 },  // প্রতিটার দাম
  stockSold:           { type: Number, default: 0 },  // মোট কতটা বিক্রি হয়েছে
  stock:               { type: Number, default: 0 },  // stockQty × stockPrice (auto)

  // Capital — how much the company itself contributed (separate from investors)
  companyContribution: { type: Number, default: 0 },

  isActive:            { type: Boolean, default: true },
  notes:               { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);