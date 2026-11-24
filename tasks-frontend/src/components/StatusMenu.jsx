import { useState } from "react";
import { STATUS_COLORS, createStatus, deleteStatus } from "../services/statuses";

/**
 * The list inside a status dropdown: built-in + this project's custom labels,
 * with an "Add label" form. Labels created here belong to this project only.
 *
 * props: options (array of statuses), projectId, onPick(status),
 *        itemStyle, pillStyle (the caller's own styles, so it matches its dropdown)
 */
export default function StatusMenu({ options, projectId, onPick, itemStyle, pillStyle }) {
  const [adding, setAdding] = useState(false);
  const [label, setLabel]   = useState("");
  const [color, setColor]   = useState(STATUS_COLORS[4]);
  const [busy, setBusy]     = useState(false);
  const [error, setError]   = useState("");

  const submit = async () => {
    if (!label.trim() || busy) return;
    setBusy(true); setError("");
    try {
      const st = await createStatus(projectId, { label, color });
      onPick(st);                       // use the new label right away
    } catch (err) {
      setError(err.response?.data?.message || "Could not add label.");
      setBusy(false);
    }
  };

  const remove = async (e, st) => {
    e.stopPropagation();
    if (!window.confirm(`Delete the label "${st.label}"?\nTasks using it go back to To Do.`)) return;
    try { await deleteStatus(st.id); }
    catch (err) { alert(err.response?.data?.message || "Could not delete label."); }
  };

  return (
    <>
      {options.map((st) => (
        <div key={st.value} style={{ ...itemStyle, justifyContent: "space-between" }} onClick={() => onPick(st)}>
          <span style={{ ...pillStyle, color: st.color, background: st.bg }}>{st.label}</span>
          {st.custom && (
            <span title="Delete label" onClick={(e) => remove(e, st)}
              style={{ fontSize: 14, lineHeight: 1, color: "#8a8a8a", cursor: "pointer", padding: "0 2px" }}>×</span>
          )}
        </div>
      ))}

      <div style={{ height: 1, background: "#383838", margin: "4px 0" }} />

      {!adding ? (
        <div style={{ ...itemStyle, color: "#a5a5a5" }} onClick={() => setAdding(true)}>+ Add label</div>
      ) : (
        <div style={{ padding: "8px 12px 10px" }} onClick={(e) => e.stopPropagation()}>
          <input
            autoFocus value={label} maxLength={30} placeholder="Label name"
            onChange={(e) => { setLabel(e.target.value); setError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") setAdding(false); }}
            style={{ width: "100%", boxSizing: "border-box", fontSize: 12, padding: "6px 8px", borderRadius: 5, background: "#202020", border: "0.5px solid #555", color: "#eee", outline: "none" }}
          />
          <div style={{ display: "flex", gap: 6, margin: "9px 0" }}>
            {STATUS_COLORS.map((c) => (
              <div key={c} onClick={() => setColor(c)} title={c}
                style={{ width: 16, height: 16, borderRadius: "50%", background: c, cursor: "pointer",
                         outline: color === c ? "2px solid #fff" : "none", outlineOffset: 1 }} />
            ))}
          </div>
          {error && <div style={{ fontSize: 11, color: "#f87171", marginBottom: 6 }}>{error}</div>}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={submit} disabled={!label.trim() || busy}
              style={{ fontSize: 11, padding: "5px 12px", borderRadius: 5, background: "#3b82f6", color: "#fff", border: "none", cursor: "pointer", opacity: !label.trim() || busy ? 0.5 : 1 }}>
              {busy ? "Adding..." : "Add"}
            </button>
            <button onClick={() => setAdding(false)}
              style={{ fontSize: 11, padding: "5px 8px", background: "transparent", color: "#8a8a8a", border: "none", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
          <div style={{ fontSize: 10, color: "#8a8a8a", marginTop: 8 }}>Only appears in this project.</div>
        </div>
      )}
    </>
  );
}
