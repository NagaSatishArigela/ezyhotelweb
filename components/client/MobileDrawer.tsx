"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X, Building2, CalendarDays, Phone } from "lucide-react";

const drawerVariants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
  exit: { x: "100%", transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
};
const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const itemVariants = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } };

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

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  listPropertyHref: string;
  listLabel: string;
  listSub: string;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function MobileDrawer({ open, onClose, listPropertyHref, listLabel, listSub, isLoggedIn, onLogout }: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 md:hidden"
          initial="hidden" animate="visible" exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        >
          <motion.div
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl flex flex-col"
            variants={drawerVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-orange-200">
              <h2 className="text-xl font-bold text-orange-600">Menu</h2>
              <button onClick={onClose} aria-label="Close navigation menu" className="p-2 hover:bg-orange-100 rounded-xl transition">
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }}>
                <h3 className="text-sm font-bold text-gray-600 mb-4">Popular Cities</h3>
                <div className="space-y-2">
                  {cities.map((city) => (
                    <motion.div key={city} variants={itemVariants}>
                      <Link href={`/hotels?city=${city}`} onClick={onClose} className="flex items-center gap-4 py-3 px-2 text-gray-800 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition">
                        <Image src={cityLandmarks[city]} alt={`${city} landmark`} width={40} height={40} className="object-contain rounded" />
                        <span className="font-medium text-lg">{city}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <hr className="border-orange-200" />

              <motion.div className="space-y-2" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                <motion.div variants={itemVariants}>
                  <Link href={listPropertyHref} onClick={onClose} className="flex items-center gap-4 py-3 hover:bg-orange-50 rounded-xl px-4 transition">
                    <Building2 className="w-6 h-6 text-orange-500" />
                    <div><p className="font-bold text-sm">{listLabel}</p><p className="text-xs text-orange-500">{listSub}</p></div>
                  </Link>
                </motion.div>
                {isLoggedIn && (
                  <motion.div variants={itemVariants}>
                    <Link href="/my-bookings" onClick={onClose} className="flex items-center gap-4 py-3 hover:bg-orange-50 rounded-xl px-4 transition">
                      <CalendarDays className="w-6 h-6 text-orange-500" />
                      <div><p className="font-bold text-sm">My Bookings</p><p className="text-xs text-orange-500">View & manage your stays</p></div>
                    </Link>
                  </motion.div>
                )}
                <motion.div variants={itemVariants}>
                  <a href="tel:+919492691010" className="flex items-center gap-4 py-3 hover:bg-orange-50 rounded-xl px-4 transition">
                    <Phone className="w-6 h-6 text-orange-500" />
                    <div><p className="font-bold text-sm">+91 94926 91010</p><p className="text-xs text-orange-500">Call us 24/7</p></div>
                  </a>
                </motion.div>
              </motion.div>

              {isLoggedIn && (
                <button onClick={() => { onLogout(); onClose(); }} className="w-full py-3 text-left px-4 font-medium text-red-600 hover:bg-red-50 rounded-xl transition">
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
