// import { useState } from 'react';
// import { aiAPI } from '../services/api';

// export default function AIReportModal({ productId, productName, onClose }) {
//   const [tab,       setTab]       = useState('report');   // 'report' | 'forecast'
//   const [language,  setLanguage]  = useState('english');
//   const [content,   setContent]   = useState('');
//   const [loading,   setLoading]   = useState(false);
//   const [error,     setError]     = useState('');
//   const [generated, setGenerated] = useState(false);

//   const generate = async () => {
//     setLoading(true); setError(''); setContent(''); setGenerated(false);
//     try {
//       const fn = tab === 'report' ? aiAPI.report : aiAPI.forecast;
//       const { data } = await fn(productId, language);
//       setContent(data.report || data.forecast);
//       setGenerated(true);
//     } catch (err) {
//       setError(err.response?.data?.error || 'AI generation failed. Check your OpenAI API key.');
//     } finally { setLoading(false); }
//   };

//   const copyText = () => {
//     navigator.clipboard.writeText(content);
//     alert('Copied to clipboard!');
//   };

//   return (
//     <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
//       <div className="modal" style={{ maxWidth: 640 }}>
//         {/* Header */}
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
//           <div>
//             <div className="modal-title" style={{ marginBottom: 4 }}>🤖 AI Analysis</div>
//             <div style={{ fontSize: 12, color: 'var(--muted2)' }}>{productName}</div>
//           </div>
//           <button className="btn btn-outline" onClick={onClose}
//             style={{ fontSize: 12, padding: '5px 12px' }}>✕ Close</button>
//         </div>

//         {/* Tab selector */}
//         <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
//           {[
//             { key: 'report',   label: '📄 Report' },
//             { key: 'forecast', label: '🔮 Forecast' },
//           ].map(t => (
//             <button key={t.key}
//               className={`btn ${tab === t.key ? 'btn-primary' : 'btn-outline'}`}
//               onClick={() => { setTab(t.key); setContent(''); setGenerated(false); }}
//               style={{ flex: 1, fontSize: 13 }}>
//               {t.label}
//             </button>
//           ))}
//         </div>

//         {/* Language selector */}
//         <div className="field" style={{ marginBottom: 20 }}>
//           <label>Language</label>
//           <select value={language} onChange={e => setLanguage(e.target.value)}>
//             <option value="english">English</option>
//             <option value="bangla">বাংলা</option>
//           </select>
//         </div>

//         {/* Info text */}
//         <div className="alert info" style={{ marginBottom: 20 }}>
//           <span className="alert-icon">💡</span>
//           <span style={{ fontSize: 12 }}>
//             {tab === 'report'
//               ? 'AI তোমার product এর current data analyze করে একটি professional financial report তৈরি করবে।'
//               : 'AI historical snapshots + current data দেখে আগামী মাসের prediction দেবে। বেশি snapshot থাকলে prediction ভালো হবে।'
//             }
//           </span>
//         </div>

//         {/* Generate button */}
//         {!generated && (
//           <button className="btn btn-primary" onClick={generate} disabled={loading}
//             style={{ width: '100%', padding: '13px', fontSize: 14, marginBottom: 16 }}>
//             {loading
//               ? `Generating ${tab === 'report' ? 'Report' : 'Forecast'}…`
//               : `Generate ${tab === 'report' ? 'Report' : 'Forecast'} →`}
//           </button>
//         )}

//         {/* Loading */}
//         {loading && (
//           <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted2)', fontSize: 13 }}>
//             <div className="spinner" style={{ width: 24, height: 24, marginBottom: 12 }} />
//             AI is analyzing your data…
//           </div>
//         )}

//         {/* Error */}
//         {error && (
//           <div className="alert warn">
//             <span className="alert-icon">⚠️</span><span>{error}</span>
//           </div>
//         )}

//         {/* Generated content */}
//         {generated && content && (
//           <div>
//             <div style={{
//               background: 'var(--s2)', border: '1px solid var(--border)',
//               borderRadius: 12, padding: '20px',
//               maxHeight: 360, overflowY: 'auto',
//               fontSize: 13, lineHeight: 1.9,
//               color: 'var(--text)', whiteSpace: 'pre-wrap',
//               fontFamily: language === 'bangla' ? 'sans-serif' : 'JetBrains Mono, monospace',
//             }}>
//               {content}
//             </div>

//             <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
//               <button className="btn btn-outline" onClick={copyText} style={{ flex: 1, fontSize: 13 }}>
//                 📋 Copy Text
//               </button>
//               <button className="btn btn-outline"
//                 onClick={() => { setContent(''); setGenerated(false); }}
//                 style={{ flex: 1, fontSize: 13 }}>
//                 🔄 Regenerate
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useState } from 'react';
import { aiAPI } from '../services/api';

export default function AIReportModal({ productId, productName, onClose }) {
  const [tab,       setTab]       = useState('report');
  const [language,  setLanguage]  = useState('english');
  const [content,   setContent]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    setLoading(true); setError(''); setContent(''); setGenerated(false);
    try {
      const fn = tab === 'report' ? aiAPI.report : aiAPI.forecast;
      const { data } = await fn(productId, language);
      setContent(data.report || data.forecast);
      setGenerated(true);
    } catch (err) {
      setError(err.response?.data?.error || 'AI generation failed. Check your OpenAI API key.');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 660, background: 'linear-gradient(135deg,rgba(13,13,36,0.98),rgba(18,18,46,0.98))' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:800, background:'linear-gradient(135deg,#a78bfa,#60a5fa,#22d3ee)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:4 }}>
              🤖 AI Analysis
            </div>
            <div style={{ fontSize:12, color:'var(--muted)' }}>{productName}</div>
          </div>
          <button className="btn btn-outline" onClick={onClose} style={{ fontSize:12, padding:'6px 14px' }}>✕ Close</button>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:20, background:'rgba(255,255,255,0.04)', borderRadius:14, padding:4 }}>
          {[{ key:'report', label:'📄 Report' }, { key:'forecast', label:'🔮 Forecast' }].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setContent(''); setGenerated(false); }}
              style={{
                flex:1, padding:'10px', border:'none', borderRadius:10, cursor:'pointer', fontFamily:'inherit',
                fontWeight:600, fontSize:13, transition:'all 0.2s',
                background: tab === t.key ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'transparent',
                color: tab === t.key ? '#fff' : 'var(--muted)',
                boxShadow: tab === t.key ? '0 4px 16px rgba(124,58,237,0.35)' : 'none',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Language */}
        <div className="field" style={{ marginBottom:20 }}>
          <label>Language</label>
          <select value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="english">English</option>
            <option value="bangla">বাংলা</option>
          </select>
        </div>

        {/* Info */}
        <div className="alert info" style={{ marginBottom:20 }}>
          <span className="alert-icon">💡</span>
          <span style={{ fontSize:12 }}>
            {tab === 'report'
              ? 'AI will analyze your current product data and generate a professional financial report.'
              : 'AI uses historical snapshots + current data to predict next month. More snapshots = better accuracy.'}
          </span>
        </div>

        {/* Generate btn */}
        {!generated && (
          <button className="btn btn-primary" onClick={generate} disabled={loading}
            style={{ width:'100%', padding:'14px', fontSize:14, marginBottom:16, borderRadius:14 }}>
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
              <button className="btn btn-outline" onClick={() => { navigator.clipboard.writeText(content); }} style={{ flex:1, fontSize:13 }}>📋 Copy</button>
              <button className="btn btn-outline" onClick={() => { setContent(''); setGenerated(false); }} style={{ flex:1, fontSize:13 }}>🔄 Regenerate</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}