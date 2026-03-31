import { useState, useMemo, useEffect } from "react";
import { getEmployees } from "../../../services/employeeService";

const ROLES = ["super_admin", "hr_admin", "manager", "employee"];

const ROLE_LABELS = {
  super_admin: "Super Admin",
  hr_admin:    "HR Admin",
  manager:     "Manager",
  employee:    "Employee",
};
const ROLE_COLORS = {
  super_admin: { bg: "#1f0a0a", color: "#f05a5a" },
  hr_admin:    { bg: "#0a1f0a", color: "#5af07a" },
  manager:     { bg: "#0a1020", color: "#5a9af0" },
  employee:    { bg: "#1f1a0a", color: "#f0c85a" },
};
const CURRENT_USER_ROLE = "super_admin";

const ALL_PERMISSIONS = {
  Tasks: [
    "tasks.view_all", "tasks.view_dept", "tasks.view_own",
    "tasks.create", "tasks.assign_any", "tasks.assign_dept", "tasks.manage_projects",
  ],
};

const AV = [
  "#ffffff", "#cccccc", "#999999", "#777777", "#555555", "#444444",
  "#ffffff", "#bbbbbb", "#888888", "#666666", "#aaaaaa", "#333333",
];

function gc(id) {
  const safeId = id ?? 0;
  const bg = AV[safeId % AV.length] ?? "#333";
  const fg = ["#fff", "#ddd", "#eee", "#ccc", "#bbb"].some((x) =>
    bg.startsWith(x.slice(0, 4))
  ) ? "#000" : "#fff";
  return { bg, fg };
}

function Avatar({ user, size = 36 }) {
  if (!user) return null;
  const { bg, fg } = gc(user.id || 0);
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
      style={{
        width: size, height: size,
        backgroundColor: bg, color: fg,
        fontFamily: "system-ui,sans-serif",
        fontSize: size < 32 ? 11 : size < 56 ? 13 : 20,
      }}
    >
      {user.avatar ||
        user.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
    </div>
  );
}

