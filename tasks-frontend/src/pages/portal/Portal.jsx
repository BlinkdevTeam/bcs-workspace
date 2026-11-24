import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { selectUser } from "../../store/slices/authSlice";

const HRIS_URL = import.meta.env.VITE_HRIS_URL || "http://localhost:5173";

export default function Portal() {
  const user     = useSelector(selectUser);
  const navigate = useNavigate();
  const [tasks, setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tasks", { params: { mine: true } })
      .then((r) => setTasks(r.data.tasks || []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  const initials = user?.avatar_initials
    || (user ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() : "");

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const weekEnd = new Date(today); weekEnd.setDate(today.getDate() + 7);
  const open    = tasks.filter((t) => !t.done);
  const overdue = open.filter((t) => t.due && new Date(t.due) < today);
  const dueSoon = open.filter((t) => t.due && new Date(t.due) >= today && new Date(t.due) <= weekEnd);
  const done    = tasks.filter((t) => t.done);

  const soon = [
    { title: "Leave",      text: "File leave requests and see your balances." },
    { title: "Attendance", text: "Your time-in / time-out records." },
    { title: "Payslips",   text: "View and download your payslips." },
    { title: "Documents",  text: "Your contracts and employee documents." },
  ];

  return (
    <div style={s.page}>
      <div style={s.title}>Employee Portal</div>
      <div style={s.sub}>Your work and HR services in one place</div>

      {/* Greeting */}
      <div style={s.card}>
        <div style={s.profileRow}>
          <div style={s.avatar}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div style={s.name}>Welcome back, {user?.first_name || "there"}</div>
            <div style={s.role}>{[user?.role_title, user?.employee_code].filter(Boolean).join(" · ") || "Employee"}</div>
          </div>
          <button style={s.btn} onClick={() => navigate("/profile")}>View my profile</button>
        </div>
      </div>

      {/* My work */}
      <div style={s.sectionTitle}>My work</div>
      <div style={s.statRow}>
        <Stat label="Open tasks"   value={loading ? "…" : open.length} />
        <Stat label="Due in 7 days" value={loading ? "…" : dueSoon.length} />
        <Stat label="Overdue"      value={loading ? "…" : overdue.length} color={overdue.length ? "#f87171" : undefined} />
        <Stat label="Completed"    value={loading ? "…" : done.length} />
      </div>
      <button style={s.btn} onClick={() => navigate("/my-tasks")}>Go to My Tasks →</button>

      {/* Coming soon */}
      <div style={s.sectionTitle}>HR services</div>
      <div style={s.soonGrid}>
        {soon.map((c) => (
          <div key={c.title} style={s.soonCard}>
            <div style={s.soonTop}>
              <span style={s.soonTitle}>{c.title}</span>
              <span style={s.soonBadge}>Coming soon</span>
            </div>
            <div style={s.soonText}>{c.text}</div>
          </div>
        ))}
      </div>
      <div style={s.note}>
        HR administrators can manage people and payroll in the{" "}
        <a href={HRIS_URL} target="_blank" rel="noopener noreferrer" style={s.link}>HRIS app</a>.
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={s.stat}>
      <div style={{ ...s.statValue, ...(color ? { color } : {}) }}>{value}</div>
      <div style={s.label}>{label}</div>
    </div>
  );
}

const s = {
  page:         { padding: "28px 32px", color: "#c9c9c9" },
  title:        { fontSize: 20, fontWeight: 600, color: "#fff" },
  sub:          { fontSize: 12, color: "#9a9a9a", marginTop: 4, marginBottom: 22 },
  card:         { background: "#262626", border: "0.5px solid #454545", borderRadius: 10, padding: 22 },
  profileRow:   { display: "flex", alignItems: "center", gap: 16 },
  avatar:       { width: 54, height: 54, borderRadius: "50%", background: "#3b82f6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 600 },
  name:         { fontSize: 17, fontWeight: 600, color: "#fff" },
  role:         { fontSize: 12, color: "#9a9a9a", marginTop: 3 },
  detailGrid:   { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 18 },
  label:        { fontSize: 11, color: "#8a8a8a", marginBottom: 4 },
  value:        { fontSize: 13, color: "#ddd", wordBreak: "break-word" },
  sectionTitle: { fontSize: 13, fontWeight: 600, color: "#fff", margin: "26px 0 12px" },
  statRow:      { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 14 },
  stat:         { background: "#262626", border: "0.5px solid #454545", borderRadius: 10, padding: "16px 18px" },
  statValue:    { fontSize: 24, fontWeight: 600, color: "#fff", marginBottom: 4 },
  btn:          { fontSize: 12, padding: "7px 16px", borderRadius: 6, background: "transparent", color: "#a5a5a5", border: "0.5px solid #555", cursor: "pointer" },
  soonGrid:     { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 },
  soonCard:     { background: "#262626", border: "0.5px dashed #454545", borderRadius: 10, padding: "14px 16px" },
  soonTop:      { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  soonTitle:    { fontSize: 13, color: "#ddd", fontWeight: 500 },
  soonBadge:    { fontSize: 10, color: "#9a9a9a", border: "0.5px solid #555", borderRadius: 10, padding: "1px 8px" },
  soonText:     { fontSize: 12, color: "#8a8a8a" },
  note:         { fontSize: 12, color: "#8a8a8a", marginTop: 22 },
  link:         { color: "#60a5fa", textDecoration: "none" },
};
