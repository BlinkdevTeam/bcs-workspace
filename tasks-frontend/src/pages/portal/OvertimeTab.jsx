import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import { ps, Drawer, StatusPill, prettyDate, prettyDateTime, todayStr } from "./portalShared";

const TYPES = [
  { value: "OT", label: "Overtime",  hint: "Worked beyond your regular hours" },
  { value: "UT", label: "Undertime", hint: "Worked fewer hours than required" },
];
const typeLabel = (v) => TYPES.find((t) => t.value === v)?.label || v;
const EMPTY = () => ({ type: "OT", date: todayStr(), time_from: "", time_to: "", reason: "" });

// minutes between two HH:MM values; a "to" that is not later than "from" runs past midnight
const minutesBetween = (from, to) => {
  if (!from || !to) return null;
  const m = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  let d = m(to) - m(from);
  if (d <= 0) d += 24 * 60;
  return d;
};
const hhmmss = (mins) => mins === null ? "--:--:--"
  : `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}:00`;
const fmt12 = (t) => {
  if (!t) return "";
  const h = Number(t.slice(0, 2));
  return `${((h + 11) % 12) + 1}:${t.slice(3, 5)} ${h < 12 ? "AM" : "PM"}`;
};

export default function OvertimeTab() {
  const [records, setRecords] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [open, setOpen]       = useState(false);
  const [form, setForm]       = useState(EMPTY());
  const [busy, setBusy]       = useState(false);
  const [error, setError]     = useState("");
  const [notice, setNotice]   = useState("");

  const load = useCallback(() =>
    api.get("/portal/overtime")
      .then((r) => { setRecords(r.data.records); setLoadError(""); })
      .catch((e) => setLoadError(e.response?.data?.message || "Could not load your records.")), []);

  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (busy) return;
    setError("");
    if (!form.date) return setError("Choose the date.");
    if (!form.time_from) return setError("Enter the time from.");
    if (!form.time_to) return setError("Enter the time to.");
    if (!form.reason.trim()) return setError("Please give a reason.");
    setBusy(true);
    try {
      await api.post("/portal/overtime", { type: form.type, date: form.date, time_from: form.time_from, time_to: form.time_to, reason: form.reason });
      await load();
      setOpen(false);
      setNotice(`${typeLabel(form.type)} request filed. It is now pending approval.`);
    } catch (e) {
      setError(e.response?.data?.message || "Could not file the request.");
    } finally { setBusy(false); }
  };

  const cancel = async (r) => {
    if (!window.confirm(`Cancel your ${typeLabel(r.type)} request for ${prettyDate(r.date)}?`)) return;
    try { await api.delete(`/portal/overtime/${r.id}`); setNotice("Request cancelled."); await load(); }
    catch (e) { setNotice(""); setLoadError(e.response?.data?.message || "Could not cancel the request."); }
  };

  if (!records) return <div style={ps.empty}>{loadError || "Loading your records..."}</div>;

  return (
    <div>
      {notice && <div style={ps.success}>{notice}</div>}
      {loadError && <div style={{ ...ps.error, marginTop: 0, marginBottom: 14 }}>{loadError}</div>}

      <div style={ps.topRow}>
        <div>
          <div style={ps.heading}>Overtime & undertime</div>
          <div style={ps.hint}>File the hours you worked beyond, or short of, your regular schedule.</div>
        </div>
        <button style={ps.primaryBtn} onClick={() => { setNotice(""); setError(""); setForm(EMPTY()); setOpen(true); }}>+ File overtime / undertime</button>
      </div>

      <Drawer open={open} title="File overtime / undertime" subtitle="It stays pending until approved. The total is worked out from the times." onClose={() => setOpen(false)}>
          <div>

          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {TYPES.map((t) => (
              <div key={t.value} onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                style={{ flex: 1, cursor: "pointer", borderRadius: 8, padding: "10px 14px",
                         border: `0.5px solid ${form.type === t.value ? "#3b82f6" : "#454545"}`,
                         background: form.type === t.value ? "rgba(59,130,246,0.1)" : "transparent" }}>
                <div style={{ fontSize: 13, color: "#fff" }}>{t.label}</div>
                <div style={{ fontSize: 11, color: "#8a8a8a", marginTop: 2 }}>{t.hint}</div>
              </div>
            ))}
          </div>

          <div style={ps.stack}>
            <div>
              <label style={ps.label}>Date</label>
              <input type="date" style={ps.input} value={form.date} onChange={set("date")} />
            </div>
            <div style={ps.pair}>
            <div>
              <label style={ps.label}>Time from</label>
              <input type="time" style={{ ...ps.input, colorScheme: "dark" }} value={form.time_from} onChange={set("time_from")} />
            </div>
            <div>
              <label style={ps.label}>Time to</label>
              <input type="time" style={{ ...ps.input, colorScheme: "dark" }} value={form.time_to} onChange={set("time_to")} />
            </div>
            </div>
          </div>

          {(() => {
            const mins = minutesBetween(form.time_from, form.time_to);
            const overnight = mins !== null && form.time_to <= form.time_from;
            return (
              <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, background: "#262626", border: "0.5px solid #454545", display: "flex", alignItems: "baseline", gap: 12 }}>
                <span style={{ fontSize: 11, color: "#8a8a8a" }}>Total</span>
                <span style={{ fontSize: 18, color: "#fff", fontFamily: "monospace" }}>{hhmmss(mins)}</span>
                <span style={{ fontSize: 11, color: "#8a8a8a" }}>
                  {mins === null ? "Fill in the time from and to." : overnight ? "Ends the next day (past midnight)." : "hh:mm:ss"}
                </span>
              </div>
            );
          })()}

          <div style={{ marginTop: 14 }}>
            <label style={ps.label}>Reason</label>
            <input style={ps.input} maxLength={255} value={form.reason} onChange={set("reason")}
              placeholder={form.type === "OT" ? "e.g. Release night deployment" : "e.g. Left early for a medical appointment"} />
          </div>

          {error && <div style={ps.error}>{error}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button style={{ ...ps.primaryBtn, opacity: busy ? 0.6 : 1 }} disabled={busy} onClick={submit}>{busy ? "Filing..." : "File request"}</button>
            <button style={ps.ghostBtn} onClick={() => setOpen(false)}>Cancel</button>
          </div>
          </div>
        </Drawer>

      <div style={{ ...ps.heading, marginBottom: 10 }}>My requests</div>
      <div style={{ ...ps.card, padding: 0, overflowX: "auto" }}>
        {records.length === 0 ? (
          <div style={ps.empty}>You haven't filed any overtime or undertime yet.</div>
        ) : (
          <table style={ps.table}>
            <thead>
              <tr>
                <th style={ps.th}>Date</th><th style={ps.th}>Type</th><th style={ps.th}>From – To</th><th style={ps.th}>Total</th>
                <th style={ps.th}>Reason</th><th style={ps.th}>Status</th><th style={ps.th}>Filed</th><th style={ps.th} />
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td style={{ ...ps.td, whiteSpace: "nowrap" }}>{prettyDate(r.date)}</td>
                  <td style={ps.td}>{typeLabel(r.type)}</td>
                  <td style={{ ...ps.td, whiteSpace: "nowrap" }}>{r.time_from && r.time_to ? `${fmt12(r.time_from)} – ${fmt12(r.time_to)}` : "—"}</td>
                  <td style={{ ...ps.td, fontFamily: "monospace" }}>{hhmmss(Math.round(r.hours * 60))}</td>
                  <td style={{ ...ps.td, color: "#a5a5a5", maxWidth: 260 }}>{r.reason || "—"}</td>
                  <td style={ps.td}><StatusPill status={r.status} /></td>
                  <td style={{ ...ps.td, color: "#8a8a8a", whiteSpace: "nowrap" }}>{prettyDateTime(r.created_at)}</td>
                  <td style={ps.td}>{r.status === "pending" && <span style={ps.action} onClick={() => cancel(r)}>Cancel</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
