import { Page, Section, StatRow, ValueList, primaryBtn } from "../components/PageLayout";
import { useNavigate } from 'react-router-dom';

export default function AboutUs() {
  const navigate = useNavigate();
  return (
    <Page title="About Staynest" subtitle="Our story, mission and the people behind it">
      <Section title="Who We Are">
        Staynest is India's most trusted platform for unique stays — connecting travellers with extraordinary homes,
        heritage havelis, backwater houseboats, and mountain retreats across all 28 states. Founded with a simple
        belief: every journey deserves a remarkable place to rest.
      </Section>
      <Section title="Our Mission">
        We exist to make authentic Indian hospitality accessible to everyone. We bridge the gap between travellers
        seeking genuine experiences and hosts who pour their heart into their spaces — whether it's a 200-year-old
        haveli in Jaipur or a forest cottage in the Doon Valley.
      </Section>
      <StatRow stats={[
        { n: "5,000+", l: "Unique Stays" },
        { n: "28", l: "States Covered" },
        { n: "1.2L+", l: "Happy Guests" },
        { n: "4.9★", l: "Avg. Rating" },
      ]} />
      <Section title="Our Values">
        <ValueList items={[
          { icon: "🤝", title: "Trust First", desc: "Every host is verified. Every listing is reviewed. Your safety is non-negotiable." },
          { icon: "🌿", title: "Sustainable Travel", desc: "We partner with eco-conscious hosts and promote responsible tourism practices." },
          { icon: "🏛️", title: "Preserve Heritage", desc: "We actively promote stays in heritage properties to fund their restoration and upkeep." },
          { icon: "💡", title: "Empower Hosts", desc: "We give independent homeowners the tools to reach millions of travellers." },
        ]} />
      </Section>
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button onClick={() => navigate('/listings')} style={{ background: "linear-gradient(135deg,#e8472a,#ff6b35)", color: "white", border: "none", borderRadius: "50px", padding: "13px 28px", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer" }}>Explore Stays</button>
      </div>
    </Page>
  );
}

function Careers() { return null; }
