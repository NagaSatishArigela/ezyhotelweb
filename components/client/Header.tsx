"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { User, Phone, Building2, Menu, CalendarDays } from "lucide-react";
import { EzyLogo } from "@/components/brand/EzyLogo";
import { useAuthState } from "@/modules/auth/hooks/useAuthState";
import { useAppSelector } from "@/store/hooks";
import { selectRole } from "@/store/selectors/authSelectors";

// Owner operations live in the partner portal (a separate origin), not in this
// guest storefront — /owner/* routes were removed.
const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:3000";

// framer-motion only loads when menu opens — keeps it out of the initial bundle
const MobileDrawer = dynamic(() => import("@/components/client/MobileDrawer"), { ssr: false });

const cityLandmarks: Record<string, string> = {
  Bangalore: "https://thumbs.dreamstime.com/b/city-skyline-iconic-buildings-landmarks-bangalore-stylized-cityscape-silhouette-featuring-famous-architecture-india-402793356.jpg",
  Chennai: "https://thumbs.dreamstime.com/b/chennai-city-skyline-iconic-buildings-landmarks-beach-temples-colonial-structures-402798536.jpg",
  Delhi: "https://www.shutterstock.com/image-vector/vector-new-delhi-skyline-travel-260nw-2709169335.jpg",
  Gurgaon: "https://www.shutterstock.com/image-vector/gurugram-india-city-skyline-illustrated-260nw-2666115309.jpg",
  Hyderabad: "https://thumbs.dreamstime.com/b/hyderabad-city-skyline-black-white-silhouette-vector-illustration-simple-flat-concept-tourism-presentation-banner-placard-70685316.jpg",
  Mumbai: "https://www.shutterstock.com/image-vector/mumbai-skyline-silhouette-minimalist-city-260nw-2653805501.jpg",
  Pune: "https://www.shutterstock.com/image-illustration/pune-skyline-black-white-silhouette-260nw-430226428.jpg",
};

const cities = ["Bangalore", "Chennai", "Delhi", "Gurgaon", "Hyderabad", "Mumbai", "Pune"];

function useListPropertyHref() {
  const role = useAppSelector(selectRole);
  if (role !== "owner") return { href: "/register?intent=owner", label: "List your property", sub: "Start earning in 30 mins" };
  // Owners manage listings in the partner portal — link there instead of the
  // removed /owner/* routes (which proxy.ts bounces to /register → loop).
  return { href: `${PORTAL_URL}/login`, label: "My Property", sub: "Go to partner portal" };
}

function TopBar() {
  const { user, logout } = useAuthState();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { href: listPropertyHref, label: listLabel, sub: listSub } = useListPropertyHref();

  const displayName = user?.name?.trim() || user?.email?.trim() || "Guest";
  const displayInitial = displayName.charAt(0).toUpperCase();

  const openDropdown = () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); setShowDropdown(true); };
  const scheduleClose = () => { closeTimerRef.current = setTimeout(() => setShowDropdown(false), 150); };

  return (
    <>
      <div className="border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="EzyHotels.com home">
            <EzyLogo />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href={listPropertyHref} className="flex items-center gap-3 group hover:bg-orange-100 px-4 py-2 rounded-xl transition-all">
              <Building2 className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="text-sm font-bold text-gray-800">{listLabel}</p>
                <p className="text-xs text-orange-500">{listSub}</p>
              </div>
            </Link>

            <a href="tel:+919492691010" className="flex items-center gap-2 hover:text-orange-600 transition-colors group">
              <Phone className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-orange-600">+91 94926 91010</span>
            </a>

            {user ? (
              <div className="relative" onMouseEnter={openDropdown} onMouseLeave={scheduleClose}>
                <button className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-orange-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-md">{displayInitial}</div>
                  <p className="font-bold text-gray-800">{displayName}</p>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 top-full w-52 bg-white rounded-xl shadow-2xl border border-orange-200 py-2 z-50" onMouseEnter={openDropdown} onMouseLeave={scheduleClose}>
                    <button onClick={() => { router.push("/profile"); setShowDropdown(false); }} className="w-full text-left px-5 py-3 text-sm font-medium text-gray-700 hover:bg-orange-100 hover:text-orange-600 transition-colors">Profile</button>
                    <button onClick={() => { router.push("/my-bookings"); setShowDropdown(false); }} className="w-full text-left px-5 py-3 text-sm font-medium text-gray-700 hover:bg-orange-100 hover:text-orange-600 transition-colors flex items-center gap-2"><CalendarDays className="w-4 h-4" /> My Bookings</button>
                    <hr className="border-orange-100 my-1" />
                    <button onClick={() => { logout(); setShowDropdown(false); }} className="w-full text-left px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-3 px-6 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 hover:shadow-xl transition-all shadow-lg">
                <User className="w-5 h-5" /><span>Login / Signup</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4 md:hidden">
            {user ? (
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-md">{displayInitial}</div>
            ) : (
              <Link href="/login" className="px-5 py-2 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 shadow-lg text-sm">Login</Link>
            )}
            <button onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation menu" aria-expanded={mobileMenuOpen} className="p-2 hover:bg-orange-100 rounded-xl transition">
              <Menu className="w-7 h-7 text-orange-600" />
            </button>
          </div>
        </div>
      </div>

      {/* MobileDrawer: dynamically imported — framer-motion only loads when needed */}
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        listPropertyHref={listPropertyHref}
        listLabel={listLabel}
        listSub={listSub}
        isLoggedIn={!!user}
        onLogout={logout}
      />
    </>
  );
}

function CityNavigation() {
  return (
    <div className="bg-orange-50 border-b border-orange-200 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
        <nav className="flex items-center gap-8 overflow-x-auto scrollbar-hide" aria-label="Browse by city">
          {cities.map((city) => (
            <Link key={city} href={`/hotels?city=${city}`} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors whitespace-nowrap group">
              <Image src={cityLandmarks[city]} alt={`${city} landmark`} width={24} height={24} className="object-contain rounded opacity-80 group-hover:opacity-100 transition" />
              <span>{city}</span>
            </Link>
          ))}
        </nav>
        <Link href="/hotels" className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors whitespace-nowrap ml-4">All Cities →</Link>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const showCityNav = pathname === "/" || pathname === "/hotels";
  return (
    <header className="flex flex-col w-full bg-white shadow-sm sticky top-0 z-50">
      <TopBar />
      {showCityNav && <CityNavigation />}
    </header>
  );
}
