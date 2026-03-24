import { useState, useMemo, useEffect } from "react";
import { getEmployees } from "../../../services/employeeService";

const ROLES = ["super_admin", "hr_admin", "manager", "employee"];

const ROLE_LABELS = {
  super_admin: "Super Admin",
  hr_admin: "HR Admin",
  manager: "Manager",
  employee: "Employee",
};
const ROLE_COLORS = {
  super_admin: { bg: "#1f0a0a", color: "#f05a5a" },
  hr_admin: { bg: "#0a1f0a", color: "#5af07a" },
  manager: { bg: "#0a1020", color: "#5a9af0" },
  employee: { bg: "#1f1a0a", color: "#f0c85a" },
};
const CURRENT_USER_ROLE = "super_admin"; // Simulate the logged-in admin's role

const AV = [
  "#ffffff",
  "#cccccc",
  "#999999",
  "#777777",
  "#555555",
  "#444444",
  "#ffffff",
  "#bbbbbb",
  "#888888",
  "#666666",
  "#aaaaaa",
  "#333333",
];

function Avatar({ user, size = 36 }) {
  if (!user) return null;

  const { bg, fg } = gc(user.id || 0);

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        color: fg,
        fontFamily: "system-ui,sans-serif",
        fontSize: size < 32 ? 11 : size < 56 ? 13 : 20,
      }}
    >
      {user.avatar ||
        user.name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
    </div>
  );
}

function gc(id) {
  const safeId = id ?? 0; // fallback to 0 if undefined
  const bg = AV[safeId % AV.length] ?? "#333"; // fallback color
  const fg = ["#fff", "#ddd", "#eee", "#ccc", "#bbb"].some((x) =>
    bg.startsWith(x.slice(0, 4)),
  )
    ? "#000"
    : "#fff";
  return { bg, fg };
}

