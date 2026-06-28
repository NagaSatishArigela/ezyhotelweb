import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: { root: __dirname },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cf.bstatic.com" },
      { protocol: "https", hostname: "thumbs.dreamstime.com" },
      { protocol: "https", hostname: "content.paulreiffer.com" },
      { protocol: "https", hostname: "www.christravelblog.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "unpkg.com" },
      { protocol: "https", hostname: "www.shutterstock.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
