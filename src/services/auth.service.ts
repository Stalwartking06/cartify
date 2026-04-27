import { authApi } from "./auth.api";

export const authService = {
  login: async (form: any) => {
    const { user, accessToken, refreshToken } = await authApi({
      ...form,
      mode: "login",
    });

    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  },

  signup: async (form: any) => {
    const { user, accessToken, refreshToken } = await authApi({
      ...form,
      mode: "register",
    });

    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};