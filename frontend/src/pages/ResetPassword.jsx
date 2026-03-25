import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ password: '', confirm: '' });
  const [done,    setDone]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const submit = async e => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirm)
      return setError('Passwords do not match');
    if (form.password.length < 6)
      return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await authAPI.reset(token, form.password);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed — link may be expired');
    } finally { setLoading(false); }
  };

  if (done) return (
    <div className="page-wrap" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>✅</div>
      <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Password Reset!</h2>
      <p style={{ color: 'var(--muted2)', fontSize: 13, marginBottom: 24 }}>
        Your password has been updated successfully.
      </p>
      <button className="btn btn-primary" onClick={() => navigate('/admin/login')}>
        Login Now →
      </button>
    </div>
  );

  return (
    <div className="page-wrap">
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div className="tag">New Password</div>
        <h1 style={{
          fontFamily: 'Syne,sans-serif', fontSize: 28, fontWeight: 800,
          background: 'linear-gradient(130deg,var(--text) 40%,var(--acc))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Reset Password</h1>
      </div>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="field">
          <label>New Password</label>
          <input type="password" value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="Min 6 characters" required />
        </div>
        <div className="field">
          <label>Confirm Password</label>
          <input type="password" value={form.confirm}
            onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
            placeholder="Repeat password" required />
        </div>

        {error && (
          <div className="alert warn"><span className="alert-icon">⚠️</span><span>{error}</span></div>
        )}

        <button className="btn btn-primary" type="submit" disabled={loading}
          style={{ padding: '14px', fontSize: 14 }}>
          {loading ? 'Saving…' : 'Set New Password →'}
        </button>
      </form>
    </div>
  );
}