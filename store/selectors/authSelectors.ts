import type { RootState } from "@/store";

export const selectUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectIsAuthenticated = (state: RootState) => state.auth.user !== null;
export const selectRole = (state: RootState) => state.auth.role;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectIsOwner = (state: RootState) => state.auth.role === "owner";
