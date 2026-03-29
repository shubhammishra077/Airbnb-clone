import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

// Safely extract a human-readable error message from any error shape
function extractError(err) {
  if (!err) return 'Unknown error';
  const res = err.response;
  if (!res) return 'Network error — is the backend running?';
  const d = res.data;
  if (!d) return `Error ${res.status}`;
  if (typeof d === 'string') return d;
  // Backend returns { status, message, subErrors } shape
  if (d.message && typeof d.message === 'string') return d.message;
  if (d.error && typeof d.error === 'string') return d.error;
  if (Array.isArray(d.errors)) return d.errors.join(', ');
  if (Array.isArray(d.subErrors) && d.subErrors.length > 0) return String(d.subErrors[0]);
  return `Error ${res.status}`;
}

export default function Login() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') === 'signup' ? 'signup' : 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('error');
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();

  // Already logged in — go to home
  useEffect(() => {
    if (user) navigate('/');
  }, [user]);

  const showToast = (msg, type = 'error') => {
    setToastMsg(String(msg));
    setToastType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { showToast('Please fill in all fields'); return; }
    if (tab === 'signup' && !form.name.trim()) { showToast('Please enter your name'); return; }

    setLoading(true);
    try {
      if (tab === 'login') {
        await login(form.email, form.password);
      } else {
        await signup(form.name, form.email, form.password);
      }
      navigate('/');
    } catch (err) {
      console.error('Auth error:', err.response?.status, err.response?.data);
      showToast(extractError(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        input:focus { outline: none; }
      `}</style>

      {toastMsg && (
        <Toast
          message={toastMsg}
          type={toastType}
          onClose={() => setToastMsg(null)}
        />
      )}

      {/* Left hero */}
      <div style={{ flex: 1, position: 'relative', background: '#1a1a1a', minHeight: '100vh' }}
        className="login-hero">
        <img
          src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80"
          alt="Jaipur"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55, position: 'absolute', inset: 0 }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)' }} />
        <div style={{ position: 'absolute', bottom: '3rem', left: '3rem', right: '3rem', color: 'white' }}>
          <div style={{ fontSize: '0.78rem', letterSpacing: '4px', textTransform: 'uppercase', color: '#ff9933', marginBottom: '12px' }}>
            Incredible India
          </div>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.15, margin: 0 }}>
            Discover royal havelis,<br />
            floating houseboats &amp;<br />
            mountain retreats.
          </h2>
        </div>
        <style>{`@media(max-width:768px){.login-hero{display:none!important}}`}</style>
      </div>

      {/* Right form */}
      <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 2.5rem' }}>
        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#e8472a,#ff7043)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🕌</div>
          <span style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a' }}>
            Stay<span style={{ color: '#e8472a' }}>nest</span>
          </span>
        </div>

        <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: '2rem', fontWeight: 900, color: '#1a1a1a', margin: '0 0 0.4rem' }}>
          {tab === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p style={{ color: '#717171', marginBottom: '2rem', fontSize: '0.95rem' }}>
          {tab === 'login' ? 'Sign in to your Staynest account' : 'Join thousands of travellers across India'}
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', border: '1.5px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
          {['login', 'signup'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '12px', border: 'none', cursor: 'pointer',
              fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s',
              background: tab === t ? '#1a1a1a' : 'white',
              color: tab === t ? 'white' : '#717171',
            }}>
              {t === 'login' ? 'Log in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tab === 'signup' && (
            <FormField label="Full name" type="text" placeholder="Priya Sharma"
              value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
          )}
          <FormField label="Email address" type="email" placeholder="priya@example.com"
            value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
          <FormField label="Password" type="password" placeholder="••••••••"
            value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} />

          <button type="submit" disabled={loading} style={{
            width: '100%', marginTop: '8px', padding: '16px',
            background: loading ? '#ccc' : 'linear-gradient(135deg,#e8472a,#ff6b35)',
            color: 'white', border: 'none', borderRadius: '12px',
            fontSize: '1rem', fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(232,71,42,0.35)',
            transition: 'all 0.2s',
          }}>
            {loading ? 'Please wait...' : tab === 'login' ? 'Log in →' : 'Create account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#717171', fontSize: '0.85rem', marginTop: '1.5rem' }}>
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}
            style={{ color: '#e8472a', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
            {tab === 'login' ? 'Sign up' : 'Log in'}
          </span>
        </p>
      </div>
    </div>
  );
}

function FormField({ label, type, placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px', letterSpacing: '0.03em' }}>
        {label}
      </label>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '14px 16px',
          border: `1.5px solid ${focused ? '#e8472a' : '#e0e0e0'}`,
          borderRadius: '12px', fontSize: '0.95rem', color: '#1a1a1a',
          background: 'white', transition: 'border-color 0.2s',
        }}
      />
    </div>
  );
}
