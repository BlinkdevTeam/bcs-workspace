import { useState, useRef, useEffect, useCallback } from "react";
import TaskPanel from "./TaskPanel";

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_TASKS = [
  { id: 1,  name: "Set up Redux store",                priority: "high",   status: "progress", project: "BCS Workspace", due: "2026-03-13", people: ["KM", "JD"], done: false, parent_id: null, description: "" },
  { id: 2,  name: "Configure Axios interceptors",      priority: "high",   status: "progress", project: "BCS Workspace", due: "2026-03-13", people: ["KM"],       done: false, parent_id: null, description: "" },
  { id: 3,  name: "Build ProtectedRoute component",    priority: "medium", status: "todo",     project: "BCS Workspace", due: "2026-03-14", people: ["KM", "AL"], done: false, parent_id: null, description: "" },
  { id: 4,  name: "Health check endpoint + CORS",      priority: "medium", status: "review",   project: "BCS Workspace", due: "2026-03-13", people: ["JD"],       done: false, parent_id: null, description: "" },
  { id: 5,  name: "Create tasks-backend boilerplate",  priority: "low",    status: "done",     project: "BCS Workspace", due: "2026-03-10", people: ["KM"],       done: true,  parent_id: null, description: "" },
  { id: 11, name: "Install redux toolkit",             priority: "high",   status: "done",     project: "BCS Workspace", due: "2026-03-13", people: ["KM"],       done: true,  parent_id: 1,    description: "" },
  { id: 12, name: "Create authSlice",                  priority: "medium", status: "progress", project: "BCS Workspace", due: "2026-03-13", people: ["KM", "JD"],done: false, parent_id: 1,    description: "" },
  { id: 13, name: "Create uiSlice",                    priority: "low",    status: "todo",     project: "BCS Workspace", due: "2026-03-14", people: ["KM"],       done: false, parent_id: 1,    description: "" },
  { id: 14, name: "Set baseURL and withCredentials",   priority: "high",   status: "done",     project: "BCS Workspace", due: "2026-03-13", people: ["KM"],       done: true,  parent_id: 2,    description: "" },
  { id: 15, name: "Add request interceptor",           priority: "high",   status: "progress", project: "BCS Workspace", due: "2026-03-13", people: ["KM"],       done: false, parent_id: 2,    description: "" },
  { id: 16, name: "Add silent refresh on 401",         priority: "high",   status: "todo",     project: "BCS Workspace", due: "2026-03-13", people: ["JD"],       done: false, parent_id: 2,    description: "" },
  { id: 6,  name: "Design HRIS employee profile page", priority: "high",   status: "todo",     project: "HRIS Redesign", due: "2026-03-10", people: ["AL"],       done: false, parent_id: null, description: "" },
  { id: 7,  name: "Build department management UI",    priority: "medium", status: "progress", project: "HRIS Redesign", due: "2026-03-14", people: ["JD", "AL"],done: false, parent_id: null, description: "" },
  { id: 8,  name: "Set up React Router for HRIS",      priority: "low",    status: "done",     project: "HRIS Redesign", due: "2026-03-09", people: ["AL"],       done: true,  parent_id: null, description: "" },
  { id: 17, name: "Design personal info tab",          priority: "high",   status: "todo",     project: "HRIS Redesign", due: "2026-03-10", people: ["AL"],       done: false, parent_id: 6,    description: "" },
  { id: 18, name: "Design job info tab",               priority: "medium", status: "todo",     project: "HRIS Redesign", due: "2026-03-10", people: ["AL", "KM"],done: false, parent_id: 6,    description: "" },
  { id: 9,  name: "Design onboarding screens",         priority: "high",   status: "todo",     project: "Mobile App",    due: "2026-03-11", people: ["KM"],       done: false, parent_id: null, description: "" },
  { id: 10, name: "API integration for mobile auth",   priority: "medium", status: "progress", project: "Mobile App",    due: "2026-03-13", people: ["JD", "KM"],done: false, parent_id: null, description: "" },
];

