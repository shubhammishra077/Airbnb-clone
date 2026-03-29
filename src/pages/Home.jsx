import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { indianCities, mockProperties, CATEGORIES } from '../data/properties';
import PropertyCard from '../components/PropertyCard';

const HERO_IMAGES = [
  // Taj Mahal at golden hour — photo-1564507592333
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&q=85",
  // Amber Fort illuminated, Jaipur — photo-1599661046289
  "https://images.pexels.com/photos/784879/pexels-photo-784879.jpeg?w=1600&q=85",
  // Kerala backwaters at dusk — photo-1602216056096
  "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=85",
  // Udaipur City Palace on lake — photo-1571003123894
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1600&q=85",
  "https://images.pexels.com/photos/11310556/pexels-photo-11310556.jpeg?w=1600&q=85"
];

const HERO_CAPTIONS = [
  { title: " Wonder in India", sub: "Taj Mahal, Agra" },
  { title: "Pink City Stays", sub: "Hawa Mahal, Jaipur" },
  { title: "God's Own Country", sub: "Backwaters, Kerala" },
  { title: "City of Lakes", sub: "Lake Palace, Udaipur" },
  { title: "Incredible india", sub: "Tomb, Fatehpur" }
];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ city: '', checkIn: '', checkOut: '', guests: 1 });
  const [activeCategory, setActiveCategory] = useState('All');
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroFade, setHeroFade] = useState(true);
  const [wishlist, setWishlist] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(8);
  const [citySearch, setCitySearch] = useState('');
  const [showCitySugg, setShowCitySugg] = useState(false);
  const cityRef = useRef(null);

  const CITIES = ['Goa', 'Jaipur', 'Kerala', 'Manali', 'Udaipur', 'Coorg', 'Rishikesh', 'Srinagar', 'Kasol', 'Munnar', 'Ooty', 'Jaisalmer', 'Jodhpur', 'Alleppey', 'Varkala'];

  // Auto-rotate hero
  useEffect(() => {
    const t = setInterval(() => {
      setHeroFade(false);
      setTimeout(() => {
        setHeroIdx(i => (i + 1) % HERO_IMAGES.length);
        setHeroFade(true);
      }, 400);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (search.city) p.set('city', search.city);
    if (search.checkIn) p.set('checkIn', search.checkIn);
    if (search.checkOut) p.set('checkOut', search.checkOut);
    if (search.guests > 1) p.set('guests', search.guests);
    navigate(`/listings?${p}`);
  };

  const toggleWish = (id, e) => {
    e.preventDefault(); e.stopPropagation();
    setWishlist(w => { const n = new Set(w); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const filtered = activeCategory === 'All'
    ? mockProperties
    : mockProperties.filter(p => p.category === activeCategory);

  const sugg = citySearch.length > 0
    ? CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
    : CITIES.slice(0, 6);

  return (
    <div style={{ fontFamily: '"DM Sans", system-ui, sans-serif', background: '#fff', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        ::placeholder { color: #aaa; }
        input:focus, select:focus { outline: none; }
        ::-webkit-scrollbar { display: none; }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
        .cat-btn { transition: all 0.18s ease; }
        .cat-btn:hover { transform: translateY(-2px); }
        .city-card { transition: transform 0.4s ease; overflow: hidden; }
        .city-card:hover img { transform: scale(1.1); }
        .city-card img { transition: transform 0.4s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(10px)} }
        @keyframes heroPulse { 0%,100%{transform:scale(1.02)} 50%{transform:scale(1.05)} }
        .section-reveal { animation: fadeIn 0.6s ease both; }
      `}</style>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <div style={{ position: 'relative', height: 'calc(100vh - 80px)', minHeight: '560px', overflow: 'hidden' }}>
        <img
          key={heroIdx}
          src={HERO_IMAGES[heroIdx]}
          alt="India"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            objectPosition: 'center 40%',
            opacity: heroFade ? 1 : 0, transition: 'opacity 0.5s ease',
            transform: 'scale(1)',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.75) 100%)' }} />

        {/* Hero dots */}
        <div style={{ position: 'absolute', bottom: '8rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 3 }}>
          {HERO_IMAGES.map((_, i) => (
            <button key={i} onClick={() => { setHeroFade(false); setTimeout(() => { setHeroIdx(i); setHeroFade(true); }, 300); }}
              style={{ width: i === heroIdx ? 24 : 8, height: 8, borderRadius: 4, border: 'none', background: i === heroIdx ? '#ff9933' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
          ))}
        </div>

        {/* Caption */}
        <div style={{ position: 'absolute', bottom: '10rem', right: '2rem', color: 'white', textAlign: 'right', zIndex: 3, opacity: heroFade ? 1 : 0, transition: 'opacity 0.4s' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#ff9933' }}>{HERO_CAPTIONS[heroIdx].title}</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>{HERO_CAPTIONS[heroIdx].sub}</div>
        </div>

        {/* Hero text + search */}
        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', letterSpacing: '5px', textTransform: 'uppercase', color: '#ff9933', fontWeight: 600, marginBottom: '1rem', animation: 'fadeIn 0.8s ease' }}>
            Incredible India
          </div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2.6rem, 7vw, 5.5rem)', fontWeight: 900, color: 'white', margin: '0 0 1rem', lineHeight: 1.05, letterSpacing: '-0.02em', textShadow: '0 2px 30px rgba(0,0,0,0.4)', animation: 'fadeIn 0.9s ease' }}>
            Find Your Perfect<br />
            <span style={{ background: 'linear-gradient(135deg, #ff9933, #ff6b35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Indian Escape</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: '520px', marginBottom: '2.5rem', lineHeight: 1.6, animation: 'fadeIn 1s ease' }}>
            From Rajasthani havelis to Keralan houseboats — 5,000+ extraordinary stays.
          </p>

          {/* ── Search bar ── */}
          <form onSubmit={handleSearch} style={{ background: 'white', borderRadius: '60px', padding: '6px 6px 6px 0', display: 'flex', flexWrap: 'nowrap', alignItems: 'center', boxShadow: '0 12px 48px rgba(0,0,0,0.35)', maxWidth: '780px', width: '100%', animation: 'fadeIn 1.1s ease', position: 'relative' }}>
            {/* City with suggestions */}
            <div style={{ position: 'relative', flex: '2', minWidth: '140px' }} ref={cityRef}>
              <div style={{ padding: '10px 16px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.05em', marginBottom: '2px' }}>WHERE</div>
                <input
                  type="text" placeholder="City or region"
                  value={search.city}
                  onChange={e => { setSearch(s => ({ ...s, city: e.target.value })); setCitySearch(e.target.value); setShowCitySugg(true); }}
                  onFocus={() => setShowCitySugg(true)}
                  onBlur={() => setTimeout(() => setShowCitySugg(false), 200)}
                  style={{ border: 'none', fontSize: '0.9rem', color: '#1a1a1a', background: 'transparent', padding: 0, width: '100%' }}
                />
              </div>
              {showCitySugg && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 100, overflow: 'hidden', animation: 'slideDown 0.2s ease', marginTop: '4px' }}>
                  {sugg.map(c => (
                    <div key={c} onMouseDown={() => { setSearch(s => ({ ...s, city: c })); setCitySearch(c); setShowCitySugg(false); }}
                      style={{ padding: '10px 16px', cursor: 'pointer', fontSize: '0.9rem', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f7f7f7'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      📍 {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ width: 1, height: 36, background: '#e0e0e0', flexShrink: 0 }} />
            <div style={{ flex: '1.2', minWidth: '110px', padding: '10px 16px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.05em', marginBottom: '2px' }}>CHECK IN</div>
              <input type="date" value={search.checkIn} min={new Date().toISOString().split('T')[0]} onChange={e => setSearch(s => ({ ...s, checkIn: e.target.value }))} style={{ border: 'none', fontSize: '0.88rem', color: search.checkIn ? '#1a1a1a' : '#aaa', background: 'transparent', padding: 0, width: '100%' }} />
            </div>
            <div style={{ width: 1, height: 36, background: '#e0e0e0', flexShrink: 0 }} />
            <div style={{ flex: '1.2', minWidth: '110px', padding: '10px 16px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.05em', marginBottom: '2px' }}>CHECK OUT</div>
              <input type="date" value={search.checkOut} min={search.checkIn || new Date().toISOString().split('T')[0]} onChange={e => setSearch(s => ({ ...s, checkOut: e.target.value }))} style={{ border: 'none', fontSize: '0.88rem', color: search.checkOut ? '#1a1a1a' : '#aaa', background: 'transparent', padding: 0, width: '100%' }} />
            </div>
            <div style={{ width: 1, height: 36, background: '#e0e0e0', flexShrink: 0 }} />
            <div style={{ flex: '1', minWidth: '90px', padding: '10px 16px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.05em', marginBottom: '2px' }}>ROOMS</div>
              <select value={search.guests} onChange={e => setSearch(s => ({ ...s, guests: e.target.value }))} style={{ border: 'none', fontSize: '0.88rem', color: '#1a1a1a', background: 'transparent', padding: 0, width: '100%', cursor: 'pointer' }}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} room{n>1?'s':''}</option>)}
              </select>
            </div>
            <button type="submit" style={{ background: 'linear-gradient(135deg, #e8472a, #ff6b35)', color: 'white', border: 'none', borderRadius: '50px', padding: '14px 24px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', margin: '4px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 16px rgba(232,71,42,0.45)', transition: 'all 0.2s', flexShrink: 0 }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              🔍 Search
            </button>
          </form>
        </div>

        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', zIndex: 2, color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', animation: 'bounce 2.5s infinite', textAlign: 'center' }}>
          <div>↓</div><div style={{ fontSize: '0.65rem', letterSpacing: '2px' }}>SCROLL</div>
        </div>
      </div>

      {/* ═══════════════════════ CATEGORIES ═══════════════════════ */}
      <div style={{ background: 'white', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 72, zIndex: 50 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '16px 0', scrollbarWidth: 'none' }}>
            {[{ icon: '✨', label: 'All', bg: '#f5f5f5' }, ...CATEGORIES].map((cat) => (
              <button key={cat.label} className="cat-btn"
                onClick={() => setActiveCategory(cat.label)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', padding: '10px 16px', border: 'none', borderRadius: '16px', background: activeCategory === cat.label ? '#1a1a1a' : cat.bg || '#f5f5f5', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.78rem', fontWeight: activeCategory === cat.label ? 700 : 500, color: activeCategory === cat.label ? 'white' : '#1a1a1a', minWidth: '72px', flexShrink: 0 }}>
                <span style={{ fontSize: '1.4rem' }}>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════ DESTINATIONS ═══════════════════════ */}
      <section className="section-reveal" style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#e8472a', fontWeight: 600, marginBottom: '8px' }}>Explore India</div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Popular Destinations</h2>
          </div>
          <button onClick={() => navigate('/listings')} style={{ background: 'none', border: '1.5px solid #1a1a1a', borderRadius: '50px', padding: '10px 20px', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#1a1a1a'; }}>
            View all →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '14px' }}>
          {indianCities.map((city, i) => (
            <div key={city.name} className="city-card card-hover"
              onClick={() => navigate(`/listings?city=${city.name}`)}
              style={{ position: 'relative', borderRadius: '18px', overflow: 'hidden', cursor: 'pointer', aspectRatio: i === 0 ? '1.8' : '1', gridColumn: i === 0 ? 'span 2' : 'auto', animation: `fadeIn 0.5s ease ${i * 0.08}s both` }}>
              <img src={city.image} alt={city.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
              <div style={{ position: 'absolute', bottom: '14px', left: '14px' }}>
                <div style={{ color: 'white', fontWeight: 700, fontSize: i === 0 ? '1.2rem' : '0.95rem', fontFamily: '"Playfair Display", serif' }}>{city.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.72rem', marginTop: '2px' }}>{city.stays}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ FEATURED STAYS ═══════════════════════ */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 2rem 4rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#e8472a', fontWeight: 600, marginBottom: '8px' }}>
              {activeCategory === 'All' ? 'All Stays' : activeCategory}
            </div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
              {activeCategory === 'All' ? 'Featured Stays' : `${activeCategory} Stays`}
            </h2>
          </div>
          <div style={{ color: '#717171', fontSize: '0.9rem' }}>{filtered.length} places</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '28px' }}>
          {filtered.slice(0, visibleCount).map((p, i) => (
            <div key={p.id} style={{ animation: `fadeIn 0.5s ease ${(i % 8) * 0.07}s both` }}>
              <PropertyCard property={p} wished={wishlist.has(p.id)} onWish={(e) => toggleWish(p.id, e)} />
            </div>
          ))}
        </div>

        {visibleCount < filtered.length && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button onClick={() => setVisibleCount(v => v + 8)}
              style={{ background: 'white', border: '1.5px solid #1a1a1a', borderRadius: '50px', padding: '14px 32px', fontSize: '0.95rem', fontWeight: 600, color: '#1a1a1a', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#1a1a1a'; }}>
              Show more places
            </button>
          </div>
        )}
      </section>

      {/* ═══════════════════════ EXPERIENCE STRIPS ═══════════════════════ */}
      <section style={{ background: '#faf8f5', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#e8472a', fontWeight: 600, marginBottom: '8px' }}>Why Staynest</div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Everything India, In One Place</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {[
              { icon: '🛡️', title: 'Verified Stays', desc: 'Every property personally reviewed and verified for quality and safety.' },
              { icon: '💰', title: 'Best Price Guarantee', desc: 'We match any lower price you find for the same property and dates.' },
              { icon: '🎯', title: 'Instant Booking', desc: 'Book in seconds with secure Stripe payments and instant confirmation.' },
              { icon: '🌟', title: '24/7 Support', desc: 'Our India travel experts are available around the clock to help you.' },
            ].map((f) => (
              <div key={f.title} className="card-hover" style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #f0ebe3' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '14px' }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a', marginBottom: '8px' }}>{f.title}</div>
                <div style={{ color: '#717171', fontSize: '0.88rem', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ STATS BANNER ═══════════════════════ */}
      <section style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 50%, #1a1a1a 100%)', padding: '5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,153,51,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,71,42,0.1) 0%, transparent 70%)' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '0.75rem', letterSpacing: '4px', textTransform: 'uppercase', color: '#ff9933', fontWeight: 600, marginBottom: '12px' }}>The Numbers</div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, color: 'white', margin: 0, lineHeight: 1.1 }}>
              India's Most Trusted<br /><span style={{ color: '#ff9933' }}>Travel Platform</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2px' }}>
            {[
              { num: '5,000+', label: 'Unique Stays', icon: '🏨' },
              { num: '28', label: 'States Covered', icon: '🗺️' },
              { num: '2.4L+', label: 'Happy Travellers', icon: '😊' },
              { num: '4.9★', label: 'Average Rating', icon: '⭐' },
            ].map((s, i) => (
              <div key={s.label} style={{ textAlign: 'center', padding: '2rem', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{s.icon}</div>
                <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.4rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>{s.num}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '6px' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <button onClick={() => navigate('/listings')}
              style={{ background: 'linear-gradient(135deg, #e8472a, #ff9933)', color: 'white', border: 'none', borderRadius: '50px', padding: '18px 44px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 8px 32px rgba(232,71,42,0.4)', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              Explore All Stays →
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TESTIMONIALS ═══════════════════════ */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#e8472a', fontWeight: 600, marginBottom: '8px' }}>Guest Stories</div>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>What Travellers Say</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {[
            { name: 'Priya Sharma', city: 'Mumbai', text: 'The Jaipur haveli was a dream — woke up to peacocks on the courtyard. Booking was seamless, host was exceptional. Already planning my next trip!', stay: 'Heritage Haveli, Jaipur', rating: 5, avatar: '👩' },
            { name: 'Rahul Mehta', city: 'Bangalore', text: 'The houseboat in Alleppey was absolutely magical. Floating through the backwaters at sunset with a private chef cooking Kerala meals — pure bliss.', stay: 'Kettuvallam Houseboat', rating: 5, avatar: '👨' },
            { name: 'Ananya Singh', city: 'Delhi', text: 'Spent 3 nights in the Udaipur lake palace suite. Best birthday gift to myself. The private boat ride at sunrise over Lake Pichola is unmatched anywhere.', stay: 'Lake Palace Suite', rating: 5, avatar: '👩‍🦱' },
          ].map((t) => (
            <div key={t.name} className="card-hover" style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #f0ebe3', position: 'relative' }}>
              <div style={{ fontSize: '2rem', color: '#ff9933', fontFamily: 'serif', lineHeight: 1, marginBottom: '12px' }}>"</div>
              <p style={{ color: '#484848', fontSize: '0.92rem', lineHeight: 1.7, margin: '0 0 20px', fontStyle: 'italic' }}>{t.text}</p>
              <div style={{ borderTop: '1px solid #f0ebe3', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#e8472a,#ff9933)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a' }}>{t.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#717171' }}>{t.city} · {t.stay}</div>
                </div>
                <div style={{ marginLeft: 'auto', color: '#ff9933', fontSize: '0.85rem', fontWeight: 700 }}>{'★'.repeat(t.rating)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
