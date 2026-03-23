import axios from "axios";
import { store } from "../store/store";
import { setCredentials, clearCredentials } from "../store/slices/authSlice";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// ── Main Axios instance ───────────────────────────────────────────────────────
const api = axios.create({
  baseURL:         BASE_URL,
  withCredentials: true, // send httpOnly refresh token cookie automatically
});

// ── Request interceptor — attach access token ─────────────────────────────────
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor — silent refresh on 401 ─────────────────────────────
let isRefreshing  = false;
let failedQueue   = []; // requests waiting for refresh

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else       prom.resolve(token);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401 with TOKEN_EXPIRED code, once
    const isExpired =
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED" &&
      !originalRequest._retry;

    if (!isExpired) return Promise.reject(error);

    if (isRefreshing) {
      // Queue other requests while refresh is in flight
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing            = true;

    try {
      const { data } = await axios.post(
        `${BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const newToken = data.access_token;

      // Update Redux store with new access token (keep existing user)
      store.dispatch(
        setCredentials({
          employee:     store.getState().auth.user,
          access_token: newToken,
        })
      );

      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      store.dispatch(clearCredentials());
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;