import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";

export type UserRole = "guest" | "owner";

interface AuthState {
  user: User | null;
  role: UserRole | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  role: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{
        user: User;
        role: UserRole;
        accessToken: string;
        refreshToken: string;
      }>
    ) {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoading = false;
    },
    clearUser(state) {
      state.user = null;
      state.role = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
