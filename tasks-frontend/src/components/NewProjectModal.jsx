import { useState, useRef, useEffect } from "react";

// ── NewProjectModal ───────────────────────────────────────────────────────────
export default function NewProjectModal({ onClose, onCreate }) {
  const [form, setForm]     = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const nameRef             = useRef(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async () => {
    if (saving) return;
    if (!form.name.trim()) { setError("Project name is required."); return; }
    setSaving(true);
    setError("");
    try {
      await onCreate(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create the project.");
      setSaving(false);
    }
  };

  return (
    <div style={m.overlay} onClick={onClose}>
      <div style={m.box} onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}>
        <div style={m.title}>New project</div>

        <label style={m.label}>Name</label>
        <input ref={nameRef} value={form.name} onChange={set("name")} placeholder="e.g. Mobile App"
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          style={m.input} maxLength={255} />

        <label style={m.label}>Description <span style={m.optional}>(optional)</span></label>
        <textarea value={form.description} onChange={set("description")} rows={3}
          placeholder="What is this project about?" style={{ ...m.input, resize: "none" }} />

        {error && <div style={m.error}>{error}</div>}

        <div style={m.actions}>
          <button style={m.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{ ...m.createBtn, opacity: saving ? 0.6 : 1 }} onClick={submit} disabled={saving}>
            {saving ? "Creating..." : "Create project"}
          </button>
        </div>
      </div>
    </div>
  );
}

const m = {
  overlay:   { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  box:       { width: 420, maxWidth: "90vw", background: "#262626", border: "0.5px solid #454545", borderRadius: 10, padding: 20, boxShadow: "0 16px 48px rgba(0,0,0,0.6)" },
  title:     { fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 14 },
  label:     { display: "block", fontSize: 11, color: "#a5a5a5", marginBottom: 5, marginTop: 12 },
  optional:  { color: "#7a7a7a" },
  input:     { width: "100%", boxSizing: "border-box", background: "#303030", border: "0.5px solid #444", borderRadius: 6, padding: "8px 10px", fontSize: 13, color: "#fff", outline: "none", colorScheme: "dark", fontFamily: "inherit" },
  row:       { display: "flex", gap: 10 },
  error:     { marginTop: 12, fontSize: 12, color: "#f97316" },
  actions:   { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 },
  cancelBtn: { fontSize: 12, padding: "7px 14px", borderRadius: 6, background: "transparent", border: "0.5px solid #444", color: "#b0b0b0", cursor: "pointer" },
  createBtn: { fontSize: 12, padding: "7px 14px", borderRadius: 6, background: "#3b82f6", border: "0.5px solid #3b82f6", color: "#fff", cursor: "pointer" },
};
