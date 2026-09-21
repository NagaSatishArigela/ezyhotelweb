"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectUser, selectIsLoading, selectIsAuthenticated } from "@/store/selectors/authSelectors";
import { clearUser } from "@/store/authSlice";
import { useToast } from "@/components/client/Toast";
import { useRouter } from "next/navigation";

export function useAuthState() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectIsLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { error: showError } = useToast();

  const logout = async () => {
    try {
      const response = await fetch("/api/session", { method: "DELETE" });
      if (!response.ok) throw new Error('Revocation failed');
    } catch {
      showError('Unable to sign out securely. Please retry.');
      return;
    }
    dispatch(clearUser());
    router.push("/login");
  };

  return { user, isLoading, isAuthenticated, logout };
}
