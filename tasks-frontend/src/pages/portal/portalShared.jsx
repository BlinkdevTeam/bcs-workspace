// Small pieces shared by the portal's Leave and Overtime tabs.

export const dayOnly = (d) => (d ? String(d).slice(0, 10) : "");

export function prettyDate(d, withYear = true) {
  const day = dayOnly(d);
  if (!day) return "—";
  return new Date(day + "T00:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric", ...(withYear ? { year: "numeric" } : {}),
  });
}

export function prettyRange(start, end) {
  const a = dayOnly(start), b = dayOnly(end);
  if (!a) return "—";
  if (a === b) return prettyDate(a);
  const sameYear = a.slice(0, 4) === b.slice(0, 4);
  return `${prettyDate(a, !sameYear)} – ${prettyDate(b)}`;
}

export const prettyDateTime = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";

// Monday–Friday days between two YYYY-MM-DD dates (inclusive) — same rule the server uses
export function workingDays(start, end) {
  if (!start || !end) return 0;
  const a = new Date(start + "T00:00:00Z"), b = new Date(end + "T00:00:00Z");
  if (Number.isNaN(a) || Number.isNaN(b) || b < a) return 0;
  let n = 0;
  for (let d = new Date(a); d <= b; d.setUTCDate(d.getUTCDate() + 1)) {
    const dow = d.getUTCDay();
    if (dow !== 0 && dow !== 6) n += 1;
  }
  return n;
}

export const todayStr = () => new Date().toLocaleDateString("en-CA");

const STATUS = {
  pending:   { label: "Pending",   color: "#facc15", bg: "rgba(250,204,21,0.12)" },
  approved:  { label: "Approved",  color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  rejected:  { label: "Rejected",  color: "#f87171", bg: "rgba(248,113,113,0.12)" },
  cancelled: { label: "Cancelled", color: "#8a8a8a", bg: "rgba(138,138,138,0.12)" },
};

export function StatusPill({ status }) {
  const st = STATUS[status] || { label: status, color: "#8a8a8a", bg: "rgba(138,138,138,0.12)" };
  return (
    <span style={{ fontSize: 11, padding: "2px 9px", borderRadius: 10, color: st.color, background: st.bg, whiteSpace: "nowrap" }}>
      {st.label}
    </span>
  );
}

export const ps = {
  card:      { background: "#262626", border: "0.5px solid #454545", borderRadius: 10, padding: 18 },
  topRow:    { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" },
  heading:   { fontSize: 13, fontWeight: 600, color: "#fff" },
  hint:      { fontSize: 11, color: "#8a8a8a" },
  primaryBtn:{ fontSize: 12, padding: "7px 16px", borderRadius: 6, background: "#3b82f6", color: "#fff", border: "none", cursor: "pointer" },
  ghostBtn:  { fontSize: 12, padding: "7px 14px", borderRadius: 6, background: "transparent", color: "#a5a5a5", border: "0.5px solid #555", cursor: "pointer" },
  label:     { display: "block", fontSize: 11, color: "#8a8a8a", marginBottom: 5 },
  input:     { width: "100%", boxSizing: "border-box", fontSize: 13, padding: "8px 11px", borderRadius: 6, background: "#202020", border: "0.5px solid #454545", color: "#eee", outline: "none", colorScheme: "dark" },
  formGrid:  { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14 },
  error:     { fontSize: 12, color: "#f87171", background: "rgba(239,68,68,0.08)", border: "0.5px solid rgba(239,68,68,0.3)", borderRadius: 6, padding: "8px 10px", marginTop: 12 },
  success:   { fontSize: 12, color: "#4ade80", background: "rgba(34,197,94,0.08)", border: "0.5px solid rgba(34,197,94,0.3)", borderRadius: 6, padding: "8px 10px", marginBottom: 14 },
  table:     { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th:        { textAlign: "left", fontSize: 10, color: "#8a8a8a", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 500, padding: "8px 10px", borderBottom: "0.5px solid #383838", whiteSpace: "nowrap" },
  td:        { padding: "11px 10px", color: "#ddd", borderBottom: "0.5px solid #303030", verticalAlign: "top" },
  action:    { fontSize: 11, color: "#f87171", cursor: "pointer", padding: "3px 6px", borderRadius: 4 },
  empty:     { fontSize: 12, color: "#8a8a8a", textAlign: "center", padding: "28px 0" },
};