const PROJECT_COLORS = {
  "BCS Workspace": "#3b82f6",
  "HRIS Redesign": "#22c55e",
  "Mobile App":    "#facc15",
};

export const PEOPLE = [
  { id: "KM", name: "Ken M.",  color: "#3b82f6" },
  { id: "JD", name: "Jane D.", color: "#a78bfa" },
  { id: "AL", name: "Alex L.", color: "#f97316" },
];

export const STATUSES = [
  { value: "todo",     label: "To Do",       color: "#555",    bg: "#1e1e1e" },
  { value: "progress", label: "In Progress", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  { value: "review",   label: "In Review",   color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  { value: "done",     label: "Done",        color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
];

export const PRIORITIES = [
  { value: "high",   label: "High",   color: "#f97316", bg: "rgba(249,115,22,0.1)" },
  { value: "medium", label: "Medium", color: "#facc15", bg: "rgba(250,204,21,0.08)" },
  { value: "low",    label: "Low",    color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
export const getStatus   = (v) => STATUSES.find((s) => s.value === v)   ?? STATUSES[0];
export const getPriority = (v) => PRIORITIES.find((p) => p.value === v) ?? PRIORITIES[1];
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
                border: "1.5px solid #141414",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: size * 0.38, color: "#fff", fontWeight: 600,
                position: "absolute", left: i * (size - overlap),
                zIndex: visible.length - i,
                userSelect: "none",
              }}
            >
              {id}
            </div>
          );
        })}
        {overflow > 0 && (
          <div style={{
            width: size, height: size, borderRadius: "50%",
            background: "#2a2a2a", border: "1.5px solid #141414",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: size * 0.34, color: "#666",
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
            <div style={{ ...pd.avatar, background: p.color }}>{p.id}</div>
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
  menu:   { position: "absolute", top: 32, left: 0, background: "#1a1a1a", border: "0.5px solid #333", borderRadius: 8, zIndex: 200, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.5)", minWidth: 180 },
  title:  { fontSize: 10, color: "#444", padding: "8px 12px 4px", textTransform: "uppercase", letterSpacing: 1 },
  item:   { display: "flex", alignItems: "center", gap: 9, padding: "7px 12px", cursor: "pointer" },
  avatar: { width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 600, flexShrink: 0 },
  name:   { fontSize: 12, color: "#888", flex: 1 },
  check:  { width: 14, height: 14, borderRadius: 3, border: "0.5px solid #555", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
};

// ── MyTasks ───────────────────────────────────────────────────────────────────
export default function MyTasks() {
  const [tasks, setTasks]                 = useState(MOCK_TASKS);
  const [search, setSearch]               = useState("");
  const [collapsed, setCollapsed]         = useState(new Set());
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [openMenu, setOpenMenu]           = useState(null);
  const [selectedTask, setSelectedTask]   = useState(null);
  const [filters, setFilters]             = useState({
    priority: new Set(), project: new Set(), person: new Set(), date: new Set(),
  });

  const updateTask = (id, patch) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    setSelectedTask((prev) => (prev?.id === id ? { ...prev, ...patch } : prev));
  };

  const addSubtask = (parentId) => {
    const parent  = tasks.find((t) => t.id === parentId);
    const newTask = {
      id: Date.now(), name: "New subtask", priority: "medium", status: "todo",
      project: parent.project, due: parent.due, people: [...parent.people],
      done: false, parent_id: parentId, description: "",
    };
    setTasks((prev) => [...prev, newTask]);
    setExpandedTasks((prev) => new Set([...prev, parentId]));
  };

  // ── Drag ──────────────────────────────────────────────────────────────────────
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

  const filtered = tasks.filter((t) => {
    if (t.parent_id !== null) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.priority.size && !filters.priority.has(t.priority)) return false;
    if (filters.project.size  && !filters.project.has(t.project))   return false;
    if (filters.person.size   && !t.people.some((p) => filters.person.has(p))) return false;
    if (filters.date.size) {
      const d = new Date(t.due);
      if (filters.date.has("overdue")  && d < today)                                    return true;
      if (filters.date.has("today")    && d.toDateString() === today.toDateString())    return true;
      if (filters.date.has("tomorrow") && d.toDateString() === tomorrow.toDateString()) return true;
      return false;
    }
    return true;
  });

  const grouped = filtered.reduce((acc, t) => {
    if (!acc[t.project]) acc[t.project] = [];
    acc[t.project].push(t);
    return acc;
  }, {});

  const panelOpen = !!selectedTask;

  return (
    <div style={s.root} onClick={() => setOpenMenu(null)}>

      {/* ── Table area ── */}
      <div style={{ ...s.tableArea, width: panelOpen ? "58%" : "100%" }}>

        <div style={s.pageHeader}>
          <div style={s.topRow}>
            <div>
              <div style={s.title}>My Tasks</div>
              <div style={s.sub}>Tasks assigned to you across all projects</div>
            </div>
            <button style={s.newBtn}>+ New task</button>
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

            <FilterDropdown label="Project" isOpen={openMenu === "project"} isActive={filters.project.size > 0} onToggle={() => setOpenMenu(openMenu === "project" ? null : "project")}
              icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>}>
              {Object.keys(PROJECT_COLORS).map((p) => <FilterOption key={p} label={p} checked={filters.project.has(p)} onClick={() => toggleFilter("project", p)} />)}
            </FilterDropdown>

            <FilterDropdown label="Person" isOpen={openMenu === "person"} isActive={filters.person.size > 0} onToggle={() => setOpenMenu(openMenu === "person" ? null : "person")}
              icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 10-16 0" /></svg>}>
              {PEOPLE.map((p) => <FilterOption key={p.id} label={p.name} checked={filters.person.has(p.id)} onClick={() => toggleFilter("person", p.id)} />)}
            </FilterDropdown>

            <FilterDropdown label="Date" isOpen={openMenu === "date"} isActive={filters.date.size > 0} onToggle={() => setOpenMenu(openMenu === "date" ? null : "date")}
              icon={<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>}>
              {[["today","Due today"],["tomorrow","Due tomorrow"],["overdue","Overdue"]].map(([val, label]) =>
                <FilterOption key={val} label={label} checked={filters.date.has(val)} onClick={() => toggleFilter("date", val)} />
              )}
            </FilterDropdown>

            {hasActiveFilters && <div style={s.clearBtn} onClick={clearFilters}>Clear</div>}
          </div>
        </div>

        <div style={s.tableWrapper}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={{ ...s.th, paddingLeft: 24, width: "40%" }}>Task</th>
                <th style={{ ...s.th, width: 130 }}>Status</th>
                <th style={{ ...s.th, width: 110 }}>Priority</th>
                <th style={{ ...s.th, width: 110 }}>People</th>
                <th style={{ ...s.th, width: 110 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(grouped).length === 0 ? (
                <tr><td colSpan={5} style={s.emptyState}>No tasks match your filters</td></tr>
              ) : (
                Object.entries(grouped).map(([project, projectTasks]) => (
                  <ProjectGroup
                    key={project}
                    project={project} tasks={projectTasks} allTasks={tasks}
                    color={PROJECT_COLORS[project] || "#888"}
                    collapsed={collapsed.has(project)}
                    onToggleCollapse={() => toggleCollapse(project)}
                    onUpdateTask={updateTask} onAddSubtask={addSubtask}
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
      </div>

      {/* ── Detail panel ── */}
      {panelOpen && (
        <div style={s.panelArea}>
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
function ProjectGroup({ project, tasks, allTasks, color, collapsed, onToggleCollapse, onUpdateTask, onAddSubtask, expandedTasks, onToggleExpand, selectedTaskId, onRowClick, dragState, onDragStart, onDragOver, onDragEnd }) {
  return (
    <>
      <tr>
        <td colSpan={5} style={{ padding: 0, background: "#141414" }}>
          <div style={s.groupHeader} onClick={onToggleCollapse}>
            <div style={{ ...s.groupDot, background: color }} />
            <span style={s.groupName}>{project}</span>
            <span style={s.groupCount}>{tasks.length}</span>
            <span style={s.groupChevron}>{collapsed ? "▸" : "▾"}</span>
          </div>
        </td>
      </tr>
      {!collapsed && (
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
              <div style={s.addTaskBtn}>+ Add task</div>
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
    background: isSelected ? "rgba(59,130,246,0.06)" : isDragOver ? "rgba(59,130,246,0.04)" : isSubtask ? "#191919" : "#141414",
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
              <div style={{ ...s.expandBtn, opacity: subtasks.length > 0 ? 1 : 0, pointerEvents: subtasks.length > 0 ? "auto" : "none" }}
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
              <span style={s.subtaskBadge}>{subtasks.filter((s) => s.done).length}/{subtasks.length}</span>
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
              <CellDropdown onClose={() => setOpenCell(null)}>
                {STATUSES.map((st) => (
                  <div key={st.value} style={s.cdItem} onClick={() => { onUpdate({ status: st.value, done: st.value === "done" }); setOpenCell(null); }}>
                    <span style={{ ...s.pill, color: st.color, background: st.bg }}>{st.label}</span>
                  </div>
                ))}
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
              <StackedAvatars peopleIds={task.people} max={3} size={22} />
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
              <span style={{ fontSize: 11, color: dateColor(task.due, task.done) }}>{formatDate(task.due)}</span>
            </div>
            {openCell === "date" && (
              <CellDropdown onClose={() => setOpenCell(null)} width={160}>
                <div style={{ padding: "8px 12px" }}>
                  <input type="date" defaultValue={task.due} style={s.dateInput}
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
          <tr style={{ background: "#191919", borderBottom: "0.5px solid #1e1e1e" }}>
            <td colSpan={5} style={{ paddingLeft: 56, paddingTop: 7, paddingBottom: 7, background: "#191919" }}>
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
const s = {
  root:            { background: "#141414", height: "100%", minHeight: "100vh", display: "flex", overflow: "hidden" },
  tableArea:       { display: "flex", flexDirection: "column", overflow: "hidden", transition: "width 0.25s ease", minWidth: 0 },
  panelArea:       { width: "42%", minWidth: 340, maxWidth: 520, flexShrink: 0, borderLeft: "0.5px solid #1e1e1e", overflow: "hidden", display: "flex", flexDirection: "column" },
  pageHeader:      { padding: "24px 24px 0", flexShrink: 0, background: "#141414" },
  topRow:          { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  title:           { fontSize: 16, fontWeight: 500, color: "#fff" },
  sub:             { fontSize: 12, color: "#555", marginTop: 3 },
  newBtn:          { fontSize: 12, padding: "7px 16px", borderRadius: 6, background: "transparent", color: "#777", border: "0.5px solid #444", cursor: "pointer" },
  filterBar:       { display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  searchBox:       { display: "flex", alignItems: "center", gap: 6, background: "#1a1a1a", border: "0.5px solid #333", borderRadius: 6, padding: "5px 10px" },
  searchInput:     { background: "transparent", border: "none", outline: "none", fontSize: 12, color: "#888", width: 140 },
  filterSep:       { width: "0.5px", height: 16, background: "#333" },
  filterBtn:       { display: "flex", alignItems: "center", gap: 5, fontSize: 11, padding: "5px 10px", borderRadius: 6, border: "0.5px solid #333", background: "transparent", color: "#666", cursor: "pointer", whiteSpace: "nowrap" },
  filterBtnActive: { borderColor: "#777", color: "#ccc", background: "#1e1e1e" },
  dropdownMenu:    { position: "absolute", top: 30, left: 0, background: "#1a1a1a", border: "0.5px solid #333", borderRadius: 8, minWidth: 160, zIndex: 100, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" },
  ddItem:          { padding: "8px 14px", fontSize: 12, color: "#777", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 },
  ddCheck:         { width: 12, height: 12, borderRadius: 3, border: "0.5px solid #555", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  ddCheckOn:       { background: "#22c55e", borderColor: "#22c55e" },
  clearBtn:        { fontSize: 11, color: "#666", cursor: "pointer", padding: "5px 8px" },
  tableWrapper:    { flex: 1, overflowY: "auto", overflowX: "auto", background: "#141414", minHeight: 0 },
  table:           { width: "100%", borderCollapse: "collapse", minWidth: 560, background: "#141414" },
  th:              { padding: "8px 12px", fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: 1, fontWeight: 500, whiteSpace: "nowrap", background: "#141414", position: "sticky", top: 0, zIndex: 10, textAlign: "left", borderBottom: "0.5px solid #252525" },
  groupHeader:     { display: "flex", alignItems: "center", gap: 8, padding: "14px 24px 8px", cursor: "pointer" },
  groupDot:        { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
  groupName:       { fontSize: 12, color: "#888", fontWeight: 500 },
  groupCount:      { fontSize: 10, color: "#555", background: "#1e1e1e", padding: "1px 7px", borderRadius: 10 },
  groupChevron:    { marginLeft: "auto", fontSize: 10, color: "#444" },
  taskRow:         { borderBottom: "0.5px solid #1e1e1e", transition: "opacity 0.15s, background 0.15s", cursor: "pointer" },
  subtaskRow:      { cursor: "default" },
  selectedRow:     { borderLeft: "2px solid #3b82f6" },
  taskNameCell:    { display: "flex", alignItems: "center", gap: 8, padding: "10px 12px 10px 0" },
  dragHandle:      { display: "flex", alignItems: "center", justifyContent: "center", width: 14, flexShrink: 0, opacity: 0.4, cursor: "grab" },
  expandBtn:       { width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", borderRadius: 3 },
  subtaskLine:     { width: 1, height: 20, background: "#2a2a2a", flexShrink: 0, marginRight: 4 },
  checkbox:        { width: 14, height: 14, borderRadius: 3, border: "1px solid #555", flexShrink: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" },
  checkboxDone:    { background: "#22c55e", borderColor: "#22c55e" },
  taskName:        { fontSize: 13, color: "#bbb", cursor: "default", userSelect: "none", flex: 1 },
  taskNameDone:    { color: "#444", textDecoration: "line-through" },
  subtaskName:     { fontSize: 12, color: "#888" },
  subtaskBadge:    { fontSize: 10, color: "#555", background: "#1e1e1e", padding: "1px 6px", borderRadius: 10, whiteSpace: "nowrap", flexShrink: 0 },
  nameInput:       { background: "#1e1e1e", border: "0.5px solid #555", borderRadius: 4, padding: "2px 8px", fontSize: 13, color: "#fff", outline: "none", width: "100%", flex: 1 },
  cell:            { padding: "10px 12px", fontSize: 12, background: "transparent", verticalAlign: "middle" },
  pill:            { display: "inline-flex", alignItems: "center", fontSize: 11, padding: "2px 10px", borderRadius: 4, whiteSpace: "nowrap" },
  cellDropdown:    { position: "absolute", top: 28, left: 0, background: "#1a1a1a", border: "0.5px solid #333", borderRadius: 8, zIndex: 200, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" },
  cdItem:          { display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", cursor: "pointer" },
  dateInput:       { background: "#222", border: "0.5px solid #444", borderRadius: 4, padding: "4px 8px", fontSize: 12, color: "#aaa", outline: "none", width: "100%", colorScheme: "dark" },
  addTaskCell:     { padding: "8px 24px", borderBottom: "0.5px solid #1e1e1e", background: "#141414" },
  addTaskBtn:      { fontSize: 12, color: "#444", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 },
  addSubtaskBtn:   { fontSize: 11, color: "#3a3a3a", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 },
  emptyState:      { padding: 48, textAlign: "center", fontSize: 12, color: "#444", background: "#141414" },
};
