// src/services/api.js
import axios from "axios";
import { store } from "../store";
import { refreshSession } from "../store/authSlice";

// Kept for backwards compatibility. Nothing calls this today; the login token is read
// straight from the Redux store below.
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

// REQUEST INTERCEPTOR: attach the logged-in user's access token
api.interceptors.request.use(
  (config) => {
    const token = authContext?.token || store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR: on a 401, renew the session once and retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        let newToken;
        if (authContext?.refreshToken) {
          newToken = await authContext.refreshToken();
        } else {
          const data = await store.dispatch(refreshSession()).unwrap();
          newToken = data.accessToken;
        }
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        if (authContext?.logout) authContext.logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
