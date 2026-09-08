import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setUser } from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Manual localStorage subscription — replaces redux-persist (~30KB gz saved)
// Fires on every state change; debounced by the event loop
if (typeof window !== "undefined") {
  // Rehydrate synchronously before the first render so client components
  // (e.g. /my-bookings, /profile) don't see a transient unauthenticated
  // state and bounce to /login on a full page load.
  try {
    const rawAuth = localStorage.getItem("pph_auth");
    if (rawAuth) {
      const { user, role } = JSON.parse(rawAuth);
      if (user && role) {
        // Tokens are never persisted to localStorage (XSS protection).
        // AuthRestorer will call GET /api/auth/me to recover the token from
        // the httpOnly pph_session cookie on the first render after reload.
        store.dispatch(setUser({ user, role, accessToken: "", refreshToken: "" }));
      }
    }
  } catch { /* corrupted storage — ignore */ }

  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  store.subscribe(() => {
    if (saveTimer) return;
    saveTimer = setTimeout(() => {
      saveTimer = null;
      const { auth } = store.getState();
      try {
        localStorage.setItem("pph_auth", JSON.stringify({
          user: auth.user,
          role: auth.role,
        }));
      } catch { /* storage quota */ }
    }, 300);
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
