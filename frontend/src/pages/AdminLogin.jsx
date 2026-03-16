import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const h = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_email', data.email);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-wrap">
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div className="tag">Super Admin</div>
        <h1 style={{
          fontFamily: 'Syne,sans-serif', fontSize: 32, fontWeight: 800,
          background: 'linear-gradient(130deg,#fff 40%,var(--acc))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>BizTrack</h1>
        <p style={{ marginTop: 8, fontSize: 12, color: 'var(--muted2)' }}>Admin Dashboard Login</p>
      </div>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="field">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={h}
            placeholder="admin@example.com" required autoComplete="email" />
        </div>
        <div className="field">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={h}
            placeholder="••••••••" required autoComplete="current-password" />
        </div>

        {error && (
          <div className="alert warn">
            <span className="alert-icon">⚠️</span><span>{error}</span>
          </div>
        )}

        <button className="btn btn-primary" type="submit" disabled={loading}
          style={{ padding: '14px', fontSize: 14, marginTop: 4 }}>
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>

        <button type="button" className="btn btn-outline"
          onClick={() => navigate('/admin/forgot-password')}
          style={{ fontSize: 12 }}>
          Forgot password?
        </button>
      </form>
    </div>
  );
}