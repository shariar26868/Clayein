import { useState } from 'react';
import { aiAPI } from '../services/api';

export default function AIReportModal({ productId, productName, onClose }) {
  const [tab,       setTab]       = useState('report');   // 'report' | 'forecast'
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

  const copyText = () => {
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 640 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div className="modal-title" style={{ marginBottom: 4 }}>🤖 AI Analysis</div>
            <div style={{ fontSize: 12, color: 'var(--muted2)' }}>{productName}</div>
          </div>
          <button className="btn btn-outline" onClick={onClose}
            style={{ fontSize: 12, padding: '5px 12px' }}>✕ Close</button>
        </div>

        {/* Tab selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[
            { key: 'report',   label: '📄 Report' },
            { key: 'forecast', label: '🔮 Forecast' },
          ].map(t => (
            <button key={t.key}
              className={`btn ${tab === t.key ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => { setTab(t.key); setContent(''); setGenerated(false); }}
              style={{ flex: 1, fontSize: 13 }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Language selector */}
        <div className="field" style={{ marginBottom: 20 }}>
          <label>Language</label>
          <select value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="english">English</option>
            <option value="bangla">বাংলা</option>
          </select>
        </div>

        {/* Info text */}
        <div className="alert info" style={{ marginBottom: 20 }}>
          <span className="alert-icon">💡</span>
          <span style={{ fontSize: 12 }}>
            {tab === 'report'
              ? 'AI তোমার product এর current data analyze করে একটি professional financial report তৈরি করবে।'
              : 'AI historical snapshots + current data দেখে আগামী মাসের prediction দেবে। বেশি snapshot থাকলে prediction ভালো হবে।'
            }
          </span>
        </div>

        {/* Generate button */}
        {!generated && (
          <button className="btn btn-primary" onClick={generate} disabled={loading}
            style={{ width: '100%', padding: '13px', fontSize: 14, marginBottom: 16 }}>
            {loading
              ? `Generating ${tab === 'report' ? 'Report' : 'Forecast'}…`
              : `Generate ${tab === 'report' ? 'Report' : 'Forecast'} →`}
          </button>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted2)', fontSize: 13 }}>
            <div className="spinner" style={{ width: 24, height: 24, marginBottom: 12 }} />
            AI is analyzing your data…
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert warn">
            <span className="alert-icon">⚠️</span><span>{error}</span>
          </div>
        )}

        {/* Generated content */}
        {generated && content && (
          <div>
            <div style={{
              background: 'var(--s2)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '20px',
              maxHeight: 360, overflowY: 'auto',
              fontSize: 13, lineHeight: 1.9,
              color: 'var(--text)', whiteSpace: 'pre-wrap',
              fontFamily: language === 'bangla' ? 'sans-serif' : 'JetBrains Mono, monospace',
            }}>
              {content}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn btn-outline" onClick={copyText} style={{ flex: 1, fontSize: 13 }}>
                📋 Copy Text
              </button>
              <button className="btn btn-outline"
                onClick={() => { setContent(''); setGenerated(false); }}
                style={{ flex: 1, fontSize: 13 }}>
                🔄 Regenerate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}