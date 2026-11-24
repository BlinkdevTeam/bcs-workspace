import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { selectUser } from "../../store/slices/authSlice";
import TaskPanel from "./TaskPanel";
import { projectColor } from "../../services/projects";
import { CUSTOM_STATUSES, setCustomStatuses, customFor } from "../../services/statuses";
import StatusMenu from "../../components/StatusMenu";

// ── Helpers for API data ──────────────────────────────────────────────────────
const PERSON_COLORS   = ["#3b82f6", "#a78bfa", "#f97316", "#22c55e", "#ec4899", "#14b8a6"];

function hashIndex(str, mod) {
  const v = str || "";
  let h = 0;
  for (let i = 0; i < v.length; i++) h = (h * 31 + v.charCodeAt(i)) >>> 0;
  return h % mod;
}

// Filled from GET /employees. Mutated in place so the helpers below can read it.
export const PEOPLE = [];

function setPeople(employees) {
  PEOPLE.length = 0;
  employees.forEach((e) =>
    PEOPLE.push({
      id:       e.id,
      name:     e.name,
      initials: e.initials || "?",
      color:    PERSON_COLORS[hashIndex(e.id, PERSON_COLORS.length)],
    })
  );
}

// API task -> the shape the UI already uses (people = array of employee ids)
const toUi = (t) => ({
  id:          t.id,
  name:        t.name,
  priority:    t.priority || "medium",
  status:      t.status,
  project:     t.project,
  project_id:  t.project_id,
  due:         t.due,
  people:      (t.people || []).map((p) => p.id),
  done:        t.done,
  parent_id:   t.parent_id ?? null,
  description: t.description || "",
});

