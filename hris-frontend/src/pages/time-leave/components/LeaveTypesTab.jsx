import React, { useState, useEffect, useCallback } from "react";
import api from "../leaveApi";

const FONT = { fontFamily: "system-ui,sans-serif" };
const MONO = { fontFamily: "monospace" };
const inputStyle = { ...FONT, backgroundColor: "#111", border: "1px solid #2a2a2a", colorScheme: "dark" };
const EMPTY = { name: "", days_per_year: "", is_paid: true, accrual_type: "upfront", is_active: false, earn_after_months: "0", description: "" };
function Switch({ on, onClick, title }) {
  return (
    <span onClick={onClick} title={title} role="switch" aria-checked={on}
      style={{ display: "inline-block", width: 36, height: 20, borderRadius: 10, position: "relative", cursor: "pointer", flexShrink: 0,
               backgroundColor: on ? "#5af07a" : "#2a2a2a", transition: "background-color .15s" }}>
      <span style={{ position: "absolute", top: 2, left: on ? 18 : 2, width: 16, height: 16, borderRadius: 8, backgroundColor: on ? "#000" : "#888", transition: "left .15s" }} />
    </span>
  );
}
const perMonth = (d) => (Math.round((Number(d) / 12) * 100) / 100).toString();

const msg = (e, fallback) => e.response?.data?.message || (e.response?.status === 403 ? "You do not have permission to manage leave types." : fallback);

