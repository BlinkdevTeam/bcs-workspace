import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import { ps, Drawer, StatusPill, prettyRange, prettyDateTime, workingDays, todayStr } from "./portalShared";

const EMPTY = { leave_type_id: "", start_date: "", end_date: "", half_day: false, reason: "" };

export default function LeaveTab() {
  const [data, setData]       = useState(null);
  const [loadError, setLoadError] = useState("");
  const [open, setOpen]       = useState(false);
  const [form, setForm]       = useState(EMPTY);
  const [busy, setBusy]       = useState(false);
  const [error, setError]     = useState("");
  const [notice, setNotice]   = useState("");

  const load = useCallback(() =>
    api.get("/portal/leave")
      .then((r) => { setData(r.data); setLoadError(""); })
      .catch((e) => setLoadError(e.response?.data?.message || "Could not load your leave.")), []);

  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const days = form.half_day && form.start_date === form.end_date ? 0.5 : workingDays(form.start_date, form.end_date);
  const sameDay = form.start_date && form.start_date === form.end_date;
  const chosen  = data?.types.find((t) => t.id === form.leave_type_id);
  // Days available on the start date: monthly types earn per_month on the 1st of each month
  const availableAt = (() => {
    if (!chosen || !chosen.is_paid) return null;
    if (chosen.accrual !== "monthly" || !form.start_date || Number(form.start_date.slice(0, 4)) !== data.year) return chosen.remaining;
    const month  = Number(form.start_date.slice(5, 7));
    const months = Math.max(0, month - (chosen.earn_start_month || 1) + 1); // months earned by then
    return Math.round((chosen.allocated / 12 * months - chosen.used - chosen.pending) * 100) / 100;
  })();

  const openForm = () => {
    setNotice(""); setError("");
    setForm({ ...EMPTY, leave_type_id: data?.types[0]?.id || "" });
    setOpen(true);
  };

  const submit = async () => {
    if (busy) return;
    setError("");
    if (!form.leave_type_id) return setError("Choose a leave type.");
    if (!form.start_date || !form.end_date) return setError("Choose the start and end dates.");
    setBusy(true);
    try {
      await api.post("/portal/leave-requests", {
        leave_type_id: form.leave_type_id, start_date: form.start_date, end_date: form.end_date,
        half_day: form.half_day && sameDay, reason: form.reason,
      });
      await load();
      setOpen(false);
      setNotice("Leave request filed. It is now pending approval.");
    } catch (e) {
      setError(e.response?.data?.message || "Could not file the request.");
    } finally { setBusy(false); }
  };

  const cancel = async (r) => {
    if (!window.confirm(`Cancel your ${r.leave_type} request (${prettyRange(r.start_date, r.end_date)})?`)) return;
    try { await api.delete(`/portal/leave-requests/${r.id}`); setNotice("Request cancelled."); await load(); }
    catch (e) { setNotice(""); setLoadError(e.response?.data?.message || "Could not cancel the request."); }
  };

  if (!data) return <div style={ps.empty}>{loadError || "Loading your leave..."}</div>;

  return (
    <div>
      {notice && <div style={ps.success}>{notice}</div>}
      {loadError && <div style={{ ...ps.error, marginTop: 0, marginBottom: 14 }}>{loadError}</div>}

      {/* Balances */}
      <div style={ps.topRow}>
        <div>
          <div style={ps.heading}>My leave balance — {data.year}</div>
          <div style={ps.hint}>Pending requests are already counted against what's left.</div>
        </div>
        <button style={ps.primaryBtn} onClick={openForm}>+ File leave</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginBottom: 22 }}>
        {data.types.map((t) => (
          <div key={t.id} style={ps.card}>
            <div style={{ fontSize: 11, color: "#8a8a8a", marginBottom: 8 }}>{t.name}</div>
            {t.is_paid ? (
              <>
                <div style={{ fontSize: 24, fontWeight: 600, color: t.remaining <= 0 ? "#f87171" : "#fff" }}>
                  {t.remaining} <span style={{ fontSize: 12, fontWeight: 400, color: "#8a8a8a" }}>available</span>
                </div>
                {t.accrual === "monthly" ? (
                  <>
                    <div style={{ fontSize: 11, color: "#8a8a8a", marginTop: 4 }}>
                      {t.earned} earned so far of {t.allocated} · +{t.per_month}/month
                    </div>
                    <div style={{ fontSize: 11, color: "#8a8a8a", marginTop: 2 }}>{t.used} used · {t.pending} pending</div>
                  </>
                ) : (
                  <div style={{ fontSize: 11, color: "#8a8a8a", marginTop: 4 }}>
                    {t.used} used · {t.pending} pending · {t.allocated} total
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#ddd" }}>No limit</div>
                <div style={{ fontSize: 11, color: "#8a8a8a", marginTop: 4 }}>Unpaid · {t.used} used</div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <Drawer open={open} title="File a leave request" subtitle="Pending requests count against your balance." onClose={() => setOpen(false)}>
          <div>
          <div style={ps.stack}>
            <div>
              <label style={ps.label}>Leave type</label>
              <select style={ps.input} value={form.leave_type_id} onChange={set("leave_type_id")}>
                {data.types.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}{t.is_paid ? ` (${t.remaining} available)` : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={ps.label}>Start date</label>
              <input type="date" style={ps.input} min={todayStr().slice(0, 4) + "-01-01"} value={form.start_date}
                onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value, end_date: f.end_date && f.end_date < e.target.value ? e.target.value : (f.end_date || e.target.value) }))} />
            </div>
            <div>
              <label style={ps.label}>End date</label>
              <input type="date" style={ps.input} min={form.start_date || undefined} value={form.end_date} onChange={set("end_date")} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18, margin: "14px 0 4px", flexWrap: "wrap" }}>
            <label style={{ fontSize: 12, color: sameDay ? "#ddd" : "#666", display: "flex", alignItems: "center", gap: 7, cursor: sameDay ? "pointer" : "default" }}>
              <input type="checkbox" disabled={!sameDay} checked={form.half_day && sameDay} onChange={set("half_day")} />
              Half day
            </label>
            {form.start_date && form.end_date && (
              <span style={{ fontSize: 12, color: days === 0 ? "#f87171" : "#a5a5a5" }}>
                {days === 0 ? "No working days in that range (weekends are not counted)" : `${days} working day${days === 1 ? "" : "s"}`}
                {availableAt !== null && days > availableAt ? ` · you would only have ${availableAt} available${chosen.accrual === "monthly" ? " by then" : ""}` : ""}
              </span>
            )}
          </div>

          <div style={{ marginTop: 14 }}>
            <label style={ps.label}>Reason <span style={{ color: "#666" }}>(optional)</span></label>
            <textarea rows={2} style={{ ...ps.input, resize: "none" }} maxLength={1000} value={form.reason} onChange={set("reason")}
              placeholder="e.g. Family trip" />
          </div>

          {error && <div style={ps.error}>{error}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button style={{ ...ps.primaryBtn, opacity: busy ? 0.6 : 1 }} disabled={busy} onClick={submit}>{busy ? "Filing..." : "File request"}</button>
            <button style={ps.ghostBtn} onClick={() => setOpen(false)}>Cancel</button>
          </div>
          </div>
        </Drawer>

      {/* My requests */}
      <div style={{ ...ps.heading, marginBottom: 10 }}>My requests</div>
      <div style={{ ...ps.card, padding: 0, overflowX: "auto" }}>
        {data.requests.length === 0 ? (
          <div style={ps.empty}>You haven't filed any leave yet.</div>
        ) : (
          <table style={ps.table}>
            <thead>
              <tr>
                <th style={ps.th}>Type</th><th style={ps.th}>Dates</th><th style={ps.th}>Days</th>
                <th style={ps.th}>Reason</th><th style={ps.th}>Status</th><th style={ps.th}>Filed</th><th style={ps.th} />
              </tr>
            </thead>
            <tbody>
              {data.requests.map((r) => (
                <tr key={r.id}>
                  <td style={ps.td}>{r.leave_type}</td>
                  <td style={{ ...ps.td, whiteSpace: "nowrap" }}>{prettyRange(r.start_date, r.end_date)}</td>
                  <td style={ps.td}>{r.total_days}</td>
                  <td style={{ ...ps.td, color: "#a5a5a5", maxWidth: 240 }}>{r.reason || "—"}</td>
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
