import { useState, useRef, useEffect, useCallback } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import api from "../services/api";
import NewProjectModal from "../components/NewProjectModal";
import { createProject, projectColor } from "../services/projects";

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
    badgeColor: "red",   // number comes from dueCount (tasks due today or overdue)
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  },
  {
    to: "/team",
    label: "Team",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
];

// ── AppLayout ─────────────────────────────────────────────────────────────────
export default function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [projects, setProjects]                 = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data.projects);
    } catch {
      // keep whatever is already shown
    }
  }, []);

  useEffect(() => {
    loadProjects();
    window.addEventListener("projects:changed", loadProjects);
    return () => window.removeEventListener("projects:changed", loadProjects);
  }, [loadProjects]);

  // Red badge on My Tasks: my open tasks that are due today or overdue.
  // Refreshed whenever you move to another page.
  const [dueCount, setDueCount] = useState(0);
  useEffect(() => {
    let cancelled = false;
    api.get("/tasks", { params: { mine: true } })
      .then(({ data }) => {
        if (cancelled) return;
        const today = new Date().toLocaleDateString("en-CA");
        setDueCount((data.tasks || []).filter((t) => !t.done && t.due && String(t.due).slice(0, 10) <= today).length);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [pathname]);

  const pageLabel = pathname.startsWith("/projects/")
    ? (projects.find((p) => pathname === `/projects/${p.id}`)?.name ?? "Project")
    : pathname.startsWith("/my-tasks") ? "My Tasks" : pathname.startsWith("/portal") ? "Employee Portal" : pathname.startsWith("/team") ? "Team" : pathname.startsWith("/profile") ? "My Profile" : "Dashboard";

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
      <style>{HOVER_CSS}</style>
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
              {item.to === "/my-tasks" && dueCount > 0 && (
                <span style={{ ...styles.badge, ...styles.badgeRed }} title="Tasks due today or overdue">
                  {dueCount}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        <div style={styles.divider} />

        {/* Projects */}
        <div style={styles.projectsSection}>
          <div style={styles.sectionLabel}>Projects</div>
          {projects.map((p) => (
            <NavLink
              key={p.id}
              to={`/projects/${p.id}`}
              style={({ isActive }) => ({
                ...styles.projectItem,
                ...(isActive ? styles.projectItemActive : {}),
              })}
            >
              <div style={{ ...styles.projectDot, background: projectColor(p.name) }} />
              {p.name}
            </NavLink>
          ))}
          {projects.length === 0 && <div style={styles.noProjects}>No projects yet</div>}
          <div style={styles.addProject} onClick={() => setShowProjectModal(true)}>+ Add project</div>
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
            <span style={{ color: "#8a8a8a" }}>Tasks</span>
            <span style={{ color: "#2a2a2a", margin: "0 6px" }}>/</span>
            <span style={{ color: "#b0b0b0" }}>{pageLabel}</span>
          </div>

          <div style={styles.topbarRight}>
            {/* Search */}
            <div style={styles.search}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#454545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    onClick={() => { navigate("/profile#password"); setDropdownOpen(false); }}
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

      {showProjectModal && (
        <NewProjectModal onClose={() => setShowProjectModal(false)} onCreate={async (form) => { const p = await createProject(form); navigate(`/projects/${p.id}`); }} />
      )}
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
// Hover feedback for everything clickable in the app (anything styled with cursor: pointer).
// Inline styles can't do :hover, so this one rule covers the whole app.
const HOVER_CSS = `
  [style*="cursor: pointer"] { transition: background-color .12s, color .12s, box-shadow .12s; }
  [style*="cursor: pointer"]:hover { box-shadow: inset 0 0 0 999px rgba(255,255,255,0.07); }
  [style*="cursor: pointer"]:not([style*="background"]):hover { color: #fff !important; }
  [style*="cursor: pointer"]:not([style*="background"]):hover svg { stroke: currentColor; }
`;

const styles = {
  shell: { display: "flex", height: "100vh", background: "#202020", fontFamily: "var(--font-sans, sans-serif)", color: "#c9c9c9", overflow: "hidden" },
  sidebar: { width: 220, minWidth: 220, background: "#1a1a1a", borderRight: "0.5px solid #2c2c2c", display: "flex", flexDirection: "column" },
  logoWrapper: { padding: "16px 16px 12px", borderBottom: "0.5px solid #262626" },
  logoText: { fontSize: 13, fontWeight: 500, color: "#fff", letterSpacing: "1.5px", textTransform: "uppercase" },
  logoSub: { fontSize: 10, color: "#333", marginTop: 2 },
  navSection: { padding: "16px 10px 6px" },
  sectionLabel: { fontSize: 9, color: "#333", textTransform: "uppercase", letterSpacing: "1.2px", padding: "0 6px", marginBottom: 4 },
  navItem: { display: "flex", alignItems: "center", gap: 9, padding: "7px 8px", borderRadius: 6, cursor: "pointer", fontSize: 13, color: "#8a8a8a", textDecoration: "none", transition: "all 0.15s" },
  navItemActive: { background: "#2c2c2c", color: "#fff" },
  navIcon: { width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  badge: { marginLeft: "auto", fontSize: 10, background: "#383838", color: "#9a9a9a", padding: "1px 6px", borderRadius: 10 },
  badgeRed: { background: "rgba(239,68,68,0.15)", color: "#f87171" },
  divider: { height: "0.5px", background: "#262626", margin: "6px 10px" },
  projectsSection: { flex: 1, overflowY: "auto", padding: "0 10px 10px" },
  projectItem: { display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 6, cursor: "pointer", fontSize: 12, color: "#9a9a9a", textDecoration: "none" },
  projectItemActive: { background: "#2c2c2c", color: "#fff" },
  projectDot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
  addProject: { fontSize: 11, color: "#9a9a9a", padding: "6px 8px 6px 22px", cursor: "pointer" },
  noProjects: { fontSize: 11, color: "#333", padding: "6px 8px" },
  sidebarBottom: { padding: 10, borderTop: "0.5px solid #262626" },
  userRow: { display: "flex", alignItems: "center", gap: 9, padding: "7px 8px", borderRadius: 6 },
  avatarSm: { width: 26, height: 26, borderRadius: "50%", background: "#2c2c2c", border: "0.5px solid #3d3d3d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#a5a5a5", flexShrink: 0 },
  userName: { fontSize: 12, color: "#9a9a9a" },
  userRole: { fontSize: 10, color: "#333" },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar: { height: 48, borderBottom: "0.5px solid #2c2c2c", display: "flex", alignItems: "center", padding: "0 20px", gap: 12, background: "#202020", flexShrink: 0 },
  breadcrumb: { fontSize: 12 },
  topbarRight: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 },
  search: { display: "flex", alignItems: "center", gap: 6, background: "#262626", border: "0.5px solid #303030", borderRadius: 6, padding: "5px 10px" },
  searchInput: { background: "transparent", border: "none", outline: "none", fontSize: 12, color: "#a5a5a5", width: 140 },
  iconBtn: { width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#7a7a7a", position: "relative" },
  notifDot: { width: 5, height: 5, background: "#f97316", borderRadius: "50%", position: "absolute", top: 4, right: 4 },
  avatarBtn: { width: 30, height: 30, borderRadius: "50%", background: "#303030", border: "0.5px solid #454545", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#999", cursor: "pointer" },
  avatarBtnOpen: { borderColor: "#fff", color: "#fff" },
  dropdown: { position: "absolute", top: 36, right: 0, width: 200, background: "#262626", border: "0.5px solid #383838", borderRadius: 8, overflow: "hidden", zIndex: 100 },
  ddHeader: { padding: "12px 14px", borderBottom: "0.5px solid #303030" },
  ddName: { fontSize: 13, color: "#ccc", fontWeight: 500 },
  ddEmail: { fontSize: 11, color: "#7a7a7a", marginTop: 1 },
  ddItem: { display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", fontSize: 12, color: "#9a9a9a", cursor: "pointer" },
  ddItemHover: { background: "#303030", color: "#ccc" },
  ddItemDanger: { color: "#8a8a8a" },
  ddItemDangerHover: { background: "rgba(239,68,68,0.05)", color: "#f87171" },
  ddDivider: { height: "0.5px", background: "#303030", margin: "2px 0" },
  content: { flex: 1, overflowY: "auto", position: "relative" },
};
