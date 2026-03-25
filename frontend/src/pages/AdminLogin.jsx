// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { authAPI } from '../services/api';

// export default function AdminLogin() {
//   const navigate = useNavigate();
//   const [form,    setForm]    = useState({ email: '', password: '' });
//   const [error,   setError]   = useState('');
//   const [loading, setLoading] = useState(false);

//   const h = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

//   const submit = async e => {
//     e.preventDefault(); setError(''); setLoading(true);
//     try {
//       const { data } = await authAPI.login(form);
//       localStorage.setItem('admin_token', data.token);
//       localStorage.setItem('admin_email', data.email);
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Login failed');
//     } finally { setLoading(false); }
//   };

//   return (
//     <div className="page-wrap">
//       <div style={{ textAlign: 'center', marginBottom: 40 }}>
//         <div className="tag">Super Admin</div>
//         <h1 style={{
//           fontFamily: 'Syne,sans-serif', fontSize: 32, fontWeight: 800,
//           background: 'linear-gradient(130deg,#fff 40%,var(--acc))',
//           WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
//         }}>BizTrack</h1>
//         <p style={{ marginTop: 8, fontSize: 12, color: 'var(--muted2)' }}>Admin Dashboard Login</p>
//       </div>

//       <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
//         <div className="field">
//           <label>Email</label>
//           <input name="email" type="email" value={form.email} onChange={h}
//             placeholder="admin@example.com" required autoComplete="email" />
//         </div>
//         <div className="field">
//           <label>Password</label>
//           <input name="password" type="password" value={form.password} onChange={h}
//             placeholder="••••••••" required autoComplete="current-password" />
//         </div>

//         {error && (
//           <div className="alert warn">
//             <span className="alert-icon">⚠️</span><span>{error}</span>
//           </div>
//         )}

//         <button className="btn btn-primary" type="submit" disabled={loading}
//           style={{ padding: '14px', fontSize: 14, marginTop: 4 }}>
//           {loading ? 'Signing in…' : 'Sign In →'}
//         </button>

//         <button type="button" className="btn btn-outline"
//           onClick={() => navigate('/admin/forgot-password')}
//           style={{ fontSize: 12 }}>
//           Forgot password?
//         </button>
//       </form>
//     </div>
//   );
// }






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
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      {/* background orbs */}
      <div style={{ position:'fixed', top:'-20%', left:'50%', transform:'translateX(-50%)', width:600, height:600, background:'radial-gradient(circle,rgba(124,58,237,0.15) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'-10%', right:'-10%', width:400, height:400, background:'radial-gradient(circle,rgba(6,182,212,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:440, position:'relative' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ fontSize:42, fontWeight:800, background:'linear-gradient(135deg,#a78bfa,#60a5fa,#22d3ee)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'-0.03em', marginBottom:8 }}>
            BizTrack
          </div>
          <div style={{ display:'inline-block', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', fontWeight:700, background:'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(37,99,235,0.15))', color:'var(--purple)', border:'1px solid rgba(124,58,237,0.3)', borderRadius:99, padding:'5px 16px' }}>
            Super Admin
          </div>
        </div>

        {/* Card */}
        <div style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:28, padding:40, boxShadow:'0 32px 80px rgba(0,0,0,0.4)' }}>
          <h2 style={{ fontSize:24, fontWeight:800, marginBottom:8, letterSpacing:'-0.02em' }}>Welcome back</h2>
          <p style={{ fontSize:13, color:'var(--muted)', marginBottom:32 }}>Sign in to your admin dashboard</p>

          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="field">
              <label>Email Address</label>
              <input name="email" type="email" value={form.email} onChange={h}
                placeholder="admin@example.com" required autoComplete="email" />
            </div>
            <div className="field">
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={h}
                placeholder="••••••••" required autoComplete="current-password" />
            </div>

            {error && <div className="alert warn"><span className="alert-icon">⚠️</span><span>{error}</span></div>}

            <button className="btn btn-primary" type="submit" disabled={loading}
              style={{ padding:'14px', fontSize:14, marginTop:8, borderRadius:14 }}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>

            <button type="button" onClick={() => navigate('/admin/forgot-password')}
              style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:13, fontFamily:'inherit', padding:'8px' }}>
              Forgot password?
            </button>
          </form>
        </div>

        {/* Investor link */}
        <div style={{ textAlign:'center', marginTop:24 }}>
          <span style={{ fontSize:13, color:'var(--muted)' }}>Investor? </span>
          <button type="button" onClick={() => navigate('/investor/login')}
            style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, fontFamily:'inherit', color:'var(--cyan)', fontWeight:600, padding:0 }}>
            Login here →
          </button>
        </div>
      </div>
    </div>
  );
}