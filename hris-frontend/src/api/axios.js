// src/api/axios.js
import axios from "axios";
import { store } from "../store";
import { setAuth, clearAuth } from "../store/authSlice";

const api = axios.create({
  baseURL: "http://localhost:3000", // your backend
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) =>
    error ? prom.reject(error) : prom.resolve(token),
  );
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      store.getState().auth.refreshToken
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = store.getState().auth.refreshToken;

      try {
        const response = await axios.post(
          "http://localhost:3000/auth/refresh",
          {
            refreshToken,
          },
        );
        const { accessToken } = response.data;
        store.dispatch(
          setAuth({
            user: store.getState().auth.user,
            accessToken,
            refreshToken,
          }),
        );
        originalRequest.headers["Authorization"] = "Bearer " + accessToken;
        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        store.dispatch(clearAuth());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
