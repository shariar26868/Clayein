import { useEffect, useState } from 'react';
import { useNavigate }        from 'react-router-dom';
import { investorAPI }        from '../services/api';
import KPICard                from '../components/KPICard';
import EvalCard               from '../components/EvalCard';
import EquityBreakdown        from '../components/EquityBreakdown';
import ProfitShareCard        from '../components/ProfitShareCard';
import AlertBox               from '../components/AlertBox';
import { fmt, pct }           from '../utils/format';
import ThemeToggle             from '../components/ThemeToggle';

export default function InvestorView() {
  const navigate = useNavigate();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const investorName = localStorage.getItem('investor_name') || 'Investor';

  useEffect(() => {
    investorAPI.getMyData()
      .then(r => setData(r.data))
      .catch(() => { localStorage.removeItem('investor_token'); navigate('/investor/login'); })
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem('investor_token');
    localStorage.removeItem('investor_name');
    localStorage.removeItem('investor_productId');
    navigate('/investor/login');
  };

  if (loading) return <div className="wrap"><div className="spinner" /></div>;
  if (!data)   return null;

  const { product, metrics: m, myShare } = data;

  return (
    <>
      <nav className="nav">
        <span className="nav-logo" style={{ background:'linear-gradient(135deg,#22d3ee,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>BizTrack</span>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{investorName}</div>
            <div style={{ fontSize:11, color:'var(--muted)' }}>Investor</div>
          </div>
          <ThemeToggle />
          <button className="btn btn-outline" onClick={logout} style={{ fontSize:12, padding:'6px 14px' }}>Logout</button>
        </div>
      </nav>

      <div className="wrap">
        <div className="page-header">
          <div style={{ display:'inline-block', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', fontWeight:700, background:'linear-gradient(135deg,rgba(6,182,212,0.15),rgba(37,99,235,0.15))', color:'var(--cyan)', border:'1px solid rgba(6,182,212,0.3)', borderRadius:99, padding:'5px 16px', marginBottom:16 }}>
            Investor View · Read Only
          </div>
          <h1 style={{ fontSize:'clamp(22px,4vw,36px)', fontWeight:800, letterSpacing:'-0.03em', background:'linear-gradient(135deg,#fff,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            {product.name}
          </h1>
          {product.category && <p>{product.category}</p>}
        </div>

        {m.cashNet < 0 && <AlertBox type="warn" icon="⚠️">Withdrawn amount exceeds profit by <strong>{fmt(Math.abs(m.cashNet))}</strong></AlertBox>}
        {m.profit  < 0 && <AlertBox type="warn" icon="📉">Product is currently at a loss of <strong>{fmt(Math.abs(m.profit))}</strong></AlertBox>}

        <div className="section-label">Overview</div>
        <div className="kpi-row">
          <KPICard label="Gross Profit"   value={fmt(m.profit)}       note="Revenue − Expenses"  color={m.profit >= 0 ? 'linear-gradient(135deg,#10b981,#06b6d4)' : 'linear-gradient(135deg,#ef4444,#f97316)'} />
          <KPICard label="Profit Margin"  value={pct(m.margin)}       note="% of revenue"         color="linear-gradient(135deg,#a78bfa,#7c3aed)" />
          <KPICard label="Total Capital"  value={fmt(m.totalCapital)} note="All contributions"    color="linear-gradient(135deg,#f59e0b,#fbbf24)" />
          <KPICard label="ROI"            value={pct(m.roi)}          note="Profit / Capital"     color="linear-gradient(135deg,#60a5fa,#22d3ee)" />
        </div>

        <div className="section-label">Your Investment</div>
        <ProfitShareCard myShare={myShare} metrics={m} />

        <div className="section-label" style={{ marginTop:24 }}>Equity & Profit Split</div>
        <EquityBreakdown
          companyContribution={m.totalCapital - m.totalInvestorAmount}
          companyEquityPct={m.companyEquityPct}
          totalInvestorAmount={m.totalInvestorAmount}
          investorEquityPct={m.investorEquityPct}
          companyProfitSharePct={m.companyProfitSharePct}
          companyProfitShare={m.companyProfitShare}
          investorShares={m.investorShares || []}
          profit={m.profit}
        />

        <div className="section-label" style={{ marginTop:24 }}>Valuation</div>
        <EvalCard totalCapital={m.totalCapital} assets={m.assets} companyValue={m.companyValue} />

        {product.investmentRules && (
          <>
            <div className="section-label" style={{ marginTop: 24 }}>Investment Rules</div>
            <div className="card" style={{ padding: 24 }}>
              <pre style={{
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                fontSize: 13, lineHeight: 1.9, color: 'var(--muted2)',
                margin: 0, fontFamily: 'inherit',
              }}>{product.investmentRules}</pre>
            </div>
          </>
        )}

        {product.notes && (
          <div className="alert info" style={{ marginTop:8 }}>
            <span className="alert-icon">📝</span>
            <span>{product.notes}</span>
          </div>
        )}
      </div>
    </>
  );
}