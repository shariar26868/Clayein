export function getTierPct(amount) {
  if (amount >= 130000) return 70;
  if (amount >= 110000) return 60;
  if (amount >= 90000)  return 50;
  if (amount >= 60000)  return 40;
  if (amount >= 30000)  return 30;
  if (amount >= 20000)  return 20;
  if (amount >= 10000)  return 10;
  return 0;
}

const INVESTOR_MAX_PCT = 85;

export function calcMetrics(p) {
  const revenue             = p.revenue             || 0;
  const expenses            = p.expenses            || 0;
  const stock               = p.stock               || 0;
  const withdrawn           = p.withdrawn           || 0;
  const companyContribution = p.companyContribution || 0;
  const investors           = p.investors           || [];

  const profit   = revenue - expenses;
  const margin   = revenue > 0 ? (profit / revenue) * 100 : 0;
  const expRatio = revenue > 0 ? (expenses / revenue) * 100 : 0;
  const cashNet  = profit - withdrawn;
  const assets   = profit + stock;

  const totalInvestorAmount = investors.reduce((s, i) => s + (i.investedAmount || 0), 0);
  const totalCapital        = companyContribution + totalInvestorAmount;
  const companyEquityPct    = totalCapital > 0 ? (companyContribution / totalCapital) * 100 : 0;
  const investorEquityPct   = totalCapital > 0 ? (totalInvestorAmount / totalCapital) * 100 : 0;

  const totalClaimPct   = investors.reduce((s, i) => s + (i.profitSharePct || getTierPct(i.investedAmount || 0)), 0);
  const scalingFactor   = totalClaimPct > INVESTOR_MAX_PCT ? INVESTOR_MAX_PCT / totalClaimPct : 1;

  const investorShares = investors.map(inv => {
    const tierPct  = inv.profitSharePct || getTierPct(inv.investedAmount || 0);
    const finalPct = tierPct * scalingFactor;
    return {
      investorName:   inv.investorName,
      investedAmount: inv.investedAmount,
      tierPct,
      profitSharePct: parseFloat(finalPct.toFixed(4)),
      equityPct:      totalCapital > 0 ? (inv.investedAmount / totalCapital) * 100 : 0,
      profitAmount:   (profit * finalPct) / 100,
      scaled:         scalingFactor < 1,
    };
  });

  const totalInvestorSharePct = investorShares.reduce((s, i) => s + i.profitSharePct, 0);
  const companyProfitSharePct = Math.max(15, 100 - totalInvestorSharePct);
  const companyProfitShare    = (profit * companyProfitSharePct) / 100;
  const companyValue          = totalCapital + assets;
  const roi                   = totalCapital > 0 ? (profit / totalCapital) * 100 : 0;

  return {
    profit, margin, expRatio, cashNet, assets,
    totalInvestorAmount, totalCapital, companyEquityPct, investorEquityPct,
    companyProfitSharePct, companyProfitShare,
    totalInvestorSharePct, totalClaimPct, scalingFactor, investorShares,
    companyValue, roi,
  };
}
