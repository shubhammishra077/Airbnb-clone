import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    setSubscribed(true);
    setEmail('');
  };

  const WHATSAPP_NUMBER = '919546075903';
  const WHATSAPP_MSG = encodeURIComponent('Hi Staynest! I need help with my booking 🏨');
  const INSTAGRAM = 'shubham_mishraa7';

  return (
    <>
      <style>{`
        .footer-link { color: rgba(255,255,255,0.55); font-size:0.88rem; cursor:pointer; transition:color 0.2s; text-decoration:none; display:block; margin-bottom:10px; }
        .footer-link:hover { color:white; }
        .whatsapp-btn { position:fixed; bottom:2rem; right:2rem; z-index:999; background:#25D366; color:white; border:none; border-radius:50%; width:60px; height:60px; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 4px 20px rgba(37,211,102,0.5); transition:all 0.25s; text-decoration:none; }
        .whatsapp-btn:hover { transform:scale(1.12); box-shadow:0 6px 28px rgba(37,211,102,0.65); }
        @keyframes pulse { 0%,100%{box-shadow:0 4px 20px rgba(37,211,102,0.5)} 50%{box-shadow:0 4px 32px rgba(37,211,102,0.8)} }
        .whatsapp-btn { animation: pulse 2.5s infinite; }
        .social-icon { width:40px; height:40px; borderRadius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s; text-decoration:none; }
      `}</style>

      {/* ── Floating WhatsApp button ── */}
      <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
        target="_blank" rel="noreferrer"
        className="whatsapp-btn"
        title="Chat with us on WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <footer style={{ background: '#111111', color: 'white', padding: '4rem 2rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* ── Newsletter banner ── */}
          <div style={{ background: 'linear-gradient(135deg, #e8472a 0%, #ff6b35 50%, #ff9933 100%)', borderRadius: '20px', padding: '2.5rem 3rem', marginBottom: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.6rem', fontWeight: 900, color: 'white', margin: '0 0 6px' }}>
                Get Exclusive Travel Deals ✉️
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', margin: 0 }}>
                Be first to know about flash sales, new destinations & seasonal offers.
              </p>
            </div>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '10px', flex: '1', maxWidth: '440px', minWidth: '280px' }}>
              <div style={{ flex: 1 }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError(''); setSubscribed(false); }}
                  placeholder="Enter your email address"
                  style={{ width: '100%', padding: '14px 18px', borderRadius: '50px', border: emailError ? '2px solid #fff' : '2px solid transparent', fontSize: '0.9rem', outline: 'none', background: 'rgba(255,255,255,0.95)', color: '#1a1a1a' }}
                />
                {emailError && <div style={{ color: 'white', fontSize: '0.75rem', marginTop: '4px', paddingLeft: '12px' }}>{emailError}</div>}
              </div>
              <button type="submit" style={{ background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '50px', padding: '14px 24px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#333'}
                onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}>
                {subscribed ? '✓ Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>

          {/* ── Main footer grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3.5rem' }}>

            {/* Brand column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
                <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2C16 2 7 13.5 7 19.5C7 24.2 11.1 28 16 28C20.9 28 25 24.2 25 19.5C25 13.5 16 2 16 2Z" fill="#e8472a"/>
                  <circle cx="16" cy="19.5" r="4" fill="white"/>
                </svg>
                <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.3rem', fontWeight: 700 }}>
                  Stay<span style={{ color: '#e8472a' }}>nest</span>
                </span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                India's most trusted platform for unique stays — from havelis to houseboats, across 28 states.
              </p>

              {/* Social icons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* Instagram */}
                <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer"
                  style={{ width: 38, height: 38, borderRadius: '10px', background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'transform 0.2s, opacity 0.2s', flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                {/* WhatsApp */}
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`} target="_blank" rel="noreferrer"
                  style={{ width: 38, height: 38, borderRadius: '10px', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'transform 0.2s', flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Explore column — each link navigates to city-filtered listings */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#e8472a', marginBottom: '1.2rem' }}>Explore</div>
              {[
                { label: 'Delhi Stays',        city: 'Delhi' },
                { label: 'Jaipur Havelis',     city: 'Jaipur' },
                { label: 'Kerala Backwaters',  city: 'Alleppey' },
                { label: 'Dehradun Retreats',  city: 'Dehradun' },
                { label: 'Goa Villas',         city: 'Goa' },
                { label: 'Udaipur Palaces',    city: 'Udaipur' },
              ].map(l => (
                <a key={l.label} className="footer-link"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/listings?city=${l.city}`)}>
                  {l.label}
                </a>
              ))}
            </div>

            {/* Company column */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#e8472a', marginBottom: '1.2rem' }}>Company</div>
              {[
                { label: 'About Us',      path: '/about' },
                { label: 'Careers',       path: '/careers' },
                { label: 'Press',         path: '/press' },
                { label: 'Blog',          path: '/blog' },
                { label: 'Trust & Safety',path: '/trust-safety' },
              ].map(l => (
                <a key={l.label} className="footer-link"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(l.path)}>
                  {l.label}
                </a>
              ))}
            </div>

            {/* Support column */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#e8472a', marginBottom: '1.2rem' }}>Support</div>
              {[
                { label: 'Help Centre',          path: '/help' },
                { label: 'Cancellation Policy',  path: '/cancellation-policy' },
                { label: 'Host Resources',        path: '/host-resources' },
                { label: 'Community',             path: '/community' },
                { label: 'Contact Us',            path: '/contact' },
              ].map(l => (
                <a key={l.label} className="footer-link"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(l.path)}>
                  {l.label}
                </a>
              ))}

            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem' }}>
              © {year} Staynest, Inc. · Made with ❤️ for Incredible India
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              {['Privacy', 'Terms', 'Sitemap'].map(l => (
                <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
                  {l}
                </a>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}
