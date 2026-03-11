import { avatarBg, initials, ROLE_COLORS, ROLE_LABELS } from "../../data/compData";

export default function DropdownMenu({ user, onClose, onLogout }) {
  if (!user) return null; // ✅ early return if user not loaded

  const bg = avatarBg(user.id);
  const rc = ROLE_COLORS[user.role] || { bg: "#111", color: "#aaa" };

  // Menu items
  const menuItems = [
    {
      icon: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
      label: "My Profile",
      sub: "View and edit your details",
      onClick: () => onClose(),
    },
    {
      icon: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      ),
      label: "Notifications",
      sub: user.unreadNotifications > 0 ? `${user.unreadNotifications} unread` : "All caught up",
      badge: user.unreadNotifications > 0 ? user.unreadNotifications : null,
      onClick: () => onClose(),
    },
    {
      icon: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: "Settings",
      sub: "Account preferences",
      onClick: () => onClose(),
    },
  ];

  return (
    <div className="absolute right-0 top-full mt-2 w-72 rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-[0_16px_48px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.04)] z-50">
      {/* User header */}
      <div className="px-4 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{
              backgroundColor: bg + "28",
              color: bg,
              border: `2px solid ${bg}40`,
            }}
          >
            {initials(user.name || "User")} {/* ✅ fallback */}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">{user.name || "User"}</p>
            <p className="text-xs text-gray-500 truncate">{user.email || "-"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: rc.bg, color: rc.color }}>
            {ROLE_LABELS[user.role] || "Employee"}
          </span>
          <span className="text-xs text-gray-500">{user.dept || "-"}</span>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1.5">
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={item.onClick}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all hover:bg-gray-800 focus:outline-none"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-700 text-gray-400 border border-gray-800">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300 mb-0.5 truncate">{item.label}</p>
              <p className={`text-xs truncate ${item.badge ? "text-yellow-400" : "text-gray-400"}`}>{item.sub}</p>
            </div>
            {item.badge && (
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-black flex-shrink-0 bg-red-500 text-[9px] font-mono font-bold">
                {item.badge}
              </div>
            )}
            <svg className="flex-shrink-0 text-gray-700" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      <div className="h-px bg-gray-800 mx-4" />

      {/* Sign out */}
      <div className="py-1.5">
        <button
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all hover:bg-red-900 focus:outline-none"
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-800 text-red-500 border border-red-900">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm leading-none mb-0.5 text-red-500 font-sans">Sign Out</p>
            <p className="text-xs text-gray-500 leading-none font-sans">End your current session</p>
          </div>
        </button>
      </div>
    </div>
  );
}