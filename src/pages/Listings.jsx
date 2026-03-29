import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useHotelSearch } from '../hooks/useHotels';
import { mockProperties, CATEGORIES } from '../data/properties';
import PropertyCard from '../components/PropertyCard';

const SORT_OPTIONS = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Top Rated', 'Most Reviewed'];

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState('Recommended');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(50000);
  const [activeType, setActiveType] = useState('All');
  const [wishlist, setWishlist] = useState(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [localCity, setLocalCity] = useState(searchParams.get('city') || '');

  const city = searchParams.get('city') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '';

  const { hotels, loading, totalPages } = useHotelSearch({ city, checkIn, checkOut, guests, page, size: 12 });

  // Sort + filter
  const sorted = [...hotels]
    .filter(h => {
      const p = h.price || h.pricePerNight || (h.hotel ? h.price : 0) || 0;
      const type = h.category || h.type || '';
      return p >= priceMin && p <= priceMax && (activeType === 'All' || type.includes(activeType));
    })
    .sort((a, b) => {
      const pa = a.price || a.pricePerNight || 0, pb = b.price || b.pricePerNight || 0;
      if (sort === 'Price: Low to High') return pa - pb;
      if (sort === 'Price: High to Low') return pb - pa;
      if (sort === 'Top Rated') return (b.rating || 0) - (a.rating || 0);
      if (sort === 'Most Reviewed') return (b.reviewCount || 0) - (a.reviewCount || 0);
      return 0;
    });

  const doSearch = () => {
    const p = new URLSearchParams(searchParams);
    if (localCity) p.set('city', localCity); else p.delete('city');
    setSearchParams(p);
    setPage(0);
  };

  return (
    <div style={{ fontFamily: '"DM Sans", system-ui, sans-serif', minHeight: '100vh', background: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        input:focus, select:focus { outline: none; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .shimmer { animation: shimmer 1.4s infinite; background: linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%); background-size: 800px; }
      `}</style>

      {/* Search bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #f0ebe3', padding: '1rem 2rem', position: 'sticky', top: 72, zIndex: 40, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e0e0e0', borderRadius: '50px', overflow: 'hidden', flex: '1', minWidth: '200px', maxWidth: '380px' }}>
            <span style={{ padding: '0 12px', fontSize: '1rem' }}>📍</span>
            <input value={localCity} placeholder="Search destination..."
              onChange={e => setLocalCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
              style={{ border: 'none', padding: '10px 0', fontSize: '0.9rem', color: '#1a1a1a', flex: 1 }} />
          </div>
          <input type="date" defaultValue={checkIn} placeholder="Check in"
            style={{ border: '1.5px solid #e0e0e0', borderRadius: '50px', padding: '10px 16px', fontSize: '0.88rem', color: '#1a1a1a' }} />
          <input type="date" defaultValue={checkOut} placeholder="Check out"
            style={{ border: '1.5px solid #e0e0e0', borderRadius: '50px', padding: '10px 16px', fontSize: '0.88rem', color: '#1a1a1a' }} />
          <button onClick={doSearch} style={{ background: 'linear-gradient(135deg,#e8472a,#ff6b35)', color: 'white', border: 'none', borderRadius: '50px', padding: '10px 22px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>Search</button>
          <button onClick={() => setFiltersOpen(f => !f)} style={{ background: filtersOpen ? '#1a1a1a' : 'white', color: filtersOpen ? 'white' : '#1a1a1a', border: '1.5px solid #e0e0e0', borderRadius: '50px', padding: '10px 18px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
            ⚙️ Filters {filtersOpen ? '▲' : '▼'}
          </button>
        </div>

        {/* Expandable filters */}
        {filtersOpen && (
          <div style={{ maxWidth: '1280px', margin: '16px auto 0', padding: '20px', background: '#faf8f5', borderRadius: '16px', display: 'flex', gap: '2rem', flexWrap: 'wrap', animation: 'fadeIn 0.2s ease' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '10px', letterSpacing: '0.05em' }}>PRICE RANGE (₹/night)</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[[0,2000,'Under ₹2k'],[2000,5000,'₹2k–5k'],[5000,10000,'₹5k–10k'],[10000,50000,'₹10k+']].map(([min,max,label]) => (
                  <button key={label} onClick={() => { setPriceMin(min); setPriceMax(max); }}
                    style={{ border: `1.5px solid ${priceMin===min && priceMax===max ? '#1a1a1a':'#e0e0e0'}`, borderRadius: '50px', padding: '6px 14px', fontSize: '0.82rem', background: priceMin===min && priceMax===max ? '#1a1a1a':'white', color: priceMin===min && priceMax===max ? 'white':'#1a1a1a', cursor: 'pointer', fontWeight: 500 }}>{label}</button>
                ))}
                <button onClick={() => { setPriceMin(0); setPriceMax(50000); }} style={{ border: '1.5px solid #e0e0e0', borderRadius: '50px', padding: '6px 14px', fontSize: '0.82rem', background: 'white', color: '#717171', cursor: 'pointer' }}>Clear</button>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '10px', letterSpacing: '0.05em' }}>PROPERTY TYPE</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['All', ...CATEGORIES.map(c => c.label)].map(t => (
                  <button key={t} onClick={() => setActiveType(t)}
                    style={{ border: `1.5px solid ${activeType===t?'#1a1a1a':'#e0e0e0'}`, borderRadius: '50px', padding: '6px 14px', fontSize: '0.82rem', background: activeType===t?'#1a1a1a':'white', color: activeType===t?'white':'#1a1a1a', cursor: 'pointer', fontWeight: 500 }}>{t}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        {/* Results header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.7rem', fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>
              {city ? `Stays in ${city}` : 'All Stays Across India'}
            </h1>
            <p style={{ color: '#717171', fontSize: '0.88rem', margin: 0 }}>
              {loading ? 'Searching...' : `${sorted.length} ${sorted.length === 1 ? 'place' : 'places'} found`}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: '#717171' }}>Sort:</span>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ border: '1.5px solid #e0e0e0', borderRadius: '50px', padding: '8px 16px', fontSize: '0.85rem', color: '#1a1a1a', background: 'white', cursor: 'pointer' }}>
              {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '28px' }}>
            {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', color: '#1a1a1a', marginBottom: '8px' }}>No stays found</h3>
            <p style={{ color: '#717171', marginBottom: '24px' }}>Try adjusting your dates, location, or filters.</p>
            <button onClick={() => { setPriceMin(0); setPriceMax(50000); setActiveType('All'); setLocalCity(''); setSearchParams({}); }}
              style={{ background: '#e8472a', color: 'white', border: 'none', borderRadius: '50px', padding: '12px 28px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '28px' }}>
              {sorted.map((h, i) => (
                <div key={`hotel-${h.id ?? i}-${i}`} style={{ animation: `fadeIn 0.4s ease ${(i % 12) * 0.05}s both` }}>
                  <PropertyCard property={h} wished={wishlist.has(h.id)} onWish={e => { e.preventDefault(); setWishlist(w => { const n = new Set(w); n.has(h.id) ? n.delete(h.id) : n.add(h.id); return n; }); }} />
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '3rem', flexWrap: 'wrap' }}>
                <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page===0}
                  style={{ padding: '10px 18px', borderRadius: '50px', border: '1.5px solid #e0e0e0', background: 'white', color: page===0?'#ccc':'#1a1a1a', cursor: page===0?'not-allowed':'pointer', fontWeight: 600 }}>← Prev</button>
                {Array(Math.min(totalPages, 7)).fill(0).map((_,i) => (
                  <button key={i} onClick={() => setPage(i)}
                    style={{ width: 40, height: 40, borderRadius: '50%', border: `1.5px solid ${page===i?'#1a1a1a':'#e0e0e0'}`, background: page===i?'#1a1a1a':'white', color: page===i?'white':'#1a1a1a', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>{i+1}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages-1, p+1))} disabled={page===totalPages-1}
                  style={{ padding: '10px 18px', borderRadius: '50px', border: '1.5px solid #e0e0e0', background: 'white', color: page===totalPages-1?'#ccc':'#1a1a1a', cursor: page===totalPages-1?'not-allowed':'pointer', fontWeight: 600 }}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
      <div className="shimmer" style={{ paddingBottom: '66.66%', borderRadius: '16px' }} />
      <div style={{ padding: '12px 4px 0' }}>
        <div className="shimmer" style={{ height: 16, borderRadius: 8, marginBottom: 8 }} />
        <div className="shimmer" style={{ height: 14, borderRadius: 8, width: '60%', marginBottom: 8 }} />
        <div className="shimmer" style={{ height: 14, borderRadius: 8, width: '40%' }} />
      </div>
    </div>
  );
}
