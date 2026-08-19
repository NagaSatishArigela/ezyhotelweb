"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/client/TourismMap"), { ssr: false });

export default function HotelLocationMap({
  hotelName,
  lat,
  lng,
}: {
  hotelName: string;
  lat?: number;
  lng?: number;
}) {
  return <Map hotelName={hotelName} lat={lat} lng={lng} />;
}
