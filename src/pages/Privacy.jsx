import { Page, Section } from '../components/PageLayout';
export default function Privacy() {
  return (
    <Page title="Privacy Policy" subtitle="How we collect, use and protect your data">
      <Section title="What We Collect">
        We collect information you provide directly — name, email, date of birth, gender — when you create an account or make a booking. We also collect usage data such as pages visited, search queries, and device type to improve our service.
      </Section>
      <Section title="How We Use Your Data">
        Your data is used to process bookings, personalise your experience, send booking confirmations and support communications, and improve our platform. We never sell your personal data to third parties.
      </Section>
      <Section title="Payment Data">
        All payment processing is handled by Stripe. Staynest never stores your card details. Stripe's privacy policy governs payment data handling.
      </Section>
      <Section title="Cookies">
        We use essential cookies for authentication and session management. We do not use advertising or tracking cookies.
      </Section>
      <Section title="Your Rights">
        You may request access to, correction of, or deletion of your personal data at any time by emailing support@staynest.com. We will respond within 7 working days.
      </Section>
      <Section title="Contact">
        For privacy-related queries: <strong style={{color:'#e8472a'}}>privacy@staynest.com</strong>
      </Section>
    </Page>
  );
}
