import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/hotels", "/hotels/"],
        disallow: ["/api/", "/login", "/register", "/booking/", "/my-bookings", "/profile", "/sso"],
      },
    ],
    sitemap: "https://ezyhotels.com/sitemap.xml",
  };
}
