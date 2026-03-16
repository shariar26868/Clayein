const mongoose = require('mongoose');

const snapshotSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  month:   { type: Number, required: true },   // 1–12
  year:    { type: Number, required: true },

  data: {
    revenue:             Number,
    expenses:            Number,
    stock:               Number,
    withdrawn:           Number,
    profit:              Number,
    margin:              Number,
    companyContribution: Number,
    totalInvestorAmount: Number,
    totalCapital:        Number,
    companyEquityPct:    Number,
    investorEquityPct:   Number,
    companyProfitShare:  Number,
    companyValue:        Number,
    roi:                 Number,
    investorShares: [{
      investorName:   String,
      investedAmount: Number,
      profitSharePct: Number,
      profitAmount:   Number,
    }],
  },
}, { timestamps: true });

// One snapshot per product per month per year
snapshotSchema.index({ product: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Snapshot', snapshotSchema);