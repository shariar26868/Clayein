// import { fmt } from '../utils/format';

// export default function EvalCard({ totalCapital, assets, companyValue, investors = [] }) {
//   return (
//     <div style={{
//       background: 'linear-gradient(135deg,#0d0d1f,#111128)',
//       border: '1px solid rgba(124,109,250,0.4)',
//       borderRadius: 20, padding: '28px 32px',
//       position: 'relative', overflow: 'hidden', marginBottom: 16,
//     }}>
//       {/* top gradient bar */}
//       <div style={{
//         position: 'absolute', top: 0, left: 0, right: 0, height: 3,
//         background: 'linear-gradient(90deg,var(--acc),var(--green),var(--blue))',
//       }} />

//       <div className="card-ttl" style={{ marginBottom: 20 }}>
//         <span className="dot" />
//         Total Company Valuation
//       </div>

//       {/* breakdown row */}
//       <div className="grid-2" style={{ marginBottom: 20 }}>
//         <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
//           <div className="kpi-lbl">Total Capital Invested</div>
//           <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--acc)' }}>{fmt(totalCapital)}</div>
//         </div>
//         <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
//           <div className="kpi-lbl">Current Assets</div>
//           <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--blue)' }}>{fmt(assets)}</div>
//           <div className="kpi-note">Profit + Stock</div>
//         </div>
//       </div>

//       {/* total */}
//       <div style={{
//         background: 'rgba(124,109,250,0.1)', border: '1px solid rgba(124,109,250,0.35)',
//         borderRadius: 16, padding: '20px 24px',
//         display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
//       }}>
//         <div>
//           <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14 }}>Total Company Value</div>
//           <div style={{ fontSize: 10, color: 'var(--muted2)', marginTop: 3 }}>Capital + Assets</div>
//         </div>
//         <div style={{
//           fontFamily: 'Syne,sans-serif', fontSize: 34, fontWeight: 800,
//           background: 'linear-gradient(120deg,#fff 30%,var(--acc))',
//           WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
//         }}>
//           {fmt(companyValue)}
//         </div>
//       </div>
//     </div>
//   );
// }




import { fmt } from '../utils/format';

export default function EvalCard({ totalCapital, assets, companyValue }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(37,99,235,0.1), rgba(6,182,212,0.08))',
      border: '1px solid rgba(124,58,237,0.25)',
      borderRadius: 24, padding: '28px 32px',
      position: 'relative', overflow: 'hidden', marginBottom: 16,
      backdropFilter: 'blur(20px)',
    }}>
      {/* top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, #7c3aed, #2563eb, #06b6d4)',
        boxShadow: '0 0 20px rgba(124,58,237,0.5)',
      }} />

      {/* bg orb */}
      <div style={{
        position: 'absolute', right: -40, top: -40,
        width: 180, height: 180,
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="card-ttl" style={{ marginBottom: 24 }}>
        <span className="dot" style={{ '--dc': 'var(--g1)' }} />
        Total Company Valuation
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: '18px 20px',
        }}>
          <div className="kpi-lbl">Total Capital</div>
          <div style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{fmt(totalCapital)}</div>
          <div className="kpi-note">All investments</div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: '18px 20px',
        }}>
          <div className="kpi-lbl">Current Assets</div>
          <div style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg,#22d3ee,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{fmt(assets)}</div>
          <div className="kpi-note">Profit + Stock</div>
        </div>
      </div>

      <div style={{
        background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)',
        borderRadius: 18, padding: '22px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        backdropFilter: 'blur(12px)',
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>Total Company Value</div>
          <div style={{ fontSize: 11, color: 'var(--muted2)', marginTop: 4 }}>Capital + Assets · Current period</div>
        </div>
        <div style={{
          fontSize: 36, fontWeight: 800,
          background: 'linear-gradient(135deg,#fff 30%,#a78bfa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          {fmt(companyValue)}
        </div>
      </div>
    </div>
  );
}