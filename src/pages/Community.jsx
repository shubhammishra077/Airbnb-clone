import { Page, Section, StatRow, ValueList, primaryBtn } from "../components/PageLayout";
export default function Community() {
  return (
    <Page title="Staynest Community" subtitle="Connect with fellow travellers and hosts across India">
      <Section title="Who We Are">
        The Staynest Community is a growing network of over 1.2 lakh travellers, 8,000+ hosts, and local experience
        guides spread across India. We share stories, tips, and a common love for authentic travel.
      </Section>
      <Section title="Community Guidelines">
        <ValueList items={[
          { icon: "🤝", title: "Be Respectful", desc: "Treat every member — guest, host, or local guide — with the same respect you'd want in return." },
          { icon: "✅", title: "Share Honestly", desc: "Reviews and tips should be genuine. Fake reviews or misleading information will lead to account suspension." },
          { icon: "🌍", title: "Travel Responsibly", desc: "Respect local cultures, minimise your environmental impact, and support local businesses." },
          { icon: "🚫", title: "Zero Tolerance", desc: "Discrimination, harassment, and hate speech are grounds for immediate and permanent removal." },
        ]} />
      </Section>
      <Section title="Join the Conversation">
        Follow us on <strong style={{ color: '#e8472a' }}>@shubham_mishraa7</strong> on Instagram for travel inspiration,
        host spotlights, and community stories. Use <strong style={{ color: '#e8472a' }}>#StaynestIndia</strong> to get featured.
      </Section>
    </Page>
  );
}
