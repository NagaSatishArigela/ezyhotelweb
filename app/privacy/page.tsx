import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How EzyHotels.com collects, uses, and protects your personal information.",
};

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "1. Information We Collect",
    body: [
      "We collect information you provide when creating an account or making a booking, including your name, phone number, email address, and government ID type.",
      "We also collect booking details and, where applicable, payment status returned by our payment processor.",
    ],
  },
  {
    heading: "2. How We Use Your Information",
    body: [
      "Your information is used to process bookings, communicate confirmations and updates, provide customer support, and meet legal and check-in requirements.",
    ],
  },
  {
    heading: "3. Sharing With Properties",
    body: [
      "To fulfil a booking, we share the details necessary for check-in (such as your name and booking reference) with the property you have booked.",
    ],
  },
  {
    heading: "4. Data Retention & Security",
    body: [
      "We retain personal information only as long as necessary for the purposes described here or as required by law, and apply reasonable safeguards to protect it.",
    ],
  },
  {
    heading: "5. Your Rights",
    body: [
      "You may request access to, correction of, or deletion of your personal information by contacting us, subject to legal and operational limits.",
    ],
  },
  {
    heading: "6. Contact",
    body: [
      "For privacy questions or requests, contact us at privacy@ezyhotels.com.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-16">
      <div className="h-1 bg-orange-600 w-full" />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
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
