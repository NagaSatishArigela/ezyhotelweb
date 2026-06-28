import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setUser } from "./authSlice";
import onboardingReducer, { rehydrateOnboarding } from "./onboardingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    onboarding: onboardingReducer,
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
      const { user, role, accessToken, refreshToken } = JSON.parse(rawAuth);
      if (user && role) {
        store.dispatch(setUser({ user, role, accessToken: accessToken ?? "", refreshToken: refreshToken ?? "" }));
      }
    }
    const rawOnboarding = localStorage.getItem("pph_onboarding");
    if (rawOnboarding) {
      store.dispatch(rehydrateOnboarding(JSON.parse(rawOnboarding)));
    }
  } catch { /* corrupted storage — ignore */ }

  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  store.subscribe(() => {
    if (saveTimer) return;
    saveTimer = setTimeout(() => {
      saveTimer = null;
      const { auth, onboarding } = store.getState();
      try {
        localStorage.setItem("pph_auth", JSON.stringify({
          user: auth.user,
          role: auth.role,
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
        }));
        localStorage.setItem("pph_onboarding", JSON.stringify({
          draftId: onboarding.draftId,
          currentStep: onboarding.currentStep,
          completedSteps: onboarding.completedSteps,
          propertyType: onboarding.propertyType,
          bookingPolicy: onboarding.bookingPolicy,
          selectedAmenities: onboarding.selectedAmenities,
          status: onboarding.status,
          submissionRef: onboarding.submissionRef,
        }));
      } catch { /* storage quota */ }
    }, 300);
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
