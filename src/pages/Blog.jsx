import { Page, Section, StatRow, ValueList, primaryBtn } from "../components/PageLayout";
const POSTS = [
  { tag: "Travel Guide", title: "The Ultimate Guide to Rajasthan's Heritage Stays", date: "Mar 10, 2026", read: "8 min", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80" },
  { tag: "Tips", title: "How to Pick the Perfect Kerala Houseboat", date: "Feb 28, 2026", read: "5 min", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80" },
  { tag: "Culture", title: "Sleeping in a Fort: What It's Really Like", date: "Feb 14, 2026", read: "6 min", img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80" },
  { tag: "Sustainability", title: "Eco Stays: India's Most Responsible Retreats", date: "Jan 30, 2026", read: "7 min", img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80" },
  { tag: "Host Stories", title: "From Family Home to Superhot Listing: Priya's Story", date: "Jan 15, 2026", read: "4 min", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" },
  { tag: "Itinerary", title: "10 Days, 3 Cities: The Perfect Rajasthan Circuit", date: "Jan 5, 2026", read: "10 min", img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80" },
];

export default function Blog() {
  return (
    <Page title="Staynest Journal" subtitle="Travel guides, host stories & India inspiration">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '8px' }}>
        {POSTS.map((p, i) => (
          <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', border: '1.5px solid #f0ebe3', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', background: 'white' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
            <img src={p.img} alt={p.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ background: '#fff5f3', color: '#e8472a', borderRadius: '6px', padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>{p.tag}</span>
                <span style={{ color: '#aaa', fontSize: '0.72rem' }}>{p.read} read</span>
              </div>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1rem', fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.4 }}>{p.title}</h3>
              <span style={{ color: '#aaa', fontSize: '0.78rem' }}>{p.date}</span>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}
