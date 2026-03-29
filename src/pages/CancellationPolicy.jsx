import { Page, Section, StatRow, ValueList, primaryBtn } from "../components/PageLayout";
export default function CancellationPolicy() {
  return (
    <Page title="Cancellation Policy" subtitle="Clear, fair rules for every booking on Staynest">
      <Section title="Our Standard Policy">
        Staynest offers three cancellation tiers, set by the host at the time of listing.
        The applicable policy is always displayed before you confirm a booking.
      </Section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', margin: '8px 0 24px' }}>
        {[
          { tier: "Flexible", color: "#16a34a", bg: "#f0fdf4", rules: ["Full refund up to 24 hrs before check-in", "50% refund within 24 hrs of check-in", "No refund after check-in begins"] },
          { tier: "Moderate", color: "#d97706", bg: "#fffbeb", rules: ["Full refund up to 5 days before check-in", "50% refund 1–5 days before check-in", "No refund within 24 hrs of check-in"] },
          { tier: "Strict", color: "#dc2626", bg: "#fef2f2", rules: ["Full refund within 48 hrs of booking (if >14 days away)", "50% refund up to 7 days before check-in", "No refund within 7 days of check-in"] },
        ].map((p) => (
          <div key={p.tier} style={{ background: p.bg, borderRadius: '16px', padding: '20px', border: `2px solid ${p.color}22` }}>
            <div style={{ color: p.color, fontWeight: 800, fontSize: '1.1rem', marginBottom: '12px' }}>{p.tier}</div>
            {p.rules.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '0.88rem', color: '#484848', alignItems: 'flex-start' }}>
                <span style={{ color: p.color, marginTop: '2px', flexShrink: 0 }}>✓</span> {r}
              </div>
            ))}
          </div>
        ))}
      </div>

      <Section title="Extenuating Circumstances">
        We understand life happens. If you need to cancel due to a medical emergency, natural disaster,
        or government-imposed travel restriction, contact us within 24 hours with supporting documentation.
        We'll review and may offer a full refund outside the standard policy at our discretion.
      </Section>
      <Section title="How to Cancel">
        Go to <strong>Profile → My Bookings</strong>, select your booking, and click <strong>Cancel Booking</strong>.
        Refunds are processed within 5–7 business days to your original payment method.
      </Section>
      <Section title="Host Cancellations">
        If a host cancels your booking, you will receive a full refund immediately plus a ₹500 travel credit
        for the inconvenience. We take host cancellations very seriously and may suspend repeat offenders.
      </Section>
    </Page>
  );
}
