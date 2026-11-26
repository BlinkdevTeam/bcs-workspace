import React, { useState, useEffect, useMemo, useCallback } from "react";
import api from "../leaveApi";

const FONT = { fontFamily: "system-ui,sans-serif" };
const MONO = { fontFamily: "monospace" };

const MATCH = {
  match:      { label: "Matches punches",  color: "#5af07a", bg: "#0a1a0a", border: "#1e3a1e" },
  over:       { label: "More than punches", color: "#f05a5a", bg: "#1f0f0f", border: "#3a1010" },
  under:      { label: "Less than punches", color: "#f0c85a", bg: "#1f1a0f", border: "#3a3010" },
  incomplete: { label: "No time-out",      color: "#f0c85a", bg: "#1f1a0f", border: "#3a3010" },
  no_record:  { label: "No time record",   color: "#f05a5a", bg: "#1f0f0f", border: "#3a1010" },
};
const STATUS = {
  pending:  { color: "#f0c85a", bg: "#1f1a0f" },
  approved: { color: "#5af07a", bg: "#0a1a0a" },
  rejected: { color: "#f05a5a", bg: "#1f0f0f" },
};
const hrs = (v) => (v === null || v === undefined ? "—" : `${Math.round(v * 100) / 100}h`);
const prettyDate = (s) => new Date(s + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const Badge = ({ map, k, text }) => {
  const m = map[k] || {};
  return (
    <span className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ ...FONT, color: m.color, backgroundColor: m.bg, border: `1px solid ${m.border || m.bg}` }}>
      {text || m.label || k}
    </span>
  );
};

