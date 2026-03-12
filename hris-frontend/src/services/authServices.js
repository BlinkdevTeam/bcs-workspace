import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // adjust backend base URL
  withCredentials: true, // send httpOnly cookies
});

// Login request
export async function loginUser(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

// Refresh token request
export async function refreshAccessToken() {
  const res = await api.post("/auth/refresh"); // backend must implement /auth/refresh
  return res.data;
}
