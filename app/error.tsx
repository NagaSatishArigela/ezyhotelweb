"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          An unexpected error occurred. Our team has been notified. Please try again or go back home.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link href="/" className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
            <Home className="w-4 h-4" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