export default function LeaveTypesTab() {
  const [types, setTypes]     = useState(null);
  const [error, setError]     = useState("");
  const [notice, setNotice]   = useState("");
  const [editingId, setEditingId] = useState(null); // "new" or a type id
  const [form, setForm]       = useState(EMPTY);
  const [applyYear, setApplyYear] = useState(true);
  const [busy, setBusy]       = useState(false);

  const load = useCallback(() =>
    api.get("/api/leave-types")
      .then((r) => { setTypes(r.data.leaveTypes); setError(""); })
      .catch((e) => setError(msg(e, "Could not load leave types."))), []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!editingId) return;
    const onKey = (e) => { if (e.key === "Escape" && !busy) setEditingId(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [editingId, busy]);

  const startNew  = () => { setNotice(""); setError(""); setForm(EMPTY); setApplyYear(true); setEditingId("new"); };
  const startEdit = (t) => {
    setNotice(""); setError("");
    setForm({ name: t.name, days_per_year: String(t.days_per_year), is_paid: t.is_paid, accrual_type: t.accrual_type || "upfront", is_active: t.is_active !== false, earn_after_months: String(t.earn_after_months ?? 0), description: t.description || "" });
    setApplyYear(true); setEditingId(t.id);
  };
  const cancel = () => { setEditingId(null); setError(""); };

  const save = async () => {
    if (busy) return;
    setError("");
    if (!form.name.trim()) return setError("Give the leave type a name.");
    if (form.days_per_year === "" || !Number.isInteger(Number(form.days_per_year)) || Number(form.days_per_year) < 0)
      return setError("Days per year must be a whole number (0 or more).");

    if (form.accrual_type === "monthly" && (!Number.isInteger(Number(form.earn_after_months || 0)) || Number(form.earn_after_months || 0) < 0))
      return setError("\"Start earning after\" must be a whole number of months (0 or more).");
    const body = { name: form.name.trim(), days_per_year: Number(form.days_per_year), is_paid: form.is_paid, accrual_type: form.accrual_type, is_active: form.is_active, earn_after_months: Number(form.earn_after_months || 0), description: form.description };
    setBusy(true);
    try {
      if (editingId === "new") {
        await api.post("/api/leave-types", body);
        setNotice(`"${body.name}" added.`);
      } else {
        const r = await api.patch(`/api/leave-types/${editingId}`, { ...body, apply_to_current_year: applyYear });
        setNotice(applyYear && r.data.balancesUpdated
          ? `"${body.name}" updated, and ${r.data.balancesUpdated} employee balance(s) for this year were adjusted.`
          : `"${body.name}" updated.`);
      }
      setEditingId(null);
      await load();
    } catch (e) {
      setError(msg(e, "Could not save the leave type."));
    } finally { setBusy(false); }
  };

  const toggleActive = async (t) => {
    setNotice(""); setError("");
    const next = !t.is_active;
    setTypes((list) => list.map((x) => (x.id === t.id ? { ...x, is_active: next } : x))); // optimistic
    try {
      await api.patch(`/api/leave-types/${t.id}`, { is_active: next, apply_to_current_year: false });
      setNotice(`"${t.name}" is now ${next ? "active" : "inactive"}${next ? ". Employees can file it." : ". Employees no longer see it."}`);
    } catch (e) {
      setTypes((list) => list.map((x) => (x.id === t.id ? { ...x, is_active: t.is_active } : x)));
      setError(msg(e, "Could not change the status."));
    }
  };

  const remove = async (t) => {
    if (!window.confirm(`Delete the "${t.name}" leave type?`)) return;
    setNotice(""); setError("");
    try { await api.delete(`/api/leave-types/${t.id}`); setNotice(`"${t.name}" deleted.`); await load(); }
    catch (e) { setError(msg(e, "Could not delete the leave type.")); }
  };

  if (!types) return <p className="text-gray-500 text-sm" style={FONT}>{error || "Loading leave types…"}</p>;

  const drawer = editingId && (
    <>
      <style>{`@keyframes ltSlideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}@keyframes ltFade{from{opacity:0}to{opacity:1}}`}</style>
      <div onClick={() => !busy && cancel()} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", zIndex: 190, animation: "ltFade .18s ease" }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 440, maxWidth: "100vw", zIndex: 200, backgroundColor: "#0a0a0a", borderLeft: "1px solid #1e1e1e", display: "flex", flexDirection: "column", animation: "ltSlideIn .22s ease" }}>
        <div className="flex items-start justify-between px-6 py-5" style={{ borderBottom: "1px solid #1a1a1a" }}>
          <div>
            <p className="text-white text-base" style={FONT}>{editingId === "new" ? "New leave type" : "Edit leave type"}</p>
            <p className="text-gray-600 text-xs mt-1" style={FONT}>{editingId === "new" ? "Employees will be able to file this leave in the Employee Portal." : "Changes show up in the Employee Portal right away."}</p>
          </div>
          <button onClick={cancel} disabled={busy} className="text-gray-500 hover:text-white text-xl leading-none" aria-label="Close">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={FONT}>Name</label>
            <input autoFocus className="w-full px-3 py-2.5 rounded text-sm text-white outline-none" style={inputStyle} maxLength={100}
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Vacation Leave"
              onKeyDown={(e) => e.key === "Enter" && save()} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={FONT}>Days per year</label>
              <input type="number" min="0" max="365" step="1" className="w-full px-3 py-2.5 rounded text-sm text-white outline-none" style={inputStyle}
                value={form.days_per_year} onChange={(e) => setForm({ ...form, days_per_year: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={FONT}>Pay</label>
              <select className="w-full px-3 py-2.5 rounded text-sm text-gray-200 outline-none" style={inputStyle}
                value={form.is_paid ? "paid" : "unpaid"} onChange={(e) => setForm({ ...form, is_paid: e.target.value === "paid" })}>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-2" style={FONT}>How is it earned?</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["upfront", "All at once", "The full yearly days are available from January."],
                ["monthly", "Monthly", form.days_per_year !== "" && Number(form.days_per_year) > 0
                  ? `Earned evenly: ${perMonth(form.days_per_year)} day${perMonth(form.days_per_year) === "1" ? "" : "s"} each month.`
                  : "Earned evenly: yearly days ÷ 12 each month."],
              ].map(([val, title, hint]) => (
                <div key={val} onClick={() => setForm({ ...form, accrual_type: val })}
                  className="rounded p-3 cursor-pointer"
                  style={{ ...FONT, userSelect: "none", backgroundColor: form.accrual_type === val ? "#1a1a1a" : "#0d0d0d", border: `1px solid ${form.accrual_type === val ? "#fff" : "#1e1e1e"}` }}>
                  <p className="text-sm text-white">{title}</p>
                  <p className="text-xs mt-1" style={{ color: form.accrual_type === val ? "#b5b5b5" : "#8a8a8a" }}>{hint}</p>
                </div>
              ))}
            </div>
            {form.accrual_type === "monthly" && (
              <div className="mt-3">
                <label className="block text-xs text-gray-500 mb-1.5" style={FONT}>Start earning after (months of service)</label>
                <input type="number" min="0" max="60" step="1" className="w-full px-3 py-2.5 rounded text-sm text-white outline-none" style={inputStyle}
                  value={form.earn_after_months} onChange={(e) => setForm({ ...form, earn_after_months: e.target.value })} />
                <p className="text-xs mt-1.5" style={{ ...FONT, color: "#8a8a8a" }}>
                  {Number(form.earn_after_months || 0) === 0
                    ? "0 = earning starts in the month the employee is hired. Someone hired in October has 2 months by November."
                    : `Earning starts ${form.earn_after_months} month${Number(form.earn_after_months) === 1 ? "" : "s"} after the hire month, based on each employee's hire date.`}
                </p>
              </div>
            )}
            {form.accrual_type === "monthly" && (
              <p className="mt-3 text-sm rounded px-3 py-2" style={{ ...FONT, color: "#5af07a", backgroundColor: "#0f1f0f", border: "1px solid #1e3a1e" }}>
                {form.days_per_year !== "" && Number(form.days_per_year) > 0
                  ? `${form.days_per_year} days a year → employees earn ${perMonth(form.days_per_year)} day${perMonth(form.days_per_year) === "1" ? "" : "s"} every month`
                  : "Enter the days per year above to see the monthly amount."}
              </p>
            )}
          </div>

          <div onClick={() => setForm({ ...form, is_active: !form.is_active })} className="flex items-center justify-between rounded p-3 cursor-pointer"
            style={{ ...FONT, userSelect: "none", backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
            <div>
              <p className="text-sm text-white">{form.is_active ? "Active" : "Inactive"}</p>
              <p className="text-xs mt-1" style={{ color: "#8a8a8a" }}>{form.is_active ? "Employees can see and file this leave." : "Hidden from employees until you switch it on."}</p>
            </div>
            <Switch on={form.is_active} />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5" style={FONT}>Description <span className="text-gray-700">(optional)</span></label>
            <textarea rows={3} className="w-full px-3 py-2.5 rounded text-sm text-white outline-none resize-none" style={inputStyle} maxLength={500}
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What is this leave for?" />
          </div>

          {editingId !== "new" && (
            <label className="flex items-start gap-2.5 text-xs text-gray-400 cursor-pointer rounded p-3" style={{ ...FONT, backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
              <input type="checkbox" className="mt-0.5" checked={applyYear} onChange={(e) => setApplyYear(e.target.checked)} />
              <span>Also apply the new days to everyone's balance for this year<br /><span className="text-gray-600">Leave unticked to affect new years only.</span></span>
            </label>
          )}

          {error && <p className="text-xs px-3 py-2 rounded" style={{ ...FONT, color: "#f05a5a", backgroundColor: "#1f0f0f", border: "1px solid #3a1515" }}>{error}</p>}
        </div>

        <div className="flex gap-2 px-6 py-4" style={{ borderTop: "1px solid #1a1a1a" }}>
          <button onClick={save} disabled={busy} className="flex-1 text-sm px-4 py-2.5 rounded hover:opacity-90"
            style={{ ...FONT, backgroundColor: "#fff", color: "#000", opacity: busy ? 0.6 : 1 }}>{busy ? "Saving…" : editingId === "new" ? "Add leave type" : "Save changes"}</button>
          <button onClick={cancel} disabled={busy} className="text-sm px-5 py-2.5 rounded hover:opacity-80"
            style={{ ...FONT, backgroundColor: "#111", color: "#888", border: "1px solid #2a2a2a" }}>Cancel</button>
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-sm" style={FONT}>Leave types</p>
          <p className="text-gray-600 text-xs mt-0.5" style={FONT}>What kinds of leave exist and how many days each employee gets per year. Employees see these in the Employee Portal.</p>
        </div>
        {(
          <button onClick={startNew} className="text-sm px-4 py-2 rounded hover:opacity-90" style={{ ...FONT, backgroundColor: "#fff", color: "#000" }}>+ Add leave type</button>
        )}
      </div>

      {notice && <p className="text-xs px-3 py-2 rounded" style={{ ...FONT, color: "#5af07a", backgroundColor: "#0f1f0f", border: "1px solid #1e3a1e" }}>{notice}</p>}
      {!editingId && error && <p className="text-xs px-3 py-2 rounded" style={{ ...FONT, color: "#f05a5a", backgroundColor: "#1f0f0f", border: "1px solid #3a1515" }}>{error}</p>}

      {drawer}

      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #1e1e1e" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid #1e1e1e" }}>
              {["Status", "Leave type", "Days / year", "Earned", "Pay", "Requests filed", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-normal text-gray-600" style={{ ...FONT, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {types.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-600 text-sm" style={FONT}>No leave types yet. Add the first one.</td></tr>
            )}
            {types.map((t, i) => (
              <tr key={t.id} style={{ borderBottom: i < types.length - 1 ? "1px solid #141414" : "none", backgroundColor: "#0d0d0d" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#111")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0d0d0d")}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Switch on={t.is_active} onClick={() => toggleActive(t)} title={t.is_active ? "Active: click to deactivate" : "Inactive: click to activate"} />
                    <span className="text-xs" style={{ ...FONT, color: t.is_active ? "#5af07a" : "#666" }}>{t.is_active ? "Active" : "Inactive"}</span>
                  </div>
                </td>
                <td className="px-4 py-3" style={{ opacity: t.is_active ? 1 : 0.5 }}>
                  <p className="text-gray-200 text-sm" style={FONT}>{t.name}</p>
                  {t.description && <p className="text-gray-600 text-xs mt-0.5" style={FONT}>{t.description}</p>}
                </td>
                <td className="px-4 py-3 text-gray-300 text-sm" style={MONO}>{t.days_per_year}</td>
                <td className="px-4 py-3 text-gray-400 text-xs" style={FONT}>
                  {t.accrual_type === "monthly"
                    ? `${perMonth(t.days_per_year)} / month${t.earn_after_months > 0 ? ` · after ${t.earn_after_months} mo.` : " · from hire"}`
                    : "All at once"}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ ...FONT, backgroundColor: t.is_paid ? "#0f1f0f" : "#1a1a1a", color: t.is_paid ? "#5af07a" : "#888" }}>{t.is_paid ? "Paid" : "Unpaid"}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs" style={MONO}>{t.request_count}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5 justify-end">
                    <button onClick={() => startEdit(t)} className="text-xs px-2.5 py-1 rounded hover:opacity-80" style={{ ...FONT, backgroundColor: "#111", color: "#aaa", border: "1px solid #2a2a2a" }}>Edit</button>
                    <button onClick={() => remove(t)} className="text-xs px-2.5 py-1 rounded hover:opacity-80" style={{ ...FONT, backgroundColor: "#1a1a1a", color: "#f05a5a", border: "1px solid #2a2a2a" }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
