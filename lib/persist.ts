// Lightweight localStorage persistence — replaces redux-persist (~30KB gz saved)

const AUTH_KEY = "pph_auth";

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
  role: import("@/store/authSlice").UserRole | null;
}

export interface PersistedAuthFull extends PersistedAuth {
  accessToken: string | null;
  refreshToken: string | null;
}

export function loadAuth(): PersistedAuth | undefined {
  const saved = safeRead<PersistedAuth>(AUTH_KEY);
  if (!saved) return undefined;
  // Old owner labels are presentation state, never proof of hotel membership.
  return { user: saved.user ?? null, role: saved.user ? "guest" : null };
}

export function saveAuth(state: PersistedAuth) {
  safeWrite(AUTH_KEY, { user: state.user, role: state.user ? "guest" : null });
}

// Synchronous write used right before a full-page navigation (window.location.href).
// Tokens are intentionally NOT written to localStorage — they are XSS-readable.
// Only user identity (name, role) is persisted; the session cookie carries the
// access token via the httpOnly pph_session mechanism.
export function saveAuthImmediate(state: PersistedAuthFull) {
  const safe: PersistedAuth = { user: state.user, role: state.user ? "guest" : null };
  safeWrite(AUTH_KEY, safe);
}

export function clearAuth() {
  try { if (typeof window !== "undefined") localStorage.removeItem(AUTH_KEY); } catch { /* Storage disabled. */ }
}
