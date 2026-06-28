"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/client/TourismMap"), { ssr: false });

export default function HotelLocationMap({ hotelName }: { hotelName: string }) {
  return <Map hotelName={hotelName} />;
}
