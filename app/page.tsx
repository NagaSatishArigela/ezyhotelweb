import type { Metadata } from "next";
import { HeroSection } from "@/components/server/HeroSection";
// import ExclusiveDealsLoader from "@/components/client/ExclusiveDealsLoader";
import { WhyChooseSection, PerfectForSection, HowItWorksSection } from "@/components/server/HomeSections";
import { TrendingCities } from "@/components/server/TrendingCities";
import { Testimonials } from "@/components/server/Testimonials";
import { Footer } from "@/components/server/Footer";

export const metadata: Metadata = {
  title: "EzyHotels.com — Book Hotels by the Hour in India. Pay Less, Stay More",
  description: "Flexible hourly hotel bookings across Bangalore, Mumbai, Delhi, Hyderabad & more. Pay Less, Stay More — pay only for hours you use. 50+ verified properties.",
  openGraph: {
    url: "https://ezyhotels.com",
    title: "EzyHotels.com — Book Hotels by the Hour",
    description: "Pay Less, Stay More. Book 3h, 6h, 12h or 24h stays at top hotels across India.",
    images: [{ url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80", width: 1200, height: 630, alt: "EzyHotels.com — Book Hotels by the Hour" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen">
      <main>
        <HeroSection />
        {/* Exclusive Deals — hidden for now; re-enable when deals are ready */}
        {/* <ExclusiveDealsLoader /> */}
        <WhyChooseSection />
        <PerfectForSection />
        <TrendingCities />
        <Testimonials />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
}
