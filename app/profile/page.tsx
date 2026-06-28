"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  Building2,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectUser, selectRole, selectIsAuthenticated } from "@/store/selectors/authSelectors";
import { useAuthState } from "@/modules/auth/hooks/useAuthState";

export default function ProfilePage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const role = useAppSelector(selectRole);
  const { logout } = useAuthState();

  useEffect(() => {
    if (!isAuthenticated) window.location.href = "/login";
  }, [isAuthenticated]);

  if (!user) return null;

  const displayName = user.name?.trim() || user.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const isOwner = role === "owner";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

        {/* Avatar + name */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-bold shadow">
            {initial}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${
              isOwner ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
            }`}>
              {isOwner ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
              {isOwner ? "Property Owner" : "Guest"}
            </span>
          </div>
        </div>

        {/* Account details */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Account Details</h2>

          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Mail className="w-4 h-4 text-orange-500 shrink-0" />
            <span>{user.email}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Phone className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-gray-400 italic">Registered via phone OTP</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
            <span className="text-green-600 font-medium">Phone verified</span>
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
          <Link
            href="/my-bookings"
            className="flex items-center justify-between px-6 py-4 hover:bg-orange-50 transition-colors rounded-t-2xl"
          >
            <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
              <CalendarDays className="w-4 h-4 text-orange-500" />
              My Bookings
            </div>
            <span className="text-gray-400 text-xs">→</span>
          </Link>

          {/* Owner operations live in the partner portal — link there */}
          {isOwner ? (
            <a
              href={`${process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:3001"}/login`}
              className="flex items-center justify-between px-6 py-4 hover:bg-orange-50 transition-colors"
            >
              <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <Building2 className="w-4 h-4 text-orange-500" />
                Manage my property
              </div>
              <span className="text-gray-400 text-xs">↗ Partner portal</span>
            </a>
          ) : (
            <Link
              href="/register?intent=owner"
              className="flex items-center justify-between px-6 py-4 hover:bg-orange-50 transition-colors"
            >
              <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <Building2 className="w-4 h-4 text-orange-500" />
                List your property
              </div>
              <span className="text-gray-400 text-xs">→</span>
            </Link>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-b-2xl"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}
