import { useState } from 'react';
import { Link } from 'react-router-dom';

const FALLBACK = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80';

export default function PropertyCard({ property: p, saved: initSaved = false }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [saved, setSaved] = useState(initSaved);
  const [heartAnim, setHeartAnim] = useState(false);

  const imgs = p.images || p.photos || [];
  if (p.imageUrl && !imgs.length) imgs.push(p.imageUrl);
  const images = imgs.length > 0 ? imgs : [FALLBACK];

  const price = p.price || p.basePrice || p.pricePerNight ||
    (p.rooms?.[0]?.basePrice) || 0;

  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(s => !s);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 400);
  };

  const prevImg = (e) => {
    e.preventDefault(); e.stopPropagation();
    setImgIdx(i => (i - 1 + images.length) % images.length);
  };
  const nextImg = (e) => {
    e.preventDefault(); e.stopPropagation();
    setImgIdx(i => (i + 1) % images.length);
  };

  return (
    <Link to={`/property/${p.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div className="card-lift" style={{ background: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--warm-100)' }}>

        {/* ── Image ── */}
        <div className="img-zoom" style={{ position: 'relative', height: '220px' }}>
          <img
            src={images[imgIdx]}
            alt={p.name}
            onError={e => { e.target.src = FALLBACK; }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* Gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,17,13,0.55) 0%, transparent 50%)' }} />

          {/* Wishlist */}
          <button onClick={toggleSave} className={heartAnim ? 'heart-pop' : ''}
            style={{ position: 'absolute', top: 12, right: 12, background: saved ? 'var(--saffron)' : 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-md)', transition: 'background var(--fast), transform var(--fast)', zIndex: 2 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'white' : 'none'} stroke={saved ? 'none' : '#666'} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          {/* Category badge */}
          {p.category && (
            <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(28,17,13,0.72)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '0.72rem', fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--radius-full)', letterSpacing: '0.04em' }}>
              {p.category}
            </div>
          )}

          {/* Superhost */}
          {p.superhost && (
            <div style={{ position: 'absolute', top: 12, left: 12, background: 'linear-gradient(135deg,var(--gold),var(--gold-light))', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              🏆 Superhost
            </div>
          )}

          {/* Arrow nav */}
          {images.length > 1 && (
            <>
              <button onClick={prevImg} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 28, height: 28, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', zIndex: 2 }}>‹</button>
              <button onClick={nextImg} style={{ position: 'absolute', right: 54, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 28, height: 28, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', zIndex: 2 }}>›</button>
              {/* Dots */}
              <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px', zIndex: 2 }}>
                {images.slice(0, 5).map((_, i) => (
                  <div key={i} style={{ width: i === imgIdx ? 14 : 6, height: 6, borderRadius: 3, background: i === imgIdx ? 'white' : 'rgba(255,255,255,0.5)', transition: 'all 0.25s' }} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Info ── */}
        <div style={{ padding: '14px 16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.3, flex: 1 }}
              title={p.name}>
              {p.name?.length > 32 ? p.name.slice(0, 32) + '…' : p.name}
            </div>
            {p.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                <span style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>★</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{p.rating}</span>
              </div>
            )}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '10px' }}>
            {p.city}{p.type ? ` · ${p.type}` : ''}{p.beds ? ` · ${p.beds} beds` : ''}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--burgundy)' }}>
                ₹{Number(price).toLocaleString('en-IN')}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}> / night</span>
            </div>
            {p.reviewCount && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>({p.reviewCount})</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
