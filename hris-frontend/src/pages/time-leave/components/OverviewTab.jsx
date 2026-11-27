import React, { useState, useEffect, useMemo } from "react";
import api from "../leaveApi";

const FONT = { fontFamily: "system-ui,sans-serif" };
const MONO = { fontFamily: "monospace" };
const iso = (d) => d.toLocaleDateString("en-CA");
const day = (s) => new Date(s + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
const range = (a, b) => (a === b ? day(a) : `${day(a)} – ${day(b)}`);
const hrs = (v) => (v === null || v === undefined ? "—" : `${Math.round(v * 100) / 100}h`);
const msg = (e, what) => e.response?.status === 403 ? `You do not have permission to view ${what}.` : `Could not load ${what}.`;

function Card({ label, value, sub, color, onClick }) {
  return (
    <div onClick={onClick} className="rounded-xl px-4 py-3" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e", cursor: onClick ? "pointer" : "default" }}>
      <p className="text-gray-600 text-xs mb-1" style={FONT}>{label}</p>
      <p className="text-2xl" style={{ ...MONO, color: color || "#fff" }}>{value}</p>
      {sub && <p className="text-gray-600 text-xs mt-1" style={FONT}>{sub}</p>}
    </div>
  );
}

function Panel({ title, action, onAction, error, children }) {
  return (
    <div className="rounded-xl" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <span className="text-sm text-white" style={FONT}>{title}</span>
        {action && <button onClick={onAction} className="text-xs text-gray-500 hover:text-white" style={FONT}>{action} →</button>}
      </div>
      <div className="px-4 py-2">
        {error ? <p className="text-xs py-3" style={{ ...FONT, color: "#f05a5a" }}>{error}</p> : children}
      </div>
    </div>
  );
}

const Empty = ({ children }) => <p className="text-xs text-gray-600 py-4" style={FONT}>{children}</p>;
const Row = ({ left, sub, right }) => (
  <div className="flex items-center justify-between gap-3 py-2.5" style={{ borderTop: "1px solid #151515" }}>
    <div className="min-w-0">
      <div className="text-sm text-white truncate" style={FONT}>{left}</div>
      {sub && <div className="text-xs text-gray-600 truncate" style={FONT}>{sub}</div>}
    </div>
    <div className="text-xs text-gray-400 whitespace-nowrap" style={FONT}>{right}</div>
  </div>
);

export default function OverviewTab({ onNavigate }) {
  const [leave, setLeave] = useState({ rows: null, error: "" });
  const [ot, setOt]       = useState({ rows: null, error: "" });
  const [att, setAtt]     = useState({ rows: null, error: "" });
  const [emps, setEmps]   = useState({ rows: null, error: "" });
  const today = iso(new Date());

  useEffect(() => {
    api.get("/api/leave-requests").then((r) => setLeave({ rows: r.data.records, error: "" })).catch((e) => setLeave({ rows: [], error: msg(e, "leave requests") }));
    api.get("/api/overtime").then((r) => setOt({ rows: r.data.records, error: "" })).catch((e) => setOt({ rows: [], error: msg(e, "OT / UT") }));
    api.get("/api/attendance", { params: { from: today, to: today } }).then((r) => setAtt({ rows: r.data.records, error: "" })).catch((e) => setAtt({ rows: [], error: msg(e, "attendance") }));
    api.get("/api/leave-balances").then((r) => setEmps({ rows: r.data.employees || [], error: "" })).catch((e) => setEmps({ rows: [], error: msg(e, "employees") }));
  }, [today]);

  const d = useMemo(() => {
    const L = leave.rows || [], O = ot.rows || [], A = att.rows || [];
    const soon = iso(new Date(Date.now() + 14 * 86400000));
    const approved = L.filter((r) => r.status === "approved");
    return {
      pendingLeave: L.filter((r) => r.status === "pending"),
      pendingOt: O.filter((r) => r.status === "pending"),
      offLeaveToday: approved.filter((r) => r.start_date <= today && r.end_date >= today),
      upcoming: approved.filter((r) => r.start_date > today && r.start_date <= soon).sort((a, b) => a.start_date.localeCompare(b.start_date)),
      timedIn: A.length,
      noTimeOut: A.filter((r) => !r.time_out),
      mismatched: O.filter((r) => r.status === "pending" && r.match !== "match"),
    };
  }, [leave.rows, ot.rows, att.rows, today]);

  const loading = !leave.rows || !ot.rows || !att.rows || !emps.rows;
  const headcount = emps.rows ? emps.rows.length : null;
  const go = (tab) => () => onNavigate && onNavigate(tab);

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-5">
        <Card label="Leave awaiting approval" value={leave.error ? "—" : d.pendingLeave.length} color={d.pendingLeave.length ? "#f0c85a" : "#fff"} onClick={go("leave")} />
        <Card label="OT / UT awaiting approval" value={ot.error ? "—" : d.pendingOt.length}
          sub={d.mismatched.length ? `${d.mismatched.length} don't match time-in/out` : undefined}
          color={d.pendingOt.length ? "#f0c85a" : "#fff"} onClick={go("otut")} />
        <Card label="On leave today" value={leave.error ? "—" : d.offLeaveToday.length} sub={headcount ? `of ${headcount} active employees` : undefined} onClick={go("leave")} />
        <Card label="Timed in today" value={att.error ? "—" : d.timedIn}
          sub={d.noTimeOut.length ? `${d.noTimeOut.length} still without time-out` : headcount ? `of ${headcount} active employees` : undefined} onClick={go("attendance")} />
      </div>

      {loading && <p className="text-xs text-gray-600 mb-3" style={FONT}>Loading…</p>}

      <div className="grid grid-cols-2 gap-4">
        <Panel title="Leave waiting for approval" action="Review" onAction={go("leave")} error={leave.error}>
          {d.pendingLeave.length === 0 ? <Empty>Nothing waiting.</Empty> : d.pendingLeave.slice(0, 6).map((r) => (
            <Row key={r.id} left={r.name} sub={`${r.leave_type} · ${range(r.start_date, r.end_date)}`} right={`${r.total_days} day${r.total_days === 1 ? "" : "s"}`} />
          ))}
          {d.pendingLeave.length > 6 && <Empty>+ {d.pendingLeave.length - 6} more</Empty>}
        </Panel>

        <Panel title="OT / UT waiting for approval" action="Review" onAction={go("otut")} error={ot.error}>
          {d.pendingOt.length === 0 ? <Empty>Nothing waiting.</Empty> : d.pendingOt.slice(0, 6).map((r) => (
            <Row key={r.id} left={r.name}
              sub={`${r.type === "OT" ? "Overtime" : "Undertime"} · ${day(r.date)}${r.time_from && r.time_to ? ` · ${r.time_from}–${r.time_to}` : ""}`}
              right={<span style={{ color: r.match === "match" ? "#5af07a" : "#f0c85a" }}>{hrs(r.hours)}{r.match === "match" ? " ✓" : r.match === "no_record" ? " · no record" : " · check"}</span>} />
          ))}
          {d.pendingOt.length > 6 && <Empty>+ {d.pendingOt.length - 6} more</Empty>}
        </Panel>

        <Panel title="Away today and in the next 14 days" action="All requests" onAction={go("leave")} error={leave.error}>
          {d.offLeaveToday.length + d.upcoming.length === 0 ? <Empty>No approved leave coming up.</Empty> : (
            <>
              {d.offLeaveToday.map((r) => <Row key={r.id} left={r.name} sub={r.leave_type} right={<span style={{ color: "#5af07a" }}>Out today · until {day(r.end_date)}</span>} />)}
              {d.upcoming.slice(0, 6).map((r) => <Row key={r.id} left={r.name} sub={r.leave_type} right={range(r.start_date, r.end_date)} />)}
            </>
          )}
        </Panel>

        <Panel title="Today's attendance" action="Attendance" onAction={go("attendance")} error={att.error}>
          {(att.rows || []).length === 0 ? <Empty>No time-ins recorded today yet.</Empty> : att.rows.slice(0, 8).map((r) => (
            <Row key={r.id} left={r.name} sub={r.department}
              right={<span style={MONO}>{r.time_in}{r.time_out ? ` – ${r.time_out}` : " – …"}</span>} />
          ))}
          {(att.rows || []).length > 8 && <Empty>+ {att.rows.length - 8} more</Empty>}
        </Panel>
      </div>
    </div>
  );
}
