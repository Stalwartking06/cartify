import axios from "axios";
import { toast } from "react-hot-toast";
import { refreshTokenApi } from "./auth.api";
import { store } from "../app/store";
import { logout } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// 🔐 REQUEST INTERCEPTOR
// 🔐 REQUEST INTERCEPTOR
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔁 RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    const data = error?.response?.data;

    const message =
      data?.message || data?.error || error?.message || "Something went wrong";

    // 🔥 TOKEN REFRESH LOGIC
    if (status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const res = await refreshTokenApi();
        const token = res.token;

        if (!token) throw new Error("No token received");

        localStorage.setItem("token", token);

        originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    switch (status) {
      case 400:
      case 404:
      case 500:
        toast.error(message);
        break;

      case 401:
        toast.error("Session expired, login again");
        store.dispatch(logout());
        window.location.href = "/login";
        break;

      case 403:
        toast.error("Access denied");
        break;

      default:
        toast.error(message);
        break;
    }

    return Promise.reject(data || error);
  },
);

// 📦 RESPONSE HELPER
const responseBody = (response: any) => response?.data;

// 🔍 QUERY BUILDER
const getQueryString = (params: any) => {
  if (!params) return "";

  const filtered = Object.entries(params).reduce((acc: any, [key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});

  const query = Object.keys(filtered)
    .map((key) => `${key}=${filtered[key]}`)
    .join("&");

  return query ? `?${query}` : "";
};

// 📤 MULTIPART HEADERS
const multipartHeaders = {
  headers: { "Content-type": "multipart/form-data" },
};

// 🚀 API SERVICE (clean usage)
export const apiService = {
  get: (url: string, params?: any) =>
    api.get(url + getQueryString(params)).then(responseBody),

  post: (url: string, body = {}) => api.post(url, body).then(responseBody),

  put: (url: string, body = {}) => api.put(url, body).then(responseBody),

  delete: (url: string) => api.delete(url).then(responseBody),

  postForm: (url: string, data: any) =>
    api.post(url, data, multipartHeaders).then(responseBody),

  putForm: (url: string, data: any) =>
    api.put(url, data, multipartHeaders).then(responseBody),
};

// 📁 FORM DATA HELPER
export const createFormData = (data: any) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value as any);
  });

  return formData;
};

export default api;
