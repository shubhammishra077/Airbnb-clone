import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile, getMyBookings, getGuests, addGuest, deleteGuest } from '../api/users';
import { cancelBooking } from '../api/bookings';
import { extractError } from '../utils/errors';
import Toast from '../components/Toast';

// Safely unwrap ApiResponse { timeStamp, data: T, error }
function unwrapData(response) {
  const body = response?.data;
  if (!body) return null;
  // Wrapped: { timeStamp, data: [...], error: null }
  if (body && typeof body === 'object' && 'timeStamp' in body && 'data' in body) {
    return body.data;
  }
  return body;
}

const TABS = ['Bookings', 'Guests', 'Profile'];
// Nav items in header

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Bookings');
  const [bookings, setBookings] = useState([]);
  const [guests, setGuests] = useState([]);
  const [profile, setProfile] = useState({ name: '', dateOfBirth: '', gender: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [newGuest, setNewGuest] = useState({ name: '', gender: '', age: '' });
  const loadedRef = useRef(false);

  const showToast = (msg, type = 'info') => setToast({ msg: String(msg), type });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (loadedRef.current) return;
    loadedRef.current = true;
    const tryLoad = () => {
      if (localStorage.getItem('accessToken')) loadData();
      else setTimeout(tryLoad, 150);
    };
    tryLoad();
  }, [user]);

  // Reload guests every time Guests tab is opened
  useEffect(() => {
    if (activeTab === 'Guests') {
      loadGuests();
    }
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookRes, profRes] = await Promise.allSettled([getMyBookings(), getProfile()]);
      if (bookRes.status === 'fulfilled') {
        const data = unwrapData(bookRes.value);
        setBookings(Array.isArray(data) ? data : []);
      }
      if (profRes.status === 'fulfilled') {
        const p = unwrapData(profRes.value) || {};
        setProfile({ name: p.name || '', dateOfBirth: p.dateOfBirth || '', gender: p.gender || '' });
      }
    } catch (e) { console.error('loadData error:', e); }
    finally { setLoading(false); }
  };

  const loadGuests = async () => {
    try {
      const response = await getGuests();
      const body = response?.data;
      console.log('loadGuests body:', JSON.stringify(body));

      let list = null;

      // Shape 1: ApiResponse wrapper { timeStamp, data: [...], error }
      if (body && 'timeStamp' in body && 'data' in body) {
        list = body.data;
      }
      // Shape 2: direct array
      else if (Array.isArray(body)) {
        list = body;
      }
      // Shape 3: nested { data: { data: [...] } }
      else if (body?.data && Array.isArray(body.data)) {
        list = body.data;
      }

      console.log('loadGuests final list:', list);
      setGuests(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error('loadGuests error:', e.response?.status, e.response?.data);
      setGuests([]);
    }
  };

  const handleProfileSave = async () => {
    try {
      await updateProfile(profile);
      showToast('Profile updated!', 'success');
    } catch (err) { showToast(extractError(err), 'error'); }
  };

  const handleAddGuest = async () => {
    if (!newGuest.name.trim()) { showToast('Enter guest name', 'error'); return; }
    try {
      const response = await addGuest(newGuest);
      console.log('Add guest response:', response?.data);
      setNewGuest({ name: '', gender: '', age: '' });
      // Reload after a short delay to ensure DB is committed
      setTimeout(() => loadGuests(), 300);
      showToast('Guest added!', 'success');
    } catch (err) {
      console.error('addGuest error:', err.response?.status, err.response?.data);
      showToast(extractError(err), 'error');
    }
  };

  const handleDeleteGuest = async (id) => {
    try {
      await deleteGuest(id);
      setGuests(prev => prev.filter(g => g.id !== id)); // optimistic update
      showToast('Guest removed', 'info');
    } catch (err) { showToast(extractError(err), 'error'); }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(bookingId);
      loadedRef.current = false;
      loadData();
      showToast('Booking cancelled', 'info');
    } catch (err) { showToast(extractError(err), 'error'); }
  };

  return (
    <div style={{ fontFamily: '"DM Sans", system-ui, sans-serif', minHeight: '100vh', background: '#faf8f5' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        input:focus, select:focus { outline: none; }
      `}</style>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#1a1a1a,#2d1810)', borderRadius: '20px', padding: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#e8472a,#ff9933)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
            {String(user?.name || user?.email || '?')[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.8rem', fontWeight: 900, color: 'white', margin: '0 0 4px' }}>
              {user?.name || 'Traveller'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>{user?.email}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '10px 20px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
              🏠 Home
            </button>
            <button onClick={() => { logout(); navigate('/'); }} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '10px 20px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
              🚪 Log out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '10px 20px', border: 'none', borderRadius: '10px', background: activeTab === t ? '#1a1a1a' : 'white', color: activeTab === t ? 'white' : '#717171', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', boxShadow: activeTab === t ? '0 2px 8px rgba(0,0,0,0.15)' : 'none', transition: 'all 0.2s' }}>
              {t}
            </button>
          ))}
        </div>

        {/* ── BOOKINGS ── */}
        {activeTab === 'Bookings' && (
          loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#717171' }}>Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <EmptyState icon="🛏" title="No bookings yet" subtitle="Start exploring India and make your first booking." action={() => navigate('/listings')} actionLabel="Browse stays" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bookings.map((b, i) => (
                <div key={b.id ?? i} style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', border: '1.5px solid #f0ebe3', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Booking #{b.id}</div>
                    <div style={{ color: '#717171', fontSize: '0.85rem' }}>📅 {b.checkInDate} → {b.checkOutDate}</div>
                    {b.roomsCount && <div style={{ color: '#717171', fontSize: '0.85rem' }}>🛏 {b.roomsCount} room{b.roomsCount > 1 ? 's' : ''}</div>}
                    <StatusBadge status={b.bookingStatus} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {b.amount != null && <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>₹{Number(b.amount).toLocaleString('en-IN')}</div>}
                    {['PENDING', 'CONFIRMED', 'RESERVED', 'PAYMENTS_PENDING'].includes(b.bookingStatus) && (
                      <button onClick={() => handleCancel(b.id)} style={{ background: 'none', border: '1.5px solid #e8472a', color: '#e8472a', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>Cancel</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── GUESTS ── */}
        {activeTab === 'Guests' && (
          <div>
            {/* Add form */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1.5px solid #f0ebe3', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, margin: '0 0 16px', fontSize: '1rem' }}>Add a Guest</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>Name *</label>
                  <input placeholder="Guest name" value={newGuest.name}
                    onChange={e => setNewGuest(g => ({ ...g, name: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: '10px', fontSize: '0.9rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>Gender</label>
                  <select value={newGuest.gender} onChange={e => setNewGuest(g => ({ ...g, gender: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: '10px', fontSize: '0.9rem', background: 'white' }}>
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>Age</label>
                  <input type="number" min="1" max="120" placeholder="25" value={newGuest.age}
                    onChange={e => setNewGuest(g => ({ ...g, age: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: '10px', fontSize: '0.9rem' }} />
                </div>
                <button onClick={handleAddGuest} style={{ background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 18px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', height: '42px' }}>
                  + Add
                </button>
              </div>
            </div>

            {/* Guest list */}
            {guests.length === 0 ? (
              <EmptyState icon="👥" title="No saved guests" subtitle="Add guests to include them in your bookings." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {guests.map((g, i) => (
                  <div key={g.id ?? i} style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', border: '1.5px solid #f0ebe3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#e8472a,#ff9933)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '1.1rem', flexShrink: 0 }}>
                        {String(g.name || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{g.name}</div>
                        <div style={{ color: '#717171', fontSize: '0.82rem' }}>
                          {g.gender ? g.gender.charAt(0) + g.gender.slice(1).toLowerCase() : ''}
                          {g.age ? ` · Age ${g.age}` : ''}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteGuest(g.id)} style={{ background: 'none', border: '1.5px solid #fee2e2', color: '#e8472a', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE ── */}
        {activeTab === 'Profile' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1.5px solid #f0ebe3', maxWidth: '520px' }}>
            <h3 style={{ fontWeight: 700, margin: '0 0 20px', fontSize: '1.1rem' }}>Edit Profile</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                { key: 'dateOfBirth', label: 'Date of Birth', type: 'date', placeholder: '' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px' }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={profile[f.key]}
                    onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', padding: '13px 14px', border: '1.5px solid #e0e0e0', borderRadius: '10px', fontSize: '0.95rem' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px' }}>Gender</label>
                <select value={profile.gender} onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))}
                  style={{ width: '100%', padding: '13px 14px', border: '1.5px solid #e0e0e0', borderRadius: '10px', fontSize: '0.95rem', background: 'white' }}>
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <button onClick={handleProfileSave} style={{ background: 'linear-gradient(135deg,#e8472a,#ff6b35)', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(232,71,42,0.3)' }}>
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (!status) return null;
  const map = { CONFIRMED: { bg: '#f0fdf4', color: '#16a34a' }, PENDING: { bg: '#fffbeb', color: '#d97706' }, RESERVED: { bg: '#fffbeb', color: '#d97706' }, PAYMENTS_PENDING: { bg: '#fff7ed', color: '#ea580c' }, CANCELLED: { bg: '#fef2f2', color: '#dc2626' }, COMPLETED: { bg: '#f0f9ff', color: '#0284c7' } };
  const s = map[status] ?? { bg: '#f5f5f5', color: '#717171' };
  return <span style={{ display: 'inline-block', marginTop: '6px', background: s.bg, color: s.color, borderRadius: '6px', padding: '2px 10px', fontSize: '0.78rem', fontWeight: 700 }}>{status}</span>;
}

function EmptyState({ icon, title, subtitle, action, actionLabel }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', border: '1.5px solid #f0ebe3' }}>
      <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{icon}</div>
      <h3 style={{ fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px' }}>{title}</h3>
      <p style={{ color: '#717171', margin: action ? '0 0 1.5rem' : 0 }}>{subtitle}</p>
      {action && <button onClick={action} style={{ background: '#e8472a', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>{actionLabel}</button>}
    </div>
  );
}
