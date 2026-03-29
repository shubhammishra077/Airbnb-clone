import { Page, Section, StatRow, ValueList, primaryBtn } from "../components/PageLayout";
import { useNavigate } from 'react-router-dom';

const JOBS = [
  { role: "Senior Frontend Engineer", team: "Engineering", loc: "Remote / Delhi", type: "Full-time" },
  { role: "Product Designer (UI/UX)", team: "Design", loc: "Bangalore", type: "Full-time" },
  { role: "Growth Marketing Manager", team: "Marketing", loc: "Remote", type: "Full-time" },
  { role: "Host Success Manager", team: "Operations", loc: "Mumbai / Jaipur", type: "Full-time" },
  { role: "Backend Engineer (Java/Spring)", team: "Engineering", loc: "Remote", type: "Full-time" },
  { role: "Content Writer – Travel", team: "Content", loc: "Remote", type: "Part-time" },
];

export default function Careers() {
  const navigate = useNavigate();
  return (
    <Page title="Careers at Staynest" subtitle="Build the future of Indian travel with us">
      <Section title="Why Join Us?">
        We're a small, passionate team obsessed with travel, design and technology.
        We move fast, think big, and genuinely care about the impact we make — on travellers,
        hosts, and the communities they're part of.
      </Section>
      <StatRow stats={[
        { n: "Remote First", l: "Work from anywhere" },
        { n: "Health Cover", l: "Full family coverage" },
        { n: "30 Days", l: "Paid leave/year" },
        { n: "Travel Credits", l: "₹50K/yr to explore India" },
      ]} />
      <Section title="Open Positions">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
          {JOBS.map((j, i) => (
            <div key={i} style={{ background: '#faf8f5', borderRadius: '14px', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', border: '1.5px solid #f0ebe3' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a', marginBottom: '4px' }}>{j.role}</div>
                <div style={{ color: '#717171', fontSize: '0.84rem' }}>{j.team} · {j.loc} · {j.type}</div>
              </div>
              <button style={{ ...primaryBtn, padding: '8px 20px', fontSize: '0.85rem' }}>Apply</button>
            </div>
          ))}
        </div>
      </Section>
      <p style={{ color: '#717171', fontSize: '0.88rem', marginTop: '2rem', textAlign: 'center' }}>
        Don't see a fit? Email us at <span style={{ color: '#e8472a', fontWeight: 600 }}>careers@staynest.com</span>
      </p>
    </Page>
  );
}
