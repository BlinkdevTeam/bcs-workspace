// Request helper for the Time & Leave screens.
// Uses the login that HRIS actually keeps in Redux (auth.token) and, on a 401,
// renews it once through the existing refreshSession thunk, then retries.
import axios from "axios";
import { store } from "../../store";
import { refreshSession } from "../../store/authSlice";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && original && !original._retried) {
      original._retried = true;
      try {
        const data = await store.dispatch(refreshSession()).unwrap();
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        /* fall through to the original error */
      }
    }
    return Promise.reject(error);
  },
);

export default api;
