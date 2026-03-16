import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { investorAPI } from '../services/api';
import KPICard         from '../components/KPICard';
import EvalCard        from '../components/EvalCard';
import EquityBreakdown from '../components/EquityBreakdown';
import ProfitShareCard from '../components/ProfitShareCard';
import AlertBox        from '../components/AlertBox';
import { fmt, pct }   from '../utils/format';

export default function InvestorView() {
  const navigate = useNavigate();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const investorName = localStorage.getItem('investor_name') || 'Investor';

  useEffect(() => {
    investorAPI.getMyData()
      .then(r => setData(r.data))
      .catch(() => {
        // token invalid or expired — send back to login
        localStorage.removeItem('investor_token');
        navigate('/investor/login');
      })
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

  const { product, metrics, myShare } = data;
  const m = metrics;

  return (
    <>
      {/* Nav */}
      <nav className="nav">
        <span className="nav-logo">BizTrack</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--muted2)' }}>{investorName}</span>
          <button className="btn btn-outline" onClick={logout} style={{ padding: '6px 14px', fontSize: 12 }}>
            Logout
          </button>
        </div>
      </nav>

      <div className="wrap">
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className="tag">Investor View · Read Only</div>
          <h1 style={{
            fontFamily: 'Syne,sans-serif', fontSize: 'clamp(22px,4vw,36px)', fontWeight: 800,
            background: 'linear-gradient(130deg,#fff 40%,var(--acc))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            {product.name}
          </h1>
          {product.category && (
            <p style={{ marginTop: 8, fontSize: 12, color: 'var(--muted2)' }}>{product.category}</p>
          )}
        </header>

        {/* Alerts */}
        {m.cashNet < 0 && (
          <AlertBox type="warn" icon="⚠️">
            Withdrawn amount exceeds profit by <strong>{fmt(Math.abs(m.cashNet))}</strong>
          </AlertBox>
        )}
        {m.profit < 0 && (
          <AlertBox type="warn" icon="📉">
            Product is currently running at a loss of <strong>{fmt(Math.abs(m.profit))}</strong>
          </AlertBox>
        )}

        {/* KPIs */}
        <div className="section-label">Overview</div>
        <div className="kpi-row">
          <KPICard label="Revenue"      value={fmt(m.assets + m.expenses - m.stock)} note="Total sales"         color="var(--blue)"   />
          <KPICard label="Gross Profit" value={fmt(m.profit)}                        note="Revenue − Expenses"  color={m.profit >= 0 ? 'var(--green)' : 'var(--red)'} />
          <KPICard label="Profit Margin" value={pct(m.margin)}                       note="% of revenue"        color="var(--acc)"    />
          <KPICard label="Total Capital" value={fmt(m.totalCapital)}                 note="All contributions"   color="var(--yellow)" />
        </div>

        {/* My Share */}
        <div className="section-label">Your Investment</div>
        <ProfitShareCard myShare={myShare} metrics={m} />

        {/* Equity breakdown */}
        <div className="section-label" style={{ marginTop: 24 }}>Equity & Profit Split</div>
        <EquityBreakdown
          companyContribution={m.totalCapital - m.totalInvestorAmount}
          companyEquityPct={m.companyEquityPct}
          totalInvestorAmount={m.totalInvestorAmount}
          investorEquityPct={m.investorEquityPct}
          companyProfitSharePct={m.companyProfitSharePct}
          companyProfitShare={m.companyProfitShare}
          investorShares={m.investorShares}
          profit={m.profit}
        />

        {/* Company valuation */}
        <div className="section-label" style={{ marginTop: 24 }}>Company Valuation</div>
        <EvalCard
          totalCapital={m.totalCapital}
          assets={m.assets}
          companyValue={m.companyValue}
        />

        {product.notes && (
          <div className="alert info" style={{ marginTop: 8 }}>
            <span className="alert-icon">📝</span>
            <span>{product.notes}</span>
          </div>
        )}
      </div>
    </>
  );
}