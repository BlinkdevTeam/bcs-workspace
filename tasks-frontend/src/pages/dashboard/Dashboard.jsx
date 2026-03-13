import { useState } from "react";
import { useSelector } from "react-redux";

// ── Mock data — replace with API calls in Sprint 6 ────────────────────────────
const MOCK_TASKS = [
  { id: 1, name: "Set up Redux store for tasks-frontend", priority: "high", project: "Sprint 1", due: "today", status: "progress", done: false },
  { id: 2, name: "Configure Axios instance with interceptors", priority: "high", project: "Sprint 1", due: "today", status: "progress", done: false },
  { id: 3, name: "Build ProtectedRoute component", priority: "medium", project: "Sprint 1", due: "tomorrow", status: "progress", done: false },
  { id: 4, name: "Health check endpoint + CORS config", priority: "medium", project: "Sprint 1", due: "today", status: "progress", done: false },
  { id: 5, name: "Create tasks-backend boilerplate", priority: "done", project: "Sprint 1", due: "done", status: "done", done: true },
  { id: 6, name: "Set up RefreshToken + PasswordResetToken models", priority: "done", project: "Sprint 1", due: "done", status: "done", done: true },
];

const MOCK_PROGRESS = [
  { name: "Sprint 1 — Overall", pct: 62, color: "#3b82f6" },
  { name: "HRIS Frontend", pct: 45, color: "#22c55e" },
  { name: "Tasks Backend", pct: 30, color: "#facc15" },
];

const MOCK_ACTIVITY = [
  { text: "Completed", bold: "tasks-backend boilerplate", time: "2 hours ago", color: "#3b82f6" },
  { text: "Junior pushed", bold: "HRIS login page", time: "4 hours ago", color: "#22c55e" },
  { text: "Sprint 1 review scheduled for", bold: "Mar 24", time: "Yesterday", color: "#facc15" },
  { text: "RefreshToken model", bold: "merged to main", time: "Yesterday", color: "#f97316" },
];

