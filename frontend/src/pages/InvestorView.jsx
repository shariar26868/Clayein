import { useEffect, useState } from 'react';
import { useNavigate }        from 'react-router-dom';
import { investorAPI }        from '../services/api';
import KPICard                from '../components/KPICard';
import EvalCard               from '../components/EvalCard';
import EquityBreakdown        from '../components/EquityBreakdown';
import ProfitShareCard        from '../components/ProfitShareCard';
import AlertBox               from '../components/AlertBox';
import { fmt, pct }           from '../utils/format';
import ThemeToggle            from '../components/ThemeToggle';

// ── Download helper ──────────────────────────────────────────────
function downloadTxt(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── Investor AI Modal ────────────────────────────────────────────
function InvestorAIModal({ productName, onClose }) {
  const [tab,       setTab]       = useState('report');
  const [language,  setLanguage]  = useState('english');
  const [content,   setContent]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    setLoading(true); setError(''); setContent(''); setGenerated(false);
    try {
      const fn = tab === 'report' ? investorAPI.aiReport : investorAPI.aiForecast;
      const { data } = await fn(language);
      setContent(data.report || data.forecast);
      setGenerated(true);
    } catch (err) {
      setError(err.response?.data?.error || 'AI generation failed.');
    } finally { setLoading(false); }
  };

  const download = () => {
    const label = tab === 'report' ? 'Report' : 'Forecast';
    downloadTxt(`${productName}_AI_${label}.txt`, content);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 660, background: 'linear-gradient(135deg,rgba(13,13,36,0.98),rgba(18,18,46,0.98))' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:800, background:'linear-gradient(135deg,#22d3ee,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:4 }}>
              🤖 AI Analysis
            </div>
            <div style={{ fontSize:12, color:'var(--muted)' }}>{productName}</div>
          </div>
          <button className="btn btn-outline" onClick={onClose} style={{ fontSize:12, padding:'6px 14px' }}>✕ Close</button>
        </div>

        <div style={{ display:'flex', gap:8, marginBottom:20, background:'rgba(255,255,255,0.04)', borderRadius:14, padding:4 }}>
          {[{ key:'report', label:'📄 Report' }, { key:'forecast', label:'🔮 Forecast' }].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setContent(''); setGenerated(false); }}
              style={{
                flex:1, padding:'10px', border:'none', borderRadius:10, cursor:'pointer', fontFamily:'inherit',
                fontWeight:600, fontSize:13, transition:'all 0.2s',
                background: tab === t.key ? 'linear-gradient(135deg,#0891b2,#2563eb)' : 'transparent',
                color: tab === t.key ? '#fff' : 'var(--muted)',
                boxShadow: tab === t.key ? '0 4px 16px rgba(8,145,178,0.35)' : 'none',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="field" style={{ marginBottom:20 }}>
          <label>Language</label>
          <select value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="english">English</option>
            <option value="bangla">বাংলা</option>
          </select>
        </div>

        <div className="alert info" style={{ marginBottom:20 }}>
          <span className="alert-icon">💡</span>
          <span style={{ fontSize:12 }}>
            {tab === 'report'
              ? 'AI will analyze the product data and generate an investor-focused financial report.'
              : 'AI uses historical snapshots + current data to forecast next month returns.'}
          </span>
        </div>

        {!generated && (
          <button className="btn btn-primary" onClick={generate} disabled={loading}
            style={{ width:'100%', padding:'14px', fontSize:14, marginBottom:16, borderRadius:14, background:'linear-gradient(135deg,#0891b2,#2563eb)' }}>
            {loading ? `Generating ${tab === 'report' ? 'Report' : 'Forecast'}…` : `Generate ${tab === 'report' ? 'Report' : 'Forecast'} →`}
          </button>
        )}

        {loading && (
          <div style={{ textAlign:'center', padding:'20px 0', color:'var(--muted)', fontSize:13 }}>
            <div className="spinner" style={{ width:28, height:28, marginBottom:12 }} />
            AI is analyzing your data…
          </div>
        )}

        {error && <div className="alert warn"><span className="alert-icon">⚠️</span><span>{error}</span></div>}

        {generated && content && (
          <div>
            <div style={{
              background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:16, padding:24, maxHeight:380, overflowY:'auto',
              fontSize:13, lineHeight:1.9, color:'var(--text)', whiteSpace:'pre-wrap',
              fontFamily: language === 'bangla' ? 'sans-serif' : "'JetBrains Mono', monospace",
            }}>
              {content}
            </div>
            <div style={{ display:'flex', gap:10, marginTop:16 }}>
              <button className="btn btn-outline" onClick={() => navigator.clipboard.writeText(content)} style={{ flex:1, fontSize:13 }}>📋 Copy</button>
              <button className="btn btn-outline" onClick={download} style={{ flex:1, fontSize:13 }}>⬇️ Download</button>
              <button className="btn btn-outline" onClick={() => { setContent(''); setGenerated(false); }} style={{ flex:1, fontSize:13 }}>🔄 Regenerate</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Smart Insights (investor view) ───────────────────────────────
function getInsights(m, myShare) {
  const items = [];
  if (m.profit > 0) {
    items.push(['📈', `Business is profitable — <b class="g">৳${m.profit?.toLocaleString()}</b> gross profit this period.`]);
  } else if (m.profit < 0) {
    items.push(['📉', `<b class="r">Business is at a loss</b> of ৳${Math.abs(m.profit)?.toLocaleString()}. Returns may be affected.`]);
  }
  if (m.margin > 0) {
    items.push(['💹', `Profit margin is <b class="g">${m.margin?.toFixed(1)}%</b> — ${m.margin > 30 ? 'healthy performance.' : 'room for improvement.'}`]);
  }
  if (myShare?.profitAmount > 0) {
    items.push(['💰', `Your current profit share: <b class="g">৳${myShare.profitAmount?.toLocaleString()}</b> (${myShare.equityPct?.toFixed(1)}% equity).`]);
  }
  if (m.roi > 0) {
    items.push(['🏆', `Overall ROI is <b class="b">${m.roi?.toFixed(1)}%</b> on total capital of ৳${m.totalCapital?.toLocaleString()}.`]);
  }
  if (m.companyValue > m.totalCapital) {
    const growth = ((m.companyValue - m.totalCapital) / m.totalCapital * 100).toFixed(1);
    items.push(['🏢', `Company value grew to <b class="p">৳${m.companyValue?.toLocaleString()}</b> — <b class="g">${growth}%</b> above total capital.`]);
  }
  return items;
}

// ── Main Component ───────────────────────────────────────────────
export default function InvestorView() {
  const navigate = useNavigate();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAI,  setShowAI]  = useState(false);
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
  const insights = getInsights(m, myShare);

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
          <button className="btn btn-outline" onClick={() => setShowAI(true)}
            style={{ fontSize:12, padding:'6px 14px', borderColor:'rgba(6,182,212,0.4)', color:'var(--cyan)' }}>
            🤖 AI Analysis
          </button>
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

        {/* Investment Rules */}
        {product.investmentRules && (
          <>
            <div className="section-label" style={{ marginTop:24 }}>
              Investment Rules
              <button
                className="btn btn-outline"
                onClick={() => downloadTxt(`${product.name}_Investment_Rules.txt`, product.investmentRules)}
                style={{ marginLeft:'auto', fontSize:11, padding:'5px 14px' }}>
                ⬇️ Download
              </button>
            </div>
            <div className="card" style={{ padding:24 }}>
              <pre style={{
                whiteSpace:'pre-wrap', wordBreak:'break-word',
                fontSize:13, lineHeight:1.9, color:'var(--muted2)',
                margin:0, fontFamily:'inherit',
              }}>{product.investmentRules}</pre>
            </div>
          </>
        )}

        {/* Smart Insights */}
        <div className="section-label" style={{ marginTop:24 }}>Smart Insights</div>
        <div className="card">
          <div className="card-ttl" style={{ marginBottom:16 }}>
            <span className="dot" />Analysis
          </div>
          {insights.length === 0
            ? <div style={{ color:'var(--muted2)', fontSize:13 }}>No data available yet.</div>
            : insights.map(([icon, html], i) => (
              <div key={i} style={{
                display:'flex', gap:14, alignItems:'flex-start',
                padding:'12px 0', borderBottom: i < insights.length - 1 ? '1px solid var(--border)' : 'none',
                fontSize:13, lineHeight:1.7, color:'#b0b0c8',
              }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{icon}</span>
                <span dangerouslySetInnerHTML={{ __html: html
                  .replace(/<b class="g">/g, '<strong style="color:var(--green)">')
                  .replace(/<b class="r">/g, '<strong style="color:var(--red)">')
                  .replace(/<b class="y">/g, '<strong style="color:var(--yellow)">')
                  .replace(/<b class="p">/g, '<strong style="color:var(--acc)">')
                  .replace(/<b class="b">/g, '<strong style="color:var(--blue)">')
                  .replace(/<b>/g, '<strong>').replace(/<\/b>/g, '</strong>')
                }} />
              </div>
            ))
          }
        </div>

        {product.notes && (
          <div className="alert info" style={{ marginTop:16 }}>
            <span className="alert-icon">📝</span>
            <span>{product.notes}</span>
          </div>
        )}
      </div>

      {showAI && (
        <InvestorAIModal
          productName={product.name}
          onClose={() => setShowAI(false)}
        />
      )}
    </>
  );
}
