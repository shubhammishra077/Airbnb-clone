import { Page, Section, StatRow, ValueList, primaryBtn } from "../components/PageLayout";
const COVERAGE = [
  { outlet: "The Hindu", headline: "Staynest is redefining how India travels — one haveli at a time", date: "Feb 2026" },
  { outlet: "Economic Times", headline: "This Jaipur startup has 5,000 unique stays and zero outside funding", date: "Jan 2026" },
  { outlet: "Forbes India", headline: "30 Under 30: The founders making Indian heritage stay cool again", date: "Dec 2025" },
  { outlet: "Condé Nast Traveller", headline: "Staynest's curated India: the best offbeat stays of 2025", date: "Nov 2025" },
  { outlet: "YourStory", headline: "From havelis to houseboats — inside Staynest's remarkable growth", date: "Oct 2025" },
];

export default function Press() {
  return (
    <Page title="Staynest in the Press" subtitle="News, coverage and media resources">
      <Section title="Recent Coverage">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
          {COVERAGE.map((c, i) => (
            <div key={i} style={{ background: '#faf8f5', borderRadius: '14px', padding: '18px 22px', border: '1.5px solid #f0ebe3' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ background: '#e8472a', color: 'white', borderRadius: '6px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700 }}>{c.outlet}</span>
                <span style={{ color: '#aaa', fontSize: '0.78rem' }}>{c.date}</span>
              </div>
              <p style={{ color: '#1a1a1a', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>"{c.headline}"</p>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Media Kit">
        For logos, brand guidelines, founder photos and fact sheets, email{' '}
        <span style={{ color: '#e8472a', fontWeight: 600 }}>press@staynest.com</span>
      </Section>
    </Page>
  );
}
