import { Page, Section, StatRow, ValueList, primaryBtn } from "../components/PageLayout";
import { useState } from 'react';

const FAQS = [
  {
    cat: "Booking",
    items: [
      { q: "How do I make a booking?", a: "Search for your destination, choose dates and rooms, then click Reserve & Pay. You'll be redirected to Stripe's secure checkout. Your booking is confirmed once payment is complete." },
      { q: "Can I modify my booking dates?", a: "Yes — go to My Bookings in your profile, select the booking, and click 'Modify Dates'. Changes are subject to availability and may affect pricing." },
      { q: "What is the check-in / check-out time?", a: "Standard check-in is 2 PM and check-out is 11 AM. Many hosts offer flexible timings — check your property's listing or message the host directly." },
      { q: "How do I add guests to my booking?", a: "Go to Profile → Guests → Add a Guest before booking. During the booking process you can select saved guests to include in your stay." },
    ],
  },
  {
    cat: "Payments",
    items: [
      { q: "What payment methods are accepted?", a: "We accept all major credit/debit cards (Visa, Mastercard, Amex), UPI, and net banking via Stripe's secure checkout." },
      { q: "When am I charged?", a: "Your card is charged immediately upon booking confirmation. The full amount is collected upfront." },
      { q: "Is my payment secure?", a: "Absolutely. All transactions are processed by Stripe with 256-bit SSL encryption. Staynest never stores your card details." },
      { q: "Why was my bill higher than the listed price?", a: "Dynamic pricing applies urgency (±15% for bookings within 7 days) and surge factors. The final price is always shown before you confirm payment." },
    ],
  },
  {
    cat: "Cancellations & Refunds",
    items: [
      { q: "How do I cancel a booking?", a: "Go to Profile → My Bookings → select your booking → Cancel Booking. Refunds follow the cancellation policy of that listing." },
      { q: "How long do refunds take?", a: "Approved refunds are processed within 5–7 business days to your original payment method." },
      { q: "What if the property doesn't match the listing?", a: "Report it within 24 hours of check-in via WhatsApp support. We'll investigate and either rebook you or issue a full refund under our Guest Protection Policy." },
    ],
  },
  {
    cat: "Account",
    items: [
      { q: "How do I update my profile?", a: "Go to Profile → Profile tab. You can update your name, date of birth and gender. Email changes require contacting support." },
      { q: "I forgot my password. What do I do?", a: "On the login page, click 'Forgot Password'. A reset link will be sent to your registered email within a few minutes." },
      { q: "How do I delete my account?", a: "Email us at support@staynest.com with your registered email address. We'll process the request within 7 working days." },
    ],
  },
];

export default function HelpCentre() {
  const [open, setOpen] = useState({});
  const toggle = (k) => setOpen(p => ({ ...p, [k]: !p[k] }));

  return (
    <Page title="Help Centre" subtitle="Find answers to common questions about Staynest">
      {FAQS.map((section) => (
        <Section key={section.cat} title={section.cat}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {section.items.map((item, i) => {
              const k = `${section.cat}-${i}`;
              return (
                <div key={k} style={{ border: '1.5px solid #f0ebe3', borderRadius: '12px', overflow: 'hidden' }}>
                  <button onClick={() => toggle(k)} style={{ width: '100%', textAlign: 'left', padding: '16px 20px', background: open[k] ? '#fff5f3' : 'white', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', transition: 'background 0.2s' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1a1a1a' }}>{item.q}</span>
                    <span style={{ color: '#e8472a', fontSize: '1.2rem', flexShrink: 0, transition: 'transform 0.2s', transform: open[k] ? 'rotate(45deg)' : 'none' }}>+</span>
                  </button>
                  {open[k] && (
                    <div style={{ padding: '0 20px 16px', color: '#484848', fontSize: '0.9rem', lineHeight: 1.7, background: '#fff5f3' }}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      ))}
      <div style={{ background: 'linear-gradient(135deg,#e8472a,#ff6b35)', borderRadius: '16px', padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 12px' }}>Still need help?</p>
        <a href="https://wa.me/919546075903?text=Hi%20Staynest!%20I%20need%20help" target="_blank" rel="noreferrer"
          style={{ display: 'inline-block', background: 'white', color: '#e8472a', borderRadius: '50px', padding: '12px 28px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
          💬 Chat with Support
        </a>
      </div>
    </Page>
  );
}
