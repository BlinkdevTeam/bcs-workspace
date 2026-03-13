import axios from "axios";
import store from "../store/store";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true, // required for httpOnly cookies (refresh token)
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor ───────────────────────────────────────────────────────
// Attaches the access token to every request automatically
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
// If a request returns 401 (token expired), automatically try to refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired — redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;