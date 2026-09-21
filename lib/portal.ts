// Production must never inherit the local development portal URL.
export const PORTAL_URL = (
  process.env.NODE_ENV === "production"
    ? "https://ezyhotels-portal.netlify.app"
    : process.env.NEXT_PUBLIC_PORTAL_URL || "http://localhost:3000"
).replace(/\/+$/, "");
