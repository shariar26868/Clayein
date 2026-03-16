import { fmt, pct } from '../utils/format';

export default function ProfitShareCard({ myShare, metrics }) {
  if (!myShare) return null;

  const roi = myShare.investedAmount > 0
    ? (myShare.profitAmount / myShare.investedAmount) * 100
    : 0;

  return (
    <div className="card" style={{ border: '1px solid rgba(124,109,250,0.35)' }}>
      <div className="card-ttl">
        <span className="dot" style={{ '--dc': 'var(--acc)' }} />
        Your Investment Summary
      </div>

      <div className="pl-row">
        <span className="lbl">You invested</span>
        <span className="val p">{fmt(myShare.investedAmount)}</span>
      </div>
      <div className="pl-row">
        <span className="lbl">Your equity share</span>
        <span className="val b">{pct(myShare.equityPct)}</span>
      </div>
      <div className="pl-row">
        <span className="lbl">Your profit share %</span>
        <span className="val y">{pct(myShare.profitSharePct)}</span>
      </div>
      <div className="pl-row big">
        <span className="lbl">Your profit this period</span>
        <span className="val" style={{ color: myShare.profitAmount >= 0 ? 'var(--green)' : 'var(--red)' }}>
          {fmt(myShare.profitAmount)}
        </span>
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="bar-lbl"><span>Return on your investment</span><span>{pct(roi)}</span></div>
        <div className="bar-track">
          <div className="bar-fill" style={{
            '--bc': roi >= 0 ? 'var(--green)' : 'var(--red)',
            width: `${Math.min(Math.abs(roi), 100)}%`,
          }} />
        </div>
      </div>
    </div>
  );
}