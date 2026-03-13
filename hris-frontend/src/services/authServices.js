import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // backend URL
  withCredentials: true, // ⚠ important: send httpOnly cookies
});

// Login request
export async function loginUser(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

// Refresh token request
export async function refreshAccessToken() {
  // ⚠ Add withCredentials here as well
  const res = await api.post(
    "/auth/refresh",
    {}, // POST body can be empty
    { withCredentials: true }, // ⚠ critical to send cookie
  );
  return res.data;
}

// Logout request
export async function logoutUser() {
  await api.post("/auth/logout"); // sends cookie automatically
}
