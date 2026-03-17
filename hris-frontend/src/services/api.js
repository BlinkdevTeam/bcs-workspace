// src/services/api.js
import axios from "axios";

// We'll inject the AuthContext from App / AuthProvider
let authContext = null;
export const setAuthContext = (ctx) => {
  authContext = ctx;
};

// Use API URL from .env
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = authContext?.token; // get access token from AuthContext
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Call refreshToken from AuthContext
        const newToken = await authContext.refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        // Refresh failed → logout user
        authContext.logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
