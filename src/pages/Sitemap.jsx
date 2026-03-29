import { Page, Section } from '../components/PageLayout';
import { useNavigate } from 'react-router-dom';

const LINKS = [
  { section: 'Main', links: [{ label: 'Home', path: '/' }, { label: 'Browse Stays', path: '/listings' }, { label: 'Login / Sign Up', path: '/login' }, { label: 'My Profile', path: '/profile' }] },
  { section: 'Company', links: [{ label: 'About Us', path: '/about' }, { label: 'Careers', path: '/careers' }, { label: 'Press', path: '/press' }, { label: 'Blog', path: '/blog' }, { label: 'Trust & Safety', path: '/trust-safety' }] },
  { section: 'Support', links: [{ label: 'Help Centre', path: '/help' }, { label: 'Cancellation Policy', path: '/cancellation-policy' }, { label: 'Host Resources', path: '/host-resources' }, { label: 'Community', path: '/community' }, { label: 'Contact Us', path: '/contact' }] },
  { section: 'Legal', links: [{ label: 'Privacy Policy', path: '/privacy' }, { label: 'Terms of Service', path: '/terms' }] },
];

export default function Sitemap() {
  const navigate = useNavigate();
  return (
    <Page title="Sitemap" subtitle="Every page on Staynest in one place">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
        {LINKS.map(s => (
          <div key={s.section}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#e8472a', marginBottom: '12px' }}>{s.section}</div>
            {s.links.map(l => (
              <div key={l.label} onClick={() => navigate(l.path)}
                style={{ color: '#484848', fontSize: '0.92rem', marginBottom: '10px', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e8472a'}
                onMouseLeave={e => e.currentTarget.style.color = '#484848'}>
                {l.label}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Page>
  );
}
