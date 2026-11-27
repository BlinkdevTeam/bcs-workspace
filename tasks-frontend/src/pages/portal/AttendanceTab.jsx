import { useState, useEffect, useMemo } from "react";
import api from "../../services/api";
import { ps, prettyDate } from "./portalShared";

const iso = (d) => d.toLocaleDateString("en-CA");
const RANGES = [
  { key: "7",     label: "Last 7 days",  from: () => iso(new Date(Date.now() - 6 * 86400000)) },
  { key: "30",    label: "Last 30 days", from: () => iso(new Date(Date.now() - 29 * 86400000)) },
  { key: "month", label: "This month",   from: () => { const d = new Date(); d.setDate(1); return iso(d); } },
];
const to12 = (t) => {
  if (!t) return "—";
  const h = Number(t.slice(0, 2));
  return `${((h + 11) % 12) + 1}:${t.slice(3, 5)} ${h < 12 ? "AM" : "PM"}`;
};
const hhmm = (h) => (h === null || h === undefined ? "—" : `${Math.floor(h)}h ${String(Math.round((h % 1) * 60)).padStart(2, "0")}m`);
const weekday = (s) => new Date(s + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" });

export default function AttendanceTab() {
  const [range, setRange] = useState("30");
  const [data, setData]   = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const r = RANGES.find((x) => x.key === range);
    setData(null);
    api.get("/portal/attendance", { params: { from: r.from(), to: iso(new Date()) } })
      .then((res) => { setData(res.data); setError(""); })
      .catch((e) => setError(e.response?.data?.message || "Could not load your attendance."));
  }, [range]);

  const todayRec = useMemo(() => data?.records.find((r) => r.date === data.today), [data]);
  const totalHours = useMemo(() => (data?.records || []).reduce((s, r) => s + (r.worked_hours || 0), 0), [data]);
  const days = data?.records.filter((r) => r.status === "present").length || 0;

  if (error) return <div style={ps.empty}>{error}</div>;

  return (
    <div>
      <div style={ps.topRow}>
        <div>
          <div style={ps.heading}>My attendance</div>
          <div style={ps.hint}>Every scan on the time clock is kept. Your first scan is your time in and your last is your time out.</div>
        </div>
        <select value={range} onChange={(e) => setRange(e.target.value)} style={{ ...ps.input, width: "auto" }}>
          {RANGES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginBottom: 22 }}>
        <div style={ps.card}>
          <div style={{ fontSize: 11, color: "#8a8a8a", marginBottom: 8 }}>Today</div>
          {!data ? <div style={{ fontSize: 13, color: "#8a8a8a" }}>Loading…</div> : todayRec ? (
            <>
              <div style={{ fontSize: 20, fontWeight: 600, color: "#fff" }}>{to12(todayRec.time_in)}</div>
              <div style={{ fontSize: 11, color: "#8a8a8a", marginTop: 4 }}>
                {todayRec.time_out ? `Out at ${to12(todayRec.time_out)}` : "Timed in · not timed out yet"}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 14, color: "#ddd" }}>Not timed in yet</div>
          )}
        </div>
        <div style={ps.card}>
          <div style={{ fontSize: 11, color: "#8a8a8a", marginBottom: 8 }}>Days worked</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: "#fff" }}>{data ? days : "…"}</div>
        </div>
        <div style={ps.card}>
          <div style={{ fontSize: 11, color: "#8a8a8a", marginBottom: 8 }}>Hours worked</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: "#fff" }}>{data ? hhmm(totalHours) : "…"}</div>
          <div style={{ fontSize: 11, color: "#8a8a8a", marginTop: 4 }}>After the 1-hour break</div>
        </div>
      </div>

      <div style={{ ...ps.card, padding: 0, overflowX: "auto" }}>
        {!data ? (
          <div style={ps.empty}>Loading your records…</div>
        ) : data.records.length === 0 ? (
          <div style={ps.empty}>No time records in this period.</div>
        ) : (
          <table style={ps.table}>
            <thead>
              <tr><th style={ps.th}>Date</th><th style={ps.th}>Time in</th><th style={ps.th}>Time out</th><th style={ps.th}>Worked</th><th style={ps.th}>All scans</th><th style={ps.th}>Status</th></tr>
            </thead>
            <tbody>
              {data.records.map((r) => (
                <tr key={r.id}>
                  <td style={{ ...ps.td, whiteSpace: "nowrap" }}>{weekday(r.date)}, {prettyDate(r.date)}</td>
                  <td style={ps.td}>{to12(r.time_in)}</td>
                  <td style={{ ...ps.td, color: r.time_out ? "#ddd" : "#facc15" }}>{r.time_out ? to12(r.time_out) : "Missing"}</td>
                  <td style={ps.td}>{hhmm(r.worked_hours)}</td>
                  <td style={{ ...ps.td, color: "#a5a5a5", fontSize: 12 }}>
                    {r.scans && r.scans.length ? r.scans.map((t) => to12(t)).join(" · ") : "—"}
                  </td>
                  <td style={ps.td}>
                    <span style={{ fontSize: 11, padding: "2px 9px", borderRadius: 10, whiteSpace: "nowrap",
                      color: r.status === "present" ? "#22c55e" : "#facc15",
                      background: r.status === "present" ? "rgba(34,197,94,0.12)" : "rgba(250,204,21,0.12)" }}>
                      {r.status === "present" ? "Present" : "Incomplete"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div style={{ ...ps.hint, marginTop: 10 }}>Only one scan in a day means no time out yet. If something looks wrong, ask HR to correct it.</div>
    </div>
  );
}
