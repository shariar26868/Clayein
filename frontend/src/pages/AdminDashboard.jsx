import { useEffect, useState } from 'react';
import { useNavigate }         from 'react-router-dom';
import { adminAPI }            from '../services/api';
import KPICard                 from '../components/KPICard';
import EvalCard                from '../components/EvalCard';
import AlertBox                from '../components/AlertBox';
import { fmt, pct }            from '../utils/format';
import ThemeToggle              from '../components/ThemeToggle';

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
        <span className="nav-logo">BizTrack</span>
        <div className="nav-links">
          <span style={{ fontSize:12, color:'var(--muted)', marginRight:8 }}>
            {localStorage.getItem('admin_email')}
          </span>
          <ThemeToggle />
          <button className="btn btn-outline"
            onClick={() => { localStorage.removeItem('admin_token'); window.location.href='/admin/login'; }}
            style={{ fontSize:12, padding:'6px 14px' }}>
            Logout
          </button>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}
            style={{ fontSize:12, padding:'6px 18px' }}>
            + New Product
          </button>
        </div>
      </nav>

      <div className="wrap">
        <div className="page-header">
          <div className="tag">Super Admin · Company Dashboard</div>
          <h1>Company Overview</h1>
          <p>{products.length} product{products.length !== 1 ? 's' : ''} · All combined</p>
        </div>

        {s.totalProfit < 0 && (
          <AlertBox type="warn" icon="📉">
            Company is running at a loss of <strong>{fmt(Math.abs(s.totalProfit))}</strong> across all products.
          </AlertBox>
        )}

        <div className="section-label">Company Totals</div>
        <div className="kpi-row">
          <KPICard label="Total Revenue"  value={fmt(s.totalRevenue)}  note="All products"       color="linear-gradient(135deg,#60a5fa,#22d3ee)"  glow="rgba(96,165,250,0.5)" />
          <KPICard label="Total Profit"   value={fmt(s.totalProfit)}   note="Revenue − Expenses" color={s.totalProfit >= 0 ? 'linear-gradient(135deg,#10b981,#06b6d4)' : 'linear-gradient(135deg,#ef4444,#f97316)'} glow={s.totalProfit >= 0 ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)'} />
          <KPICard label="Profit Margin"  value={pct(s.totalMargin)}   note="Combined %"          color="linear-gradient(135deg,#a78bfa,#7c3aed)"  glow="rgba(167,139,250,0.5)" />
          <KPICard label="Total Stock"    value={fmt(s.totalStock)}    note="Inventory value"     color="linear-gradient(135deg,#f59e0b,#fbbf24)"  glow="rgba(245,158,11,0.5)" />
          <KPICard label="Total Capital"  value={fmt(s.totalCapital)}  note="All investments"     color="linear-gradient(135deg,#7c3aed,#2563eb)"  glow="rgba(124,58,237,0.5)" />
        </div>

        <div className="section-label">Company Valuation</div>
        <EvalCard totalCapital={s.totalCapital} assets={s.totalAssets} companyValue={s.totalCompanyValue} />

        <div className="section-label">Products</div>
        {products.length === 0 ? (
          <div className="card" style={{ textAlign:'center', padding:60 }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📦</div>
            <div style={{ color:'var(--muted)', fontSize:15, marginBottom:24 }}>No products yet</div>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add First Product</button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {products.map((p, i) => (
              <div key={p._id} className="card" style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap', transition:'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform='translateX(4px)'}
                onMouseLeave={e => e.currentTarget.style.transform='translateX(0)'}>

                {/* Color indicator */}
                <div style={{
                  width:4, height:48, borderRadius:99, flexShrink:0,
                  background: ['linear-gradient(180deg,#7c3aed,#2563eb)', 'linear-gradient(180deg,#10b981,#06b6d4)', 'linear-gradient(180deg,#f59e0b,#f97316)', 'linear-gradient(180deg,#60a5fa,#a78bfa)'][i % 4],
                }} />

                <div style={{ flex:1, minWidth:140 }}>
                  <div style={{ fontWeight:700, fontSize:16, marginBottom:4, letterSpacing:'-0.01em' }}>{p.name}</div>
                  <div style={{ fontSize:11, color:'var(--muted2)', textTransform:'uppercase', letterSpacing:'0.1em' }}>{p.category}</div>
                </div>

                <div style={{ display:'flex', gap:28, flexWrap:'wrap' }}>
                  {[
                    { label:'REVENUE', value: fmt(p.revenue), color:'var(--blue)' },
                    { label:'PROFIT',  value: fmt(p.profit),  color: p.profit >= 0 ? 'var(--green)' : 'var(--red)' },
                    { label:'MARGIN',  value: pct(p.margin),  color:'var(--purple)' },
                    { label:'VALUE',   value: fmt(p.companyValue), color:'var(--yellow)' },
                  ].map(item => (
                    <div key={item.label} style={{ textAlign:'center' }}>
                      <div style={{ fontSize:10, color:'var(--muted2)', marginBottom:4, letterSpacing:'0.1em' }}>{item.label}</div>
                      <div style={{ fontWeight:700, fontSize:14, color:item.color }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display:'flex', gap:8, marginLeft:'auto' }}>
                  <button className="btn btn-primary" onClick={() => navigate(`/product/${p._id}`)}
                    style={{ fontSize:12, padding:'8px 18px' }}>Open →</button>
                  <button className="btn btn-danger" onClick={() => deleteProduct(p._id, p.name)}
                    style={{ fontSize:12, padding:'8px 12px' }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal">
            <div className="modal-title">New Product</div>
            <form onSubmit={createProduct} style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div className="field">
                <label>Product Name</label>
                <input value={addForm.name} onChange={e => setAddForm(p => ({...p, name:e.target.value}))} placeholder="e.g. T-Shirt Collection" required />
              </div>
              <div className="field">
                <label>Category</label>
                <input value={addForm.category} onChange={e => setAddForm(p => ({...p, category:e.target.value}))} placeholder="e.g. Clothing" />
              </div>
              <div className="field">
                <label>Notes</label>
                <input value={addForm.notes} onChange={e => setAddForm(p => ({...p, notes:e.target.value}))} placeholder="Optional notes" />
              </div>
              {addErr && <div className="alert warn"><span className="alert-icon">⚠️</span><span>{addErr}</span></div>}
              <div style={{ display:'flex', gap:10, marginTop:8 }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAdd(false)} style={{ flex:1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex:1 }}>Create →</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}