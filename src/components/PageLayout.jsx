import { useNavigate } from 'react-router-dom';

// Shared layout for all info pages — same branding as main site
export function Page({ title, subtitle, children }) {
  const navigate = useNavigate();
  return (
    <div style={{ fontFamily: '"DM Sans", system-ui, sans-serif', minHeight: '100vh', background: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
      `}</style>

      {/* Hero header — paddingTop accounts for fixed 80px navbar */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 100%)', paddingTop: '6rem', paddingBottom: '4rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.7)', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ← Back
          </button>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'white', margin: '0 0 12px', lineHeight: 1.15 }}>
            {title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', margin: 0 }}>{subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        {children}
      </div>
    </div>
  );
}

export function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', margin: '0 0 14px', paddingBottom: '10px', borderBottom: '2px solid #f0ebe3' }}>
        {title}
      </h2>
      <div style={{ color: '#484848', lineHeight: 1.75, fontSize: '0.96rem' }}>{children}</div>
    </div>
  );
}

export function StatRow({ stats }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: '16px', margin: '0 0 2.5rem' }}>
      {stats.map((s, i) => (
        <div key={i} style={{ background: 'linear-gradient(135deg, #fff5f3, #fff)', border: '1.5px solid #fde8e4', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.6rem', fontWeight: 900, color: '#e8472a', marginBottom: '4px' }}>{s.n}</div>
          <div style={{ color: '#717171', fontSize: '0.82rem', fontWeight: 600 }}>{s.l}</div>
        </div>
      ))}
    </div>
  );
}

export function ValueList({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '8px' }}>
      {items.map((item, i) => (
        <div key={i} style={{ background: '#faf8f5', borderRadius: '14px', padding: '18px', border: '1.5px solid #f0ebe3' }}>
          <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{item.icon}</div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a', marginBottom: '5px' }}>{item.title}</div>
          <div style={{ color: '#717171', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.desc}</div>
        </div>
      ))}
    </div>
  );
}

export const primaryBtn = {
  background: 'linear-gradient(135deg, #e8472a, #ff6b35)',
  color: 'white',
  border: 'none',
  borderRadius: '50px',
  padding: '13px 28px',
  fontSize: '0.9rem',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 4px 16px rgba(232,71,42,0.3)',
};
