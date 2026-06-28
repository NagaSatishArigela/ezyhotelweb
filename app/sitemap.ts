import type { MetadataRoute } from "next";
import { hotelsData } from "@/data/hotelsData";

const BASE = "https://payperhour.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const hotels = hotelsData.map((h) => ({
    url: `${BASE}/hotels/${h.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/hotels`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    ...hotels,
  ];
}
