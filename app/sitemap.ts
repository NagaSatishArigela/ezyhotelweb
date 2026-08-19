import type { MetadataRoute } from "next";
import { publicPropertiesApi } from "@/lib/api";

const BASE = "https://ezyhotels.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let propertyUrls: MetadataRoute.Sitemap = [];

  try {
    const result = await publicPropertiesApi.list({ limit: 500 });
    propertyUrls = result.items.map((p) => ({
      url: `${BASE}/hotels/${p.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // Backend unreachable — omit property URLs rather than include demo data
  }

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/hotels`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    ...propertyUrls,
  ];
}
