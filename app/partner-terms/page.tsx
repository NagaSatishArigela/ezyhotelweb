import type { Metadata } from "next";
import Link from "next/link";
import { partnerTermsIntroduction, partnerTermsSections } from "@/data/partnerTerms";

export const metadata: Metadata = {
  title: "Partner Terms & Conditions",
  description: "EzyHotels.com Property Listing Legal Declaration and Compliance Undertaking for property owners and authorised representatives.",
};

export default function PartnerTermsPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-16">
      <div className="h-1 w-full bg-orange-600" />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8 space-y-4">
          <p className="text-sm font-semibold text-orange-700">For property owners and authorised representatives</p>
          <h1 className="text-3xl font-bold text-gray-900">Partner Terms &amp; Conditions</h1>
          <p className="text-lg font-semibold text-gray-800">Property Listing – Legal Declaration &amp; Compliance Undertaking</p>
          <p className="text-sm leading-relaxed text-gray-600">{partnerTermsIntroduction}</p>
        </header>

        <details className="mb-8 rounded-xl border border-gray-200 bg-white p-5">
          <summary className="cursor-pointer font-semibold text-gray-900">Contents — all 38 sections</summary>
          <nav aria-label="Partner terms sections" className="mt-4">
            <ol className="space-y-2">
              {partnerTermsSections.map(section => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-sm text-orange-700 underline-offset-4 hover:underline">
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </details>

        <div className="space-y-8">
          {partnerTermsSections.map(section => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className="scroll-mt-48 space-y-3">
              <h2 id={`${section.id}-heading`} className="text-lg font-bold text-gray-900">{section.heading}</h2>
              {section.blocks.map((block, index) => {
                if (block.type === "paragraph") {
                  return <p key={index} className="text-sm leading-relaxed text-gray-600">{block.text}</p>;
                }
                const List = block.type === "numbered" ? "ol" : "ul";
                return (
                  <List key={index} className={`space-y-2 pl-6 text-sm leading-relaxed text-gray-600 ${block.type === "numbered" ? "list-decimal" : "list-disc"}`}>
                    {block.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
                  </List>
                );
              })}
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-5 border-t border-gray-200 pt-6 text-sm font-medium text-orange-700">
          <Link href="/terms" className="hover:underline">Guest booking terms</Link>
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/" className="hover:underline">Back to Home</Link>
        </div>
      </article>
    </div>
  );
}

