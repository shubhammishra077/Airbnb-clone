import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CITIES = ['Delhi','Jaipur','Dehradun','Goa','Udaipur','Jodhpur','Alleppey','Jaisalmer','Manali','Srinagar','Rishikesh','Munnar'];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [rooms, setRooms] = useState(1);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const cityInputRef = useRef(null);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => { if (searchOpen) setTimeout(() => cityInputRef.current?.focus(), 50); }, [searchOpen]);

  const doSearch = (e) => {
    e?.preventDefault();
    setSearchOpen(false);
    const p = new URLSearchParams();
    if (city) p.set('city', city);
    if (checkIn) p.set('checkIn', checkIn);
    if (checkOut) p.set('checkOut', checkOut);
    if (rooms > 1) p.set('guests', rooms);
    navigate(`/listings?${p}`);
  };

  const solid = !isHome || scrolled;

  const pillBg    = solid ? 'white' : 'rgba(255,255,255,0.92)';
  const pillBorder= solid ? '1px solid var(--warm-200)' : '1px solid rgba(255,255,255,0.6)';
  const logoColor = solid ? 'var(--saffron)' : 'white';
  const textColor = solid ? 'var(--text-primary)' : 'white';
  const navBg     = solid ? 'rgba(253,250,246,0.96)' : 'transparent';
  const navBorder = solid ? '1px solid var(--warm-100)' : 'none';

  return (
    <>
      <style>{`
        .nav-btn { background:none; border:none; cursor:pointer; border-radius:var(--radius-full); padding:8px 14px; font-family:var(--font-body); font-size:0.875rem; font-weight:600; transition:background var(--fast); }
        .nav-btn:hover { background:rgba(0,0,0,0.07); }
        .drop-item { display:flex; align-items:center; gap:10px; padding:10px 16px; text-decoration:none; color:var(--text-primary); font-size:0.875rem; transition:background var(--fast); cursor:pointer; }
        .drop-item:hover { background:var(--warm-50); }
        .city-chip { background:var(--warm-50); border:1.5px solid var(--warm-100); border-radius:var(--radius-full); padding:6px 14px; font-size:0.82rem; cursor:pointer; color:var(--text-secondary); font-weight:500; transition:all var(--fast); white-space:nowrap; }
        .city-chip:hover { background:var(--saffron-pale); border-color:var(--saffron); color:var(--saffron); }
        @keyframes dropIn { from{opacity:0;transform:translateY(-8px) scale(0.97)} to{opacity:1;transform:none} }
        @keyframes searchExpand { from{opacity:0;transform:translateY(-6px) scale(0.98)} to{opacity:1;transform:none} }
        .nav-backdrop { position:fixed;inset:0;background:rgba(28,17,13,0.4);backdrop-filter:blur(3px);z-index:998; }
      `}</style>

      {searchOpen && <div className="nav-backdrop" onClick={() => setSearchOpen(false)} />}

      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:999, height:72, background:navBg, borderBottom:navBorder, backdropFilter:solid?'blur(14px)':'none', transition:'all 0.35s var(--ease)', display:'flex', alignItems:'center', padding:'0 32px', gap:16 }}>

        {/* Logo */}
        <div style={{ flex:1 }}>
          <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:8 }}>
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
              <path d="M16 2C16 2 7 13.5 7 19.5C7 24.2 11.1 28 16 28C20.9 28 25 24.2 25 19.5C25 13.5 16 2 16 2Z" fill={solid ? 'var(--saffron)' : 'white'}/>
              <circle cx="16" cy="19.5" r="4" fill={solid ? 'white' : 'rgba(255,255,255,0.3)'}/>
            </svg>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:700, color:logoColor, letterSpacing:'-0.02em', transition:'color 0.3s', lineHeight:1 }}>
              staynest
            </span>
          </Link>
        </div>

        {/* Search pill */}
        <div style={{ flex:2, display:'flex', justifyContent:'center', position:'relative' }} ref={searchRef}>
          {!searchOpen ? (
            <button onClick={() => setSearchOpen(true)}
              style={{ display:'flex', alignItems:'center', background:pillBg, border:pillBorder, borderRadius:'var(--radius-full)', padding:0, cursor:'pointer', height:44, minWidth:320, maxWidth:480, width:'100%', boxShadow:'var(--shadow-sm)', transition:'box-shadow var(--fast), background 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow='var(--shadow-md)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow='var(--shadow-sm)'}>
              <span style={{ padding:'0 16px 0 20px', fontSize:'0.875rem', fontWeight:600, color:'var(--text-primary)', borderRight:'1px solid var(--warm-200)', whiteSpace:'nowrap' }}>{city||'Anywhere'}</span>
              <span style={{ padding:'0 16px', fontSize:'0.875rem', fontWeight:600, color:'var(--text-primary)', borderRight:'1px solid var(--warm-200)', whiteSpace:'nowrap' }}>{checkIn||'Any week'}</span>
              <span style={{ padding:'0 12px 0 16px', fontSize:'0.875rem', color:'var(--text-muted)', flex:1, textAlign:'left' }}>{rooms>1?`${rooms} rooms`:'Add rooms'}</span>
              <div style={{ background:'linear-gradient(135deg,var(--saffron),var(--saffron-light))', borderRadius:'50%', width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 6px', flexShrink:0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"/></svg>
              </div>
            </button>
          ) : (
            <form onSubmit={doSearch}
              style={{ position:'absolute', top:-8, left:'50%', transform:'translateX(-50%)', width:'min(720px, 90vw)', background:'white', borderRadius:'var(--radius-xl)', boxShadow:'var(--shadow-xl)', padding:8, zIndex:1001, display:'flex', alignItems:'center', animation:'searchExpand 0.2s var(--ease)', border:'1px solid var(--warm-100)' }}>
              {/* City */}
              <div style={{ flex:2, padding:'6px 14px', borderRight:'1px solid var(--warm-100)', position:'relative' }}>
                <div style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--saffron)', marginBottom:3 }}>Where</div>
                <input ref={cityInputRef} value={city} onChange={e => setCity(e.target.value)} placeholder="Search destinations"
                  style={{ border:'none', outline:'none', fontSize:'0.9rem', color:'var(--text-primary)', background:'transparent', width:'100%', fontFamily:'var(--font-body)' }}/>
                {/* Chips */}
                {!city && (
                  <div style={{ position:'absolute', top:'100%', left:0, marginTop:8, background:'white', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-lg)', padding:12, display:'flex', flexWrap:'wrap', gap:6, width:260, zIndex:10, border:'1px solid var(--warm-100)' }}>
                    {CITIES.map(c => <button key={c} type="button" onClick={() => setCity(c)} className="city-chip">📍 {c}</button>)}
                  </div>
                )}
              </div>
              {/* Check-in */}
              <div style={{ flex:1.2, padding:'6px 12px', borderRight:'1px solid var(--warm-100)' }}>
                <div style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--saffron)', marginBottom:3 }}>Check in</div>
                <input type="date" value={checkIn} min={new Date().toISOString().split('T')[0]} onChange={e => setCheckIn(e.target.value)}
                  style={{ border:'none', outline:'none', fontSize:'0.88rem', color:checkIn?'var(--text-primary)':'var(--text-muted)', background:'transparent', width:'100%', fontFamily:'var(--font-body)', cursor:'pointer' }}/>
              </div>
              {/* Check-out */}
              <div style={{ flex:1.2, padding:'6px 12px', borderRight:'1px solid var(--warm-100)' }}>
                <div style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--saffron)', marginBottom:3 }}>Check out</div>
                <input type="date" value={checkOut} min={checkIn||new Date().toISOString().split('T')[0]} onChange={e => setCheckOut(e.target.value)}
                  style={{ border:'none', outline:'none', fontSize:'0.88rem', color:checkOut?'var(--text-primary)':'var(--text-muted)', background:'transparent', width:'100%', fontFamily:'var(--font-body)', cursor:'pointer' }}/>
              </div>
              {/* Rooms */}
              <div style={{ padding:'6px 12px' }}>
                <div style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--saffron)', marginBottom:3 }}>Rooms</div>
                <select value={rooms} onChange={e => setRooms(Number(e.target.value))}
                  style={{ border:'none', outline:'none', fontSize:'0.88rem', color:'var(--text-primary)', background:'transparent', cursor:'pointer', fontFamily:'var(--font-body)' }}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} room{n>1?'s':''}</option>)}
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ padding:'12px 18px', borderRadius:'var(--radius-full)', flexShrink:0, display:'flex', alignItems:'center', gap:6 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"/></svg>
                Search
              </button>
            </form>
          )}
        </div>

        {/* Right */}
        <div style={{ flex:1, display:'flex', justifyContent:'flex-end', alignItems:'center', gap:4 }}>
          <button onClick={() => navigate('/listings')} className="nav-btn" style={{ color:textColor, transition:'color 0.3s, background var(--fast)' }}>Explore stays</button>
          <div ref={menuRef} style={{ position:'relative' }}>
            <button onClick={() => setMenuOpen(!menuOpen)}
              style={{ display:'flex', alignItems:'center', gap:10, border:solid?'1px solid var(--warm-200)':'1px solid rgba(255,255,255,0.45)', borderRadius:'var(--radius-full)', background:solid?'white':'rgba(255,255,255,0.12)', cursor:'pointer', padding:'5px 5px 5px 12px', boxShadow:menuOpen?'var(--shadow-md)':'none', transition:'all var(--fast)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={solid?'var(--text-secondary)':'white'}>
                <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd"/>
              </svg>
              <div style={{ width:30, height:30, borderRadius:'50%', background:user?'linear-gradient(135deg,var(--saffron),var(--gold-light))':'var(--warm-200)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'13px', fontWeight:700, flexShrink:0 }}>
                {user ? String(user.name||user.email||'?')[0].toUpperCase()
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill={solid?'var(--text-muted)':'white'}><path d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"/></svg>}
              </div>
            </button>

            {menuOpen && (
              <div style={{ position:'absolute', top:'calc(100% + 10px)', right:0, background:'white', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-xl)', border:'1px solid var(--warm-100)', minWidth:220, overflow:'hidden', animation:'dropIn 0.18s var(--ease)', zIndex:200 }}>
                {user ? (
                  <>
                    <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--warm-100)', background:'var(--warm-50)' }}>
                      <div style={{ fontWeight:700, fontSize:'0.9rem', color:'var(--text-primary)' }}>{user.name||'Traveller'}</div>
                      <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:2 }}>{user.email}</div>
                    </div>
                    <div style={{ padding:'6px 0' }}>
                      <DI icon="👤" label="Profile" to="/profile" close={() => setMenuOpen(false)} />
                      <DI icon="🛏" label="My Bookings" to="/profile" close={() => setMenuOpen(false)} />
                      <DI icon="❤️" label="Wishlists" to="/listings" close={() => setMenuOpen(false)} />
                      <DI icon="🏠" label="Home" to="/" close={() => setMenuOpen(false)} />
                    </div>
                    <div style={{ borderTop:'1px solid var(--warm-100)', padding:'6px 0' }}>
                      <button onClick={() => { logout(); setMenuOpen(false); navigate('/'); }} className="drop-item" style={{ width:'100%', textAlign:'left', background:'none', border:'none', fontFamily:'var(--font-body)' }}>
                        <span>🚪</span> Log out
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ padding:'6px 0' }}>
                    <DI icon="🔑" label="Log in" to="/login" close={() => setMenuOpen(false)} bold />
                    <DI icon="✨" label="Sign up" to="/login?tab=signup" close={() => setMenuOpen(false)} />
                    <DI icon="🔍" label="Explore stays" to="/listings" close={() => setMenuOpen(false)} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      <div style={{ height:72 }} />
    </>
  );
}

function DI({ icon, label, to, close, bold }) {
  return (
    <Link to={to} onClick={close} className="drop-item" style={{ fontWeight: bold ? 700 : 400 }}>
      <span>{icon}</span>{label}
    </Link>
  );
}
