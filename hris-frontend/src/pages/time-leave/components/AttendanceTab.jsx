import React, { useState, useEffect, useCallback } from "react";
import api from "../leaveApi";

const FONT = { fontFamily: "system-ui,sans-serif" };
const MONO = { fontFamily: "monospace" };
const iso = (d) => d.toLocaleDateString("en-CA");
const daysAgo = (n) => iso(new Date(Date.now() - n * 86400000));
const prettyDate = (s) => new Date(s + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
const hrs = (v) => (v === null || v === undefined ? "—" : `${Math.round(v * 100) / 100}h`);
const field = { ...FONT, backgroundColor: "#111", border: "1px solid #2a2a2a", color: "#fff" };

function Drawer({ record, employees, onClose, onSaved }) {
  const editing = !!record;
  const [form, setForm] = useState({
    employee_id: record?.employee_id || "", date: record?.date || iso(new Date()),
    time_in: record?.time_in || "", time_out: record?.time_out || "", remarks: record?.remarks || "", reason: "",
  });
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save() {
    setSaving(true); setErr("");
    try {
      if (editing) await api.patch(`/api/attendance/${record.id}`, { time_in: form.time_in, time_out: form.time_out, remarks: form.remarks, reason: form.reason });
      else await api.post("/api/attendance", form);
      onSaved();
    } catch (e) {
      setErr(e.response?.data?.message || "Could not save.");
    } finally { setSaving(false); }
  }

  const Label = ({ children }) => <label className="block text-xs text-gray-500 mb-1.5 mt-4" style={FONT}>{children}</label>;
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 440, background: "#0d0d0d", borderLeft: "1px solid #1e1e1e", zIndex: 50, padding: 24, overflowY: "auto" }}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg text-white" style={FONT}>{editing ? "Correct attendance" : "Add attendance record"}</h2>
          <button onClick={onClose} className="text-gray-500 text-xl">×</button>
        </div>

        <Label>Employee</Label>
        <select value={form.employee_id} onChange={set("employee_id")} disabled={editing} className="w-full rounded-lg px-3 py-2 text-sm" style={field}>
          <option value="">Choose employee…</option>
          {employees.map((e) => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
        </select>

        <Label>Date</Label>
        <input type="date" value={form.date} max={iso(new Date())} onChange={set("date")} disabled={editing}
          className="w-full rounded-lg px-3 py-2 text-sm" style={{ ...field, colorScheme: "dark" }} />

        <div className="grid grid-cols-2 gap-3">
          <div><Label>Time in</Label>
            <input type="time" value={form.time_in} onChange={set("time_in")} className="w-full rounded-lg px-3 py-2 text-sm" style={{ ...field, colorScheme: "dark" }} /></div>
          <div><Label>Time out</Label>
            <input type="time" value={form.time_out} onChange={set("time_out")} className="w-full rounded-lg px-3 py-2 text-sm" style={{ ...field, colorScheme: "dark" }} /></div>
        </div>

        <Label>Remarks (optional)</Label>
        <input value={form.remarks} onChange={set("remarks")} maxLength={255} className="w-full rounded-lg px-3 py-2 text-sm" style={field} />

        {editing && (
          <>
            <Label>Reason for the correction</Label>
            <input value={form.reason} onChange={set("reason")} maxLength={255} placeholder="e.g. Forgot to time out"
              className="w-full rounded-lg px-3 py-2 text-sm" style={field} />
            {record?.corrected_by && (
              <p className="text-xs text-gray-600 mt-3" style={FONT}>Last corrected by {record.corrected_by}: “{record.correction_reason}”</p>
            )}
          </>
        )}

        {err && <p className="text-sm mt-4" style={{ ...FONT, color: "#f05a5a" }}>{err}</p>}
        <button onClick={save} disabled={saving} className="w-full mt-6 rounded-lg py-2.5 text-sm"
          style={{ ...FONT, backgroundColor: "#fff", color: "#000", opacity: saving ? 0.6 : 1 }}>
          {saving ? "Saving…" : editing ? "Save changes" : "Add record"}
        </button>
      </div>
    </>
  );
}

