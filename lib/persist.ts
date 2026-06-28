// Lightweight localStorage persistence — replaces redux-persist (~30KB gz saved)

const AUTH_KEY = "pph_auth";
const ONBOARDING_KEY = "pph_onboarding";

function safeRead<T>(key: string): T | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

function safeWrite(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota exceeded */ }
}

export interface PersistedAuth {
  user: import("@/types").User | null;
  role: "guest" | "owner" | null;
}

export interface PersistedAuthFull extends PersistedAuth {
  accessToken: string | null;
  refreshToken: string | null;
}

export interface PersistedOnboarding {
  draftId: string | null;
  currentStep: number;
  completedSteps: number[];
  propertyType: string;
  bookingPolicy: string;
  selectedAmenities: string[];
  status: string;
}

export function loadAuth(): PersistedAuth | undefined {
  return safeRead<PersistedAuth>(AUTH_KEY);
}

export function loadOnboarding(): PersistedOnboarding | undefined {
  return safeRead<PersistedOnboarding>(ONBOARDING_KEY);
}

export function saveAuth(state: PersistedAuth) {
  safeWrite(AUTH_KEY, state);
}

// Synchronous write used right before a full-page navigation (window.location.href).
// Tokens are intentionally NOT written to localStorage — they are XSS-readable.
// Only user identity (name, role) is persisted; the session cookie carries the
// access token via the httpOnly pph_session mechanism.
export function saveAuthImmediate(state: PersistedAuthFull) {
  const safe: PersistedAuth = { user: state.user, role: state.role };
  safeWrite(AUTH_KEY, safe);
}

export function saveOnboarding(state: PersistedOnboarding) {
  safeWrite(ONBOARDING_KEY, state);
}

export function clearAuth() {
  if (typeof window !== "undefined") localStorage.removeItem(AUTH_KEY);
}
