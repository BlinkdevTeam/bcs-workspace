import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, d2, circle, rect, viewBox = "0 0 24 24" }) => (
  <svg
    width="14" height="14" viewBox={viewBox}
    fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
  >
    {d && <path d={d} />}
    {d2 && <path d={d2} />}
    {circle && <circle cx={circle.cx} cy={circle.cy} r={circle.r} />}
    {rect && <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx={rect.rx} />}
  </svg>
);

// ── Sidebar nav items ─────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    to: "/my-tasks",
    label: "My Tasks",
    badge: 4,
    badgeColor: "red",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  },
  {
    to: "/team",
    label: "Team",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
];

const PROJECTS = [
  { id: 1, name: "BCS Workspace", color: "#3b82f6" },
  { id: 2, name: "HRIS Redesign", color: "#22c55e" },
  { id: 3, name: "Mobile App", color: "#facc15" },
];

// ── AppLayout ─────────────────────────────────────────────────────────────────
export default function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
    : "?";

  const fullName = user ? `${user.first_name} ${user.last_name}` : "User";
  const email = user?.email ?? "";

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div style={styles.shell}>
      {/* ── Sidebar ── */}
      <aside style={styles.sidebar}>
        {/* Logo */}
        <div style={styles.logoWrapper}>
          <div style={styles.logoText}>Tasks</div>
          <div style={styles.logoSub}>BCS Workspace</div>
        </div>

        {/* Main nav */}
        <div style={styles.navSection}>
          <div style={styles.sectionLabel}>Menu</div>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
              {item.badge && (
                <span style={{
                  ...styles.badge,
                  ...(item.badgeColor === "red" ? styles.badgeRed : {}),
                }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        <div style={styles.divider} />

        {/* Projects */}
        <div style={styles.projectsSection}>
          <div style={styles.sectionLabel}>Projects</div>
          {PROJECTS.map((p) => (
            <div key={p.id} style={styles.projectItem}>
              <div style={{ ...styles.projectDot, background: p.color }} />
              {p.name}
            </div>
          ))}
          <div style={styles.addProject}>+ Add project</div>
        </div>

        {/* Bottom user row */}
        <div style={styles.sidebarBottom}>
          <div style={styles.userRow}>
            <div style={styles.avatarSm}>{initials}</div>
            <div>
              <div style={styles.userName}>{fullName}</div>
              <div style={styles.userRole}>{user?.role ?? "Member"}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={styles.main}>
        {/* Topbar */}
        <header style={styles.topbar}>
          <div style={styles.breadcrumb}>
            <span style={{ color: "#555" }}>Tasks</span>
            <span style={{ color: "#2a2a2a", margin: "0 6px" }}>/</span>
            <span style={{ color: "#888" }}>Dashboard</span>
          </div>

          <div style={styles.topbarRight}>
            {/* Search */}
            <div style={styles.search}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input placeholder="Search tasks..." style={styles.searchInput} />
            </div>

            {/* Notifications */}
            <div style={styles.iconBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <div style={styles.notifDot} />
            </div>

            {/* Avatar + dropdown */}
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <div
                style={{
                  ...styles.avatarBtn,
                  ...(dropdownOpen ? styles.avatarBtnOpen : {}),
                }}
                onClick={() => setDropdownOpen((v) => !v)}
              >
                {initials}
              </div>

              {dropdownOpen && (
                <div style={styles.dropdown}>
                  <div style={styles.ddHeader}>
                    <div style={styles.ddName}>{fullName}</div>
                    <div style={styles.ddEmail}>{email}</div>
                  </div>

                  <DropdownItem
                    icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>}
                    label="My Profile"
                    onClick={() => { navigate("/profile"); setDropdownOpen(false); }}
                  />
                  <DropdownItem
                    icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>}
                    label="Employee Portal"
                    onClick={() => { navigate("/portal"); setDropdownOpen(false); }}
                  />
                  <DropdownItem
                    icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>}
                    label="Change Password"
                    onClick={() => { navigate("/change-password"); setDropdownOpen(false); }}
                  />

                  <div style={styles.ddDivider} />

                  <DropdownItem
                    icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>}
                    label="Logout"
                    onClick={handleLogout}
                    danger
                  />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// ── Dropdown item ─────────────────────────────────────────────────────────────
function DropdownItem({ icon, label, onClick, danger }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...styles.ddItem,
        ...(danger ? styles.ddItemDanger : {}),
        ...(hovered ? (danger ? styles.ddItemDangerHover : styles.ddItemHover) : {}),
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon}
      {label}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  shell: { display: "flex", height: "100vh", background: "#141414", fontFamily: "var(--font-sans, sans-serif)", color: "#c9c9c9", overflow: "hidden" },
  sidebar: { width: 220, minWidth: 220, background: "#0f0f0f", borderRight: "0.5px solid #1e1e1e", display: "flex", flexDirection: "column" },
  logoWrapper: { padding: "16px 16px 12px", borderBottom: "0.5px solid #1a1a1a" },
  logoText: { fontSize: 13, fontWeight: 500, color: "#fff", letterSpacing: "1.5px", textTransform: "uppercase" },
  logoSub: { fontSize: 10, color: "#333", marginTop: 2 },
  navSection: { padding: "16px 10px 6px" },
  sectionLabel: { fontSize: 9, color: "#333", textTransform: "uppercase", letterSpacing: "1.2px", padding: "0 6px", marginBottom: 4 },
  navItem: { display: "flex", alignItems: "center", gap: 9, padding: "7px 8px", borderRadius: 6, cursor: "pointer", fontSize: 13, color: "#555", textDecoration: "none", transition: "all 0.15s" },
  navItemActive: { background: "#1e1e1e", color: "#fff" },
  navIcon: { width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  badge: { marginLeft: "auto", fontSize: 10, background: "#2a2a2a", color: "#666", padding: "1px 6px", borderRadius: 10 },
  badgeRed: { background: "rgba(239,68,68,0.15)", color: "#f87171" },
  divider: { height: "0.5px", background: "#1a1a1a", margin: "6px 10px" },
  projectsSection: { flex: 1, overflowY: "auto", padding: "0 10px 10px" },
  projectItem: { display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 6, cursor: "pointer", fontSize: 12, color: "#444" },
  projectDot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
  addProject: { fontSize: 11, color: "#2a2a2a", padding: "6px 8px 6px 22px", cursor: "pointer" },
  sidebarBottom: { padding: 10, borderTop: "0.5px solid #1a1a1a" },
  userRow: { display: "flex", alignItems: "center", gap: 9, padding: "7px 8px", borderRadius: 6 },
  avatarSm: { width: 26, height: 26, borderRadius: "50%", background: "#1e1e1e", border: "0.5px solid #2e2e2e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#777", flexShrink: 0 },
  userName: { fontSize: 12, color: "#666" },
  userRole: { fontSize: 10, color: "#333" },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar: { height: 48, borderBottom: "0.5px solid #1e1e1e", display: "flex", alignItems: "center", padding: "0 20px", gap: 12, background: "#141414", flexShrink: 0 },
  breadcrumb: { fontSize: 12 },
  topbarRight: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 },
  search: { display: "flex", alignItems: "center", gap: 6, background: "#1a1a1a", border: "0.5px solid #222", borderRadius: 6, padding: "5px 10px" },
  searchInput: { background: "transparent", border: "none", outline: "none", fontSize: 12, color: "#777", width: 140 },
  iconBtn: { width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#444", position: "relative" },
  notifDot: { width: 5, height: 5, background: "#f97316", borderRadius: "50%", position: "absolute", top: 4, right: 4 },
  avatarBtn: { width: 30, height: 30, borderRadius: "50%", background: "#222", border: "0.5px solid #333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#999", cursor: "pointer" },
  avatarBtnOpen: { borderColor: "#fff", color: "#fff" },
  dropdown: { position: "absolute", top: 36, right: 0, width: 200, background: "#1a1a1a", border: "0.5px solid #2a2a2a", borderRadius: 8, overflow: "hidden", zIndex: 100 },
  ddHeader: { padding: "12px 14px", borderBottom: "0.5px solid #222" },
  ddName: { fontSize: 13, color: "#ccc", fontWeight: 500 },
  ddEmail: { fontSize: 11, color: "#444", marginTop: 1 },
  ddItem: { display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", fontSize: 12, color: "#666", cursor: "pointer" },
  ddItemHover: { background: "#222", color: "#ccc" },
  ddItemDanger: { color: "#555" },
  ddItemDangerHover: { background: "rgba(239,68,68,0.05)", color: "#f87171" },
  ddDivider: { height: "0.5px", background: "#222", margin: "2px 0" },
  content: { flex: 1, overflowY: "auto" },
};
