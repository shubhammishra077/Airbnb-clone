import { Page, Section, StatRow, ValueList, primaryBtn } from "../components/PageLayout";
export default function HostResources() {
  return (
    <Page title="Host Resources" subtitle="Everything you need to list and manage your property on Staynest">
      <Section title="Getting Started">
        <ValueList items={[
          { icon: "📋", title: "Create Your Listing", desc: "Sign up as a host, add your property details, photos and pricing. Our team verifies and publishes within 48 hours." },
          { icon: "📸", title: "Photography Tips", desc: "Listings with professional photos get 3× more bookings. Use natural light, shoot wide-angle, and showcase unique features." },
          { icon: "💰", title: "Set Your Price", desc: "We recommend a base price + surge factor. Our dynamic pricing engine optimises revenue based on demand automatically." },
          { icon: "📅", title: "Manage Availability", desc: "Block dates, set minimum stays, and manage bookings from your host dashboard." },
        ]} />
      </Section>
      <Section title="Payouts">
        Hosts receive 97% of the booking amount (3% platform fee). Payouts are transferred to your bank account
        within 24 hours of guest check-in via NEFT/IMPS. We support all major Indian banks.
      </Section>
      <Section title="Host Standards">
        To maintain your listing on Staynest, hosts must maintain a minimum 4.0 rating, respond to booking
        requests within 24 hours, and honour confirmed bookings. Consistent superhosts (4.8+) get priority
        placement and a verified badge.
      </Section>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a href="https://wa.me/919546075903" target="_blank" rel="noreferrer" style={{ background: "linear-gradient(135deg,#e8472a,#ff6b35)", color: "white", border: "none", borderRadius: "50px", fontWeight: 700, cursor: "pointer", display: 'inline-block', textDecoration: 'none' }}>
          💬 Talk to a Host Advisor
        </a>
      </div>
    </Page>
  );
}
