import { Page, Section, StatRow, ValueList, primaryBtn } from "../components/PageLayout";
export default function TrustSafety() {
  return (
    <Page title="Trust & Safety" subtitle="How we protect every guest and host on Staynest">
      <Section title="Our Safety Promise">
        Every listing on Staynest goes through a multi-step verification process before it's published.
        We verify host identity, property ownership, and listing accuracy so you can book with complete confidence.
      </Section>
      <Section title="How We Protect You">
        <ValueList items={[
          { icon: "🔒", title: "Secure Payments", desc: "All payments are processed via Stripe with 256-bit encryption. We never store your card details." },
          { icon: "✅", title: "Verified Listings", desc: "Photos, amenities and descriptions are verified against guest reviews and periodic host audits." },
          { icon: "🛡️", title: "Guest Protection Policy", desc: "If your stay doesn't match the listing, we'll rebook you or issue a full refund within 24 hours." },
          { icon: "📞", title: "24/7 Support", desc: "Our support team is available around the clock via WhatsApp and email for urgent issues." },
          { icon: "⭐", title: "Review System", desc: "Genuine two-way reviews after every stay ensure accountability for both guests and hosts." },
          { icon: "🚨", title: "Emergency Assistance", desc: "In-app emergency button connects you to local authorities and our support team instantly." },
        ]} />
      </Section>
    </Page>
  );
}