export default function OTUTTab() {
  const [data, setData]       = useState(null);
  const [error, setError]     = useState("");
  const [busy, setBusy]       = useState(null);
  const [type, setType]       = useState("All");
  const [status, setStatus]   = useState("All");
  const [matchF, setMatchF]   = useState("All");
  const [search, setSearch]   = useState("");

  const load = useCallback(() => {
    api.get("/api/overtime")
      .then((r) => { setData(r.data); setError(""); })
      .catch((e) => setError(e.response?.data?.message
        || (e.response?.status === 403 ? "You do not have permission to view OT / UT records." : "Could not load OT / UT records.")));
  }, []);
  useEffect(load, [load]);

  async function decide(id, next) {
    setBusy(id);
    try {
      await api.patch(`/api/overtime/${id}/status`, { status: next });
      load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not update the request.");
    } finally { setBusy(null); }
  }

  const rows = useMemo(() => (data?.records || []).filter((r) =>
    (type === "All" || r.type === type) &&
    (status === "All" || r.status === status) &&
    (matchF === "All" || r.match === matchF) &&
    (!search || r.name.toLowerCase().includes(search.toLowerCase()))
  ), [data, type, status, matchF, search]);

  const all = data?.records || [];
  const pending = all.filter((r) => r.status === "pending").length;
  const mismatched = all.filter((r) => !["match"].includes(r.match)).length;
  const approvedOT = all.filter((r) => r.type === "OT" && r.status === "approved").reduce((s, r) => s + r.hours, 0);

  const sel = { ...FONT, backgroundColor: "#111", border: "1px solid #2a2a2a", color: "#ccc" };
  const Card = ({ label, value, color }) => (
    <div className="rounded-xl px-4 py-3" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
      <p className="text-gray-600 text-xs mb-1" style={FONT}>{label}</p>
      <p className="text-2xl" style={{ ...MONO, color: color || "#fff" }}>{value}</p>
    </div>
  );

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Card label="Pending approval" value={pending} color={pending ? "#f0c85a" : "#fff"} />
        <Card label="Don't match time record" value={mismatched} color={mismatched ? "#f05a5a" : "#fff"} />
        <Card label="Approved OT hours" value={hrs(approvedOT)} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employee…"
          className="text-sm rounded-lg px-3 py-2 outline-none" style={{ ...sel, color: "#fff", width: 200 }} />
        <select value={type} onChange={(e) => setType(e.target.value)} className="text-sm rounded-lg px-3 py-2" style={sel}>
          <option value="All">OT and UT</option><option value="OT">Overtime</option><option value="UT">Undertime</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-sm rounded-lg px-3 py-2" style={sel}>
          <option value="All">Any status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
        </select>
        <select value={matchF} onChange={(e) => setMatchF(e.target.value)} className="text-sm rounded-lg px-3 py-2" style={sel}>
          <option value="All">Any match</option>
          {Object.entries(MATCH).map(([k, m]) => <option key={k} value={k}>{m.label}</option>)}
        </select>
        {data && (
          <span className="text-xs text-gray-600 ml-auto" style={FONT}>
            Rules: {data.shift_hours}h shift · {data.break_hours}h break · ±{data.tolerance_hours}h tolerance
          </span>
        )}
      </div>

      {error && <p className="text-sm mb-3" style={{ ...FONT, color: "#f05a5a" }}>{error}</p>}
      {!data && !error && <p className="text-sm text-gray-600" style={FONT}>Loading…</p>}

      {data && (
        <div className="rounded-xl overflow-x-auto" style={{ border: "1px solid #1e1e1e" }}>
          <table className="w-full text-sm" style={{ ...FONT, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#0d0d0d", color: "#666" }} className="text-xs text-left">
                {["Employee", "Date", "Type", "Filed", "Time in", "Time out", "Worked", "Punches support", "Match", "Status", ""].map((h) => (
                  <th key={h} className="px-3 py-2.5 font-normal whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={11} className="px-3 py-8 text-center text-gray-600">No OT / UT records{all.length ? " match these filters" : " filed yet"}.</td></tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid #1a1a1a" }} title={r.reason || ""}>
                  <td className="px-3 py-2.5 text-white whitespace-nowrap">{r.name}<div className="text-gray-600 text-xs">{r.department}</div></td>
                  <td className="px-3 py-2.5 text-gray-300 whitespace-nowrap">{prettyDate(r.date)}</td>
                  <td className="px-3 py-2.5 text-gray-300">{r.type}</td>
                  <td className="px-3 py-2.5 text-white whitespace-nowrap" style={MONO}>{hrs(r.hours)}{r.time_from && r.time_to && <div className="text-gray-600 text-xs">{r.time_from}–{r.time_to}</div>}</td>
                  <td className="px-3 py-2.5 text-gray-300" style={MONO}>{r.time_in || "—"}</td>
                  <td className="px-3 py-2.5 text-gray-300" style={MONO}>{r.time_out || "—"}</td>
                  <td className="px-3 py-2.5 text-gray-300" style={MONO}>{hrs(r.worked)}</td>
                  <td className="px-3 py-2.5 text-gray-300" style={MONO}>{hrs(r.supported)}</td>
                  <td className="px-3 py-2.5"><Badge map={MATCH} k={r.match} /></td>
                  <td className="px-3 py-2.5"><Badge map={STATUS} k={r.status} text={r.status[0].toUpperCase() + r.status.slice(1)} /></td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-right">
                    {r.status === "pending" && (
                      <>
                        <button disabled={busy === r.id} onClick={() => decide(r.id, "approved")}
                          className="text-xs px-2.5 py-1 rounded-md mr-1.5" style={{ ...FONT, color: "#5af07a", border: "1px solid #1e3a1e", background: "#0a1a0a" }}>Approve</button>
                        <button disabled={busy === r.id} onClick={() => decide(r.id, "rejected")}
                          className="text-xs px-2.5 py-1 rounded-md" style={{ ...FONT, color: "#f05a5a", border: "1px solid #3a1010", background: "#1f0f0f" }}>Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-700 mt-3" style={FONT}>Hover a row to see the reason the employee gave. "Punches support" is what the time-in / time-out allows: OT = worked hours beyond the shift, UT = shortfall from the shift.</p>
    </div>
  );
}
