/**
 * BizTrack Calculation Engine
 * Used by backend controllers + copied to frontend/src/utils/calc.js
 *
 * @param {Object} p
 * @param {number} p.revenue
 * @param {number} p.expenses
 * @param {number} p.stock
 * @param {number} p.withdrawn
 * @param {number} p.companyContribution   - capital company put in
 * @param {Array}  p.investors             - [{ investorName, investedAmount, profitSharePct }]
 */
function calcMetrics(p) {
  const revenue             = p.revenue             || 0;
  const expenses            = p.expenses            || 0;
  const stock               = p.stock               || 0;
  const withdrawn           = p.withdrawn           || 0;
  const companyContribution = p.companyContribution || 0;
  const investors           = p.investors           || [];

  // ── Profit & Loss ──
  const profit    = revenue - expenses;
  const margin    = revenue > 0 ? (profit / revenue) * 100 : 0;
  const expRatio  = revenue > 0 ? (expenses / revenue) * 100 : 0;
  const cashNet   = profit - withdrawn;
  const assets    = profit + stock;

  // ── Capital & Equity ──
  const totalInvestorAmount = investors.reduce((s, i) => s + (i.investedAmount || 0), 0);
  const totalCapital        = companyContribution + totalInvestorAmount;
  const companyEquityPct    = totalCapital > 0 ? (companyContribution  / totalCapital) * 100 : 0;
  const investorEquityPct   = totalCapital > 0 ? (totalInvestorAmount  / totalCapital) * 100 : 0;

  // ── Profit Distribution ──
  // Total investor profit share = sum of all investors' profitSharePct
  const totalInvestorSharePct = investors.reduce((s, i) => s + (i.profitSharePct || 0), 0);
  const companyProfitSharePct = Math.max(0, 100 - totalInvestorSharePct);
  const companyProfitShare    = (profit * companyProfitSharePct) / 100;

  const investorShares = investors.map(inv => ({
    investorName:   inv.investorName,
    investedAmount: inv.investedAmount,
    profitSharePct: inv.profitSharePct,
    equityPct:      totalCapital > 0 ? (inv.investedAmount / totalCapital) * 100 : 0,
    profitAmount:   (profit * (inv.profitSharePct || 0)) / 100,
  }));

  // ── Valuation & ROI ──
  const companyValue = totalCapital + assets;
  const roi          = totalCapital > 0 ? (profit / totalCapital) * 100 : 0;

  return {
    // P&L
    profit, margin, expRatio, cashNet, assets,
    // Capital
    totalInvestorAmount, totalCapital, companyEquityPct, investorEquityPct,
    // Profit distribution
    companyProfitSharePct, companyProfitShare,
    totalInvestorSharePct, investorShares,
    // Valuation
    companyValue, roi,
  };
}

module.exports = { calcMetrics };