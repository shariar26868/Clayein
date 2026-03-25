import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI }      from '../services/api';
import KPICard           from '../components/KPICard';
import EvalCard          from '../components/EvalCard';
import EquityBreakdown   from '../components/EquityBreakdown';
import TrendChart        from '../components/TrendChart';
import AlertBox          from '../components/AlertBox';
import { fmt, pct }      from '../utils/format';
import AIReportModal    from '../components/AIReportModal';
import ThemeToggle      from '../components/ThemeToggle';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Smart insights generator
function getInsights(p, m) {
  const items = [];
  const revenue = p.revenue || 0;
  const stock   = p.stock   || 0;

  if (m.profit > 0) {
    items.push(['📈', `<b class="g">Revenue healthy:</b> ${fmt(revenue)} sales থেকে <b class="g">${pct(m.margin)} profit margin</b> আসছে।`]);
  } else if (m.profit < 0) {
    items.push(['📉', `<b class="r">Loss alert:</b> Expenses revenue কে exceed করছে। এখনই cost কমানো দরকার।`]);
  }

  if (m.expRatio > 80) {
    items.push(['🔥', `<b class="r">Expense ratio বেশি (${pct(m.expRatio)}):</b> প্রতি ৳100 revenue তে ৳${m.expRatio.toFixed(0)} খরচ হচ্ছে।`]);
  } else if (m.expRatio > 60) {
    items.push(['⚡', `<b class="y">Expense ratio মধ্যম (${pct(m.expRatio)}):</b> একটু কমানোর চেষ্টা করুন।`]);
  } else if (revenue > 0) {
    items.push(['✅', `<b class="g">Expense ratio ভালো (${pct(m.expRatio)}):</b> Cost management সঠিক আছে।`]);
  }

  if (p.stockQty > 0) {
    const totalQty  = (p.stockQty || 0) + (p.stockSold || 0);
    const soldPct   = totalQty > 0 ? ((p.stockSold || 0) / totalQty * 100).toFixed(1) : 0;
    items.push(['📦', `<b class="p">Inventory:</b> মোট <b>${p.stockQty} টি</b> product আছে (বিক্রি হয়েছে <b class="g">${p.stockSold || 0} টি</b> · ${soldPct}%)। Stock value <b class="b">${fmt(stock)}</b>।`]);
  }

  if (m.cashNet < 0) {
    items.push(['💸', `<b class="r">Over-withdrawal:</b> ${fmt(Math.abs(m.cashNet))} টাকা capital থেকে নেওয়া হচ্ছে। Stock বিক্রির আগে আর withdraw না করাই ভালো।`]);
  }

  if (stock > 0 && m.profit >= 0) {
    items.push(['🏷️', `<b class="p">Stock value ${fmt(stock)}:</b> এই inventory বিক্রি হলে total profit হবে <b class="g">${fmt(m.profit + stock)}</b>।`]);
  }

  if (m.totalCapital > 0) {
    items.push(['💼', `<b class="b">Return on Investment:</b> মোট বিনিয়োগ ${fmt(m.totalCapital)} এর বিপরীতে ROI <b>${pct(m.roi)}</b>।`]);
  }

  if (m.companyValue > 0 && m.totalCapital > 0) {
    const growth = ((m.companyValue - m.totalCapital) / m.totalCapital * 100).toFixed(1);
    items.push(['🏢', `<b class="p">Company Value:</b> মোট বিনিয়োগ ${fmt(m.totalCapital)} থেকে company value হয়েছে <b class="g">${fmt(m.companyValue)}</b> — বৃদ্ধি <b>${growth}%</b>।`]);
  }

  return items;
}

