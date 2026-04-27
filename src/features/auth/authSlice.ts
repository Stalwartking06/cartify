import { createSlice } from "@reduxjs/toolkit";
import { authService } from "../../services/auth.service";

interface AuthState {
  isLoggedIn: boolean;
  user: any;
  isAuthChecked: boolean; // 🔥 ADD THIS
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  isAuthChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.isAuthChecked = true; // 🔥
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.isAuthChecked = true;
      authService.logout(); // cleaner
    },
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
  },
});

export const { loginSuccess, logout, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;
