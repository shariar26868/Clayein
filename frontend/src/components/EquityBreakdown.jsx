import { fmt, pct } from '../utils/format';

const COLORS = ['#7c6dfa', '#4dffa0', '#ffd166', '#6db8fa', '#ff9f7c', '#fa6dc9'];

export default function EquityBreakdown({
  companyContribution, companyEquityPct,
  totalInvestorAmount, investorEquityPct,
  companyProfitSharePct, companyProfitShare,
  investorShares = [],
  profit,
}) {
  return (
    <div className="card">
      <div className="card-ttl"><span className="dot" style={{ '--dc': 'var(--acc)' }} />Equity & Profit Share</div>

      {/* Capital equity bars */}
      <div style={{ marginBottom: 20 }}>
        <div className="bar-lbl"><span>Company equity</span><span>{pct(companyEquityPct)} · {fmt(companyContribution)}</span></div>
        <div className="bar-track">
          <div className="bar-fill" style={{ '--bc': 'var(--acc)', width: `${Math.min(companyEquityPct, 100)}%` }} />
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div className="bar-lbl"><span>Investor equity (total)</span><span>{pct(investorEquityPct)} · {fmt(totalInvestorAmount)}</span></div>
        <div className="bar-track">
          <div className="bar-fill" style={{ '--bc': 'var(--green)', width: `${Math.min(investorEquityPct, 100)}%` }} />
        </div>
      </div>

      {/* Profit distribution */}
      <div className="card-ttl" style={{ marginBottom: 14 }}><span className="dot" style={{ '--dc': 'var(--yellow)' }} />Profit Distribution</div>

      <div className="pl-row">
        <span className="lbl">Company share ({pct(companyProfitSharePct)})</span>
        <span className="val p">{fmt(companyProfitShare)}</span>
      </div>

      {investorShares.map((inv, i) => (
        <div className="pl-row" key={inv.investorName}>
          <span className="lbl" style={{ color: COLORS[i % COLORS.length] }}>
            {inv.investorName} ({pct(inv.profitSharePct)})
          </span>
          <span className="val" style={{ color: COLORS[i % COLORS.length] }}>
            {fmt(inv.profitAmount)}
          </span>
        </div>
      ))}

      <div className="pl-row big" style={{ marginTop: 8 }}>
        <span className="lbl">Total Profit</span>
        <span className="val" style={{ color: profit >= 0 ? 'var(--green)' : 'var(--red)' }}>{fmt(profit)}</span>
      </div>
    </div>
  );
}