const FILTERS = ["All", "Due today", "In progress", "Completed"];

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const firstName = user?.first_name ?? "there";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const [filter, setFilter] = useState("All");
  const [tasks, setTasks] = useState(MOCK_TASKS);

  const filteredTasks = tasks.filter((t) => {
    if (filter === "All") return true;
    if (filter === "Due today") return t.due === "today";
    if (filter === "In progress") return t.status === "progress";
    if (filter === "Completed") return t.done;
    return true;
  });

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, done: !t.done, status: !t.done ? "done" : "progress", due: !t.done ? "done" : "today" }
          : t
      )
    );
  };

  const stats = [
    { label: "Total Tasks", value: tasks.length, sub: "+3 this week", subColor: "#22c55e" },
    { label: "In Progress", value: tasks.filter((t) => t.status === "progress").length, sub: "3 projects", subColor: "#444" },
    { label: "Due Today", value: tasks.filter((t) => t.due === "today").length, sub: "2 high priority", subColor: "#f97316" },
    { label: "Completed", value: tasks.filter((t) => t.done).length, sub: `${Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100)}% rate`, subColor: "#22c55e" },
  ];

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.topRow}>
        <div>
          <div style={s.greeting}>Good morning, {firstName}</div>
          <div style={s.sub}>{today} · {tasks.filter((t) => t.due === "today" && !t.done).length} tasks due today</div>
        </div>
        <button style={s.newBtn}>+ New task</button>
      </div>

      {/* Stats */}
      <div style={s.statsGrid}>
        {stats.map((st) => (
          <div key={st.label} style={s.statCard}>
            <div style={s.statLabel}>{st.label}</div>
            <div style={s.statValue}>{st.value}</div>
            <div style={{ ...s.statSub, color: st.subColor }}>{st.sub}</div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div style={s.contentGrid}>
        {/* Tasks panel */}
        <div>
          <div style={s.panelTitle}>My Tasks</div>
          <div style={s.filters}>
            {FILTERS.map((f) => (
              <div
                key={f}
                style={{ ...s.filterBtn, ...(filter === f ? s.filterBtnActive : {}) }}
                onClick={() => setFilter(f)}
              >
                {f}
              </div>
            ))}
          </div>
          <div>
            {filteredTasks.length === 0 && (
              <div style={s.emptyState}>No tasks found</div>
            )}
            {filteredTasks.map((task) => (
              <div key={task.id} style={s.taskItem}>
                <div
                  style={{ ...s.checkbox, ...(task.done ? s.checkboxDone : {}) }}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.done && (
                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
                      <path d="M1 2.5L3 4.5L7 0.5" stroke={task.done ? "#fff" : "transparent"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...s.taskName, ...(task.done ? s.taskNameDone : {}) }}>
                    {task.name}
                  </div>
                  <div style={s.taskMeta}>
                    <span style={{ ...s.taskBadge, ...priorityStyle(task.priority) }}>
                      {task.priority === "done" ? "Done" : task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    <span style={s.metaDot}>·</span>
                    <span style={s.taskBadge}>{task.project}</span>
                    {task.due !== "done" && (
                      <>
                        <span style={s.metaDot}>·</span>
                        <span style={{ ...s.taskDue, ...(task.due === "today" ? s.taskDueOverdue : {}) }}>
                          Due {task.due}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Progress */}
          <div>
            <div style={s.panelTitle}>Progress</div>
            <div style={s.divLine} />
            {MOCK_PROGRESS.map((p) => (
              <div key={p.name} style={{ marginBottom: 14 }}>
                <div style={s.progressLabel}>
                  <span style={s.progressName}>{p.name}</span>
                  <span style={s.progressPct}>{p.pct}%</span>
                </div>
                <div style={s.progressBar}>
                  <div style={{ ...s.progressFill, width: `${p.pct}%`, background: p.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Activity */}
          <div>
            <div style={s.panelTitle}>Activity</div>
            <div style={s.divLine} />
            {MOCK_ACTIVITY.map((a, i) => (
              <div key={i} style={s.activityItem}>
                <div style={{ ...s.activityDot, background: a.color }} />
                <div>
                  <div style={s.activityText}>
                    {a.text} <span style={s.activityBold}>{a.bold}</span>
                  </div>
                  <div style={s.activityTime}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function priorityStyle(priority) {
  if (priority === "high") return { color: "#f97316" };
  if (priority === "medium") return { color: "#facc15" };
  if (priority === "done") return { color: "#22c55e" };
  return {};
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: { padding: "32px 28px", maxWidth: 960, background: "#141414", minHeight: "100%" },
  topRow: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 },
  greeting: { fontSize: 20, fontWeight: 500, color: "#fff", letterSpacing: "-0.3px" },
  sub: { fontSize: 12, color: "#444", marginTop: 4 },
  newBtn: { fontSize: 12, padding: "7px 16px", borderRadius: 6, background: "transparent", color: "#666", border: "0.5px solid #2e2e2e", cursor: "pointer" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 1, background: "#222", border: "0.5px solid #222", borderRadius: 8, overflow: "hidden", marginBottom: 32 },
  statCard: { background: "#141414", padding: 20 },
  statLabel: { fontSize: 10, color: "#3a3a3a", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 },
  statValue: { fontSize: 30, fontWeight: 400, color: "#fff", lineHeight: 1, marginBottom: 4 },
  statSub: { fontSize: 11 },
  contentGrid: { display: "grid", gridTemplateColumns: "minmax(0,1.9fr) minmax(0,1fr)", gap: 24 },
  panelTitle: { fontSize: 11, fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 },
  filters: { display: "flex", borderBottom: "0.5px solid #222", marginBottom: 16 },
  filterBtn: { fontSize: 11, padding: "6px 14px", background: "transparent", color: "#3a3a3a", cursor: "pointer", borderBottom: "1.5px solid transparent", marginBottom: "-0.5px" },
  filterBtnActive: { color: "#fff", borderBottomColor: "#fff" },
  taskItem: { display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: "0.5px solid #1e1e1e" },
  checkbox: { width: 14, height: 14, borderRadius: 3, border: "0.5px solid #333", flexShrink: 0, marginTop: 3, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" },
  checkboxDone: { background: "#22c55e", borderColor: "#22c55e" },
  taskName: { fontSize: 13, color: "#bbb", marginBottom: 5, lineHeight: 1.4 },
  taskNameDone: { color: "#333", textDecoration: "line-through" },
  taskMeta: { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" },
  taskBadge: { fontSize: 10, color: "#555", letterSpacing: "0.3px" },
  metaDot: { fontSize: 10, color: "#2a2a2a" },
  taskDue: { fontSize: 10, color: "#444" },
  taskDueOverdue: { color: "#f97316" },
  emptyState: { fontSize: 12, color: "#333", padding: "24px 0", textAlign: "center" },
  divLine: { height: "0.5px", background: "#1e1e1e", marginBottom: 14 },
  progressLabel: { display: "flex", justifyContent: "space-between", marginBottom: 5 },
  progressName: { fontSize: 11, color: "#555" },
  progressPct: { fontSize: 11, color: "#444" },
  progressBar: { height: 3, background: "#1e1e1e", borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  activityItem: { display: "flex", gap: 12, padding: "9px 0", borderBottom: "0.5px solid #1e1e1e" },
  activityDot: { width: 5, height: 5, borderRadius: "50%", marginTop: 5, flexShrink: 0 },
  activityText: { fontSize: 12, color: "#555", lineHeight: 1.5 },
  activityBold: { color: "#888", fontWeight: 400 },
  activityTime: { fontSize: 10, color: "#333", marginTop: 2 },
};