// ── TASK APP INVITE MODAL ─────────────────────────────────────────────────────
function TaskAppInviteModal({ user, onClose, onSuccess }) {
  const [status,   setStatus]  = useState("idle");
  const [errorMsg, setErrorMsg]= useState("");

  const taskPerms = ALL_PERMISSIONS.Tasks;
  const roleColor = ROLE_COLORS[user.role]?.color ?? "#aaa";

  async function handleConfirm() {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res  = await fetch(`/api/users/${user.id}/invite-to-task-app`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please check your connection.");
      setStatus("error");
    }
  }

  // ── Success state ────────────────────────────────────────────────────────
  if (status === "success") return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
        onClick={() => { onSuccess(user.id); onClose(); }} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-xl flex flex-col items-center py-10 px-8 text-center"
          style={{ backgroundColor: "#080808", border: "1px solid #222", boxShadow: "0 24px 80px rgba(0,0,0,0.8)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
            style={{ backgroundColor: "#0a1a0a", border: "1px solid #1e3a1e" }}>
            <span style={{ fontSize: 28 }}>✉️</span>
          </div>
          <h3 className="text-lg font-normal text-white mb-2">Invite sent!</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-1" style={{ fontFamily: "system-ui,sans-serif" }}>
            <strong className="text-white">{user.name}</strong> has been invited to the Task Management app.
          </p>
          <p className="text-xs text-gray-600 mb-8" style={{ fontFamily: "system-ui,sans-serif" }}>
            They'll receive a magic link and temporary password at{" "}
            <span className="text-gray-400">{user.email}</span>.
          </p>
          <button onClick={() => { onSuccess(user.id); onClose(); }}
            className="px-6 py-2 rounded text-sm bg-white text-black hover:opacity-80"
            style={{ fontFamily: "system-ui,sans-serif" }}>
            Done
          </button>
        </div>
      </div>
    </>
  );

  // ── Confirmation modal ────────────────────────────────────────────────────
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.75)" }} onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl overflow-hidden"
          style={{ backgroundColor: "#080808", border: "1px solid #222", boxShadow: "0 24px 80px rgba(0,0,0,0.8)" }}>

          {/* Header */}
          <div className="px-7 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid #1a1a1a" }}>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-0.5" style={{ fontFamily: "system-ui,sans-serif" }}>
                Task Management
              </p>
              <h2 className="text-base font-normal text-white">Invite Employee to Task App</h2>
            </div>
            <button onClick={onClose} className="text-gray-600 hover:text-white text-xl leading-none">✕</button>
          </div>

          {/* Employee card */}
          <div className="px-7 py-5" style={{ borderBottom: "1px solid #1a1a1a" }}>
            <div className="flex items-center gap-4 mb-4">
              <Avatar user={user} size={44} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm">{user.name}</p>
                <p className="text-gray-500 text-xs mt-0.5 truncate" style={{ fontFamily: "system-ui,sans-serif" }}>{user.email}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ fontFamily: "system-ui,sans-serif", backgroundColor: ROLE_COLORS[user.role]?.bg, color: roleColor }}>
                {ROLE_LABELS[user.role] ?? user.role}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg px-3 py-2.5" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
                <p className="text-xs text-gray-600 mb-0.5" style={{ fontFamily: "system-ui,sans-serif" }}>Department</p>
                <p className="text-xs text-gray-300" style={{ fontFamily: "system-ui,sans-serif" }}>{user.dept}</p>
              </div>
              <div className="rounded-lg px-3 py-2.5" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
                <p className="text-xs text-gray-600 mb-0.5" style={{ fontFamily: "system-ui,sans-serif" }}>Invite destination</p>
                <p className="text-xs text-gray-300 truncate" style={{ fontFamily: "monospace" }}>{user.email}</p>
              </div>
            </div>
          </div>

          {/* What they'll get */}
          <div className="px-7 py-5" style={{ borderBottom: "1px solid #1a1a1a" }}>
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-3" style={{ fontFamily: "system-ui,sans-serif" }}>
              Task app permissions for <span style={{ color: roleColor }}>{ROLE_LABELS[user.role] ?? user.role}</span>
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-4">
              {taskPerms.map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: "#5a9af0" }} />
                  <span className="text-xs text-gray-500" style={{ fontFamily: "monospace" }}>{p}</span>
                </div>
              ))}
            </div>
            <div className="rounded-lg px-4 py-3 flex items-start gap-2" style={{ backgroundColor: "#0a1020", border: "1px solid #1a2a3a" }}>
              <span className="text-blue-400 text-xs flex-shrink-0 mt-0.5">ℹ</span>
              <p className="text-xs text-gray-400 leading-relaxed" style={{ fontFamily: "system-ui,sans-serif" }}>
                The invite email will include a <strong className="text-white">one-click magic link</strong> (valid 24 hrs) and a{" "}
                <strong className="text-white">temporary password</strong>. The employee sets a permanent password on first login.
              </p>
            </div>
          </div>

          {/* Error */}
          {status === "error" && (
            <div className="px-7 pt-5">
              <div className="rounded-lg px-4 py-3 flex items-start gap-2" style={{ backgroundColor: "#1f0a0a", border: "1px solid #3a1515" }}>
                <span className="text-red-400 text-xs flex-shrink-0 mt-0.5">✕</span>
                <p className="text-xs text-red-400" style={{ fontFamily: "system-ui,sans-serif" }}>{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-7 py-5 flex items-center justify-between">
            <button onClick={onClose} className="px-4 py-2 rounded text-sm"
              style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", color: "#aaa", border: "1px solid #2a2a2a" }}>
              Cancel
            </button>
            <button onClick={handleConfirm} disabled={status === "loading"}
              className="px-5 py-2 rounded text-sm font-medium hover:opacity-80 flex items-center gap-2"
              style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#fff", color: "#000", cursor: status === "loading" ? "not-allowed" : "pointer", opacity: status === "loading" ? 0.7 : 1 }}>
              {status === "loading" ? (
                <>
                  <span style={{ display: "inline-block", width: 12, height: 12, border: "1.5px solid #999", borderTopColor: "#000", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                  Sending invite…
                </>
              ) : "Send Task App Invite ✉"}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

// ── TASK APP INVITE BUTTON (table row) ────────────────────────────────────────
function TaskAppInviteButton({ user, onInvited }) {
  const [showModal, setShowModal] = useState(false);
  const [invited,   setInvited]   = useState(user.taskAppInvited);

  if (invited) return (
    <span className="text-xs px-2.5 py-1 rounded flex items-center gap-1.5"
      style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#0a1a0a", color: "#5af07a", border: "1px solid #1e3a1e" }}>
      <span style={{ fontSize: 9 }}>✓</span> Task App
    </span>
  );

  if (user.status === "inactive") return (
    <span className="text-xs px-2.5 py-1 rounded"
      title="Cannot invite an inactive employee"
      style={{ fontFamily: "system-ui,sans-serif", color: "#333", border: "1px solid #1a1a1a", cursor: "not-allowed" }}>
      Task App
    </span>
  );

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
        className="text-xs px-2.5 py-1 rounded flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#0a1020", color: "#5a9af0", border: "1px solid #1a2a3a", cursor: "pointer" }}>
        ✉ Task App
      </button>
      {showModal && (
        <TaskAppInviteModal
          user={user}
          onClose={() => setShowModal(false)}
          onSuccess={(id) => { setInvited(true); onInvited(id); }}
        />
      )}
    </>
  );
}

// ── PEOPLE > USERS TAB ────────────────────────────────────────────────────────
export default function UserManagementPage() {
  const [users,        setUsers]       = useState([]);
  const [search,       setSearch]      = useState("");
  const [roleFilter,   setRoleFilter]  = useState("All");
  const [statusFilter, setStatusFilter]= useState("All");
  const [editing,      setEditing]     = useState(null);

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const q = search.toLowerCase();
        return (
          (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
          (roleFilter === "All" || u.role === roleFilter) &&
          (statusFilter === "All" || u.status === statusFilter)
        );
      }),
    [users, search, roleFilter, statusFilter],
  );

  function mapRole(role) {
    if (!role) return "employee";
    const r = role.toLowerCase();
    if (r.includes("admin"))   return "super_admin";
    if (r.includes("hr"))      return "hr_admin";
    if (r.includes("manager")) return "manager";
    return "employee";
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getEmployees();
        const mapped = res.data.map((emp) => ({
          id:                emp.id,
          name:              `${emp.first_name || ""} ${emp.last_name || ""}`.trim(),
          email:             emp.email,
          role:              mapRole(emp.role_title),
          dept:              emp.department?.name || "—",
          status:            emp.status || "inactive",
          lastLogin:         emp.last_login_at
            ? new Date(emp.last_login_at).toLocaleString("en-US", {
                month: "short", day: "numeric", year: "numeric",
                hour: "numeric", minute: "2-digit",
              })
            : "Never",
          mustChangePassword: false,
          createdOn:          emp.created_at,
          avatar:             emp.avatar_initials,
          taskAppInvited:     emp.task_app_invited ?? false, // ← from your User model
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
    setUsers((p) => p.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
    setEditing(null);
  }

  // Called by TaskAppInviteButton after successful API response
  function handleTaskAppInvited(userId) {
    setUsers((p) => p.map((u) => (u.id === userId ? { ...u, taskAppInvited: true } : u)));
  }

  const stats        = ROLES.map((r) => ({ role: r, count: users.filter((u) => u.role === r).length }));
  const inactive     = users.filter((u) => u.status === "inactive").length;
  const taskAppCount = users.filter((u) => u.taskAppInvited).length;

  return (
    <div className="flex-1 overflow-hidden flex flex-col" style={{ backgroundColor: "#000" }}>

      {/* Summary cards */}
      <div className="px-8 pt-8 pb-0 flex-shrink-0">
        <div className="grid grid-cols-6 gap-3 mb-6">
          {[
            ...stats.map((s) => ({
              label: ROLE_LABELS[s.role],
              value: s.count,
              color: ROLE_COLORS[s.role].color,
            })),
            { label: "Inactive", value: inactive,     color: "#555"    },
            { label: "Task App", value: taskAppCount,  color: "#5a9af0" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg px-4 py-3"
              style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
              <p className="text-xs uppercase tracking-widest mb-1.5"
                style={{ fontFamily: "system-ui,sans-serif", color: "#444" }}>
                {s.label}
              </p>
              <p className="text-2xl font-light" style={{ fontFamily: "monospace", color: s.color }}>
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
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            <input
              className="w-full pl-9 pr-4 py-2 rounded text-sm text-white placeholder-gray-600 outline-none"
              style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", border: "1px solid #2a2a2a" }}
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1 rounded-lg p-0.5" style={{ backgroundColor: "#111", border: "1px solid #2a2a2a" }}>
            {["All", ...ROLES].map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className="px-3 py-1.5 rounded text-xs transition-all"
                style={{ fontFamily: "system-ui,sans-serif", backgroundColor: roleFilter === r ? "#fff" : "transparent", color: roleFilter === r ? "#000" : "#555" }}>
                {r === "All" ? "All Roles" : ROLE_LABELS[r]}
              </button>
            ))}
          </div>
          <div className="flex gap-1 rounded-lg p-0.5" style={{ backgroundColor: "#111", border: "1px solid #2a2a2a" }}>
            {["All", "active", "inactive"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 rounded text-xs transition-all capitalize"
                style={{ fontFamily: "system-ui,sans-serif", backgroundColor: statusFilter === s ? "#fff" : "transparent", color: statusFilter === s ? "#000" : "#555" }}>
                {s === "All" ? "All" : s}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <span className="text-gray-600 text-sm" style={{ fontFamily: "monospace" }}>
            {filtered.length} users
          </span>
        </div>

        {/* Users table */}
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #1e1e1e" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid #1e1e1e" }}>
                {["User", "Role", "Status", "Last Login", "HRIS Invite", "Task App", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-normal text-gray-600 whitespace-nowrap"
                    style={{ fontFamily: "system-ui,sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => {
                const rc = ROLE_COLORS[user.role];
                return (
                  <tr key={user.id} className="group"
                    style={{
                      borderBottom: i < filtered.length - 1 ? "1px solid #141414" : "none",
                      backgroundColor: user.status === "inactive" ? "#080808" : "#0d0d0d",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#111")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = user.status === "inactive" ? "#080808" : "#0d0d0d")}>

                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar user={user} size={32} />
                          {user.status === "inactive" && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black"
                              style={{ backgroundColor: "#f05a5a" }} />
                          )}
                        </div>
                        <div>
                          <p className="text-white text-sm" style={{ fontFamily: "system-ui,sans-serif", opacity: user.status === "inactive" ? 0.5 : 1 }}>
                            {user.name}
                          </p>
                          <p className="text-gray-600 text-xs" style={{ fontFamily: "system-ui,sans-serif" }}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: "system-ui,sans-serif", ...rc }}>
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: user.status === "active" ? "#5af07a" : "#333" }} />
                        <span className="text-xs capitalize" style={{ fontFamily: "system-ui,sans-serif", color: user.status === "active" ? "#5af07a" : "#555" }}>
                          {user.status}
                        </span>
                      </div>
                    </td>

                    {/* Last Login */}
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap" style={{ fontFamily: "monospace" }}>
                      {user.lastLogin}
                    </td>

                    {/* HRIS Invite status */}
                    <td className="px-4 py-3">
                      {user.mustChangePassword && (
                        <span className="text-xs px-2 py-0.5 rounded"
                          style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#1f1a0f", color: "#f0c85a", border: "1px solid #3a3010" }}>
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Task App invite — opens confirmation modal */}
                    <td className="px-4 py-3">
                      <TaskAppInviteButton user={user} onInvited={handleTaskAppInvited} />
                    </td>

                    {/* Edit */}
                    <td className="px-4 py-3">
                      <button onClick={() => setEditing(user)}
                        className="text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-80"
                        style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", color: "#aaa", border: "1px solid #2a2a2a" }}>
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