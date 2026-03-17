// import { fmt, pct } from '../utils/format';

// const COLORS = ['#7c6dfa', '#4dffa0', '#ffd166', '#6db8fa', '#ff9f7c', '#fa6dc9'];

// export default function EquityBreakdown({
//   companyContribution, companyEquityPct,
//   totalInvestorAmount, investorEquityPct,
//   companyProfitSharePct, companyProfitShare,
//   investorShares = [],
//   profit,
// }) {
//   return (
//     <div className="card">
//       <div className="card-ttl"><span className="dot" style={{ '--dc': 'var(--acc)' }} />Equity & Profit Share</div>

//       {/* Capital equity bars */}
//       <div style={{ marginBottom: 20 }}>
//         <div className="bar-lbl"><span>Company equity</span><span>{pct(companyEquityPct)} · {fmt(companyContribution)}</span></div>
//         <div className="bar-track">
//           <div className="bar-fill" style={{ '--bc': 'var(--acc)', width: `${Math.min(companyEquityPct, 100)}%` }} />
//         </div>
//       </div>
//       <div style={{ marginBottom: 24 }}>
//         <div className="bar-lbl"><span>Investor equity (total)</span><span>{pct(investorEquityPct)} · {fmt(totalInvestorAmount)}</span></div>
//         <div className="bar-track">
//           <div className="bar-fill" style={{ '--bc': 'var(--green)', width: `${Math.min(investorEquityPct, 100)}%` }} />
//         </div>
//       </div>

//       {/* Profit distribution */}
//       <div className="card-ttl" style={{ marginBottom: 14 }}><span className="dot" style={{ '--dc': 'var(--yellow)' }} />Profit Distribution</div>

//       <div className="pl-row">
//         <span className="lbl">Company share ({pct(companyProfitSharePct)})</span>
//         <span className="val p">{fmt(companyProfitShare)}</span>
//       </div>

//       {investorShares.map((inv, i) => (
//         <div className="pl-row" key={inv.investorName}>
//           <span className="lbl" style={{ color: COLORS[i % COLORS.length] }}>
//             {inv.investorName} ({pct(inv.profitSharePct)})
//           </span>
//           <span className="val" style={{ color: COLORS[i % COLORS.length] }}>
//             {fmt(inv.profitAmount)}
//           </span>
//         </div>
//       ))}

//       <div className="pl-row big" style={{ marginTop: 8 }}>
//         <span className="lbl">Total Profit</span>
//         <span className="val" style={{ color: profit >= 0 ? 'var(--green)' : 'var(--red)' }}>{fmt(profit)}</span>
//       </div>
//     </div>
//   );
// }





import { fmt, pct } from '../utils/format';

const COLORS = [
  'linear-gradient(135deg,#7c3aed,#2563eb)',
  'linear-gradient(135deg,#10b981,#06b6d4)',
  'linear-gradient(135deg,#f59e0b,#fbbf24)',
  'linear-gradient(135deg,#60a5fa,#a78bfa)',
  'linear-gradient(135deg,#f97316,#ef4444)',
  'linear-gradient(135deg,#ec4899,#a78bfa)',
];
const SOLID = ['#a78bfa','#34d399','#fbbf24','#60a5fa','#fb923c','#f472b6'];

export default function EquityBreakdown({
  companyContribution, companyEquityPct,
  totalInvestorAmount, investorEquityPct,
  companyProfitSharePct, companyProfitShare,
  investorShares = [], profit,
}) {
  return (
    <div className="card">
      <div className="card-ttl"><span className="dot" style={{ '--dc': 'var(--g1)' }} />Equity & Profit Share</div>

      <div style={{ marginBottom: 20 }}>
        <div className="bar-lbl">
          <span>Company equity</span>
          <span style={{ color: 'var(--purple)' }}>{pct(companyEquityPct)} · {fmt(companyContribution)}</span>
        </div>
        <div className="bar-track">
          <div className="bar-fill" style={{ '--bc': 'linear-gradient(90deg,#7c3aed,#2563eb)', '--bs': 'rgba(124,58,237,0.4)', width: `${Math.min(companyEquityPct, 100)}%` }} />
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div className="bar-lbl">
          <span>Investor equity (total)</span>
          <span style={{ color: 'var(--cyan)' }}>{pct(investorEquityPct)} · {fmt(totalInvestorAmount)}</span>
        </div>
        <div className="bar-track">
          <div className="bar-fill" style={{ '--bc': 'linear-gradient(90deg,#10b981,#06b6d4)', '--bs': 'rgba(16,185,129,0.4)', width: `${Math.min(investorEquityPct, 100)}%` }} />
        </div>
      </div>

      <div className="card-ttl" style={{ marginBottom: 16 }}>
        <span className="dot" style={{ '--dc': 'var(--yellow)' }} />Profit Distribution
      </div>

      <div className="pl-row">
        <span className="lbl">Company share ({pct(companyProfitSharePct)})</span>
        <span className="val" style={{ background: 'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>{fmt(companyProfitShare)}</span>
      </div>

      {investorShares.map((inv, i) => (
        <div className="pl-row" key={inv.investorName}>
          <span className="lbl" style={{ color: SOLID[i % SOLID.length] }}>
            {inv.investorName} ({pct(inv.profitSharePct)})
          </span>
          <span className="val" style={{ color: SOLID[i % SOLID.length], fontWeight: 700 }}>
            {fmt(inv.profitAmount)}
          </span>
        </div>
      ))}

      <div className="pl-row big" style={{ marginTop: 8 }}>
        <span className="lbl">Total Profit</span>
        <span className="val" style={{
          background: profit >= 0 ? 'linear-gradient(135deg,#10b981,#06b6d4)' : 'linear-gradient(135deg,#ef4444,#f97316)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>{fmt(profit)}</span>
      </div>
    </div>
  );
}