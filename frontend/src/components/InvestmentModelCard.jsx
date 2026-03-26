import { fmt, pct } from '../utils/format';

const TIERS = [
  { label: '৳10,000',            pct: 10 },
  { label: '৳20,000',            pct: 20 },
  { label: '৳30,000 – 50,000',   pct: 30 },
  { label: '৳60,000 – 80,000',   pct: 40 },
  { label: '৳90,000 – 100,000',  pct: 50 },
  { label: '৳1,10,000 – 1,20,000', pct: 60 },
  { label: '৳1,30,000 – 1,50,000', pct: 70 },
];

export default function InvestmentModelCard({ metrics, myShare }) {
  const {
    investorShares   = [],
    totalClaimPct    = 0,
    scalingFactor    = 1,
    companyProfitSharePct = 15,
    profit           = 0,
  } = metrics || {};

  const isScaled     = scalingFactor < 1;
  const companyShare = (profit * companyProfitSharePct) / 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Tier Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px 12px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            💼 Investment Tiers
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted2)', marginTop: 4 }}>
            Profit share is based on invested amount. Final % may scale if total claims exceed 85%.
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ padding: '10px 20px', textAlign: 'left', color: 'var(--muted2)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, borderBottom: '1px solid var(--border)' }}>Investment</th>
              <th style={{ padding: '10px 20px', textAlign: 'right', color: 'var(--muted2)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, borderBottom: '1px solid var(--border)' }}>Profit Claim</th>
            </tr>
          </thead>
          <tbody>
            {TIERS.map((t, i) => {
              const isMyTier = myShare && Math.round(myShare.profitSharePct) === t.pct ||
                               investorShares.some(s => s.tierPct === t.pct && s.investorName === myShare?.investorName);
              return (
                <tr key={i} style={{ background: isMyTier ? 'rgba(124,58,237,0.07)' : 'transparent' }}>
                  <td style={{ padding: '12px 20px', color: 'var(--text)', borderBottom: i < TIERS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    {isMyTier && <span style={{ marginRight: 6, fontSize: 10, background: 'rgba(124,58,237,0.2)', color: 'var(--purple)', borderRadius: 99, padding: '2px 8px', fontWeight: 700 }}>YOU</span>}
                    {t.label}
                  </td>
                  <td style={{ padding: '12px 20px', textAlign: 'right', fontWeight: 700, color: 'var(--acc)', borderBottom: i < TIERS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    {t.pct}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Live Distribution */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
          📊 Live Distribution
        </div>

        {/* Scaling status */}
        <div style={{
          borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 12,
          background: isScaled ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
          border: `1px solid ${isScaled ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}`,
          color: isScaled ? 'var(--red)' : 'var(--green)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>{isScaled ? '⚠️ Scaling applied — total claims exceeded 85%' : '✅ No scaling — all investors get full tier %'}</span>
          <span style={{ fontWeight: 700 }}>
            {isScaled ? `Factor: ${scalingFactor.toFixed(3)}` : `Total: ${totalClaimPct.toFixed(1)}%`}
          </span>
        </div>

        {/* Investor rows */}
        {investorShares.length === 0 ? (
          <div style={{ color: 'var(--muted2)', fontSize: 13 }}>No investors yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {investorShares.map((inv, i) => {
              const isMe = inv.investorName === myShare?.investorName;
              const barW = Math.min(inv.profitSharePct / 85 * 100, 100);
              return (
                <div key={i} style={{
                  background: isMe ? 'rgba(124,58,237,0.07)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isMe ? 'rgba(124,58,237,0.3)' : 'var(--border)'}`,
                  borderRadius: 12, padding: '12px 16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {isMe && <span style={{ fontSize: 10, background: 'rgba(124,58,237,0.2)', color: 'var(--purple)', borderRadius: 99, padding: '2px 8px', fontWeight: 700 }}>YOU</span>}
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{inv.investorName}</span>
                      <span style={{ fontSize: 11, color: 'var(--muted2)' }}>{fmt(inv.investedAmount)}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {isScaled && (
                        <span style={{ fontSize: 11, color: 'var(--muted2)', marginRight: 8, textDecoration: 'line-through' }}>
                          {inv.tierPct}%
                        </span>
                      )}
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--acc)' }}>
                        {inv.profitSharePct.toFixed(2)}%
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--green)', marginLeft: 8 }}>
                        {fmt(inv.profitAmount)}
                      </span>
                    </div>
                  </div>
                  {/* bar */}
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 99, width: `${barW}%`,
                      background: isMe ? 'linear-gradient(90deg,#7c3aed,#2563eb)' : 'linear-gradient(90deg,#374151,#6b7280)',
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Company row */}
        <div style={{
          marginTop: 12, background: 'rgba(6,182,212,0.06)',
          border: '1px solid rgba(6,182,212,0.2)', borderRadius: 12, padding: '12px 16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--cyan)' }}>🏢 Company (min 15%)</span>
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--cyan)' }}>
              {companyProfitSharePct.toFixed(1)}%
            </span>
            <span style={{ fontSize: 11, color: 'var(--muted2)', marginLeft: 8 }}>
              {fmt(companyShare)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
