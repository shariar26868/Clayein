import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await authAPI.forgot(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally { setLoading(false); }
  };

  if (sent) return (
    <div className="page-wrap" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>📧</div>
      <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Check your email</h2>
      <p style={{ color: 'var(--muted2)', fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>
        If <strong style={{ color: 'var(--text)' }}>{email}</strong> is registered,<br />
        a password reset link has been sent.
      </p>
      <button className="btn btn-outline" onClick={() => navigate('/admin/login')}>
        Back to Login
      </button>
    </div>
  );

  return (
    <div className="page-wrap">
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div className="tag">Password Reset</div>
        <h1 style={{
          fontFamily: 'Syne,sans-serif', fontSize: 28, fontWeight: 800,
          background: 'linear-gradient(130deg,#fff 40%,var(--acc))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Forgot Password</h1>
        <p style={{ marginTop: 8, fontSize: 12, color: 'var(--muted2)' }}>
          We'll send a reset link to your email
        </p>
      </div>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="field">
          <label>Admin Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="admin@example.com" required />
        </div>

        {error && (
          <div className="alert warn"><span className="alert-icon">⚠️</span><span>{error}</span></div>
        )}

        <button className="btn btn-primary" type="submit" disabled={loading}
          style={{ padding: '14px', fontSize: 14 }}>
          {loading ? 'Sending…' : 'Send Reset Link →'}
        </button>
        <button type="button" className="btn btn-outline"
          onClick={() => navigate('/admin/login')} style={{ fontSize: 12 }}>
          Back to Login
        </button>
      </form>
    </div>
  );
}