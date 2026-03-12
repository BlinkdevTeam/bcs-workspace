import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { refreshAccessToken } from "../services/authServices";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = (accessToken, userData) => {
    setToken(accessToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshToken = async () => {
    try {
      const data = await refreshAccessToken(); // calls backend /auth/refresh
      setToken(data.accessToken);
      setUser(data.user);
      setIsAuthenticated(true);
      return data.accessToken;
    } catch (err) {
      logout();
      console.error("Refresh token failed:", err);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await refreshToken();
      setLoading(false);
    };
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout, refreshToken, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}