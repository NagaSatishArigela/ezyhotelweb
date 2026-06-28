"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectUser, selectIsLoading, selectIsAuthenticated } from "@/store/selectors/authSelectors";
import { clearUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";

export function useAuthState() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectIsLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const logout = async () => {
    await fetch("/api/session", { method: "DELETE" });
    dispatch(clearUser());
    router.push("/login");
  };

  return { user, isLoading, isAuthenticated, logout };
}
