import { Navigate } from "react-router-dom";
import useSetupStatus from "../hooks/useSetupStatus";
import PageLoader from "./ui/PageLoader";

export default function SetupRoute({ children }) {
  const { setupComplete, loading } = useSetupStatus();

  if (loading) {
    return <PageLoader message="Checking setup..." />;
  }

  if (!setupComplete) {
    return <Navigate to="/initial-setup" replace />;
  }

  return children;
}