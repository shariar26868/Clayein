// import { fmt, pct } from '../utils/format';

// export default function ProfitShareCard({ myShare, metrics }) {
//   if (!myShare) return null;

//   const roi = myShare.investedAmount > 0
//     ? (myShare.profitAmount / myShare.investedAmount) * 100
//     : 0;

//   return (
//     <div className="card" style={{ border: '1px solid rgba(124,109,250,0.35)' }}>
//       <div className="card-ttl">
//         <span className="dot" style={{ '--dc': 'var(--acc)' }} />
//         Your Investment Summary
//       </div>

//       <div className="pl-row">
//         <span className="lbl">You invested</span>
//         <span className="val p">{fmt(myShare.investedAmount)}</span>
//       </div>
//       <div className="pl-row">
//         <span className="lbl">Your equity share</span>
//         <span className="val b">{pct(myShare.equityPct)}</span>
//       </div>
//       <div className="pl-row">
//         <span className="lbl">Your profit share %</span>
//         <span className="val y">{pct(myShare.profitSharePct)}</span>
//       </div>
//       <div className="pl-row big">
//         <span className="lbl">Your profit this period</span>
//         <span className="val" style={{ color: myShare.profitAmount >= 0 ? 'var(--green)' : 'var(--red)' }}>
//           {fmt(myShare.profitAmount)}
//         </span>
//       </div>

//       <div style={{ marginTop: 16 }}>
//         <div className="bar-lbl"><span>Return on your investment</span><span>{pct(roi)}</span></div>
//         <div className="bar-track">
//           <div className="bar-fill" style={{
//             '--bc': roi >= 0 ? 'var(--green)' : 'var(--red)',
//             width: `${Math.min(Math.abs(roi), 100)}%`,
//           }} />
//         </div>
//       </div>
//     </div>
//   );
// }




import { fmt, pct } from '../utils/format';

export default function ProfitShareCard({ myShare }) {
  if (!myShare) return null;
  const roi = myShare.investedAmount > 0 ? (myShare.profitAmount / myShare.investedAmount) * 100 : 0;

  return (
    <div className="card" style={{ border: '1px solid rgba(124,58,237,0.3)', background: 'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(37,99,235,0.06))' }}>
      <div className="card-ttl"><span className="dot" style={{ '--dc': 'var(--g1)' }} />Your Investment Summary</div>

      <div className="pl-row">
        <span className="lbl">You invested</span>
        <span className="val" style={{ background: 'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontWeight:700 }}>{fmt(myShare.investedAmount)}</span>
      </div>
      <div className="pl-row">
        <span className="lbl">Your equity share</span>
        <span className="val" style={{ color: 'var(--cyan)', fontWeight:700 }}>{pct(myShare.equityPct)}</span>
      </div>
      <div className="pl-row">
        <span className="lbl">Your profit share %</span>
        <span className="val" style={{ color: 'var(--yellow)', fontWeight:700 }}>{pct(myShare.profitSharePct)}</span>
      </div>
      <div className="pl-row big">
        <span className="lbl">Your profit this period</span>
        <span className="val" style={{
          background: myShare.profitAmount >= 0 ? 'linear-gradient(135deg,#10b981,#06b6d4)' : 'linear-gradient(135deg,#ef4444,#f97316)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>{fmt(myShare.profitAmount)}</span>
      </div>

      <div style={{ marginTop: 20 }}>
        <div className="bar-lbl"><span>Return on investment</span><span style={{ color: roi >= 0 ? 'var(--green)' : 'var(--red)' }}>{pct(roi)}</span></div>
        <div className="bar-track">
          <div className="bar-fill" style={{
            '--bc': roi >= 0 ? 'linear-gradient(90deg,#10b981,#06b6d4)' : 'linear-gradient(90deg,#ef4444,#f97316)',
            '--bs': roi >= 0 ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)',
            width: `${Math.min(Math.abs(roi), 100)}%`,
          }} />
        </div>
      </div>
    </div>
  );
}