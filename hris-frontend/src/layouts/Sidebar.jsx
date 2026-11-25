import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../services/authServices";
import { logout } from "../store/authSlice";

const FONT = { fontFamily: "system-ui, sans-serif" };

// Tiny inline icons (24x24, stroke) so we don't need an icon package
const I = (d) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);
const ICONS = {
  dashboard:   I(<><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>),
  people:      I(<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" /><path d="M18 14.4c2.2.7 3.5 2.6 3.5 5.6" /></>),
  users:       I(<><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" /><path d="M9.5 12l2 2 3.5-4" /></>),
  payroll:     I(<><rect x="2.5" y="6" width="19" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9.5v.01M18 14.5v.01" /></>),
  time:        I(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  recruitment: I(<><circle cx="10.5" cy="10.5" r="6.5" /><path d="M20 20l-4.9-4.9" /></>),
  logout:      I(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>),
  collapse:    I(<><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></>),
};

const NAV = [
  { label: "Dashboard",       path: "/dashboard",   icon: "dashboard" },
  { label: "People",          path: "/people",      icon: "people" },
  { label: "Time & Leave",    path: "/time-leave",  icon: "time" },
  { label: "Payroll",         path: "/payroll",     icon: "payroll" },
  { label: "Recruitment",     path: "/recruitment", icon: "recruitment" },
  { label: "User Management", path: "/users",       icon: "users" },
];

const STORE_KEY = "hris_sidebar_collapsed";
function initialCollapsed() {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved !== null) return saved === "1";
  } catch { /* ignore */ }
  return typeof window !== "undefined" && window.innerWidth < 900;
}

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  const toggle = () => setCollapsed((c) => {
    try { localStorage.setItem(STORE_KEY, c ? "0" : "1"); } catch { /* ignore */ }
    return !c;
  });

  const handleLogout = async () => {
    try {
      await logoutUser();      // revoke refresh token on the backend
      dispatch(logout());      // clear Redux state
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!isAuthenticated || !user) return null;

  const fullName = user.name || [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email || "Signed in";
  const initials = (user.avatar_initials
    || [user.first_name?.[0], user.last_name?.[0]].filter(Boolean).join("")
    || fullName.slice(0, 2)).toUpperCase();

  const width = collapsed ? 64 : 232;

  return (
    <aside
      className="flex flex-col flex-shrink-0 h-screen"
      style={{ width, backgroundColor: "#000", borderRight: "1px solid #1a1a1a", transition: "width 0.15s ease", ...FONT }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 flex-shrink-0" style={{ height: 64, borderBottom: "1px solid #141414" }}>
        <div className="w-8 h-8 rounded-sm bg-white flex items-center justify-center flex-shrink-0">
          <span className="text-black font-bold text-xs" style={{ fontFamily: "monospace" }}>BCS</span>
        </div>
        {!collapsed && (
          <span className="text-white text-sm truncate" style={{ letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Georgia', serif" }}>
            Workspace
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4 flex flex-col gap-1">
        {!collapsed && (
          <p className="px-3 pb-2 text-gray-600" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>Menu</p>
        )}
        {NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : undefined}
            className="flex items-center gap-3 rounded-md text-sm"
            style={({ isActive }) => ({
              padding: collapsed ? "10px 0" : "9px 12px",
              justifyContent: collapsed ? "center" : "flex-start",
              color: isActive ? "#fff" : "#7a7a7a",
              backgroundColor: isActive ? "#1c1c1c" : "transparent",
              boxShadow: isActive ? "inset 2px 0 0 #fff" : "none",
              textDecoration: "none",
              transition: "background-color 0.12s, color 0.12s",
            })}
            onMouseEnter={(e) => { if (!e.currentTarget.getAttribute("aria-current")) { e.currentTarget.style.backgroundColor = "#111"; e.currentTarget.style.color = "#ddd"; } }}
            onMouseLeave={(e) => { if (!e.currentTarget.getAttribute("aria-current")) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#7a7a7a"; } }}
          >
            <span className="flex-shrink-0 flex">{ICONS[item.icon]}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer: collapse + user */}
      <div className="flex-shrink-0 px-2.5 py-3 flex flex-col gap-2" style={{ borderTop: "1px solid #141414" }}>
        <button
          onClick={toggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex items-center gap-3 rounded-md text-sm hover:opacity-90"
          style={{ padding: collapsed ? "9px 0" : "8px 12px", justifyContent: collapsed ? "center" : "flex-start", color: "#555", backgroundColor: "transparent" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
        >
          <span className="flex-shrink-0 flex">{ICONS.collapse}</span>
          {!collapsed && <span>Collapse</span>}
        </button>

        <div
          className="flex items-center gap-2.5 rounded-md"
          style={{ padding: collapsed ? "8px 0" : "8px 10px", justifyContent: collapsed ? "center" : "flex-start", backgroundColor: "#0d0d0d", border: "1px solid #1a1a1a" }}
        >
          <div className="w-8 h-8 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center flex-shrink-0">{initials}</div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-gray-200 text-xs truncate">{fullName}</p>
              {user.email && <p className="text-gray-600 truncate" style={{ fontSize: 10 }}>{user.email}</p>}
            </div>
          )}
          {!collapsed && (
            <button onClick={handleLogout} title="Log out" className="flex-shrink-0 hover:opacity-100" style={{ color: "#777", opacity: 0.9 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f05a5a")} onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}>
              {ICONS.logout}
            </button>
          )}
        </div>
        {collapsed && (
          <button onClick={handleLogout} title="Log out" className="flex justify-center py-2" style={{ color: "#777" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f05a5a")} onMouseLeave={(e) => (e.currentTarget.style.color = "#777")}>
            {ICONS.logout}
          </button>
        )}
      </div>
    </aside>
  );
}
