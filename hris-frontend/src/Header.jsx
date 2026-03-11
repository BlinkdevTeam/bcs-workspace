import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ── Nav config ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard",    path: "/dashboard"  },
  { label: "People",       path: "/people"     },
  { label: "Payroll",      path: "/payroll"    },
  { label: "Time & Leave", path: "/time-leave" },
  { label: "Recruitment",  path: "/recruitment"},
  { label: "Reports",      path: "/reports"    },
];


const ROLE_LABELS = {
  super_admin: "Super Admin",
  hr_admin:    "HR Admin",
  manager:     "Manager",
};

const ROLE_COLORS = {
  super_admin: { bg:"#1f0a0a", color:"#f05a5a" },
  hr_admin:    { bg:"#0a1f0a", color:"#5af07a" },
  manager:     { bg:"#0a1020", color:"#5a9af0" },
};

const AV_COLORS = [
  "#5a9af0","#5af07a","#f0c85a","#c07af0",
  "#f05a5a","#f0905a","#50c8c8","#d090f0",
];

function avatarBg(id) { return AV_COLORS[id % AV_COLORS.length]; }
function initials(name) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

// ── CURRENT USER (simulated — replace with auth context in production) ────────
const CURRENT_USER = {
  id:         2,
  name:       "Chris Mendez",
  email:      "hr@company.com",
  role:       "hr_admin",
  dept:       "HR & Admin",
  lastLogin:  "Mar 2, 2026 · 9:01 AM",
  unreadNotifications: 3,
};

// ── AVATAR BUTTON ─────────────────────────────────────────────────────────────
function AvatarButton({ user, onClick, isOpen }) {
  const bg = avatarBg(user.id);
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-all"
      style={{
        backgroundColor: isOpen ? "#111" : "transparent",
        border:          `1px solid ${isOpen ? "#2a2a2a" : "transparent"}`,
        outline:         "none",
      }}
    >
      {/* Avatar circle */}
      <div className="relative flex-shrink-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            backgroundColor: bg + "28",
            color:           bg,
            border:          `1.5px solid ${bg}50`,
            fontFamily:      "system-ui, sans-serif",
          }}
        >
          {initials(user.name)}
        </div>

        {/* Online indicator */}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: "#5af07a", border: "2px solid #000" }}
        />
      </div>

      {/* Name + role — visible on wider nav */}
      <div className="text-left hidden sm:block">
        <p className="text-xs text-white leading-none mb-0.5"
          style={{ fontFamily: "system-ui, sans-serif" }}>
          {user.name.split(" ")[0]}
        </p>
        <p className="text-xs leading-none"
          style={{ fontFamily: "system-ui, sans-serif", color: ROLE_COLORS[user.role]?.color || "#aaa" }}>
          {ROLE_LABELS[user.role]}
        </p>
      </div>

      {/* Chevron */}
      <svg
        width="12" height="12" viewBox="0 0 12 12" fill="none"
        className="hidden sm:block transition-transform"
        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", color: "#444" }}
      >
        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      {/* Unread badge */}
      {user.unreadNotifications > 0 && !isOpen && (
        <div
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-black"
          style={{ backgroundColor: "#f05a5a", fontSize: 9, fontFamily: "monospace", fontWeight: 700 }}
        >
          {user.unreadNotifications > 9 ? "9+" : user.unreadNotifications}
        </div>
      )}
    </button>
  );
}

