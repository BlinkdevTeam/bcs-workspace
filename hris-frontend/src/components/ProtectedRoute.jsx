import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PageLoader from "./ui/PageLoader";
import useSetupStatus from "../hooks/useSetupStatus";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading: authLoading } = useSelector(
    (state) => state.auth
  );

  const { setupComplete, checking } = useSetupStatus();

  // Show loader while checking auth or setup
  if (authLoading || checking) {
    return <PageLoader message="Checking session..." />;
  }

  // If system not initialized
  if (!setupComplete) {
    return <Navigate to="/initial-setup" replace />;
  }

  // If user not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Allow access
  return children;
}