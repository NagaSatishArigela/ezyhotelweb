"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

let iconsFixed = false;
const fixLeafletIcons = () => {
  if (iconsFixed) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
  iconsFixed = true;
};

const hotelIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface TourismMapProps {
  lat?: number;
  lng?: number;
  hotelName: string;
}

export default function TourismMap({ lat = 18.922, lng = 72.8347, hotelName }: TourismMapProps) {
  useEffect(() => { fixLeafletIcons(); }, []);

  const position: [number, number] = [lat, lng];

  return (
    <MapContainer center={position} zoom={14} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Only the real property marker — no fabricated "nearby" POIs. */}
      <Marker position={position} icon={hotelIcon}>
        <Popup>
          <div className="font-bold text-sm">{hotelName}</div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
