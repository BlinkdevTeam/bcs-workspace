import axios from "axios";
import store from "../store/store";
import { logout, setCredentials } from "../store/slices/authSlice";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Call refresh endpoint — sends httpOnly cookie automatically
        const res = await api.post("/auth/refresh");
        const newToken = res.data.accessToken;

        // Update Redux store with new token
        store.dispatch(setCredentials({
          token: newToken,
          user: store.getState().auth.user,
        }));

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        // Refresh failed → clear store and redirect to login
        store.dispatch(logout());
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;