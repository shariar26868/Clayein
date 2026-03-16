import { useEffect, useState } from 'react';
import { useNavigate }         from 'react-router-dom';
import { adminAPI }            from '../services/api';
import KPICard                 from '../components/KPICard';
import EvalCard                from '../components/EvalCard';
import AlertBox                from '../components/AlertBox';
import { fmt, pct }            from '../utils/format';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [summary,  setSummary]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [showAdd,  setShowAdd]  = useState(false);
  const [addForm,  setAddForm]  = useState({ name:'', category:'', notes:'' });
  const [addErr,   setAddErr]   = useState('');

  const load = async () => {
    try {
      const { data } = await adminAPI.getSummary();
      setSummary(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const createProduct = async e => {
    e.preventDefault(); setAddErr('');
    try {
      const { data } = await adminAPI.createProduct(addForm);
      setShowAdd(false);
      setAddForm({ name:'', category:'', notes:'' });
      navigate(`/product/${data._id}`);
    } catch (err) { setAddErr(err.response?.data?.error || 'Failed'); }
  };

  const deleteProduct = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await adminAPI.deleteProduct(id);
    load();
  };

  if (loading) return <div className="wrap"><div className="spinner" /></div>;

  const s = summary?.summary || {};
  const products = summary?.products || [];

  return (
    <>
      <nav className="nav">
        <a className="nav-logo" style={{textDecoration:"none"}} href="/">BizTrack</a>
        <div className="nav-links">
          <button className="btn btn-outline" onClick={() => { localStorage.removeItem("admin_token"); window.location.href="/admin/login"; }} style={{ fontSize: 12, padding: "6px 14px" }}>Logout</button>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)} style={{ fontSize: 12, padding: "6px 16px" }}>
            + New Product
          </button>
        </div>
      </nav>

      <div className="wrap">
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className="tag">Super Admin · Company Dashboard</div>
          <h1 style={{
            fontFamily: 'Syne,sans-serif', fontSize: 'clamp(24px,5vw,42px)', fontWeight: 800,
            background: 'linear-gradient(130deg,#fff 40%,var(--acc))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Company Overview
          </h1>
          <p style={{ marginTop: 8, fontSize: 12, color: 'var(--muted2)' }}>
            All {products.length} product{products.length !== 1 ? 's' : ''} combined
          </p>
        </header>

        {/* Alerts */}
        {s.totalProfit < 0 && (
          <AlertBox type="warn" icon="📉">
            Company is running at a loss of <strong>{fmt(Math.abs(s.totalProfit))}</strong> across all products.
          </AlertBox>
        )}

        {/* KPIs */}
        <div className="section-label">Company Totals</div>
        <div className="kpi-row">
          <KPICard label="Total Revenue"  value={fmt(s.totalRevenue)}      note="All products"        color="var(--blue)"   />
          <KPICard label="Total Profit"   value={fmt(s.totalProfit)}       note="Revenue − Expenses"  color={s.totalProfit >= 0 ? 'var(--green)' : 'var(--red)'} />
          <KPICard label="Profit Margin"  value={pct(s.totalMargin)}       note="Combined %"           color="var(--acc)"    />
          <KPICard label="Total Stock"    value={fmt(s.totalStock)}        note="Inventory value"      color="var(--yellow)" />
          <KPICard label="Total Capital"  value={fmt(s.totalCapital)}      note="All investments"      color="var(--acc)"    />
        </div>

        {/* Company valuation */}
        <div className="section-label">Company Valuation</div>
        <EvalCard
          totalCapital={s.totalCapital}
          assets={s.totalAssets}
          companyValue={s.totalCompanyValue}
        />

        {/* Products list */}
        <div className="section-label">Products</div>
        {products.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--muted2)', padding: 40 }}>
            No products yet. Click <strong style={{ color: 'var(--acc)' }}>+ New Product</strong> to add one.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {products.map(p => (
              <div key={p._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.category}</div>
                </div>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--muted2)', marginBottom: 4 }}>REVENUE</div>
                    <div className="b" style={{ fontWeight: 600 }}>{fmt(p.revenue)}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--muted2)', marginBottom: 4 }}>PROFIT</div>
                    <div className={p.profit >= 0 ? 'g' : 'r'} style={{ fontWeight: 600 }}>{fmt(p.profit)}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--muted2)', marginBottom: 4 }}>MARGIN</div>
                    <div className="p" style={{ fontWeight: 600 }}>{pct(p.margin)}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--muted2)', marginBottom: 4 }}>VALUE</div>
                    <div className="y" style={{ fontWeight: 600 }}>{fmt(p.companyValue)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                  <button className="btn btn-primary" onClick={() => navigate(`/product/${p._id}`)}
                    style={{ fontSize: 12, padding: '7px 16px' }}>
                    Open →
                  </button>
                  <button className="btn btn-danger" onClick={() => deleteProduct(p._id, p.name)}
                    style={{ fontSize: 12, padding: '7px 12px' }}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add product modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal">
            <div className="modal-title">New Product</div>
            <form onSubmit={createProduct} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="field">
                <label>Product Name</label>
                <input value={addForm.name} onChange={e => setAddForm(p => ({...p, name: e.target.value}))}
                  placeholder="e.g. T-Shirt Collection" required />
              </div>
              <div className="field">
                <label>Category</label>
                <input value={addForm.category} onChange={e => setAddForm(p => ({...p, category: e.target.value}))}
                  placeholder="e.g. Clothing" />
              </div>
              <div className="field">
                <label>Notes</label>
                <input value={addForm.notes} onChange={e => setAddForm(p => ({...p, notes: e.target.value}))}
                  placeholder="Optional notes" />
              </div>
              {addErr && <div className="alert warn"><span className="alert-icon">⚠️</span><span>{addErr}</span></div>}
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create →</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}