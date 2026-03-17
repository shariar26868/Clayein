// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { investorAPI } from '../services/api';

// export default function InvestorLogin() {
//   const navigate = useNavigate();
//   const [form, setForm]   = useState({ username: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

//   const submit = async e => {
//     e.preventDefault();
//     setError(''); setLoading(true);
//     try {
//       const { data } = await investorAPI.login(form);
//       localStorage.setItem('investor_token',    data.token);
//       localStorage.setItem('investor_name',     data.investorName);
//       localStorage.setItem('investor_productId', data.productId);
//       navigate('/investor/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="page-wrap">
//       {/* Header */}
//       <div style={{ textAlign: 'center', marginBottom: 40 }}>
//         <div className="tag">Investor Portal</div>
//         <h1 style={{
//           fontFamily: 'Syne,sans-serif', fontSize: 32, fontWeight: 800,
//           background: 'linear-gradient(130deg,#fff 40%,var(--acc))',
//           WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
//         }}>
//           Sign In
//         </h1>
//         <p style={{ marginTop: 8, fontSize: 12, color: 'var(--muted2)' }}>
//           Use the credentials your admin provided
//         </p>
//       </div>

//       <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
//         <div className="field">
//           <label>Username</label>
//           <input
//             name="username" value={form.username} onChange={handle}
//             placeholder="your_username" autoComplete="username" required
//           />
//         </div>

//         <div className="field">
//           <label>Password</label>
//           <input
//             type="password" name="password" value={form.password} onChange={handle}
//             placeholder="••••••••" autoComplete="current-password" required
//           />
//         </div>

//         {error && (
//           <div className="alert warn">
//             <span className="alert-icon">⚠️</span>
//             <span>{error}</span>
//           </div>
//         )}

//         <button className="btn btn-primary" type="submit" disabled={loading}
//           style={{ marginTop: 8, padding: '14px', fontSize: 14 }}>
//           {loading ? 'Signing in…' : 'Sign In →'}
//         </button>
//       </form>
//     </div>
//   );
// }





import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { investorAPI } from '../services/api';

export default function InvestorLogin() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ username: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const h = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await investorAPI.login(form);
      localStorage.setItem('investor_token', data.token);
      localStorage.setItem('investor_name', data.investorName);
      localStorage.setItem('investor_productId', data.productId);
      navigate('/investor/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ position:'fixed', top:'-20%', left:'50%', transform:'translateX(-50%)', width:600, height:600, background:'radial-gradient(circle,rgba(6,182,212,0.12) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'-10%', left:'-10%', width:400, height:400, background:'radial-gradient(circle,rgba(124,58,237,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:440, position:'relative' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ fontSize:42, fontWeight:800, background:'linear-gradient(135deg,#22d3ee,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'-0.03em', marginBottom:8 }}>
            BizTrack
          </div>
          <div style={{ display:'inline-block', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', fontWeight:700, background:'linear-gradient(135deg,rgba(6,182,212,0.15),rgba(37,99,235,0.15))', color:'var(--cyan)', border:'1px solid rgba(6,182,212,0.3)', borderRadius:99, padding:'5px 16px' }}>
            Investor Portal
          </div>
        </div>

        <div style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:28, padding:40, boxShadow:'0 32px 80px rgba(0,0,0,0.4)' }}>
          <h2 style={{ fontSize:24, fontWeight:800, marginBottom:8, letterSpacing:'-0.02em' }}>Investor Login</h2>
          <p style={{ fontSize:13, color:'var(--muted)', marginBottom:32 }}>Use the credentials provided by your admin</p>

          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="field">
              <label>Username</label>
              <input name="username" value={form.username} onChange={h}
                placeholder="your_username" required autoComplete="username" />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={h}
                placeholder="••••••••" required autoComplete="current-password" />
            </div>

            {error && <div className="alert warn"><span className="alert-icon">⚠️</span><span>{error}</span></div>}

            <button className="btn btn-primary" type="submit" disabled={loading}
              style={{ padding:'14px', fontSize:14, marginTop:8, borderRadius:14, background:'linear-gradient(135deg,#0891b2,#2563eb)' }}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}