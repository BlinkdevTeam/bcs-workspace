import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { PageLoader } from "./ui";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => setShowLoader(true), 150);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Optional loader UX
  if (!isAuthenticated && showLoader) {
    return <PageLoader message="Checking authentication..." />;
  }

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated
  return children;
}