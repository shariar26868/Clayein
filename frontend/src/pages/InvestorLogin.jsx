import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { investorAPI } from '../services/api';

export default function InvestorLogin() {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await investorAPI.login(form);
      localStorage.setItem('investor_token',    data.token);
      localStorage.setItem('investor_name',     data.investorName);
      localStorage.setItem('investor_productId', data.productId);
      navigate('/investor/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div className="tag">Investor Portal</div>
        <h1 style={{
          fontFamily: 'Syne,sans-serif', fontSize: 32, fontWeight: 800,
          background: 'linear-gradient(130deg,#fff 40%,var(--acc))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Sign In
        </h1>
        <p style={{ marginTop: 8, fontSize: 12, color: 'var(--muted2)' }}>
          Use the credentials your admin provided
        </p>
      </div>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="field">
          <label>Username</label>
          <input
            name="username" value={form.username} onChange={handle}
            placeholder="your_username" autoComplete="username" required
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password" name="password" value={form.password} onChange={handle}
            placeholder="••••••••" autoComplete="current-password" required
          />
        </div>

        {error && (
          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button className="btn btn-primary" type="submit" disabled={loading}
          style={{ marginTop: 8, padding: '14px', fontSize: 14 }}>
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>
      </form>
    </div>
  );
}