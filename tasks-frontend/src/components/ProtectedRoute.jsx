import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, clearCredentials, selectIsAuth } from "../store/slices/authSlice";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

/**
 * ProtectedRoute
 *
 * On mount:
 * 1. If we already have an access token in Redux → render children immediately.
 * 2. If not → attempt a silent refresh using the httpOnly cookie.
 *    - Success: store the new access token + user, render children.
 *    - Failure: redirect to /login.
 *
 * This handles the page-refresh case where Redux state is cleared but the
 * refresh token cookie is still valid.
 */
export default function ProtectedRoute() {
  const dispatch  = useDispatch();
  const isAuth    = useSelector(selectIsAuth);
  const [checking, setChecking] = useState(!isAuth); // skip check if already authed

  useEffect(() => {
    if (isAuth) return; // already have a token — nothing to do

    const silentRefresh = async () => {
      try {
        // Attempt to get a fresh access token using the cookie
        const { data: refreshData } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Fetch current employee info using the new token
        const { data: meData } = await axios.get(
          `${BASE_URL}/auth/me`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${refreshData.access_token}` },
          }
        );

        dispatch(
          setCredentials({
            access_token: refreshData.access_token,
            employee:     meData.employee,
          })
        );
      } catch {
        dispatch(clearCredentials());
      } finally {
        setChecking(false);
      }
    };

    silentRefresh();
  }, []);

  if (checking) {
    return <AuthLoadingScreen />;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// ── Minimal loading screen shown during silent refresh ────────────────────────
function AuthLoadingScreen() {
  return (
    <div style={{
      minHeight: "100vh", background: "#0f0f0f",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "1px" }}>BCS</div>
        <div style={spinnerStyle} />
      </div>
    </div>
  );
}

const spinnerStyle = {
  width:  20,
  height: 20,
  border: "2px solid #222",
  borderTop: "2px solid #555",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

// Inject keyframe globally (only once)
if (typeof document !== "undefined" && !document.getElementById("bcs-spin-style")) {
  const style = document.createElement("style");
  style.id    = "bcs-spin-style";
  style.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
  document.head.appendChild(style);
}
