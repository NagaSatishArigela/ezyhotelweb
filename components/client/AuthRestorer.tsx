"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser, selectRole, selectAccessToken } from "@/store/selectors/authSelectors";
import { setUser, clearUser } from "@/store/authSlice";

// Runs once on mount. If Redux has a user (rehydrated from localStorage) but no
// access token (tokens are never persisted to localStorage — XSS safety), it
// recovers a live token from the httpOnly pph_session cookie via /api/auth/me
// and merges it onto the existing user. If the cookie is gone/expired it tries
// a silent refresh; only if that also fails does it clear the session.
export function AuthRestorer() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const role = useAppSelector(selectRole);
  const token = useAppSelector(selectAccessToken);

  useEffect(() => {
    if (!user || token) return;

    const restore = async () => {
      let accessToken: string | null = null;

      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        accessToken = (await meRes.json()).accessToken ?? null;
      } else {
        // Access cookie expired — try the refresh cookie before giving up.
        const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });
        if (refreshRes.ok) accessToken = (await refreshRes.json()).accessToken ?? null;
      }

      if (accessToken) {
        dispatch(setUser({ user, role: role ?? "guest", accessToken, refreshToken: "" }));
      } else {
        dispatch(clearUser());
      }
    };

    restore().catch(() => dispatch(clearUser()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
