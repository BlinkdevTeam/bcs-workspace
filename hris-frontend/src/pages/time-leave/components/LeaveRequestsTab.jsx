import React, { useState, useEffect, useMemo, useCallback } from "react";
import api from "../leaveApi";

const FONT = { fontFamily: "system-ui,sans-serif" };
const MONO = { fontFamily: "monospace" };
const STATUS = {
  pending:   { label: "Pending",   color: "#f0c85a", bg: "#1f1a0f", border: "#3a3010" },
  approved:  { label: "Approved",  color: "#5af07a", bg: "#0a1a0a", border: "#1e3a1e" },
  rejected:  { label: "Rejected",  color: "#f05a5a", bg: "#1f0f0f", border: "#3a1010" },
  cancelled: { label: "Cancelled", color: "#888",    bg: "#141414", border: "#2a2a2a" },
};
const day = (s) => new Date(s + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const range = (a, b) => (a === b ? day(a) : `${day(a)} – ${day(b)}`);
const filed = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function LeaveRequestsTab({ onChanged }) {
  const [data, setData]     = useState(null);
  const [error, setError]   = useState("");
  const [busy, setBusy]     = useState(null);
  const [status, setStatus] = useState("All");
  const [type, setType]     = useState("All");
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    api.get("/api/leave-requests")
      .then((r) => { setData(r.data); setError(""); })
      .catch((e) => setError(e.response?.data?.message
        || (e.response?.status === 403 ? "You do not have permission to view leave requests." : "Could not load leave requests.")));
  }, []);
  useEffect(load, [load]);

  async function decide(r, next) {
    if (next === "rejected" && !window.confirm(`Reject ${r.name}'s ${r.leave_type} request?`)) return;
    setBusy(r.id);
    try {
      await api.patch(`/api/leave-requests/${r.id}/status`, { status: next });
      load();
      if (onChanged) onChanged();
    } catch (e) {
      setError(e.response?.data?.message || "Could not update the request.");
      load();
    } finally { setBusy(null); }
  }

  const all = data?.records || [];
  const types = useMemo(() => ["All", ...Array.from(new Set(all.map((r) => r.leave_type).filter(Boolean))).sort()], [all]);
  const rows = useMemo(() => all.filter((r) =>
    (status === "All" || r.status === status) &&
    (type === "All" || r.leave_type === type) &&
    (!search || r.name.toLowerCase().includes(search.toLowerCase()))
  ), [all, status, type, search]);

  const pending = all.filter((r) => r.status === "pending").length;
  const approvedDays = all.filter((r) => r.status === "approved").reduce((s, r) => s + r.total_days, 0);
  const Card = ({ label, value, color }) => (
    <div className="rounded-xl px-4 py-3" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
      <p className="text-gray-600 text-xs mb-1" style={FONT}>{label}</p>
      <p className="text-2xl" style={{ ...MONO, color: color || "#fff" }}>{value}</p>
    </div>
  );
  const sel = { ...FONT, backgroundColor: "#111", border: "1px solid #2a2a2a", color: "#ccc" };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Card label="Pending approval" value={pending} color={pending ? "#f0c85a" : "#fff"} />
        <Card label="Approved days (all time)" value={Math.round(approvedDays * 100) / 100} />
        <Card label="Total requests" value={all.length} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employee…"
          className="text-sm rounded-lg px-3 py-2 outline-none" style={{ ...sel, color: "#fff", width: 200 }} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-sm rounded-lg px-3 py-2" style={sel}>
          <option value="All">Any status</option>
          {Object.entries(STATUS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="text-sm rounded-lg px-3 py-2" style={sel}>
          {types.map((t) => <option key={t} value={t}>{t === "All" ? "Any leave type" : t}</option>)}
        </select>
      </div>

      {error && <p className="text-sm mb-3" style={{ ...FONT, color: "#f05a5a" }}>{error}</p>}
      {!data && !error && <p className="text-sm text-gray-600" style={FONT}>Loading…</p>}

      {data && (
        <div className="rounded-xl overflow-x-auto" style={{ border: "1px solid #1e1e1e" }}>
          <table className="w-full text-sm" style={{ ...FONT, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#0d0d0d", color: "#666" }} className="text-xs text-left">
                {["Employee", "Leave type", "Dates", "Days", "Reason", "Filed", "Status", ""].map((h) => (
                  <th key={h} className="px-3 py-2.5 font-normal whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-600">No leave requests{all.length ? " match these filters" : " filed yet"}.</td></tr>
              )}
              {rows.map((r) => {
                const st = STATUS[r.status] || STATUS.cancelled;
                return (
                  <tr key={r.id} style={{ borderTop: "1px solid #1a1a1a" }}>
                    <td className="px-3 py-2.5 text-white whitespace-nowrap">{r.name}<div className="text-gray-600 text-xs">{r.department}</div></td>
                    <td className="px-3 py-2.5 text-gray-300 whitespace-nowrap">{r.leave_type || "—"}{r.is_paid === false && <span className="text-gray-600 text-xs"> · unpaid</span>}</td>
                    <td className="px-3 py-2.5 text-gray-300 whitespace-nowrap">{range(r.start_date, r.end_date)}</td>
                    <td className="px-3 py-2.5 text-white" style={MONO}>{r.total_days}</td>
                    <td className="px-3 py-2.5 text-gray-500" style={{ maxWidth: 240 }}>{r.reason || "—"}</td>
                    <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{filed(r.created_at)}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: st.color, backgroundColor: st.bg, border: `1px solid ${st.border}` }}>{st.label}</span>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-right">
                      {r.status === "pending" && (
                        <>
                          <button disabled={busy === r.id} onClick={() => decide(r, "approved")}
                            className="text-xs px-2.5 py-1 rounded-md mr-1.5" style={{ color: "#5af07a", border: "1px solid #1e3a1e", background: "#0a1a0a" }}>Approve</button>
                          <button disabled={busy === r.id} onClick={() => decide(r, "rejected")}
                            className="text-xs px-2.5 py-1 rounded-md" style={{ color: "#f05a5a", border: "1px solid #3a1010", background: "#1f0f0f" }}>Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-700 mt-3" style={FONT}>Approving moves the days from pending to used on the employee's leave balance.</p>
    </div>
  );
}
