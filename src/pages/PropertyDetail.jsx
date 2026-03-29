import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHotelInfo } from '../api/hotels';
import { unwrap } from '../api/axios';
import { mockProperties } from '../data/properties';
import { useBooking } from '../hooks/useBooking';
import { useAuth } from '../context/AuthContext';
import { extractError } from '../utils/errors';
import Toast from '../components/Toast';

const FALLBACK_IMGS = {
  delhi:    ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900'],
  jaipur:   ['https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=900','https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900'],
  dehradun: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900'],
  default:  ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900','https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900'],
};

function getImages(hotel) {
  const photos = hotel?.photos || hotel?.images || [];
  if (photos.length > 0) return photos;
  if (hotel?.imageUrl) return [hotel.imageUrl];
  const city = (hotel?.city||'').toLowerCase();
  const key = Object.keys(FALLBACK_IMGS).find(k => city.includes(k));
  return key ? FALLBACK_IMGS[key] : FALLBACK_IMGS.default;
}

function amenityIcon(a) {
  const s = String(a).toLowerCase();
  if (s.includes('wifi')) return '📶';
  if (s.includes('pool')) return '🏊';
  if (s.includes('ac') || s.includes('air')) return '❄️';
  if (s.includes('kitchen')) return '🍳';
  if (s.includes('parking')) return '🚗';
  if (s.includes('fire')) return '🔥';
  if (s.includes('garden')) return '🌿';
  if (s.includes('gym')) return '🏋️';
  if (s.includes('spa')) return '💆';
  if (s.includes('bar')) return '🍸';
  if (s.includes('breakfast')) return '☕';
  if (s.includes('butler')) return '🎩';
  if (s.includes('bbq') || s.includes('barbeque')) return '🍖';
  if (s.includes('tv')) return '📺';
  if (s.includes('workspace')) return '💻';
  if (s.includes('view')) return '🌅';
  return '✓';
}

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading: bookingLoading, init, pay } = useBooking();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomsCount, setRoomsCount] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [booked, setBooked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('info');
  const [showMap, setShowMap] = useState(false);

  const showToast = (msg, type='info') => { setToastMsg(String(msg||'')); setToastType(type); };
  const toggleSave = () => { setSaved(s=>!s); setHeartAnim(true); setTimeout(()=>setHeartAnim(false),400); };

  useEffect(() => {
    const numId = Number(id);
    setLoading(true);
    getHotelInfo(numId)
      .then(res => {
        const info = unwrap(res);
        if (info?.hotel) { setHotel(info.hotel); setRooms(info.rooms||[]); if(info.rooms?.[0]) setSelectedRoomId(info.rooms[0].id); }
        else { setHotel(info); setRooms([]); }
      })
      .catch(() => {
        const mock = mockProperties.find(p => String(p.id)===String(id));
        if (mock) { setHotel(mock); setRooms([]); } else setHotel(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ── Price calculator ──
  const basePrice = Number(rooms[0]?.basePrice || hotel?.price || hotel?.pricePerNight || 0);
  const nights = checkIn && checkOut ? Math.max(0, Math.ceil((new Date(checkOut)-new Date(checkIn))/86400000)) : 0;
  const urgency = checkIn && (new Date(checkIn)-new Date()) < 7*86400000 ? 1.15 : 1;
  const subtotal = basePrice * roomsCount * nights;
  const urgencyFee = subtotal * (urgency - 1);
  const total = subtotal + urgencyFee;

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    if (!checkIn || !checkOut) { showToast('Select check-in and check-out dates','error'); return; }
    if (new Date(checkOut) <= new Date(checkIn)) { showToast('Check-out must be after check-in','error'); return; }
    if (rooms.length === 0) { showToast(`Search "${hotel?.city||'this city'}" in listings for available rooms`,'info'); return; }
    try {
      const booking = await init({ hotelId: Number(id), roomId: selectedRoomId||rooms[0]?.id, checkIn, checkOut, guests: roomsCount });
      setBooked(true);
      showToast('Booking created! Redirecting to payment…','success');
      await pay(booking?.id||booking?.bookingId);
    } catch(err) { showToast(extractError(err),'error'); }
  };

  if (loading) return <Loader />;
  if (!hotel)  return <NotFound navigate={navigate} />;

  const images = getImages(hotel);
  const mapCity = encodeURIComponent((hotel.city||hotel.location||'India') + ' India');

  return (
    <div className="page-enter" style={{ fontFamily:'var(--font-body)', background:'var(--cream)', minHeight:'100vh' }}>
      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={()=>setToastMsg(null)}/>}

      {/* Lightbox */}
      {lightbox && (
        <div onClick={()=>setLightbox(false)} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.95)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem' }}>
          <button onClick={()=>setLightbox(false)} style={{ position:'absolute',top:'1.5rem',right:'1.5rem',background:'rgba(255,255,255,0.1)',border:'none',borderRadius:'50%',width:44,height:44,color:'white',fontSize:'1.2rem',cursor:'pointer' }}>✕</button>
          <button onClick={e=>{e.stopPropagation();setActiveImg(i=>(i-1+images.length)%images.length)}} style={{ position:'absolute',left:'1.5rem',background:'rgba(255,255,255,0.1)',border:'none',borderRadius:'50%',width:44,height:44,color:'white',fontSize:'1.5rem',cursor:'pointer' }}>‹</button>
          <img src={images[activeImg]} alt="" style={{ maxHeight:'85vh',maxWidth:'90vw',objectFit:'contain',borderRadius:12 }}/>
          <button onClick={e=>{e.stopPropagation();setActiveImg(i=>(i+1)%images.length)}} style={{ position:'absolute',right:'1.5rem',background:'rgba(255,255,255,0.1)',border:'none',borderRadius:'50%',width:44,height:44,color:'white',fontSize:'1.5rem',cursor:'pointer' }}>›</button>
          <div style={{ position:'absolute',bottom:'1.5rem',left:'50%',transform:'translateX(-50%)',color:'rgba(255,255,255,0.5)',fontSize:'0.85rem' }}>{activeImg+1}/{images.length}</div>
        </div>
      )}

      <div style={{ maxWidth:1140,margin:'0 auto',padding:'2rem 1.5rem' }}>
        <button onClick={()=>navigate(-1)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',fontSize:'0.9rem',marginBottom:'1.5rem',padding:0,display:'flex',alignItems:'center',gap:6,fontFamily:'var(--font-body)',transition:'color var(--fast)' }}
          onMouseEnter={e=>e.currentTarget.style.color='var(--saffron)'}
          onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
          ← Back to results
        </button>

        {/* Title row */}
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:16,marginBottom:'0.75rem',flexWrap:'wrap' }}>
          <h1 style={{ fontFamily:'var(--font-display)',fontSize:'clamp(1.8rem,4vw,2.8rem)',fontWeight:700,color:'var(--text-primary)',lineHeight:1.15,flex:1 }}>{hotel.name}</h1>
          <button onClick={toggleSave} className={heartAnim?'heart-pop':''} style={{ background:saved?'var(--saffron)':'white',border:'1.5px solid '+(saved?'var(--saffron)':'var(--warm-200)'),borderRadius:'var(--radius-full)',padding:'8px 16px',cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontSize:'0.88rem',fontWeight:600,color:saved?'white':'var(--text-secondary)',transition:'all var(--fast)',flexShrink:0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={saved?'white':'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {saved?'Saved':'Save'}
          </button>
        </div>

        <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:'1.5rem',flexWrap:'wrap',color:'var(--text-muted)',fontSize:'0.9rem' }}>
          {hotel.rating && <span style={{ color:'var(--text-primary)',fontWeight:700 }}>★ {hotel.rating}</span>}
          {hotel.reviewCount && <span>· {hotel.reviewCount} reviews</span>}
          {hotel.superhost && <span style={{ color:'var(--gold)',fontWeight:700 }}>· 🏆 Superhost</span>}
          <span>· 📍 {hotel.city}</span>
          <button onClick={()=>setShowMap(m=>!m)} style={{ background:'none',border:'none',color:'var(--saffron)',fontWeight:600,cursor:'pointer',fontSize:'0.88rem',fontFamily:'var(--font-body)',padding:0,textDecoration:'underline' }}>
            {showMap?'Hide map':'Show on map'}
          </button>
        </div>

        {/* Map embed */}
        {showMap && (
          <div style={{ marginBottom:'1.5rem',borderRadius:'var(--radius-lg)',overflow:'hidden',height:280,border:'1px solid var(--warm-100)',boxShadow:'var(--shadow-md)' }}>
            <iframe
              title="property-map"
              width="100%" height="280" frameBorder="0" style={{ border:0 }} loading="lazy"
              src={`https://maps.google.com/maps?q=${mapCity}&z=13&output=embed`}
              allowFullScreen />
          </div>
        )}

        {/* Gallery */}
        <div style={{ position:'relative',marginBottom:'2.5rem' }}>
          <div style={{ display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gridTemplateRows:'260px 260px',gap:8,borderRadius:'var(--radius-xl)',overflow:'hidden' }}>
            <div onClick={()=>{setActiveImg(0);setLightbox(true)}} className="img-zoom" style={{ gridRow:'span 2',cursor:'pointer' }}>
              <img src={images[0]} alt={hotel.name} style={{ width:'100%',height:'100%',objectFit:'cover' }} onError={e=>e.target.src=FALLBACK_IMGS.default[0]}/>
            </div>
            {[1,2,3,4].map(s=>(
              <div key={s} onClick={()=>{setActiveImg(s);setLightbox(true)}} className="img-zoom" style={{ cursor:'pointer',background:'var(--warm-100)' }}>
                <img src={images[s]||images[s%images.length]} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }} onError={e=>e.target.src=FALLBACK_IMGS.default[0]}/>
              </div>
            ))}
          </div>
          <button onClick={()=>{setActiveImg(0);setLightbox(true)}} style={{ position:'absolute',bottom:14,right:14,background:'white',border:'1.5px solid var(--text-primary)',borderRadius:'var(--radius-md)',padding:'10px 18px',fontSize:'0.85rem',fontWeight:700,cursor:'pointer',transition:'all var(--fast)',fontFamily:'var(--font-body)' }}
            onMouseEnter={e=>{e.currentTarget.style.background='var(--text-primary)';e.currentTarget.style.color='white'}}
            onMouseLeave={e=>{e.currentTarget.style.background='white';e.currentTarget.style.color='var(--text-primary)'}}>
            🖼 View all {images.length} photos
          </button>
        </div>

        <div style={{ display:'grid',gridTemplateColumns:'1fr minmax(340px,400px)',gap:'4rem',alignItems:'start' }}>
          {/* Left */}
          <div>
            <div style={{ display:'flex',gap:24,padding:'20px 0',borderBottom:'1px solid var(--warm-100)',marginBottom:24,flexWrap:'wrap' }}>
              {[hotel.guests&&{icon:'👥',l:`${hotel.guests} guests`},hotel.beds&&{icon:'🛏',l:`${hotel.beds} beds`},hotel.baths&&{icon:'🚿',l:`${hotel.baths} baths`}].filter(Boolean).map((x,i)=>(
                <div key={i} style={{ display:'flex',alignItems:'center',gap:6,fontSize:'0.9rem',color:'var(--text-secondary)' }}><span>{x.icon}</span><span>{x.l}</span></div>
              ))}
            </div>
            {hotel.description && (
              <div style={{ borderBottom:'1px solid var(--warm-100)',paddingBottom:24,marginBottom:24 }}>
                <h3 style={{ fontFamily:'var(--font-display)',fontSize:'1.35rem',fontWeight:700,marginBottom:10,color:'var(--text-primary)' }}>About this place</h3>
                <p style={{ color:'var(--text-secondary)',lineHeight:1.8,fontSize:'0.95rem' }}>{hotel.description}</p>
              </div>
            )}
            {hotel.amenities?.length > 0 && (
              <div style={{ borderBottom: rooms.length>0?'1px solid var(--warm-100)':'none',paddingBottom:24,marginBottom:24 }}>
                <h3 style={{ fontFamily:'var(--font-display)',fontSize:'1.35rem',fontWeight:700,marginBottom:16,color:'var(--text-primary)' }}>What this place offers</h3>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
                  {hotel.amenities.map((a,i)=>(
                    <div key={i} style={{ display:'flex',alignItems:'center',gap:10,fontSize:'0.9rem',color:'var(--text-secondary)',padding:'10px 14px',background:'var(--warm-50)',borderRadius:'var(--radius-md)',border:'1px solid var(--warm-100)' }}>
                      <span style={{ fontSize:'1.1rem' }}>{amenityIcon(a)}</span><span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {rooms.length > 0 && (
              <div>
                <h3 style={{ fontFamily:'var(--font-display)',fontSize:'1.35rem',fontWeight:700,marginBottom:16,color:'var(--text-primary)' }}>Available Rooms</h3>
                <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
                  {rooms.map(room=>(
                    <div key={room.id} onClick={()=>setSelectedRoomId(room.id)}
                      style={{ border:`2px solid ${selectedRoomId===room.id?'var(--saffron)':'var(--warm-100)'}`,borderRadius:'var(--radius-md)',padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',transition:'all var(--fast)',background:selectedRoomId===room.id?'var(--saffron-pale)':'white' }}>
                      <div>
                        <div style={{ fontWeight:700,fontSize:'0.95rem',marginBottom:4 }}>{room.type||'Standard Room'}</div>
                        <div style={{ color:'var(--text-muted)',fontSize:'0.82rem' }}>Up to {room.capacity||'?'} guests · {room.totalCount||1} available</div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1.2rem',color:'var(--burgundy)' }}>₹{Number(room.basePrice||0).toLocaleString('en-IN')}</div>
                        <div style={{ color:'var(--text-muted)',fontSize:'0.78rem' }}>/night</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking card */}
          <div style={{ position:'sticky',top:90,background:'white',borderRadius:'var(--radius-xl)',padding:28,boxShadow:'var(--shadow-xl)',border:'1px solid var(--warm-100)' }}>
            <div style={{ marginBottom:20 }}>
              <div style={{ display:'flex',alignItems:'baseline',gap:4 }}>
                <span style={{ fontFamily:'var(--font-display)',fontSize:'2rem',fontWeight:700,color:'var(--burgundy)' }}>
                  {basePrice>0?`₹${basePrice.toLocaleString('en-IN')}`:'—'}
                </span>
                {basePrice>0 && <span style={{ color:'var(--text-muted)' }}>/night</span>}
              </div>
              {hotel.rating && <div style={{ color:'var(--text-muted)',fontSize:'0.85rem',marginTop:4 }}>★ {hotel.rating} · {hotel.reviewCount||0} reviews</div>}
            </div>

            {/* Date pickers */}
            <div style={{ border:'1.5px solid var(--warm-200)',borderRadius:'var(--radius-md)',overflow:'hidden',marginBottom:10 }}>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr' }}>
                <div style={{ padding:'12px 14px',borderRight:'1px solid var(--warm-100)' }}>
                  <div style={{ fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--saffron)',marginBottom:4 }}>Check-in</div>
                  <input type="date" value={checkIn} min={new Date().toISOString().split('T')[0]} onChange={e=>setCheckIn(e.target.value)}
                    style={{ border:'none',outline:'none',fontSize:'0.9rem',color:checkIn?'var(--text-primary)':'var(--text-muted)',background:'transparent',width:'100%',fontFamily:'var(--font-body)',cursor:'pointer' }}/>
                </div>
                <div style={{ padding:'12px 14px' }}>
                  <div style={{ fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--saffron)',marginBottom:4 }}>Check-out</div>
                  <input type="date" value={checkOut} min={checkIn||new Date().toISOString().split('T')[0]} onChange={e=>setCheckOut(e.target.value)}
                    style={{ border:'none',outline:'none',fontSize:'0.9rem',color:checkOut?'var(--text-primary)':'var(--text-muted)',background:'transparent',width:'100%',fontFamily:'var(--font-body)',cursor:'pointer' }}/>
                </div>
              </div>
              <div style={{ borderTop:'1px solid var(--warm-100)',padding:'12px 14px' }}>
                <div style={{ fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--saffron)',marginBottom:4 }}>Rooms</div>
                <select value={roomsCount} onChange={e=>setRoomsCount(Number(e.target.value))}
                  style={{ border:'none',outline:'none',fontSize:'0.9rem',color:'var(--text-primary)',background:'transparent',width:'100%',cursor:'pointer',fontFamily:'var(--font-body)' }}>
                  {[1,2,3,4,5].map(n=><option key={n} value={n}>{n} room{n>1?'s':''}</option>)}
                </select>
              </div>
            </div>

            <button onClick={handleBook} disabled={bookingLoading||booked} className="btn-primary"
              style={{ width:'100%',padding:16,fontSize:'1rem',borderRadius:'var(--radius-md)',marginBottom:16,opacity:(bookingLoading||booked)?0.7:1 }}>
              {bookingLoading?'⏳ Processing…':booked?'✅ Booking Created!':user?'⚡ Reserve & Pay':'🔑 Log in to Book'}
            </button>

            {/* ── Real-time price breakdown ── */}
            {nights > 0 && basePrice > 0 && (
              <div style={{ fontSize:'0.88rem',borderTop:'1px solid var(--warm-100)',paddingTop:14 }}>
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8,color:'var(--text-secondary)' }}>
                  <span>₹{basePrice.toLocaleString('en-IN')} × {nights} night{nights>1?'s':''} × {roomsCount} room{roomsCount>1?'s':''}</span>
                  <span style={{ color:'var(--text-primary)',fontWeight:500 }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {urgencyFee > 0 && (
                  <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8,color:'var(--text-secondary)' }}>
                    <span style={{ display:'flex',alignItems:'center',gap:4 }}>
                      Last-minute fee
                      <span title="Bookings within 7 days incur a 15% urgency fee" style={{ cursor:'help',color:'var(--text-muted)',fontSize:'0.75rem',border:'1px solid var(--warm-200)',borderRadius:'50%',width:16,height:16,display:'inline-flex',alignItems:'center',justifyContent:'center' }}>?</span>
                    </span>
                    <span style={{ color:'var(--gold)',fontWeight:500 }}>+₹{Math.round(urgencyFee).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={{ display:'flex',justifyContent:'space-between',borderTop:'1px solid var(--warm-100)',paddingTop:12,marginTop:4 }}>
                  <span style={{ fontWeight:700,fontSize:'1rem',color:'var(--text-primary)' }}>Total (INR)</span>
                  <span style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1.2rem',color:'var(--burgundy)' }}>₹{Math.round(total).toLocaleString('en-IN')}</span>
                </div>
                <p style={{ color:'var(--text-muted)',fontSize:'0.75rem',textAlign:'center',marginTop:10 }}>You won't be charged yet</p>
              </div>
            )}
            <div style={{ display:'flex',justifyContent:'center',gap:20,marginTop:14,paddingTop:14,borderTop:'1px solid var(--warm-50)' }}>
              {['🔒 Secure','↩️ Free cancel','⭐ Verified'].map(b=>(
                <span key={b} style={{ fontSize:'0.72rem',color:'var(--text-muted)' }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div style={{ display:'flex',justifyContent:'center',alignItems:'center',height:'60vh',flexDirection:'column',gap:16 }}>
      <div style={{ width:48,height:48,border:'4px solid var(--warm-100)',borderTopColor:'var(--saffron)',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color:'var(--text-muted)',fontFamily:'var(--font-body)' }}>Loading property…</p>
    </div>
  );
}
function NotFound({ navigate }) {
  return (
    <div style={{ textAlign:'center',padding:'5rem',fontFamily:'var(--font-body)' }}>
      <div style={{ fontSize:'4rem',marginBottom:'1rem' }}>🏚️</div>
      <h2 style={{ fontFamily:'var(--font-display)',fontSize:'1.8rem',color:'var(--text-primary)',marginBottom:8 }}>Property not found</h2>
      <button onClick={()=>navigate('/listings')} className="btn-primary" style={{ marginTop:'1.5rem' }}>Browse all stays</button>
    </div>
  );
}
