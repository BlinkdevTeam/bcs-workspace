import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks
import { logoutUser } from "../services/authServices";
import { logout } from "../store/authSlice"; // Import logout action

import AvatarButton from "./components/AvatarButton";
import DropdownMenu from "./components/DropdownMenu";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "People", path: "/people" },
  { label: "Payroll", path: "/payroll" },
  { label: "Time & Leave", path: "/time-leave" },
  { label: "Recruitment", path: "/recruitment" },
  { label: "Reports", path: "/reports" },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);

  // 1. Get user directly from Redux instead of local state/localStorage
  const { user: currentUser, isAuthenticated } = useSelector((state) => state.auth);

  // 2. Updated Logout to use Redux
const handleLogout = async () => {
  try {
    await logoutUser();       // call backend to revoke refresh token
    dispatch(logout());       // clear Redux state
    navigate("/login", { replace: true });
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // 3. IMPORTANT: Check isAuthenticated from Redux
  // If we don't have a user, we don't render the header.
  if (!isAuthenticated || !currentUser) return null;

  const activeLabel = NAV_ITEMS.find((item) =>
    location.pathname.startsWith(item.path)
  )?.label;

  return (
    <header 
      className="border-b px-8 py-4 flex items-center justify-between flex-shrink-0" 
      style={{ backgroundColor: "#000", borderColor: "#222", zIndex: 100 }}
    >
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-sm bg-white flex items-center justify-center">
            <span className="text-black font-bold text-sm" style={{ fontFamily: "monospace" }}>BCS</span>
          </div>
          <span className="text-lg text-white" style={{ letterSpacing: "0.2em", textTransform: "uppercase" }}>
            BCS
          </span>
        </div>

        <nav className="flex gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="px-4 py-1.5 rounded text-sm transition-all"
              style={{
                fontFamily: "system-ui, sans-serif",
                backgroundColor: activeLabel === item.label ? "#fff" : "transparent",
                color: activeLabel === item.label ? "#000" : "#666",
                fontWeight: activeLabel === item.label ? 600 : 400,
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="relative" ref={containerRef}>
        <AvatarButton
          user={currentUser}
          onClick={() => setOpen((o) => !o)}
          isOpen={open}
        />

        {open && (
          <DropdownMenu
            user={currentUser}
            onClose={() => setOpen(false)}
            onLogout={handleLogout}
          />
        )}
      </div>
    </header>
  );
}