"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAccessToken, selectUser, selectRole } from "@/store/selectors/authSelectors";
import { setUser, clearUser } from "@/store/authSlice";

// Silently refreshes the access token every 14 minutes (before the 15-min
// expiry) via /api/auth/refresh, which uses the httpOnly pph_refresh cookie —
// so this works even after a page reload (when Redux holds no refresh token).
// On refresh failure the session is cleared and the user is sent to /login.
const INTERVAL_MS = 14 * 60 * 1000;

export function AuthRefresher() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const role = useAppSelector(selectRole);
  const accessToken = useAppSelector(selectAccessToken);

  useEffect(() => {
    if (!user || !accessToken) return;

    const refresh = async () => {
      let res: Response;
      try {
        res = await fetch("/api/auth/refresh", { method: "POST" });
      } catch {
        return; // network blip — keep the session, retry next interval
      }
      if (res.ok) {
        const { accessToken: newToken } = await res.json();
        dispatch(setUser({ user, role: role ?? "guest", accessToken: newToken, refreshToken: "" }));
        return;
      }
      // Only a definitive 401 (refresh token invalid/expired) ends the session;
      // transient 502s are ignored so a backend hiccup doesn't log users out.
      if (res.status === 401) {
        dispatch(clearUser());
        window.location.href = "/login";
      }
    };

    const id = setInterval(refresh, INTERVAL_MS);
    return () => clearInterval(id);
  }, [user, role, accessToken, dispatch]);

  return null;
}
