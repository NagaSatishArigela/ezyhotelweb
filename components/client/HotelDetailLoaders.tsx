"use client";

import dynamic from "next/dynamic";

// Lazy-load heavy interactive components on hotel detail page
// — keeps them out of the critical SSG bundle
export const HotelGalleryLazy = dynamic(
  () => import("@/components/client/HotelGallery"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] md:h-[450px] bg-gray-200 rounded-2xl animate-pulse" />
    ),
  }
);

export const HotelBookingPanelLazy = dynamic(
  () => import("@/components/client/HotelBookingPanel"),
  { ssr: false }
);

export const RealHotelBookingPanelLazy = dynamic(
  () => import("@/components/client/RealHotelBookingPanel"),
  { ssr: false }
);
