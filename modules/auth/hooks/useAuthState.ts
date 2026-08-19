"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectUser, selectIsLoading, selectIsAuthenticated, selectAccessToken, selectRefreshToken } from "@/store/selectors/authSelectors";
import { clearUser } from "@/store/authSlice";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export function useAuthState() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectIsLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const accessToken = useAppSelector(selectAccessToken);
  const refreshToken = useAppSelector(selectRefreshToken);

  const logout = async () => {
    if (refreshToken && accessToken) {
      try {
        await authApi.logout(refreshToken, accessToken);
      } catch {
        // Backend revocation best-effort — clear local state regardless
      }
    }
    await fetch("/api/session", { method: "DELETE" });
    dispatch(clearUser());
    router.push("/login");
  };

  return { user, isLoading, isAuthenticated, logout };
}