// ── USER MANAGEMENT PAGE ──────────────────────────────────────────────────────
export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const q = search.toLowerCase();
        return (
          (!q ||
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)) &&
          (roleFilter === "All" || u.role === roleFilter) &&
          (statusFilter === "All" || u.status === statusFilter)
        );
      }),
    [users, search, roleFilter, statusFilter],
  );

  function mapRole(role) {
    if (!role) return "employee";

    const r = role.toLowerCase();

    if (r.includes("admin")) return "super_admin";
    if (r.includes("hr")) return "hr_admin";
    if (r.includes("manager")) return "manager";

    return "employee";
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getEmployees();

        const mapped = res.data.map((emp) => ({
          id: emp.id,
          name: `${emp.first_name || ""} ${emp.last_name || ""}`.trim(),
          email: emp.email,
          role: mapRole(emp.role_title), // 🔹 normalize role
          dept: emp.department?.name || "—",
          status: emp.status || "inactive",
          lastLogin: emp.last_login_at
            ? new Date(emp.last_login_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })
            : "Never",
          mustChangePassword: false,
          createdOn: emp.created_at,
          avatar: emp.avatar_initials,
        }));

        setUsers(mapped);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  function handleSave(updated) {
    setUsers((p) =>
      p.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)),
    );
    setEditing(null);
  }

  // Summary stats
  const stats = ROLES.map((r) => ({
    role: r,
    count: users.filter((u) => u.role === r).length,
  }));
  const inactive = users.filter((u) => u.status === "inactive").length;

  return (
    <div
      className="flex-1 overflow-hidden flex flex-col"
      style={{ backgroundColor: "#000" }}
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-0 flex-shrink-0">
        {/* Role summary cards */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[
            ...stats.map((s) => ({
              label: ROLE_LABELS[s.role],
              value: s.count,
              color: ROLE_COLORS[s.role].color,
            })),
            {
              label: "Inactive",
              value: inactive,
              color: "#555",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg px-4 py-3"
              style={{
                backgroundColor: "#0d0d0d",
                border: "1px solid #1e1e1e",
              }}
            >
              <p
                className="text-xs uppercase tracking-widest mb-1.5"
                style={{ fontFamily: "system-ui,sans-serif", color: "#444" }}
              >
                {s.label}
              </p>
              <p
                className="text-2xl font-light"
                style={{ fontFamily: "monospace", color: s.color }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              🔍
            </span>
            <input
              className="w-full pl-9 pr-4 py-2 rounded text-sm text-white placeholder-gray-600 outline-none"
              style={{
                fontFamily: "system-ui,sans-serif",
                backgroundColor: "#111",
                border: "1px solid #2a2a2a",
              }}
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div
            className="flex gap-1 rounded-lg p-0.5"
            style={{ backgroundColor: "#111", border: "1px solid #2a2a2a" }}
          >
            {["All", ...ROLES].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className="px-3 py-1.5 rounded text-xs transition-all"
                style={{
                  fontFamily: "system-ui,sans-serif",
                  backgroundColor: roleFilter === r ? "#fff" : "transparent",
                  color: roleFilter === r ? "#000" : "#555",
                }}
              >
                {r === "All" ? "All Roles" : ROLE_LABELS[r]}
              </button>
            ))}
          </div>
          <div
            className="flex gap-1 rounded-lg p-0.5"
            style={{ backgroundColor: "#111", border: "1p  x solid #2a2a2a" }}
          >
            {["All", "active", "inactive"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 rounded text-xs transition-all capitalize"
                style={{
                  fontFamily: "system-ui,sans-serif",
                  backgroundColor: statusFilter === s ? "#fff" : "transparent",
                  color: statusFilter === s ? "#000" : "#555",
                }}
              >
                {s === "All" ? "All" : s}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <span
            className="text-gray-600 text-sm"
            style={{ fontFamily: "monospace" }}
          >
            {filtered.length} users
          </span>
        </div>

        {/* Users table */}
        <div
          className="rounded-lg overflow-hidden"
          style={{ border: "1px solid #1e1e1e" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  backgroundColor: "#0a0a0a",
                  borderBottom: "1px solid #1e1e1e",
                }}
              >
                {["User", "Role", "Status", "Last Login", "Invite", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-normal text-gray-600 whitespace-nowrap"
                      style={{
                        fontFamily: "system-ui,sans-serif",
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => {
                const rc = ROLE_COLORS[user.role];
                return (
                  <tr
                    key={user.id}
                    className="group"
                    style={{
                      borderBottom:
                        i < filtered.length - 1 ? "1px solid #141414" : "none",
                      backgroundColor:
                        user.status === "inactive" ? "#080808" : "#0d0d0d",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#111")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        user.status === "inactive" ? "#080808" : "#0d0d0d")
                    }
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar user={user} size={32} />
                          {user.status === "inactive" && (
                            <div
                              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black"
                              style={{ backgroundColor: "#f05a5a" }}
                            />
                          )}
                        </div>
                        <div>
                          <p
                            className="text-white text-sm"
                            style={{
                              fontFamily: "system-ui,sans-serif",
                              opacity: user.status === "inactive" ? 0.5 : 1,
                            }}
                          >
                            {user.name}
                          </p>
                          <p
                            className="text-gray-600 text-xs"
                            style={{ fontFamily: "system-ui,sans-serif" }}
                          >
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ fontFamily: "system-ui,sans-serif", ...rc }}
                      >
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              user.status === "active" ? "#5af07a" : "#333",
                          }}
                        />
                        <span
                          className="text-xs capitalize"
                          style={{
                            fontFamily: "system-ui,sans-serif",
                            color:
                              user.status === "active" ? "#5af07a" : "#555",
                          }}
                        >
                          {user.status}
                        </span>
                      </div>
                    </td>

                    <td
                      className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap"
                      style={{ fontFamily: "monospace" }}
                    >
                      {user.lastLogin}
                    </td>

                    <td className="px-4 py-3">
                      {user.mustChangePassword && (
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            fontFamily: "system-ui,sans-serif",
                            backgroundColor: "#1f1a0f",
                            color: "#f0c85a",
                            border: "1px solid #3a3010",
                          }}
                        >
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => setEditing(user)}
                        className="text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-80"
                        style={{
                          fontFamily: "system-ui,sans-serif",
                          backgroundColor: "#111",
                          color: "#aaa",
                          border: "1px solid #2a2a2a",
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <EditUserDrawer
          user={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
