"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-24 lg:bottom-8 left-4 z-40 w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
