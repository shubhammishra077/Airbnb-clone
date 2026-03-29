import { Page, Section } from '../components/PageLayout';
export default function Terms() {
  return (
    <Page title="Terms of Service" subtitle="The rules that govern your use of Staynest">
      <Section title="Acceptance">
        By accessing or using Staynest, you agree to be bound by these Terms. If you do not agree, please do not use the platform.
      </Section>
      <Section title="Bookings & Payments">
        All bookings are binding once payment is confirmed. Prices shown include applicable taxes. Dynamic pricing may apply based on demand, urgency, and seasonal factors — the final price is always shown before you confirm.
      </Section>
      <Section title="Guest Responsibilities">
        Guests must treat properties with respect, adhere to house rules set by the host, and not exceed the maximum occupancy stated in the listing. Damage caused during a stay may be charged to the guest.
      </Section>
      <Section title="Host Responsibilities">
        Hosts must ensure listings are accurate, properties are clean and safe, and confirmed bookings are honoured. Repeated cancellations or misrepresentation may result in listing removal.
      </Section>
      <Section title="Cancellations">
        Cancellation terms depend on the policy set by the host (Flexible, Moderate, or Strict). See our Cancellation Policy page for full details.
      </Section>
      <Section title="Limitation of Liability">
        Staynest acts as a marketplace connecting guests and hosts. We are not liable for disputes between guests and hosts beyond our Guest Protection Policy. Maximum liability is limited to the booking amount paid.
      </Section>
      <Section title="Governing Law">
        These Terms are governed by the laws of India. Disputes shall be subject to the jurisdiction of courts in New Delhi.
      </Section>
    </Page>
  );
}
