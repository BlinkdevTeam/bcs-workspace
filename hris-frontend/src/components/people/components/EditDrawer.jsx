// ── EDIT DRAWER ───────────────────────────────────────────────────────────────
export default function EditDrawer({ emp, onClose, onSave }) {
  const [form, setForm] = useState({ ...emp });
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }
  return (
    <>
      <div className="fixed inset-0 z-20" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onClose} />
      <div className="fixed top-0 right-0 h-full z-30 flex flex-col" style={{ width: 480, backgroundColor: "#080808", borderLeft: "1px solid #222", boxShadow: "-8px 0 40px rgba(0,0,0,0.8)" }}>
        <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: "1px solid #1a1a1a" }}>
          <div className="flex items-center gap-3"><Avatar emp={emp} size={38} /><div><h2 className="text-base font-normal text-white">Edit Employee</h2><p className="text-gray-500 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{emp.name}</p></div></div>
          <button onClick={onClose} className="text-gray-600 hover:text-white text-xl">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name"><input className={IC} style={IS} value={form.name.split(" ")[0]} onChange={e => set("name", e.target.value + " " + form.name.split(" ").slice(1).join(" "))} /></Field>
            <Field label="Last Name"><input className={IC} style={IS} value={form.name.split(" ").slice(1).join(" ")} onChange={e => set("name", form.name.split(" ")[0] + " " + e.target.value)} /></Field>
          </div>
          <Field label="Work Email"><input className={IC} style={IS} value={form.email} onChange={e => set("email", e.target.value)} /></Field>
          <Field label="Job Title"><input className={IC} style={IS} value={form.role} onChange={e => set("role", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Department"><select className={IC} style={IS} value={form.dept} onChange={e => set("dept", e.target.value)}>{["Engineering","Sales","Product","Design","Operations","Marketing","HR & Admin"].map(d => <option key={d}>{d}</option>)}</select></Field>
            <Field label="Status"><select className={IC} style={IS} value={form.status} onChange={e => set("status", e.target.value)}><option>Active</option><option>On Leave</option><option>Inactive</option></select></Field>
          </div>
        </div>
        <div className="px-7 py-5 flex items-center justify-between" style={{ borderTop: "1px solid #1a1a1a" }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded text-sm hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", color: "#aaa", border: "1px solid #2a2a2a" }}>Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} className="px-5 py-2.5 rounded text-sm font-medium bg-white text-black hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif" }}>Save Changes ✓</button>
        </div>
      </div>
    </>
  );
}