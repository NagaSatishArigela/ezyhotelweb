import Link from "next/link";
import { SearchX, Home, Hotel } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-orange-500 mb-4 tracking-tighter">404</div>
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <SearchX className="w-8 h-8 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link href="/hotels" className="flex items-center gap-2 px-6 py-3 border border-orange-200 text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors">
            <Hotel className="w-4 h-4" /> Browse Hotels
          </Link>
        </div>
      </div>
    </div>
  );
}
