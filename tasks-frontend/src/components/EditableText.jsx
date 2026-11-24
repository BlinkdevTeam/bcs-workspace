import { useState, useRef, useEffect } from "react";

/**
 * Text you can click to edit in place.
 * Enter saves, Escape cancels, clicking away saves. If onSave throws, the old
 * text comes back and the error is shown under the field.
 */
export default function EditableText({ value, onSave, canEdit = true, style, inputStyle, placeholder = "Click to add", multiline = false, emptyText }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value || "");
  const [busy, setBusy]       = useState(false);
  const [error, setError]     = useState("");
  const [hover, setHover]     = useState(false);
  const ref = useRef(null);
  const cancelled = useRef(false);

  useEffect(() => { if (!editing) setDraft(value || ""); }, [value, editing]);
  useEffect(() => { if (editing) { ref.current?.focus(); ref.current?.select?.(); } }, [editing]);

  const finish = async () => {
    if (cancelled.current) { cancelled.current = false; return; }
    const next = draft.trim();
    if (next === (value || "")) { setEditing(false); setError(""); return; }
    setBusy(true); setError("");
    try {
      await onSave(next);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Could not save.");
      setDraft(value || "");
      setEditing(false);
    } finally { setBusy(false); }
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") { cancelled.current = true; setDraft(value || ""); setEditing(false); setError(""); }
    if (e.key === "Enter" && (!multiline || !e.shiftKey)) { e.preventDefault(); e.currentTarget.blur(); }
  };

  if (!canEdit) return <div style={style}>{value || emptyText}</div>;

  if (editing) {
    const common = {
      ref, value: draft, disabled: busy, onChange: (e) => setDraft(e.target.value), onBlur: finish, onKeyDown,
      style: { width: "100%", boxSizing: "border-box", background: "#262626", border: "0.5px solid #5a8bd6", borderRadius: 5, outline: "none", color: "#fff", font: "inherit", padding: "3px 8px", ...inputStyle },
    };
    return multiline ? <textarea rows={2} {...common} /> : <input {...common} />;
  }

  return (
    <div>
      <div
        style={{ ...style, cursor: "text", borderRadius: 5, padding: "3px 8px", margin: "-3px -8px", background: hover ? "#2a2a2a" : "transparent", display: "flex", alignItems: "center", gap: 8 }}
        title="Click to edit"
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onClick={() => setEditing(true)}
      >
        <span>{value || emptyText || placeholder}</span>
        {hover && <span style={{ fontSize: 11, color: "#7a7a7a" }}>✎</span>}
      </div>
      {error && <div style={{ fontSize: 11, color: "#f87171", marginTop: 4 }}>{error}</div>}
    </div>
  );
}