// ── DROPDOWN MENU ─────────────────────────────────────────────────────────────
function DropdownMenu({ user, onClose, onLogout }) {
  const bg    = avatarBg(user.id);
  const rc    = ROLE_COLORS[user.role] || { bg: "#111", color: "#aaa" };

  const menuItems = [
    {
      icon: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
        </svg>
      ),
      label:   "My Profile",
      sub:     "View and edit your details",
      onClick: () => { onClose(); },
    },
    {
      icon: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
        </svg>
      ),
      label:   "Notifications",
      sub:     user.unreadNotifications > 0
                 ? `${user.unreadNotifications} unread`
                 : "All caught up",
      badge:   user.unreadNotifications > 0 ? user.unreadNotifications : null,
      onClick: () => { onClose(); },
    },
    {
      icon: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/>
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      ),
      label:   "Settings",
      sub:     "Account preferences",
      onClick: () => { onClose(); },
    },
  ];

  return (
    <div
      className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden"
      style={{
        width:           280,
        backgroundColor: "#0d0d0d",
        border:          "1px solid #1e1e1e",
        boxShadow:       "0 16px 48px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
        zIndex:          100,
      }}
    >
      {/* User identity header */}
      <div className="px-4 py-4" style={{ borderBottom: "1px solid #161616" }}>
        <div className="flex items-center gap-3 mb-3">
          {/* Large avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{
              backgroundColor: bg + "28",
              color:           bg,
              border:          `2px solid ${bg}40`,
              fontFamily:      "system-ui, sans-serif",
            }}
          >
            {initials(user.name)}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate"
              style={{ fontFamily: "system-ui, sans-serif" }}>
              {user.name}
            </p>
            <p className="text-xs text-gray-600 truncate"
              style={{ fontFamily: "system-ui, sans-serif" }}>
              {user.email}
            </p>
          </div>
        </div>

        {/* Role + dept */}
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ fontFamily: "system-ui, sans-serif", ...rc }}
          >
            {ROLE_LABELS[user.role]}
          </span>
          <span className="text-xs text-gray-700"
            style={{ fontFamily: "system-ui, sans-serif" }}>
            {user.dept}
          </span>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1.5">
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={item.onClick}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all group"
            style={{ outline: "none" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#111"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            {/* Icon */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                backgroundColor: "#161616",
                color:           "#555",
                border:          "1px solid #1e1e1e",
              }}
            >
              {item.icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300 leading-none mb-0.5"
                style={{ fontFamily: "system-ui, sans-serif" }}>
                {item.label}
              </p>
              <p className="text-xs leading-none"
                style={{
                  fontFamily: "system-ui, sans-serif",
                  color: item.badge ? "#f0c85a" : "#444",
                }}>
                {item.sub}
              </p>
            </div>

            {/* Badge */}
            {item.badge && (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-black flex-shrink-0"
                style={{ backgroundColor: "#f05a5a", fontSize: 9, fontFamily: "monospace", fontWeight: 700 }}
              >
                {item.badge}
              </div>
            )}

            {/* Arrow */}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
              style={{ color: "#2a2a2a", flexShrink: 0 }}>
              <path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: "#161616", margin: "0 16px" }}/>

      {/* Sign out */}
      <div className="py-1.5">
        <button
          onClick={() => { onClose(); onLogout(); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all"
          style={{ outline: "none" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1a0a0a"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
        >
          {/* Icon */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#1a0a0a", color: "#f05a5a", border: "1px solid #2a1010" }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
            </svg>
          </div>

          <div className="flex-1">
            <p className="text-sm leading-none mb-0.5"
              style={{ fontFamily: "system-ui, sans-serif", color: "#f05a5a" }}>
              Sign Out
            </p>
            <p className="text-xs text-gray-700 leading-none"
              style={{ fontFamily: "system-ui, sans-serif" }}>
              End your current session
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}


// ── TopNav ────────────────────────────────────────────────────────────────────
// Defined here so it lives in one place and renders above every route.
// useLocation auto-highlights the active nav item — no activeNav state needed.
export default function Header({ currentUser = CURRENT_USER, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();


  const [open,    setOpen]    = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function handleLogout() {
    setLoggedOut(true);
    if (onLogout) onLogout();
  }

  if (loggedOut) {
    return (
      <div
        className="h-14 flex items-center justify-center"
        style={{ backgroundColor: "#000", borderBottom: "1px solid #111" }}
      >
        <p className="text-sm text-gray-600" style={{ fontFamily: "system-ui, sans-serif" }}>
          Signed out. <button onClick={() => setLoggedOut(false)}
            className="text-white underline hover:no-underline">Sign back in</button>
        </p>
      </div>
    );
  }

  // /people/5/compensation still highlights "People"
  const activeLabel = NAV_ITEMS.find(item =>
    location.pathname.startsWith(item.path)
  )?.label;

  return (
    <header
      className="border-b px-8 py-4 flex items-center justify-between flex-shrink-0"
      style={{ backgroundColor: "#000", borderColor: "#222" }}
    >
      <div className="flex items-center gap-10">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-sm bg-white flex items-center justify-center">
            <span className="text-black font-bold text-sm" style={{ fontFamily: "monospace" }}>H</span>
          </div>
          <span className="text-lg text-white" style={{ letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Hera
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex gap-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="px-4 py-1.5 rounded text-sm transition-all"
              style={{
                fontFamily:      "system-ui, sans-serif",
                backgroundColor: activeLabel === item.label ? "#fff" : "transparent",
                color:           activeLabel === item.label ? "#000" : "#666",
                fontWeight:      activeLabel === item.label ? 600    : 400,
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Right — avatar */}
      <div className="relative" ref={containerRef}>
        <AvatarButton
          user={currentUser}
          onClick={() => setOpen(o => !o)}
          isOpen={open}
        />

        {/* Dropdown */}
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