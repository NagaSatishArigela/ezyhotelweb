import Link from "next/link";
import { PORTAL_URL } from "@/lib/portal";
import { EzyMark } from "@/components/brand/EzyLogo";


export function Footer() {
  return (
    <footer className="bg-brand-black text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <EzyMark size={34} dark />
              <span className="text-xl font-extrabold tracking-tight">
                <span className="text-brand-orange">Ezy</span>Hotels
                <span className="text-brand-orange">.com</span>
              </span>
            </Link>
            <p className="text-gray-300 font-semibold leading-relaxed mb-4">Pay Less, Stay More.</p>
            <p className="text-sm text-gray-500">
              Book hotels by the hour with EzyHotels.com — a flexible, affordable, and modern way to stay.
            </p>
          </div>

          <div>
            <h5 className="text-lg font-bold mb-6">Explore</h5>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link href="/hotels" className="hover:text-brand-orange transition-colors">Featured Hotels</Link></li>
              <li><a href="/#trending-cities" className="hover:text-brand-orange transition-colors">Trending Cities</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-lg font-bold mb-6">Support</h5>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><a href="mailto:support@ezyhotels.com" className="hover:text-brand-orange transition-colors">Get help</a></li>
              <li><a href="tel:+919492691010" className="hover:text-brand-orange transition-colors">Contact Us</a></li>
              <li><Link href="/terms" className="hover:text-brand-orange transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-orange transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-lg font-bold mb-6">List your property</h5>
            <p className="text-gray-400 mb-4">Manage your property and bookings in our partner portal.</p>
            <a href={`${PORTAL_URL}/login`} className="text-brand-orange hover:underline">Open partner portal</a>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm font-medium">
            © 2026 EzyHotels.com. All rights reserved. Built with ❤️ for travelers.
          </p>
          <a href="https://wa.me/919492691010" className="text-gray-400 hover:text-brand-orange">Contact us on WhatsApp</a>
        </div>
      </div>
    </footer>
  );
}
