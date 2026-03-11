import {
  ROLE_COLORS, ROLE_LABELS, ROLE_ACCESS
} from "../../../data/compData";
import { SignInBtn } from "../../../components/ui";

export default function LoggedInView({ user, onLogout }) {
  const color = ROLE_COLORS[user?.role] || "#888";

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2)
    : "--";

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold"
          style={{ backgroundColor: color + "22", border: `1px solid ${color}44`, color }}
        >
          {initials}
        </div>

        <h2 className="text-xl font-normal text-white mb-1" style={{ letterSpacing:"-0.01em" }}>
          Welcome back, {user?.name?.split(" ")[0] || "User"}
        </h2>

        <span
          className="text-xs px-3 py-1 rounded-full"
          style={{ fontFamily:"system-ui,sans-serif", backgroundColor: color + "18", color }}
        >
          {ROLE_LABELS[user?.role] || "Unknown Role"}
        </span>
      </div>

      {/* Access info */}
      <div className="rounded-lg p-4 space-y-2" style={{ backgroundColor:"#0d0d0d", border:"1px solid #1e1e1e" }}>
        <p className="text-xs uppercase tracking-widest text-gray-600 mb-3" style={{ fontFamily:"system-ui,sans-serif" }}>
          Your access level
        </p>
        {ROLE_ACCESS[user?.role]?.map(item => (
          <div key={item.label} className="flex items-center gap-2.5">
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.level === "full" ? "#5af07a" : item.level === "dept" ? "#5a9af0" : item.level === "own" ? "#f0c85a" : "#333" }}
            />
            <span className="text-sm text-gray-400 flex-1" style={{ fontFamily:"system-ui,sans-serif" }}>
              {item.label}
            </span>
            <span className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>
              {item.scope}
            </span>
          </div>
        )) || <p className="text-sm text-gray-500">No access info available</p>}
      </div>

      <SignInBtn onClick={onLogout} variant="secondary">Sign Out</SignInBtn>
    </div>
  );
}