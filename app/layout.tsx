import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/client/StoreProvider";
import { Header } from "@/components/client/Header";
import { ToastProvider } from "@/components/client/Toast";
import BackToTop from "@/components/client/BackToTop";
import { AuthRestorer } from "@/components/client/AuthRestorer";
import { AuthRefresher } from "@/components/client/AuthRefresher";

// 3 weights only — removes ~80KB of font data vs 5 weights
const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["400", "600", "800"],
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F05A00",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ezyhotels.com"),
  title: {
    template: "%s | EzyHotels.com",
    default: "EzyHotels.com — Book Hotels by the Hour. Pay Less, Stay More",
  },
  description: "Flexible hotel bookings by the hour. Pay Less, Stay More — pay only for the hours you use.",
  openGraph: { siteName: "EzyHotels.com", type: "website" },
  // Explicit robots for indexability
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <head>
        {/* Preconnect to image CDNs — reduces LCP by 100-300ms on mobile */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://thumbs.dreamstime.com" />
        <link rel="dns-prefetch" href="https://cf.bstatic.com" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
        <link rel="dns-prefetch" href="https://raw.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
      </head>
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <AuthRestorer />
          <AuthRefresher />
          <ToastProvider>
            <Header />
            {children}
            <BackToTop />
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