export const STATUSES = [
  { value: "todo",     label: "To Do",       color: "#8a8a8a",    bg: "#2c2c2c" },
  { value: "progress", label: "In Progress", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  { value: "review",   label: "In Review",   color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  { value: "done",     label: "Done",        color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
];

export const PRIORITIES = [
  { value: "critical", label: "Critical", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  { value: "high",   label: "High",   color: "#f97316", bg: "rgba(249,115,22,0.1)" },
  { value: "medium", label: "Medium", color: "#facc15", bg: "rgba(250,204,21,0.08)" },
  { value: "low",    label: "Low",    color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
export const getStatus   = (v) => STATUSES.find((s) => s.value === v) ?? CUSTOM_STATUSES.find((s) => s.value === v) ?? STATUSES[0];
// Built-in statuses + the custom labels of one project
export const statusesFor = (projectId) => [...STATUSES, ...customFor(projectId)];
export const getPriority = (v) => PRIORITIES.find((p) => p.value === v) ?? PRIORITIES.find((p) => p.value === "medium");
export const getPerson   = (id) => PEOPLE.find((p) => p.id === id);

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const today    = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const d        = new Date(dateStr);
  if (d < today)                                    return "Overdue";
  if (d.toDateString() === today.toDateString())    return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function dateColor(dateStr, done) {
  if (done) return "#444";
  if (!dateStr) return "#555";
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d     = new Date(dateStr);
  if (d < today)                                    return "#f97316";
  if (d.toDateString() === today.toDateString())    return "#facc15";
  return "#555";
}

// ── Stacked Avatars ───────────────────────────────────────────────────────────
export function StackedAvatars({ peopleIds, max = 3, size = 22 }) {
  const visible = peopleIds.slice(0, max);
  const overflow = peopleIds.length - max;
  const overlap = Math.round(size * 0.35);

  return (
    <div style={{ display: "flex", alignItems: "center", height: size }}>
      <div style={{ display: "flex", position: "relative", width: visible.length * (size - overlap) + overlap + (overflow > 0 ? size - overlap : 0) }}>
        {visible.map((id, i) => {
          const p = getPerson(id);
          return (
            <div
              key={id}
              title={p?.name ?? id}
              style={{
                width: size, height: size, borderRadius: "50%",
                background: p?.color ?? "#555",
                border: "1.5px solid #202020",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: size * 0.38, color: "#fff", fontWeight: 600,
                position: "absolute", left: i * (size - overlap),
                zIndex: visible.length - i,
                userSelect: "none",
              }}
            >
              {p?.initials ?? "?"}
            </div>
          );
        })}
        {overflow > 0 && (
          <div style={{
            width: size, height: size, borderRadius: "50%",
            background: "#383838", border: "1.5px solid #202020",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: size * 0.34, color: "#9a9a9a",
            position: "absolute", left: visible.length * (size - overlap),
            zIndex: 0,
          }}>
            +{overflow}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Multi-person Dropdown ─────────────────────────────────────────────────────
export function PeopleDropdown({ selected, onChange, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const toggle = (id) => {
    if (selected.includes(id)) {
      const next = selected.filter((s) => s !== id);
      onChange(next.length ? next : selected); // keep at least 1
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div ref={ref} style={pd.menu} onClick={(e) => e.stopPropagation()}>
      <div style={pd.title}>Assign people</div>
      {PEOPLE.map((p) => {
        const checked = selected.includes(p.id);
        return (
          <div key={p.id} style={pd.item} onClick={() => toggle(p.id)}>
            <div style={{ ...pd.avatar, background: p.color }}>{p.initials}</div>
            <span style={pd.name}>{p.name}</span>
            <div style={{ ...pd.check, ...(checked ? { background: "#22c55e", borderColor: "#22c55e" } : {}) }}>
              {checked && (
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3L3 5L7 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const pd = {
  menu:   { position: "absolute", top: 32, left: 0, background: "#262626", border: "0.5px solid #454545", borderRadius: 8, zIndex: 200, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.5)", minWidth: 180 },
  title:  { fontSize: 10, color: "#7a7a7a", padding: "8px 12px 4px", textTransform: "uppercase", letterSpacing: 1 },
  item:   { display: "flex", alignItems: "center", gap: 9, padding: "7px 12px", cursor: "pointer" },
  avatar: { width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 600, flexShrink: 0 },
  name:   { fontSize: 12, color: "#b0b0b0", flex: 1 },
  check:  { width: 14, height: 14, borderRadius: 3, border: "0.5px solid #555", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
};

// ── MyTasks ───────────────────────────────────────────────────────────────────
export default function MyTasks() {
  const me = useSelector(selectUser);
  const { projectId } = useParams();   // set on /projects/:projectId
  const inProject = !!projectId;

  const [tasks, setTasks]                 = useState([]);
  const [projects, setProjects]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [loadError, setLoadError]         = useState("");
  const [search, setSearch]               = useState("");
  const [collapsed, setCollapsed]         = useState(new Set());
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [openMenu, setOpenMenu]           = useState(null);
  const [selectedTask, setSelectedTask]   = useState(null);
  const [filters, setFilters]             = useState({
    priority: new Set(), project: new Set(), person: new Set(), date: new Set(),
  });

  const load = useCallback(async () => {
    try {
      const [t, e, p, st] = await Promise.all([
        api.get("/tasks"), api.get("/employees"), api.get("/projects"),
        api.get("/project-statuses").catch(() => ({ data: { statuses: [] } })),
      ]);
      setCustomStatuses(st.data.statuses);
      setPeople(e.data.employees);
      setProjects(p.data.projects);
      setTasks(t.data.tasks.map(toUi));
      setSelectedTask(null);
      setLoadError("");
    } catch (err) {
      setLoadError(err.response?.data?.message || "Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Reload when a project is created from anywhere (e.g. the sidebar)
  useEffect(() => {
    window.addEventListener("projects:changed", load);
    return () => window.removeEventListener("projects:changed", load);
  }, [load]);

  // A label was added or deleted: re-render; for a deleted one, those tasks fall back to To Do
  const [, setStatusTick] = useState(0);
  useEffect(() => {
    const onChange = (e) => {
      setStatusTick((n) => n + 1);
      const gone = e.detail?.deleted;
      if (gone) {
        setTasks((prev) => prev.map((t) => (t.status === gone ? { ...t, status: "todo", done: false } : t)));
        setSelectedTask((prev) => (prev && prev.status === gone ? { ...prev, status: "todo", done: false } : prev));
      }
    };
    window.addEventListener("statuses:changed", onChange);
    return () => window.removeEventListener("statuses:changed", onChange);
  }, []);

  // Switching project (or going to My Tasks) closes the panel and clears the search
  useEffect(() => { setSelectedTask(null); setSearch(""); }, [projectId]);

  // Optimistic update, then save. If saving fails, reload the real data.
  const updateTask = async (id, patch) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    setSelectedTask((prev) => (prev?.id === id ? { ...prev, ...patch } : prev));

    const body = {};
    if (patch.name        !== undefined) body.name         = patch.name;
    if (patch.description !== undefined) body.description  = patch.description;
    if (patch.priority    !== undefined) body.priority     = patch.priority;
    if (patch.status      !== undefined) body.status       = patch.status;
    else if (patch.done   !== undefined) body.done         = patch.done;
    if (patch.due         !== undefined) body.due          = patch.due;
    if (patch.people      !== undefined) body.assignee_ids = patch.people;

    try {
      await api.patch(`/tasks/${id}`, body);
    } catch (err) {
      alert(err.response?.data?.message || "Could not save that change.");
      load();
    }
  };

  const addSubtask = async (parentId) => {
    const parent = tasks.find((t) => t.id === parentId);
    if (!parent) return;
    try {
      const { data } = await api.post("/tasks", {
        name: "New subtask", parent_id: parentId,
        due: parent.due, assignee_ids: parent.people,
      });
      setTasks((prev) => [...prev, toUi(data.task)]);
      setExpandedTasks((prev) => new Set([...prev, parentId]));
    } catch (err) {
      alert(err.response?.data?.message || "Could not add subtask.");
    }
  };

  const addTask = async (projectId) => {
    const pid = projectId || projects[0]?.id;
    if (!pid) { alert("There are no projects yet."); return; }
    try {
      const { data } = await api.post("/tasks", {
        name: "New task", project_id: pid,
        assignee_ids: me?.id ? [me.id] : [],
      });
      const created = toUi(data.task);
      setTasks((prev) => [...prev, created]);
      setSelectedTask(created);
    } catch (err) {
      alert(err.response?.data?.message || "Could not create task.");
    }
  };

  // ── Drag (order is local only for now) ───────────────────────────────────────
  const dragId                    = useRef(null);
  const dragOverId                = useRef(null);
  const [dragState, setDragState] = useState({ dragging: null, over: null });

  const onDragStart = useCallback((id) => { dragId.current = id; setDragState({ dragging: id, over: null }); }, []);
  const onDragOver  = useCallback((id) => {
    if (id === dragId.current) return;
    dragOverId.current = id;
    setDragState((prev) => ({ ...prev, over: id }));
  }, []);
  const onDragEnd   = useCallback(() => {
    const fromId = dragId.current, toId = dragOverId.current;
    if (fromId && toId && fromId !== toId) {
      setTasks((prev) => {
        const next = [...prev];
        const fromI = next.findIndex((t) => t.id === fromId);
        const toI   = next.findIndex((t) => t.id === toId);
        const [item] = next.splice(fromI, 1);
        next.splice(toI, 0, item);
        return next;
      });
    }
    dragId.current = null; dragOverId.current = null;
    setDragState({ dragging: null, over: null });
  }, []);

  // ── Filters ───────────────────────────────────────────────────────────────────
  const toggleFilter = (type, val) => {
    setFilters((prev) => {
      const next = new Set(prev[type]);
      next.has(val) ? next.delete(val) : next.add(val);
      return { ...prev, [type]: next };
    });
  };
  const clearFilters   = () => { setSearch(""); setFilters({ priority: new Set(), project: new Set(), person: new Set(), date: new Set() }); };
  const toggleCollapse = (p) => { setCollapsed((prev) => { const n = new Set(prev); n.has(p) ? n.delete(p) : n.add(p); return n; }); };
  const toggleExpand   = (id) => { setExpandedTasks((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); };

  const hasActiveFilters = filters.priority.size || filters.project.size || filters.person.size || filters.date.size || search;

  const today    = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

  // "My Tasks": main tasks I'm assigned to, or whose subtasks are assigned to me
  const myTopLevelIds = new Set();
  tasks.forEach((t) => {
    if (me?.id && t.people.includes(me.id)) myTopLevelIds.add(t.parent_id ?? t.id);
  });

  const filtered = tasks.filter((t) => {
    if (t.parent_id !== null) return false;
    if (inProject) { if (t.project_id !== projectId) return false; }
    else if (!myTopLevelIds.has(t.id)) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.priority.size && !filters.priority.has(t.priority)) return false;
    if (filters.project.size  && !filters.project.has(t.project))   return false;
    if (filters.person.size   && !t.people.some((p) => filters.person.has(p))) return false;
    if (filters.date.size) {
      if (!t.due) return false;
      const d = new Date(t.due);
      if (filters.date.has("overdue")  && d < today)                                    return true;
      if (filters.date.has("today")    && d.toDateString() === today.toDateString())    return true;
      if (filters.date.has("tomorrow") && d.toDateString() === tomorrow.toDateString()) return true;
      return false;
    }
    return true;
  });

  // Project page: one table for that project (no group header).
  // My Tasks: my tasks, grouped by project.
  const currentProject = projects.find((p) => p.id === projectId);
  const groups = inProject
    ? (currentProject ? [{ id: currentProject.id, name: currentProject.name, tasks: filtered }] : [])
    : projects
        .map((p) => ({ id: p.id, name: p.name, tasks: filtered.filter((x) => x.project_id === p.id) }))
        .filter((g) => g.tasks.length > 0)
        .sort((a, b) => a.name.localeCompare(b.name));

  const panelOpen = !!selectedTask;

  return (
    <div style={s.root} onClick={() => setOpenMenu(null)}>

      {/* ── Table area ── */}
      <div style={s.tableArea}>

        <div style={s.pageHeader}>
          <div style={s.topRow}>
            <div>
              <div style={s.title}>{inProject ? (currentProject?.name ?? "Project") : "My Tasks"}</div>
              <div style={s.sub}>
                {inProject
                  ? (currentProject?.description || "All tasks in this project")
                  : "Tasks assigned to you across all projects"}
              </div>
            </div>
            <button style={s.newBtn} onClick={() => addTask(inProject ? projectId : groups[0]?.id)}>+ New task</button>
          </div>

          <div style={s.filterBar} onClick={(e) => e.stopPropagation()}>
            <div style={s.searchBox}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..." style={s.searchInput} />
            </div>
            <div style={s.filterSep} />

            <FilterDropdown label="Priority" isOpen={openMenu === "priority"} isActive={filters.priority.size > 0} onToggle={() => setOpenMenu(openMenu === "priority" ? null : "priority")}
              icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M6 12h12M9 18h6" /></svg>}>
              {PRIORITIES.map((p) => <FilterOption key={p.value} label={p.label} checked={filters.priority.has(p.value)} onClick={() => toggleFilter("priority", p.value)} />)}
            </FilterDropdown>

            {!inProject && (
            <FilterDropdown label="Project" isOpen={openMenu === "project"} isActive={filters.project.size > 0} onToggle={() => setOpenMenu(openMenu === "project" ? null : "project")}
              icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>}>
              {projects.map((p) => <FilterOption key={p.id} label={p.name} checked={filters.project.has(p.name)} onClick={() => toggleFilter("project", p.name)} />)}
            </FilterDropdown>
            )}

            <FilterDropdown label="Person" isOpen={openMenu === "person"} isActive={filters.person.size > 0} onToggle={() => setOpenMenu(openMenu === "person" ? null : "person")}
              icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 10-16 0" /></svg>}>
              {PEOPLE.map((p) => <FilterOption key={p.id} label={p.name} checked={filters.person.has(p.id)} onClick={() => toggleFilter("person", p.id)} />)}
            </FilterDropdown>

            <FilterDropdown label="Due date" isOpen={openMenu === "date"} isActive={filters.date.size > 0} onToggle={() => setOpenMenu(openMenu === "date" ? null : "date")}
              icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>}>
              {[["today","Due today"],["tomorrow","Due tomorrow"],["overdue","Overdue"]].map(([val, label]) =>
                <FilterOption key={val} label={label} checked={filters.date.has(val)} onClick={() => toggleFilter("date", val)} />
              )}
            </FilterDropdown>

            {hasActiveFilters && <div style={s.clearBtn} onClick={clearFilters}>Clear</div>}
          </div>
        </div>

        <div style={s.tableWrapper}>
         <div style={{ flex: "0 0 100%", minWidth: 1000 }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={{ ...s.th, paddingLeft: 24, width: "40%" }}>Task</th>
                <th style={{ ...s.th, width: 130 }}>Status</th>
                <th style={{ ...s.th, width: 110 }}>Priority</th>
                <th style={{ ...s.th, width: 110 }}>People</th>
                <th style={{ ...s.th, width: 110 }}>Due date</th>
              </tr>
            </thead>
            <tbody>
              {groups.length === 0 ? (
                <tr><td colSpan={5} style={s.emptyState}>
                  {loading ? "Loading tasks..." : loadError || (hasActiveFilters ? "No tasks match your filters" : inProject ? "Project not found." : "No tasks assigned to you yet.")}
                </td></tr>
              ) : (
                groups.map((g) => (
                  <ProjectGroup
                    key={g.id}
                    project={g.name} tasks={g.tasks} allTasks={tasks}
                    color={projectColor(g.name)}
                    collapsed={collapsed.has(g.name)}
                    onToggleCollapse={() => toggleCollapse(g.name)}
                    onUpdateTask={updateTask} onAddSubtask={addSubtask}
                    onAddTask={() => addTask(g.id)}
                    showHeader={!inProject}
                    expandedTasks={expandedTasks} onToggleExpand={toggleExpand}
                    selectedTaskId={selectedTask?.id}
                    onRowClick={(task) => setSelectedTask(task.id === selectedTask?.id ? null : task)}
                    dragState={dragState}
                    onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}
                  />
                ))
              )}
            </tbody>
          </table>
         </div>
         {panelOpen && <div style={{ flex: `0 0 ${PANEL_WIDTH}px` }} />}
        </div>
      </div>

      {/* ── Detail panel ── */}
      {panelOpen && (
        <div style={s.panelArea} onClick={(e) => e.stopPropagation()}>
          <TaskPanel
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={(patch) => updateTask(selectedTask.id, patch)}
          />
        </div>
      )}

    </div>
  );
}

// ── ProjectGroup ──────────────────────────────────────────────────────────────
function ProjectGroup({ project, tasks, allTasks, color, collapsed, onToggleCollapse, onUpdateTask, onAddSubtask, onAddTask, showHeader = true, expandedTasks, onToggleExpand, selectedTaskId, onRowClick, dragState, onDragStart, onDragOver, onDragEnd }) {
  return (
    <>
      {showHeader && (
        <tr>
          <td colSpan={5} style={{ padding: 0, background: "#202020" }}>
            <div style={s.groupHeader} onClick={onToggleCollapse}>
              <div style={{ ...s.groupDot, background: color }} />
              <span style={s.groupName}>{project}</span>
              <span style={s.groupCount}>{tasks.length}</span>
              <span style={s.groupChevron}>{collapsed ? "▸" : "▾"}</span>
            </div>
          </td>
        </tr>
      )}
      {(!showHeader || !collapsed) && (
        <>
          {tasks.map((task) => {
            const subtasks   = allTasks.filter((t) => t.parent_id === task.id);
            const isExpanded = expandedTasks.has(task.id);
            return (
              <TaskRow
                key={task.id} task={task} subtasks={subtasks} isExpanded={isExpanded}
                onToggleExpand={() => onToggleExpand(task.id)}
                onUpdate={(patch) => onUpdateTask(task.id, patch)}
                onAddSubtask={() => onAddSubtask(task.id)}
                onUpdateSubtask={onUpdateTask}
                isSelected={selectedTaskId === task.id} onRowClick={onRowClick}
                isDragging={dragState.dragging === task.id} isDragOver={dragState.over === task.id}
                onDragStart={() => onDragStart(task.id)} onDragOver={() => onDragOver(task.id)} onDragEnd={onDragEnd}
                isSubtask={false}
              />
            );
          })}
          <tr>
            <td colSpan={5} style={s.addTaskCell}>
              <div style={s.addTaskBtn} onClick={onAddTask}>+ Add task</div>
            </td>
          </tr>
        </>
      )}
    </>
  );
}

// ── TaskRow ───────────────────────────────────────────────────────────────────
function TaskRow({ task, subtasks = [], isExpanded, onToggleExpand, onUpdate, onAddSubtask, onUpdateSubtask, isSelected, onRowClick, isDragging, isDragOver, onDragStart, onDragOver, onDragEnd, isSubtask }) {
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal]         = useState(task.name);
  const [openCell, setOpenCell]       = useState(null);
  const nameRef                       = useRef(null);

  useEffect(() => { if (editingName) nameRef.current?.focus(); }, [editingName]);
  useEffect(() => { setNameVal(task.name); }, [task.name]);

  const commitName = () => { setEditingName(false); if (nameVal.trim()) onUpdate({ name: nameVal.trim() }); else setNameVal(task.name); };
  const toggleCell = (cell, e) => { e.stopPropagation(); setOpenCell(openCell === cell ? null : cell); };

  const rowStyle = {
    ...s.taskRow,
    ...(isSubtask  ? s.subtaskRow  : {}),
    ...(isSelected ? s.selectedRow : {}),
    opacity:    isDragging ? 0.4 : 1,
    borderTop:  isDragOver ? "2px solid #3b82f6" : undefined,
    background: isSelected ? "rgba(59,130,246,0.06)" : isDragOver ? "rgba(59,130,246,0.04)" : isSubtask ? "#252525" : "#202020",
  };

  return (
    <>
      <tr
        style={rowStyle}
        draggable={!isSubtask}
        onDragStart={!isSubtask ? (e) => { e.dataTransfer.effectAllowed = "move"; onDragStart(); } : undefined}
        onDragOver={!isSubtask  ? (e) => { e.preventDefault(); onDragOver(); } : undefined}
        onDragEnd={!isSubtask   ? onDragEnd : undefined}
        onClick={() => { setOpenCell(null); if (!editingName) onRowClick(task); }}
      >
        {/* Name */}
        <td style={{ paddingLeft: isSubtask ? 56 : 24, background: "transparent" }}>
          <div style={s.taskNameCell}>
            {!isSubtask && (
              <div style={s.dragHandle}>
                <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
                  <circle cx="3" cy="2.5"  r="1" fill="#444" /><circle cx="7" cy="2.5"  r="1" fill="#444" />
                  <circle cx="3" cy="7"    r="1" fill="#444" /><circle cx="7" cy="7"    r="1" fill="#444" />
                  <circle cx="3" cy="11.5" r="1" fill="#444" /><circle cx="7" cy="11.5" r="1" fill="#444" />
                </svg>
              </div>
            )}
            {isSubtask && <div style={s.subtaskLine} />}
            {!isSubtask && (
              <div style={s.expandBtn} title={isExpanded ? "Hide subtasks" : "Show subtasks"}
                onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d={isExpanded ? "M2 4l3 3 3-3" : "M4 2l3 3-3 3"} stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
            <div style={{ ...s.checkbox, ...(task.done ? s.checkboxDone : {}) }}
              onClick={(e) => { e.stopPropagation(); onUpdate({ done: !task.done, status: !task.done ? "done" : "todo" }); }}>
              {task.done && <svg width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M1 2.5L3 4.5L7 0.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            {editingName ? (
              <input ref={nameRef} value={nameVal} onChange={(e) => setNameVal(e.target.value)}
                onBlur={commitName}
                onKeyDown={(e) => { if (e.key === "Enter") commitName(); if (e.key === "Escape") { setNameVal(task.name); setEditingName(false); } }}
                style={s.nameInput} onClick={(e) => e.stopPropagation()} />
            ) : (
              <span style={{ ...s.taskName, ...(task.done ? s.taskNameDone : {}), ...(isSubtask ? s.subtaskName : {}) }}
                onDoubleClick={(e) => { e.stopPropagation(); setNameVal(task.name); setEditingName(true); }}
                title="Double-click to edit">
                {task.name}
              </span>
            )}
            {!isSubtask && subtasks.length > 0 && (
              <span style={s.subtaskBadge}>{subtasks.filter((x) => x.done).length}/{subtasks.length}</span>
            )}
            {!isSubtask && (
              <span style={s.addSubInline} title="Add subtask"
                onClick={(e) => { e.stopPropagation(); onAddSubtask(); }}>+ subtask</span>
            )}
          </div>
        </td>

        {/* Status */}
        <td style={s.cell} onClick={(e) => e.stopPropagation()}>
          <div style={{ position: "relative" }}>
            <div style={{ ...s.pill, color: getStatus(task.status).color, background: getStatus(task.status).bg, cursor: "pointer" }} onClick={(e) => toggleCell("status", e)}>
              {getStatus(task.status).label}
            </div>
            {openCell === "status" && (
              <CellDropdown onClose={() => setOpenCell(null)} width={220}>
                <StatusMenu
                  options={statusesFor(task.project_id)} projectId={task.project_id}
                  itemStyle={s.cdItem} pillStyle={s.pill}
                  onPick={(st) => { onUpdate({ status: st.value, done: st.value === "done" }); setOpenCell(null); }}
                />
              </CellDropdown>
            )}
          </div>
        </td>

        {/* Priority */}
        <td style={s.cell} onClick={(e) => e.stopPropagation()}>
          <div style={{ position: "relative" }}>
            <div style={{ ...s.pill, color: getPriority(task.priority).color, background: getPriority(task.priority).bg, cursor: "pointer" }} onClick={(e) => toggleCell("priority", e)}>
              {getPriority(task.priority).label}
            </div>
            {openCell === "priority" && (
              <CellDropdown onClose={() => setOpenCell(null)}>
                {PRIORITIES.map((pr) => (
                  <div key={pr.value} style={s.cdItem} onClick={() => { onUpdate({ priority: pr.value }); setOpenCell(null); }}>
                    <span style={{ ...s.pill, color: pr.color, background: pr.bg }}>{pr.label}</span>
                  </div>
                ))}
              </CellDropdown>
            )}
          </div>
        </td>

        {/* People — stacked avatars + multi-select dropdown */}
        <td style={s.cell} onClick={(e) => e.stopPropagation()}>
          <div style={{ position: "relative" }}>
            <div style={{ cursor: "pointer", display: "inline-flex" }} onClick={(e) => toggleCell("people", e)}>
              {task.people.length > 0
                ? <StackedAvatars peopleIds={task.people} max={3} size={22} />
                : <span style={{ fontSize: 11, color: "#7a7a7a" }}>Unassigned</span>}
            </div>
            {openCell === "people" && (
              <PeopleDropdown
                selected={task.people}
                onChange={(next) => onUpdate({ people: next })}
                onClose={() => setOpenCell(null)}
              />
            )}
          </div>
        </td>

        {/* Date */}
        <td style={s.cell} onClick={(e) => e.stopPropagation()}>
          <div style={{ position: "relative" }}>
            <div style={{ cursor: "pointer" }} onClick={(e) => toggleCell("date", e)}>
              <span style={{ fontSize: 11, color: dateColor(task.due, task.done) }}>{formatDate(task.due) || "No date"}</span>
            </div>
            {openCell === "date" && (
              <CellDropdown onClose={() => setOpenCell(null)} width={160}>
                <div style={{ padding: "8px 12px" }}>
                  <input type="date" defaultValue={task.due || ""} style={s.dateInput}
                    onChange={(e) => { onUpdate({ due: e.target.value }); setOpenCell(null); }}
                    onClick={(e) => e.stopPropagation()} />
                </div>
              </CellDropdown>
            )}
          </div>
        </td>
      </tr>

      {/* Subtasks */}
      {!isSubtask && isExpanded && (
        <>
          {subtasks.map((sub) => (
            <TaskRow key={sub.id} task={sub} subtasks={[]} isExpanded={false}
              onToggleExpand={() => {}} onUpdate={(patch) => onUpdateSubtask(sub.id, patch)}
              onAddSubtask={() => {}} onUpdateSubtask={onUpdateSubtask}
              isSelected={false} onRowClick={onRowClick}
              isDragging={false} isDragOver={false}
              onDragStart={() => {}} onDragOver={() => {}} onDragEnd={() => {}}
              isSubtask={true} />
          ))}
          <tr style={{ background: "#252525", borderBottom: `0.5px solid ${LINE_COLOR}` }}>
            <td colSpan={5} style={{ paddingLeft: 56, paddingTop: 7, paddingBottom: 7, background: "#252525" }}>
              <div style={s.addSubtaskBtn} onClick={() => onAddSubtask()}>+ Add subtask</div>
            </td>
          </tr>
        </>
      )}
    </>
  );
}

// ── CellDropdown ──────────────────────────────────────────────────────────────
function CellDropdown({ children, onClose, width = 180 }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return (
    <div ref={ref} style={{ ...s.cellDropdown, width }} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  );
}

// ── FilterDropdown ────────────────────────────────────────────────────────────
function FilterDropdown({ label, icon, isOpen, isActive, onToggle, children }) {
  return (
    <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
      <div style={{ ...s.filterBtn, ...(isActive ? s.filterBtnActive : {}) }} onClick={onToggle}>{icon}{label}</div>
      {isOpen && <div style={s.dropdownMenu}>{children}</div>}
    </div>
  );
}

function FilterOption({ label, checked, onClick }) {
  return (
    <div style={s.ddItem} onClick={onClick}>
      <div style={{ ...s.ddCheck, ...(checked ? s.ddCheckOn : {}) }}>
        {checked && <svg width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M1 2.5L3 4.5L7 0.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
      {label}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const PANEL_WIDTH = 520;
const LINE_COLOR  = "#2c2c2c";   // table row lines

const s = {
  root:            { background: "#202020", position: "absolute", top: 0, right: 0, bottom: 0, left: 0, display: "flex", overflow: "hidden" },
  tableArea:       { display: "flex", flexDirection: "column", overflow: "hidden", width: "100%", minWidth: 0 },
  panelArea:       { position: "absolute", top: 0, right: 0, bottom: 0, width: PANEL_WIDTH, maxWidth: "92%", zIndex: 60, background: "#202020", borderLeft: "0.5px solid #454545", boxShadow: "-12px 0 32px rgba(0,0,0,0.45)", overflow: "hidden", display: "flex", flexDirection: "column" },
  pageHeader:      { padding: "24px 24px 0", flexShrink: 0, background: "#202020" },
  topRow:          { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  title:           { fontSize: 16, fontWeight: 500, color: "#fff" },
  sub:             { fontSize: 12, color: "#8a8a8a", marginTop: 3 },
  newBtn:          { fontSize: 12, padding: "7px 16px", borderRadius: 6, background: "transparent", color: "#a5a5a5", border: "0.5px solid #444", cursor: "pointer" },
  filterBar:       { display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  searchBox:       { display: "flex", alignItems: "center", gap: 6, background: "#262626", border: "0.5px solid #454545", borderRadius: 6, padding: "5px 10px" },
  searchInput:     { background: "transparent", border: "none", outline: "none", fontSize: 12, color: "#b0b0b0", width: 140 },
  filterSep:       { width: "0.5px", height: 16, background: "#454545" },
  filterBtn:       { display: "flex", alignItems: "center", gap: 5, fontSize: 11, padding: "5px 10px", borderRadius: 6, border: "0.5px solid #454545", background: "transparent", color: "#9a9a9a", cursor: "pointer", whiteSpace: "nowrap" },
  filterBtnActive: { borderColor: "#777", color: "#ccc", background: "#2c2c2c" },
  dropdownMenu:    { position: "absolute", top: 30, left: 0, background: "#262626", border: "0.5px solid #454545", borderRadius: 8, minWidth: 160, zIndex: 100, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" },
  ddItem:          { padding: "8px 14px", fontSize: 12, color: "#a5a5a5", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 },
  ddCheck:         { width: 12, height: 12, borderRadius: 3, border: "0.5px solid #555", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  ddCheckOn:       { background: "#22c55e", borderColor: "#22c55e" },
  clearBtn:        { fontSize: 11, color: "#9a9a9a", cursor: "pointer", padding: "5px 8px" },
  tableWrapper:    { flex: 1, overflowY: "auto", overflowX: "auto", background: "#202020", minHeight: 0, display: "flex", alignItems: "flex-start" },
  table:           { width: "100%", borderCollapse: "collapse", minWidth: 560, background: "#202020" },
  th:              { padding: "8px 12px", fontSize: 10, color: "#9a9a9a", textTransform: "uppercase", letterSpacing: 1, fontWeight: 500, whiteSpace: "nowrap", background: "#202020", position: "sticky", top: 0, zIndex: 10, textAlign: "left", borderBottom: "0.5px solid #323232" },
  groupHeader:     { display: "flex", alignItems: "center", gap: 8, padding: "14px 24px 8px", cursor: "pointer" },
  groupDot:        { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
  groupName:       { fontSize: 12, color: "#b0b0b0", fontWeight: 500 },
  groupCount:      { fontSize: 10, color: "#8a8a8a", background: "#2c2c2c", padding: "1px 7px", borderRadius: 10 },
  groupChevron:    { marginLeft: "auto", fontSize: 10, color: "#7a7a7a" },
  taskRow:         { borderBottom: `0.5px solid ${LINE_COLOR}`, transition: "opacity 0.15s, background 0.15s", cursor: "pointer" },
  subtaskRow:      { cursor: "default" },
  selectedRow:     { borderLeft: "2px solid #3b82f6" },
  taskNameCell:    { display: "flex", alignItems: "center", gap: 8, padding: "10px 12px 10px 0" },
  dragHandle:      { display: "flex", alignItems: "center", justifyContent: "center", width: 14, flexShrink: 0, opacity: 0.4, cursor: "grab" },
  expandBtn:       { width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", borderRadius: 3 },
  subtaskLine:     { width: 1, height: 20, background: "#383838", flexShrink: 0, marginRight: 4 },
  checkbox:        { width: 14, height: 14, borderRadius: 3, border: "1px solid #555", flexShrink: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" },
  checkboxDone:    { background: "#22c55e", borderColor: "#22c55e" },
  taskName:        { fontSize: 13, color: "#bbb", cursor: "default", userSelect: "none", flex: 1 },
  taskNameDone:    { color: "#7a7a7a", textDecoration: "line-through" },
  subtaskName:     { fontSize: 12, color: "#b0b0b0" },
  subtaskBadge:    { fontSize: 10, color: "#8a8a8a", background: "#2c2c2c", padding: "1px 6px", borderRadius: 10, whiteSpace: "nowrap", flexShrink: 0 },
  nameInput:       { background: "#2c2c2c", border: "0.5px solid #555", borderRadius: 4, padding: "2px 8px", fontSize: 13, color: "#fff", outline: "none", width: "100%", flex: 1 },
  cell:            { padding: "10px 12px", fontSize: 12, background: "transparent", verticalAlign: "middle" },
  pill:            { display: "inline-flex", alignItems: "center", fontSize: 11, padding: "2px 10px", borderRadius: 4, whiteSpace: "nowrap" },
  cellDropdown:    { position: "absolute", top: 28, left: 0, background: "#262626", border: "0.5px solid #454545", borderRadius: 8, zIndex: 200, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" },
  cdItem:          { display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", cursor: "pointer" },
  dateInput:       { background: "#303030", border: "0.5px solid #444", borderRadius: 4, padding: "4px 8px", fontSize: 12, color: "#aaa", outline: "none", width: "100%", colorScheme: "dark" },
  addTaskCell:     { padding: "8px 24px", borderBottom: `0.5px solid ${LINE_COLOR}`, background: "#202020" },
  addTaskBtn:      { fontSize: 12, color: "#7a7a7a", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 },
  addSubInline:    { fontSize: 11, color: "#9a9a9a", cursor: "pointer", padding: "1px 8px", borderRadius: 4, border: "0.5px solid #383838", marginLeft: 6, whiteSpace: "nowrap" },
  addSubtaskBtn:   { fontSize: 11, color: "#707070", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 },
  emptyState:      { padding: 48, textAlign: "center", fontSize: 12, color: "#7a7a7a", background: "#202020" },
};
