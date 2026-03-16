import { avatarBg, initials, ROLE_COLORS, ROLE_LABELS } from "../../data/compData";

export default function AvatarButton({ user, onClick, isOpen }) {
  if (!user) return null; // no user yet

  const bg = avatarBg(user.id);

  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-all"
      style={{
        backgroundColor: isOpen ? "#111" : "transparent",
        border: `1px solid ${isOpen ? "#2a2a2a" : "transparent"}`,
        outline: "none",
      }}
    >
      {/* Avatar circle */}
      <div className="relative flex-shrink-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            backgroundColor: bg + "28",
            color: bg,
            border: `1.5px solid ${bg}50`,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {initials(user.first_name || "User")}
        </div>

        {/* Online indicator */}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: "#5af07a", border: "2px solid #000" }}
        />
      </div>

      {/* Name + role — visible on wider nav */}
      <div className="text-left hidden sm:block">
        <p
          className="text-xs text-white leading-none mb-0.5 uppercase font-bold"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          {(user.first_name?.split(" ")[0]) || "User"}
        </p>
        <p
          className="text-xs leading-none"
          style={{
            fontFamily: "system-ui, sans-serif",
            color: ROLE_COLORS[user.role]?.color || "#aaa",
          }}
        >
          {ROLE_LABELS[user.role] || "Employee"}
        </p>
      </div>

      {/* Chevron */}
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className="hidden sm:block transition-transform"
        style={{
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          color: "#444",
        }}
      >
        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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