export default function ProductDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [product,   setProduct]   = useState(null);
  const [snapshots, setSnapshots] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [form,      setForm]      = useState({});
  const [rulesEdit, setRulesEdit] = useState(false);
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [invForm,   setInvForm]   = useState({ username:'', password:'', investorName:'', investedAmount:'', profitSharePct:'' });
  const [invError,  setInvError]  = useState('');
  const [showAI,    setShowAI]    = useState(false);

  const load = async () => {
    try {
      const [pRes, sRes] = await Promise.all([
        adminAPI.getProduct(id),
        adminAPI.getSnapshots(id),
      ]);
      setProduct(pRes.data);
      setForm({
        name:                pRes.data.name,
        category:            pRes.data.category,
        revenue:             pRes.data.revenue,
        expenses:            pRes.data.expenses,
        stockQty:            pRes.data.stockQty,
        stockPrice:          pRes.data.stockPrice,
        stockSold:           pRes.data.stockSold,
        withdrawn:           pRes.data.withdrawn,
        companyContribution: pRes.data.companyContribution,
        notes:               pRes.data.notes,
        investmentRules:     pRes.data.investmentRules || '',
      });
      setSnapshots(sRes.data);
    } catch { navigate('/'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  // live preview: recalculate stock as user types qty/price
  const computedStock = (parseFloat(form.stockQty) || 0) * (parseFloat(form.stockPrice) || 0);

  const saveProduct = async () => {
    setSaving(true);
    try {
      const { data } = await adminAPI.updateProduct(id, form);
      setProduct(data);
    } finally { setSaving(false); }
  };

  const saveSnapshot = async () => {
    const now = new Date();
    await adminAPI.saveSnapshot(id, { month: now.getMonth() + 1, year: now.getFullYear() });
    const { data } = await adminAPI.getSnapshots(id);
    setSnapshots(data);
    alert('Snapshot saved!');
  };

  const addInvestor = async e => {
    e.preventDefault(); setInvError('');
    try {
      await adminAPI.addInvestor(id, {
        ...invForm,
        investedAmount: Number(invForm.investedAmount),
        profitSharePct: Number(invForm.profitSharePct),
      });
      setShowInvestorModal(false);
      setInvForm({ username:'', password:'', investorName:'', investedAmount:'', profitSharePct:'' });
      load();
    } catch (err) { setInvError(err.response?.data?.error || 'Failed'); }
  };

  const removeInvestor = async (accessId) => {
    if (!confirm('Remove this investor?')) return;
    await adminAPI.removeInvestor(id, accessId);
    load();
  };

  if (loading) return <div className="wrap"><div className="spinner" /></div>;
  if (!product) return null;

  const m = product.metrics || {};
  const investors = product.investors || [];
  const insights = getInsights(product, m);
  const h = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <>
      <nav className="nav">
        <a className="nav-logo" href="/">BizTrack</a>
        <div className="nav-links">
          <button className="btn btn-outline" onClick={() => navigate('/')} style={{ fontSize: 12, padding: '6px 14px' }}>Back</button>
          <ThemeToggle />
          <button className="btn btn-outline" onClick={() => setShowAI(true)} style={{ fontSize: 12, padding: '6px 14px', borderColor: 'rgba(124,109,250,0.5)', color: 'var(--acc)' }}>🤖 AI Analysis</button>
          <button className="btn btn-outline" onClick={saveSnapshot} style={{ fontSize: 12, padding: '6px 14px' }}>Snapshot</button>
          <button className="btn btn-primary" onClick={saveProduct} disabled={saving} style={{ fontSize: 12, padding: '6px 14px' }}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </nav>

      <div className="wrap">
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className="tag">Product Analysis</div>
          <h1 style={{
            fontFamily: 'Syne,sans-serif', fontSize: 'clamp(22px,4vw,36px)', fontWeight: 800,
            background: 'linear-gradient(130deg,#fff 40%,var(--acc))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            {product.name}
          </h1>
        </header>

        {/* Alerts */}
        {m.cashNet < 0 && <AlertBox type="warn" icon="⚠️">Withdrawn এর চেয়ে profit কম। Overpull: <strong>{fmt(Math.abs(m.cashNet))}</strong></AlertBox>}
        {m.profit  < 0 && <AlertBox type="warn" icon="📉">এই product এ loss হচ্ছে: <strong>{fmt(Math.abs(m.profit))}</strong></AlertBox>}
        {m.profit  > 0 && m.cashNet >= 0 && <AlertBox type="good" icon="✅">Profit healthy — {fmt(m.cashNet)} এখনো company তে আছে।</AlertBox>}

        {/* ── Business Figures ── */}
        <div className="section-label">Business Figures</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 14, marginBottom: 14 }}>
          {[
            { name:'revenue',             label:'Revenue / Sales' },
            { name:'expenses',            label:'Expenses' },
            { name:'withdrawn',           label:'Cash Withdrawn' },
            { name:'companyContribution', label:'Company Capital' },
          ].map(({ name, label }) => (
            <div key={name} className="field">
              <label>{label}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--muted)', fontSize: 16 }}>৳</span>
                <input type="number" name={name} value={form[name] || ''} onChange={h} placeholder="0" />
              </div>
            </div>
          ))}
          <div className="field">
            <label>Category</label>
            <input name="category" value={form.category || ''} onChange={h} placeholder="General" />
          </div>
        </div>
        <div className="field" style={{ marginBottom: 20 }}>
          <label>Notes</label>
          <input name="notes" value={form.notes || ''} onChange={h} placeholder="Any notes..." />
        </div>

        {/* ── Inventory Calculator ── */}
        <div className="section-label">Inventory</div>
        <div style={{
          background: 'var(--s1)', border: '1px solid var(--border2)',
          borderRadius: 16, padding: 24, marginBottom: 20,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 14, marginBottom: 16 }}>
            <div className="field">
              <label>Stock Quantity (টি আছে)</label>
              <input type="number" name="stockQty" value={form.stockQty || ''} onChange={h} placeholder="0" />
            </div>
            <div className="field">
              <label>Price per Unit (৳)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--muted)', fontSize: 16 }}>৳</span>
                <input type="number" name="stockPrice" value={form.stockPrice || ''} onChange={h} placeholder="0" />
              </div>
            </div>
            <div className="field">
              <label>Total Sold (টি বিক্রি)</label>
              <input type="number" name="stockSold" value={form.stockSold || ''} onChange={h} placeholder="0" />
            </div>
          </div>

          {/* live preview */}
          <div style={{
            background: 'rgba(124,109,250,0.08)', border: '1px solid rgba(124,109,250,0.25)',
            borderRadius: 12, padding: '14px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--muted2)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
                Stock Value Preview
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted2)' }}>
                {form.stockQty || 0} টি × ৳{form.stockPrice || 0}
              </div>
            </div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--acc)' }}>
              {fmt(computedStock)}
            </div>
          </div>

          {(form.stockSold > 0 || form.stockQty > 0) && (
            <div style={{ marginTop: 12, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 12, color: 'var(--muted2)' }}>
                মোট stock ছিল: <span style={{ color: 'var(--text)' }}>
                  {(parseInt(form.stockQty) || 0) + (parseInt(form.stockSold) || 0)} টি
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted2)' }}>
                বিক্রি হয়েছে: <span style={{ color: 'var(--green)' }}>{form.stockSold || 0} টি</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted2)' }}>
                বাকি আছে: <span style={{ color: 'var(--yellow)' }}>{form.stockQty || 0} টি</span>
              </div>
            </div>
          )}
        </div>

        {/* KPIs */}
        <div className="section-label">Live Results</div>
        <div className="kpi-row">
          <KPICard label="Gross Profit"  value={fmt(m.profit)}       note="Revenue - Expenses"  color={m.profit >= 0 ? 'var(--green)' : 'var(--red)'} />
          <KPICard label="Profit Margin" value={pct(m.margin)}       note="% of revenue"         color="var(--acc)"    />
          <KPICard label="Stock Value"   value={fmt(product.stock)}  note={`${product.stockQty || 0} টি × ৳${product.stockPrice || 0}`} color="var(--blue)" />
          <KPICard label="Total Capital" value={fmt(m.totalCapital)} note="Company + Investors"  color="var(--yellow)" />
          <KPICard label="ROI"           value={pct(m.roi)}          note="Profit / Capital"     color="var(--acc)"    />
        </div>

        {/* Equity */}
        <div className="section-label">Equity & Profit Split</div>
        <EquityBreakdown
          companyContribution={product.companyContribution}
          companyEquityPct={m.companyEquityPct}
          totalInvestorAmount={m.totalInvestorAmount}
          investorEquityPct={m.investorEquityPct}
          companyProfitSharePct={m.companyProfitSharePct}
          companyProfitShare={m.companyProfitShare}
          investorShares={m.investorShares || []}
          profit={m.profit}
        />

        {/* Valuation */}
        <div className="section-label" style={{ marginTop: 24 }}>Valuation</div>
        <EvalCard totalCapital={m.totalCapital} assets={m.assets} companyValue={m.companyValue} />

        {/* Investment Rules */}
        <div className="section-label" style={{ marginTop: 24 }}>
          Investment Rules
          <button
            className="btn btn-outline"
            onClick={() => setRulesEdit(r => !r)}
            style={{ marginLeft: 'auto', fontSize: 11, padding: '5px 14px' }}
          >
            {rulesEdit ? 'Preview' : '✏️ Edit'}
          </button>
          {rulesEdit && (
            <button className="btn btn-primary" onClick={saveProduct} disabled={saving}
              style={{ fontSize: 11, padding: '5px 14px' }}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
        <div className="card" style={{ padding: rulesEdit ? 16 : 24 }}>
          {rulesEdit ? (
            <textarea
              name="investmentRules"
              value={form.investmentRules || ''}
              onChange={h}
              placeholder="Investment rules লিখুন..."
              rows={16}
              style={{
                width: '100%', background: 'var(--s2)', border: '1px solid var(--border2)',
                borderRadius: 10, padding: '12px 14px', color: 'var(--text)',
                fontSize: 13, lineHeight: 1.8, resize: 'vertical', outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          ) : (
            form.investmentRules
              ? <pre style={{
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  fontSize: 13, lineHeight: 1.9, color: 'var(--muted2)',
                  margin: 0, fontFamily: 'inherit',
                }}>{form.investmentRules}</pre>
              : <div style={{ color: 'var(--muted2)', fontSize: 13 }}>No investment rules set yet.</div>
          )}
        </div>

        {/* Investors */}
        <div className="section-label" style={{ marginTop: 24 }}>
          Investors
          <button className="btn btn-primary" onClick={() => setShowInvestorModal(true)}
            style={{ marginLeft: 'auto', fontSize: 11, padding: '5px 14px' }}>
            + Add
          </button>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {investors.length === 0
            ? <div style={{ padding: 24, color: 'var(--muted2)', fontSize: 13 }}>No investors yet.</div>
            : (
              <table className="table">
                <thead>
                  <tr><th>Name</th><th>Username</th><th>Invested</th><th>Profit Share</th><th>Equity</th><th></th></tr>
                </thead>
                <tbody>
                  {investors.map((inv) => {
                    const share = m.investorShares?.find(s => s.investorName === inv.investorName);
                    return (
                      <tr key={inv._id}>
                        <td style={{ color: 'var(--acc)', fontWeight: 600 }}>{inv.investorName}</td>
                        <td style={{ color: 'var(--muted2)' }}>{inv.username}</td>
                        <td className="g">{fmt(inv.investedAmount)}</td>
                        <td className="y">{pct(inv.profitSharePct)} → {fmt(share?.profitAmount || 0)}</td>
                        <td className="b">{pct(share?.equityPct || 0)}</td>
                        <td>
                          <button className="btn btn-danger" onClick={() => removeInvestor(inv._id)}
                            style={{ fontSize: 11, padding: '4px 10px' }}>✕</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )
          }
        </div>

        {/* Trend */}
        <div className="section-label" style={{ marginTop: 24 }}>Monthly Trend</div>
        <TrendChart snapshots={snapshots} />

        {/* Smart Insights */}
        <div className="section-label" style={{ marginTop: 24 }}>Smart Insights</div>
        <div className="card">
          <div className="card-ttl" style={{ marginBottom: 16 }}>
            <span className="dot" />
            Analysis
          </div>
          {insights.length === 0
            ? <div style={{ color: 'var(--muted2)', fontSize: 13 }}>Save some data to see insights.</div>
            : insights.map(([icon, html], i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                padding: '12px 0', borderBottom: i < insights.length - 1 ? '1px solid var(--border)' : 'none',
                fontSize: 13, lineHeight: 1.7, color: '#b0b0c8',
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                <span dangerouslySetInnerHTML={{ __html: html
                  .replace(/<b class="g">/g, '<strong style="color:var(--green)">')
                  .replace(/<b class="r">/g, '<strong style="color:var(--red)">')
                  .replace(/<b class="y">/g, '<strong style="color:var(--yellow)">')
                  .replace(/<b class="p">/g, '<strong style="color:var(--acc)">')
                  .replace(/<b class="b">/g, '<strong style="color:var(--blue)">')
                  .replace(/<b>/g, '<strong>')
                  .replace(/<\/b>/g, '</strong>')
                }} />
              </div>
            ))
          }
        </div>
      </div>

      {showAI && (
        <AIReportModal
          productId={id}
          productName={product.name}
          onClose={() => setShowAI(false)}
        />
      )}

      {/* Add investor modal */}
      {showInvestorModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowInvestorModal(false)}>
          <div className="modal">
            <div className="modal-title">Add Investor Access</div>
            <form onSubmit={addInvestor} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { name:'investorName',   label:'Investor Name',      type:'text',     placeholder:'Sadek' },
                { name:'username',       label:'Login Username',      type:'text',     placeholder:'sadek123' },
                { name:'password',       label:'Login Password',      type:'password', placeholder:'...' },
                { name:'investedAmount', label:'Invested Amount (৳)', type:'number',   placeholder:'0' },
                { name:'profitSharePct', label:'Profit Share (%)',    type:'number',   placeholder:'0' },
              ].map(f => (
                <div key={f.name} className="field">
                  <label>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder}
                    value={invForm[f.name]}
                    onChange={e => setInvForm(p => ({ ...p, [f.name]: e.target.value }))} required />
                </div>
              ))}
              {invError && <div className="alert warn"><span className="alert-icon">⚠️</span><span>{invError}</span></div>}
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowInvestorModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Investor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}