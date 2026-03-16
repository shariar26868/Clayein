const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  resetToken:   { type: String },
  resetExpires: { type: Date },
}, { timestamps: true });

adminSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

adminSchema.methods.matchPassword = function(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('Admin', adminSchema);