export default function AttendanceTab() {
  const [from, setFrom] = useState(daysAgo(30));
  const [to, setTo]     = useState(iso(new Date()));
  const [empId, setEmpId] = useState("");
  const [data, setData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [drawer, setDrawer] = useState(null); // null | "new" | record

  const load = useCallback(() => {
    api.get("/api/attendance", { params: { from, to, employee_id: empId || undefined } })
      .then((r) => { setData(r.data); setError(""); })
      .catch((e) => setError(e.response?.data?.message
        || (e.response?.status === 403 ? "You do not have permission to view attendance." : "Could not load attendance.")));
  }, [from, to, empId]);
  useEffect(load, [load]);

  useEffect(() => {
    api.get("/employees").then((r) => {
      const list = (Array.isArray(r.data) ? r.data : []).filter((e) => e.is_active !== false && !e.deleted_at);
      setEmployees(list.sort((a, b) => `${a.first_name}`.localeCompare(`${b.first_name}`)));
    }).catch(() => {});
  }, []);

  async function remove(r) {
    if (!window.confirm(`Delete ${r.name}'s time record for ${prettyDate(r.date)}?`)) return;
    try { await api.delete(`/api/attendance/${r.id}`); load(); }
    catch (e) { setError(e.response?.data?.message || "Could not delete."); }
  }

  const sel = { ...field, color: "#ccc", colorScheme: "dark" };
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="text-sm rounded-lg px-3 py-2" style={sel} />
        <span className="text-gray-600 text-sm">to</span>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="text-sm rounded-lg px-3 py-2" style={sel} />
        <select value={empId} onChange={(e) => setEmpId(e.target.value)} className="text-sm rounded-lg px-3 py-2" style={sel}>
          <option value="">All employees</option>
          {employees.map((e) => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
        </select>
      </div>

      {data && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[["Records", data.records.length, "#fff"],
            ["Present", data.records.filter((r) => r.status === "present").length, "#5af07a"],
            ["Missing time-out", data.records.filter((r) => r.status === "incomplete").length, "#f0c85a"]].map(([l, v, c]) => (
            <div key={l} className="rounded-xl px-4 py-3" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
              <p className="text-gray-600 text-xs mb-1" style={FONT}>{l}</p>
              <p className="text-2xl" style={{ ...MONO, color: c }}>{v}</p>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm mb-3" style={{ ...FONT, color: "#f05a5a" }}>{error}</p>}
      {!data && !error && <p className="text-sm text-gray-600" style={FONT}>Loading…</p>}

      {data && (
        <div className="rounded-xl overflow-x-auto" style={{ border: "1px solid #1e1e1e" }}>
          <table className="w-full text-sm" style={{ ...FONT, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#0d0d0d", color: "#666" }} className="text-xs text-left">
                {["Employee", "Date", "Time in", "Time out", "Worked", "Status", "Remarks", ""].map((h) => <th key={h} className="px-3 py-2.5 font-normal">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.records.length === 0 && (
                <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-600">No attendance records in this range. Records will appear here once the time-in app or biometrics is connected.</td></tr>
              )}
              {data.records.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid #1a1a1a" }}>
                  <td className="px-3 py-2.5 text-white whitespace-nowrap">{r.name}<div className="text-gray-600 text-xs">{r.department}</div></td>
                  <td className="px-3 py-2.5 text-gray-300 whitespace-nowrap">{prettyDate(r.date)}</td>
                  <td className="px-3 py-2.5 text-gray-300" style={MONO}>{r.time_in || "—"}</td>
                  <td className="px-3 py-2.5" style={{ ...MONO, color: r.time_out ? "#ccc" : "#f0c85a" }}>{r.time_out || "missing"}</td>
                  <td className="px-3 py-2.5 text-gray-300" style={MONO}>{hrs(r.worked_hours)}</td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={r.status === "present"
                      ? { color: "#5af07a", backgroundColor: "#0a1a0a", border: "1px solid #1e3a1e" }
                      : { color: "#f0c85a", backgroundColor: "#1f1a0f", border: "1px solid #3a3010" }}>
                      {r.status === "present" ? "Present" : "Incomplete"}
                    </span>
                    {r.corrected_by && (
                      <span className="text-xs ml-2 px-2 py-0.5 rounded-full text-gray-400" style={{ border: "1px solid #2a2a2a" }}
                        title={`Corrected by ${r.corrected_by}: ${r.correction_reason || ""}`}>Corrected</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">{r.remarks || ""}</td>
                  <td className="px-3 py-2.5 text-right whitespace-nowrap">
                    <button onClick={() => setDrawer(r)} className="text-xs text-gray-400 mr-3">Edit</button>
                    <button onClick={() => remove(r)} className="text-xs" style={{ color: "#f05a5a" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-700 mt-3" style={FONT}>Worked = time-out minus time-in, less a {data?.break_hours ?? 1}h break on days longer than 5 hours. Records come from the time-in app / biometrics. Admins can only correct an existing record, with a reason. Late and absent are not tracked yet.</p>

      {drawer && (
        <Drawer record={drawer} employees={employees}
          onClose={() => setDrawer(null)} onSaved={() => { setDrawer(null); load(); }} />
      )}
    </div>
  );
}
