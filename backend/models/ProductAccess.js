const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

/**
 * One record per investor per product.
 * Admin creates these — investor uses username + password
 * to log in and see ONLY their product's analysis page.
 */
const productAccessSchema = new mongoose.Schema({
  product:        { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  username:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash:   { type: String, required: true },
  investorName:   { type: String, required: true },
  investedAmount: { type: Number, required: true, default: 0 },

  // What % of total profit goes to this investor
  profitSharePct: { type: Number, required: true, default: 0 },

  lastLogin:      { type: Date },
}, { timestamps: true });

// Hash password before saving
productAccessSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

productAccessSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('ProductAccess', productAccessSchema);