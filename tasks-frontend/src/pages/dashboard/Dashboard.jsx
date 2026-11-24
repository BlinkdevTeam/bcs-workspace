import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { projectColor } from "../../services/projects";
import { setCustomStatuses } from "../../services/statuses";
import { getPriority, getStatus } from "../my-tasks/MyTasks";

const FILTERS = ["All", "Due today", "Overdue", "In progress", "Completed"];

// Local "today" as YYYY-MM-DD, and the date part of a task's due value
const todayStr = () => new Date().toLocaleDateString("en-CA");
const dueDay   = (due) => (due ? String(due).slice(0, 10) : null);

function dueInfo(task, today) {
  const day = dueDay(task.due);
  if (!day || task.done) return null;
  if (day < today) return { text: "Overdue", color: "#f87171" };
  if (day === today) return { text: "Due today", color: "#f97316" };
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  if (day === tomorrow.toLocaleDateString("en-CA")) return { text: "Due tomorrow", color: "#7a7a7a" };
  return {
    text: "Due " + new Date(day + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    color: "#7a7a7a",
  };
}

function timeAgo(iso) {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const firstName = user?.first_name ?? "there";

  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [filter, setFilter]     = useState("All");

  const load = useCallback(async () => {
    try {
      const [t, st] = await Promise.all([
        api.get("/tasks"),
        api.get("/project-statuses").catch(() => ({ data: { statuses: [] } })),
      ]);
      setCustomStatuses(st.data.statuses);
      setAllTasks(t.data.tasks || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load your tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const today = todayStr();
  const hour  = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateLabel = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  // Tasks assigned to me (main tasks and subtasks)
  const mine = allTasks.filter((t) => (t.people || []).some((p) => p.id === user?.id));
  const open      = mine.filter((t) => !t.done);
  const dueToday  = open.filter((t) => dueDay(t.due) === today);
  const overdue   = open.filter((t) => dueDay(t.due) && dueDay(t.due) < today);
  const doneCount = mine.length - open.length;
  const inProg    = open.filter((t) => t.status === "progress");
  const projectCount = new Set(mine.map((t) => t.project_id)).size;

  const stats = [
    { label: "Assigned to me", value: mine.length, sub: `${projectCount} project${projectCount === 1 ? "" : "s"}`, subColor: "#7a7a7a" },
    { label: "In Progress", value: inProg.length, sub: `${open.length} open`, subColor: "#7a7a7a" },
    { label: "Due Today", value: dueToday.length, sub: overdue.length ? `${overdue.length} overdue` : "none overdue", subColor: overdue.length ? "#f87171" : "#22c55e" },
    { label: "Completed", value: doneCount, sub: mine.length ? `${Math.round((doneCount / mine.length) * 100)}% done` : "—", subColor: "#22c55e" },
  ];

  const filteredTasks = mine
    .filter((t) => {
      if (filter === "All") return true;
      if (filter === "Due today") return !t.done && dueDay(t.due) === today;
      if (filter === "Overdue") return !t.done && dueDay(t.due) && dueDay(t.due) < today;
      if (filter === "In progress") return !t.done && t.status === "progress";
      if (filter === "Completed") return t.done;
      return true;
    })
    // open first, then by due date (no date last), finished tasks at the bottom
    .sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      const da = dueDay(a.due) || "9999", db = dueDay(b.due) || "9999";
      return da < db ? -1 : da > db ? 1 : 0;
    });

  const toggleTask = async (task) => {
    const done = !task.done;
    const patch = { done, status: done ? "done" : "todo" };
    setAllTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, ...patch } : t)));   // optimistic
    try {
      await api.patch(`/tasks/${task.id}`, patch);
    } catch {
      setAllTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, done: task.done, status: task.status } : t)));
    }
  };

  // Progress per project (all tasks in the project, not only mine)
  const progress = Object.values(
    allTasks.reduce((acc, t) => {
      const key = t.project_id;
      if (!key) return acc;
      acc[key] = acc[key] || { id: key, name: t.project || "Project", total: 0, done: 0 };
      acc[key].total += 1;
      if (t.done) acc[key].done += 1;
      return acc;
    }, {})
  ).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 6);

  // Recently updated tasks (stands in for an activity log, which doesn't exist yet)
  const recent = [...allTasks]
    .filter((t) => t.updated_at)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 6);

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.topRow}>
        <div>
          <div style={s.greeting}>{greeting}, {firstName}</div>
          <div style={s.sub}>{dateLabel} · {dueToday.length} task{dueToday.length === 1 ? "" : "s"} due today{overdue.length ? ` · ${overdue.length} overdue` : ""}</div>
        </div>
      </div>

      {error && <div style={{ ...s.emptyState, color: "#f87171" }}>{error}</div>}

      {/* Stats */}
      <div style={s.statsGrid}>
        {stats.map((st) => (
          <div key={st.label} style={s.statCard}>
            <div style={s.statLabel}>{st.label}</div>
            <div style={s.statValue}>{loading ? "…" : st.value}</div>
            <div style={{ ...s.statSub, color: st.subColor }}>{loading ? "" : st.sub}</div>
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
              <div key={f} style={{ ...s.filterBtn, ...(filter === f ? s.filterBtnActive : {}) }} onClick={() => setFilter(f)}>
                {f}
              </div>
            ))}
          </div>
          <div>
            {loading ? (
              <div style={s.emptyState}>Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
              <div style={s.emptyState}>{mine.length === 0 ? "No tasks are assigned to you yet." : "No tasks found"}</div>
            ) : filteredTasks.map((task) => {
              const pr  = getPriority(task.priority);
              const st  = getStatus(task.status);
              const due = dueInfo(task, today);
              return (
                <div key={task.id} style={s.taskItem}>
                  <div style={{ ...s.checkbox, ...(task.done ? s.checkboxDone : {}) }} onClick={() => toggleTask(task)}>
                    {task.done && (
                      <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
                        <path d="M1 2.5L3 4.5L7 0.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...s.taskName, ...s.taskLink, ...(task.done ? s.taskNameDone : {}) }}
                         onClick={() => navigate(`/projects/${task.project_id}`)}>
                      {task.name}
                    </div>
                    <div style={s.taskMeta}>
                      <span style={{ ...s.taskBadge, color: pr.color }}>{pr.label}</span>
                      <span style={s.metaDot}>·</span>
                      <span style={{ ...s.taskBadge, color: st.color }}>{st.label}</span>
                      <span style={s.metaDot}>·</span>
                      <span style={s.taskBadge}>{task.project}</span>
                      {task.parent_id && (<><span style={s.metaDot}>·</span><span style={s.taskBadge}>Subtask</span></>)}
                      {due && (<><span style={s.metaDot}>·</span><span style={{ ...s.taskDue, color: due.color }}>{due.text}</span></>)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Progress */}
          <div>
            <div style={s.panelTitle}>Progress by project</div>
            <div style={s.divLine} />
            {progress.length === 0 && <div style={s.emptyState}>No projects with tasks yet</div>}
            {progress.map((p) => {
              const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
              return (
                <div key={p.id} style={{ marginBottom: 14, cursor: "pointer" }} onClick={() => navigate(`/projects/${p.id}`)}>
                  <div style={s.progressLabel}>
                    <span style={s.progressName}>{p.name}</span>
                    <span style={s.progressPct}>{p.done}/{p.total} · {pct}%</span>
                  </div>
                  <div style={s.progressBar}>
                    <div style={{ ...s.progressFill, width: `${pct}%`, background: projectColor(p.name) }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recently updated */}
          <div>
            <div style={s.panelTitle}>Recently updated</div>
            <div style={s.divLine} />
            {recent.length === 0 && <div style={s.emptyState}>Nothing yet</div>}
            {recent.map((t) => (
              <div key={t.id} style={s.activityItem}>
                <div style={{ ...s.activityDot, background: t.done ? "#22c55e" : projectColor(t.project || "") }} />
                <div>
                  <div style={s.activityText}>
                    {t.done ? "Completed" : "Updated"} <span style={s.activityBold}>{t.name}</span>
                    {t.project ? <> in {t.project}</> : null}
                  </div>
                  <div style={s.activityTime}>{timeAgo(t.updated_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: { padding: "32px 28px", background: "#202020", minHeight: "100%" },
  topRow: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 },
  greeting: { fontSize: 20, fontWeight: 500, color: "#fff", letterSpacing: "-0.3px" },
  sub: { fontSize: 12, color: "#7a7a7a", marginTop: 4 },
  newBtn: { fontSize: 12, padding: "7px 16px", borderRadius: 6, background: "transparent", color: "#9a9a9a", border: "0.5px solid #3d3d3d", cursor: "pointer" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 1, background: "#303030", border: "0.5px solid #303030", borderRadius: 8, overflow: "hidden", marginBottom: 32 },
  statCard: { background: "#202020", padding: 20 },
  statLabel: { fontSize: 10, color: "#707070", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 },
  statValue: { fontSize: 30, fontWeight: 400, color: "#fff", lineHeight: 1, marginBottom: 4 },
  statSub: { fontSize: 11 },
  contentGrid: { display: "grid", gridTemplateColumns: "minmax(0,1.9fr) minmax(0,1fr)", gap: 24 },
  panelTitle: { fontSize: 11, fontWeight: 500, color: "#7a7a7a", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 },
  filters: { display: "flex", borderBottom: "0.5px solid #303030", marginBottom: 16 },
  filterBtn: { fontSize: 11, padding: "6px 14px", background: "transparent", color: "#707070", cursor: "pointer", borderBottom: "1.5px solid transparent", marginBottom: "-0.5px" },
  filterBtnActive: { color: "#fff", borderBottomColor: "#fff" },
  taskItem: { display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: "0.5px solid #2c2c2c" },
  checkbox: { width: 14, height: 14, borderRadius: 3, border: "0.5px solid #454545", flexShrink: 0, marginTop: 3, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" },
  checkboxDone: { background: "#22c55e", borderColor: "#22c55e" },
  taskName: { fontSize: 13, color: "#bbb", marginBottom: 5, lineHeight: 1.4 },
  taskNameDone: { color: "#333", textDecoration: "line-through" },
  taskMeta: { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" },
  taskBadge: { fontSize: 10, color: "#8a8a8a", letterSpacing: "0.3px" },
  metaDot: { fontSize: 10, color: "#2a2a2a" },
  taskDue: { fontSize: 10, color: "#7a7a7a" },
  taskDueOverdue: { color: "#f97316" },
  taskLink: { cursor: "pointer" },
  statLink: { cursor: "pointer" },
  emptyState: { fontSize: 12, color: "#333", padding: "24px 0", textAlign: "center" },
  divLine: { height: "0.5px", background: "#2c2c2c", marginBottom: 14 },
  progressLabel: { display: "flex", justifyContent: "space-between", marginBottom: 5 },
  progressName: { fontSize: 11, color: "#8a8a8a" },
  progressPct: { fontSize: 11, color: "#7a7a7a" },
  progressBar: { height: 3, background: "#2c2c2c", borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  activityItem: { display: "flex", gap: 12, padding: "9px 0", borderBottom: "0.5px solid #2c2c2c" },
  activityDot: { width: 5, height: 5, borderRadius: "50%", marginTop: 5, flexShrink: 0 },
  activityText: { fontSize: 12, color: "#8a8a8a", lineHeight: 1.5 },
  activityBold: { color: "#b0b0b0", fontWeight: 400 },
  activityTime: { fontSize: 10, color: "#333", marginTop: 2 },
};
