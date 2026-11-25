import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import { ps, StatusPill, prettyDate, prettyDateTime, todayStr } from "./portalShared";

const TYPES = [
  { value: "OT", label: "Overtime",  hint: "Worked beyond your regular hours" },
  { value: "UT", label: "Undertime", hint: "Worked fewer hours than required" },
];
const typeLabel = (v) => TYPES.find((t) => t.value === v)?.label || v;
const EMPTY = () => ({ type: "OT", date: todayStr(), hours: "", reason: "" });

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
    const hours = Number(form.hours);
    if (!hours || hours <= 0) return setError("Enter the number of hours.");
    if (!form.reason.trim()) return setError("Please give a reason.");
    setBusy(true);
    try {
      await api.post("/portal/overtime", { type: form.type, date: form.date, hours, reason: form.reason });
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
        {!open && <button style={ps.primaryBtn} onClick={() => { setNotice(""); setError(""); setForm(EMPTY()); setOpen(true); }}>+ File overtime / undertime</button>}
      </div>

      {open && (
        <div style={{ ...ps.card, marginBottom: 22 }}>
          <div style={{ ...ps.heading, marginBottom: 14 }}>New request</div>

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

          <div style={ps.formGrid}>
            <div>
              <label style={ps.label}>Date</label>
              <input type="date" style={ps.input} value={form.date} onChange={set("date")} />
            </div>
            <div>
              <label style={ps.label}>Hours</label>
              <input type="number" step="0.25" min="0.25" max="24" style={ps.input} value={form.hours} onChange={set("hours")} placeholder="e.g. 2.5" />
            </div>
          </div>

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
      )}

      <div style={{ ...ps.heading, marginBottom: 10 }}>My requests</div>
      <div style={{ ...ps.card, padding: 0, overflowX: "auto" }}>
        {records.length === 0 ? (
          <div style={ps.empty}>You haven't filed any overtime or undertime yet.</div>
        ) : (
          <table style={ps.table}>
            <thead>
              <tr>
                <th style={ps.th}>Date</th><th style={ps.th}>Type</th><th style={ps.th}>Hours</th>
                <th style={ps.th}>Reason</th><th style={ps.th}>Status</th><th style={ps.th}>Filed</th><th style={ps.th} />
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td style={{ ...ps.td, whiteSpace: "nowrap" }}>{prettyDate(r.date)}</td>
                  <td style={ps.td}>{typeLabel(r.type)}</td>
                  <td style={ps.td}>{r.hours}</td>
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
