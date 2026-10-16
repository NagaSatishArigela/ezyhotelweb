"use client";

import { useEffect } from "react";
import { refreshWebSession } from '@/lib/refresh-session';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAccessToken, selectUser, selectRole } from "@/store/selectors/authSelectors";
import { setUser, clearUser } from "@/store/authSlice";

// Silently refreshes the access token every 14 minutes (before the 15-min
// expiry) via /api/auth/refresh, which uses the httpOnly pph_refresh cookie —
// so this works even after a page reload (when Redux holds no refresh token).
// On refresh failure the session is cleared and the user is sent to /login.
const INTERVAL_MS = 30 * 1000;

export function AuthRefresher() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const role = useAppSelector(selectRole);
  const accessToken = useAppSelector(selectAccessToken);

  useEffect(() => {
    if (!user || !accessToken) return;

    const refresh = async () => {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        if (payload.exp * 1000 - Date.now() > 60000) return;
      } catch { return; }
      let res: Awaited<ReturnType<typeof refreshWebSession>>;
      try {
        res = await refreshWebSession();
      } catch {
        return; // network blip — keep the session, retry next interval
      }
      if (res.accessToken) {
        const newToken = res.accessToken;
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

    void refresh();
    const resume = () => { void refresh(); };
    const id = setInterval(resume, INTERVAL_MS);
    window.addEventListener('focus', resume);
    window.addEventListener('online', resume);
    return () => { clearInterval(id); window.removeEventListener('focus', resume); window.removeEventListener('online', resume); };
  }, [user, role, accessToken, dispatch]);

  return null;
}
