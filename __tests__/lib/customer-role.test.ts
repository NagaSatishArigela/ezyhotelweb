import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import reducer, { setUser, clearUser } from "@/store/authSlice";
import { loadAuth, saveAuth, saveAuthImmediate } from "@/lib/persist";
import type { MeResponse, ServerUser } from "@/lib/api";
const user = { id: 1, name: "Customer", username: "customer", email: "customer@test.com" };
const storage = new Map<string, string>();
beforeEach(() => {
  storage.clear();
  vi.stubGlobal("window", {});
  vi.stubGlobal("localStorage", { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) });
});
afterEach(() => vi.unstubAllGlobals());
describe("customer-only web role", () => {
  it.each(["owner", "guest", "SUPER_ADMIN"])("normalizes persisted %s without restoring stored tokens", role => {
    storage.set("pph_auth", JSON.stringify({ user, role, accessToken: "old-token" }));
    expect(loadAuth()).toEqual({ user, role: "guest" });
  });
  it("keeps logged-out state without a role", () => {
    storage.set("pph_auth", JSON.stringify({ user: null, role: "owner" }));
    expect(loadAuth()).toEqual({ user: null, role: null });
  });
  it("ignores corrupted storage", () => {
    storage.set("pph_auth", "invalid-json");
    expect(loadAuth()).toBeUndefined();
  });
  it("never restores ownership from a legacy Redux action", () => {
    const action = { type: setUser.type, payload: { user, role: "owner", accessToken: "token", refreshToken: "refresh" } };
    const state = reducer(undefined, action);
    expect(state.role).toBe("guest");
    expect(state.user).toEqual(user);
    expect(reducer(state, clearUser()).role).toBeNull();
  });
  it("persists only customer identity through both save paths", () => {
    saveAuth({ user, role: "guest" });
    expect(JSON.parse(storage.get("pph_auth")!)).toEqual({ user, role: "guest" });
    saveAuthImmediate({ user, role: "guest", accessToken: "token", refreshToken: "refresh" });
    expect(JSON.parse(storage.get("pph_auth")!)).toEqual({ user, role: "guest" });
  });
  it("accepts SUPPORT in both backend user contracts", () => {
    const role: ServerUser["globalRole"] = "SUPPORT";
    const profile: MeResponse = { id: "id", email: "support@test.com", phone: "", globalRole: role };
    expect(profile.globalRole).toBe("SUPPORT");
  });
});
