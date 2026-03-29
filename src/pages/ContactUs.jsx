import { Page, Section, StatRow, ValueList, primaryBtn } from "../components/PageLayout";
export default function ContactUs() {
  return (
    <Page title="Contact Us" subtitle="We're here to help — reach us any way you prefer">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', margin: '8px 0 24px' }}>
        {[
          { icon: "💬", title: "WhatsApp", desc: "Fastest response — typically under 5 minutes", action: "Chat Now", link: "https://wa.me/919546075903?text=Hi%20Staynest!" },
          { icon: "📧", title: "Email", desc: "support@staynest.com — response within 4 hours", action: "Send Email", link: "mailto:support@staynest.com" },
          { icon: "📸", title: "Instagram", desc: "@shubham_mishraa7 — DMs welcome", action: "Message Us", link: "https://instagram.com/shubham_mishraa7" },
        ].map((c) => (
          <div key={c.title} style={{ background: '#faf8f5', borderRadius: '16px', padding: '24px', border: '1.5px solid #f0ebe3', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{c.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>{c.title}</div>
            <div style={{ color: '#717171', fontSize: '0.84rem', marginBottom: '16px', lineHeight: 1.5 }}>{c.desc}</div>
            <a href={c.link} target="_blank" rel="noreferrer" style={{ background: "linear-gradient(135deg,#e8472a,#ff6b35)", color: "white", border: "none", borderRadius: "50px", fontWeight: 700, cursor: "pointer", display: 'inline-block', textDecoration: 'none', fontSize: '0.85rem', padding: '10px 20px' }}>{c.action}</a>
          </div>
        ))}
      </div>
      <Section title="Office Hours">
        Our support team is available <strong>Mon–Sun, 8 AM – 11 PM IST</strong>.
        For urgent booking issues outside these hours, WhatsApp us and we'll respond as soon as possible.
      </Section>
    </Page>
  );
}
