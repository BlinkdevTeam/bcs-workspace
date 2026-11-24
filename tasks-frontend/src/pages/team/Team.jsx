import { useState, useEffect } from "react";
import api from "../../services/api";

export default function Team() {
  const [people, setPeople] = useState([]);
  const [tasks, setTasks]   = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    Promise.all([api.get("/employees"), api.get("/tasks")])
      .then(([e, t]) => { setPeople(e.data.employees || []); setTasks(t.data.tasks || []); })
      .catch((err) => setError(err.response?.data?.message || "Could not load the team."))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date(); today.setHours(0, 0, 0, 0);

  const rows = people
    .map((p) => {
      const mine    = tasks.filter((t) => (t.people || []).some((x) => x.id === p.id));
      const open    = mine.filter((t) => !t.done);
      const overdue = open.filter((t) => t.due && new Date(t.due) < today);
      return { ...p, open: open.length, overdue: overdue.length, done: mine.length - open.length };
    })
    .filter((p) => !search || `${p.name} ${p.email} ${p.role || ""}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={s.page}>
      <div style={s.head}>
        <div>
          <div style={s.title}>Team</div>
          <div style={s.sub}>Everyone in the workspace and what's on their plate</div>
        </div>
        <input style={s.search} placeholder="Search people..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? <div style={s.empty}>Loading team...</div>
        : error ? <div style={s.empty}>{error}</div>
        : rows.length === 0 ? <div style={s.empty}>No people found.</div>
        : (
        <div style={s.card}>
          <div style={{ ...s.row, ...s.headRow }}>
            <div style={{ flex: 1 }}>Person</div>
            <div style={s.num}>Open</div>
            <div style={s.num}>Overdue</div>
            <div style={s.num}>Done</div>
          </div>
          {rows.map((p) => (
            <div key={p.id} style={s.row}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <div style={s.avatar}>{p.initials}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={s.name}>{p.name}</div>
                  <div style={s.meta}>{[p.role, p.email].filter(Boolean).join(" · ")}</div>
                </div>
              </div>
              <div style={s.num}>{p.open}</div>
              <div style={{ ...s.num, ...(p.overdue ? { color: "#f87171" } : {}) }}>{p.overdue}</div>
              <div style={s.num}>{p.done}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page:    { padding: "28px 32px", color: "#c9c9c9" },
  head:    { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 20, flexWrap: "wrap" },
  title:   { fontSize: 20, fontWeight: 600, color: "#fff" },
  sub:     { fontSize: 12, color: "#9a9a9a", marginTop: 4 },
  search:  { fontSize: 12, padding: "7px 12px", borderRadius: 6, background: "#262626", border: "0.5px solid #454545", color: "#ddd", outline: "none", width: 200 },
  card:    { background: "#262626", border: "0.5px solid #454545", borderRadius: 10, overflow: "hidden" },
  row:     { display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: "0.5px solid #383838" },
  headRow: { fontSize: 11, color: "#8a8a8a", background: "#2c2c2c" },
  avatar:  { width: 34, height: 34, borderRadius: "50%", background: "#3d3d3d", color: "#ddd", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  name:    { fontSize: 13, color: "#fff" },
  meta:    { fontSize: 11, color: "#8a8a8a", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  num:     { width: 70, textAlign: "center", fontSize: 13, color: "#ddd" },
  empty:   { padding: 40, textAlign: "center", fontSize: 13, color: "#8a8a8a" },
};
