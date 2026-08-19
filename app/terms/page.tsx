import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms and conditions governing use of EzyHotels.com hourly hotel bookings.",
};

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "1. Acceptance of Terms",
    body: [
      "By creating an account or making a booking on EzyHotels.com, you agree to be bound by these Terms & Conditions and our Privacy Policy.",
    ],
  },
  {
    heading: "2. Bookings & Payments",
    body: [
      "All bookings are subject to availability and confirmation. Prices shown include applicable taxes unless stated otherwise.",
      "A booking is only confirmed once payment is successfully processed and you receive a booking reference.",
    ],
  },
  {
    heading: "3. Check-in Requirements",
    body: [
      "A valid government-issued photo ID (Aadhaar, Passport, Driving License, or Voter ID) is mandatory for every guest at check-in.",
      "The property reserves the right to refuse entry where valid identification is not presented.",
    ],
  },
  {
    heading: "4. Cancellations & Refunds",
    body: [
      "Free cancellation is available up to 1 hour before the scheduled check-in time. No refund is applicable after that window.",
      "Where a refund is due, it is initiated to the original payment method per the cancellation policy shown at booking.",
    ],
  },
  {
    heading: "5. Guest Conduct",
    body: [
      "Guests must comply with property rules and applicable law. EzyHotels.com is a booking platform and is not responsible for the conduct of guests or properties.",
    ],
  },
  {
    heading: "6. Contact",
    body: [
      "For questions about these terms, contact us at support@ezyhotels.com.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-16">
      <div className="h-1 bg-orange-600 w-full" />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms &amp; Conditions</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: 23 July 2026</p>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.heading} className="space-y-2">
              <h2 className="text-lg font-bold text-gray-900">{section.heading}</h2>
              {section.body.map((para, i) => (
                <p key={i} className="text-sm text-gray-600 leading-relaxed">{para}</p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-10">
          <Link href="/" className="text-sm font-medium text-orange-600 hover:text-orange-700">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
