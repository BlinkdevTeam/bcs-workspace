import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import api from "../services/api";
import { selectUser } from "../store/slices/authSlice";

const ALLOWED = [".docx", ".pdf", ".xlsx", ".csv"];
const MAX_BYTES = 10 * 1024 * 1024;

const extOf = (name) => (name.match(/\.[^.]+$/)?.[0] || "").toLowerCase();

const TYPE_STYLE = {
  ".pdf":  { label: "PDF",  color: "#ef4444" },
  ".docx": { label: "DOC",  color: "#3b82f6" },
  ".xlsx": { label: "XLS",  color: "#22c55e" },
  ".csv":  { label: "CSV",  color: "#14b8a6" },
};

function formatSize(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function formatWhen(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " +
         d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/** Loads a task's files. Used by TaskPanel so the tab can show a count. */
export function useTaskFiles(taskId) {
  const [files, setFiles]     = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    return api.get(`/tasks/${taskId}/attachments`)
      .then((r) => setFiles(r.data.attachments || []))
      .catch(() => setFiles([]))
      .finally(() => setLoading(false));
  }, [taskId]);

  useEffect(() => { setFiles([]); load(); }, [load]);
  return { files, setFiles, loading };
}

export default function TaskFiles({ taskId, files, setFiles, loading }) {
  const me = useSelector(selectUser);
  const inputRef = useRef(null);
  const currentTask = useRef(taskId);
  useEffect(() => { currentTask.current = taskId; }, [taskId]);
  const [busy, setBusy]       = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors]   = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const uploadAll = async (fileList) => {
    const picked = Array.from(fileList);
    if (!picked.length) return;
    setBusy(true); setErrors([]);
    const problems = [];

    for (const file of picked) {
      if (!ALLOWED.includes(extOf(file.name))) { problems.push(`${file.name}: only .docx, .pdf, .xlsx and .csv files can be added.`); continue; }
      if (file.size > MAX_BYTES)               { problems.push(`${file.name}: too large (limit is 10 MB).`); continue; }
      if (file.size === 0)                     { problems.push(`${file.name}: the file is empty.`); continue; }

      try {
        setProgress(0);
        const fd = new FormData();
        fd.append("file", file);
        const { data } = await api.post(`/tasks/${taskId}/attachments`, fd, {
          onUploadProgress: (e) => e.total && setProgress(Math.round((e.loaded / e.total) * 100)),
        });
        // only add it to the list if this task is still the one being shown
        if (currentTask.current === taskId) setFiles((prev) => [...prev, data.attachment]);
      } catch (err) {
        problems.push(`${file.name}: ${err.response?.data?.message || "upload failed."}`);
      }
    }
    setBusy(false); setProgress(0); setErrors(problems);
    if (inputRef.current) inputRef.current.value = "";
  };

  const download = async (f) => {
    try {
      const res = await api.get(`/attachments/${f.id}/download`, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url; a.download = f.name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch {
      setErrors([`${f.name}: could not download.`]);
    }
  };

  const remove = async (f) => {
    if (!window.confirm(`Delete "${f.name}"?`)) return;
    try {
      await api.delete(`/attachments/${f.id}`);
      setFiles((prev) => prev.filter((x) => x.id !== f.id));
    } catch (err) {
      setErrors([`${f.name}: ${err.response?.data?.message || "could not delete."}`]);
    }
  };

  return (
    <div
      style={{ ...s.wrap, ...(dragOver ? s.wrapDrag : {}) }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); uploadAll(e.dataTransfer.files); }}
    >
      <div style={s.topRow}>
        <button style={{ ...s.addBtn, opacity: busy ? 0.6 : 1 }} disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? `Uploading... ${progress}%` : "+ Add file"}
        </button>
        <span style={s.hint}>.docx, .pdf, .xlsx, .csv · up to 10 MB each</span>
        <input ref={inputRef} type="file" multiple accept={ALLOWED.join(",")} style={{ display: "none" }}
          onChange={(e) => uploadAll(e.target.files)} />
      </div>

      {errors.length > 0 && (
        <div style={s.errorBox}>
          {errors.map((m, i) => <div key={i}>{m}</div>)}
        </div>
      )}

      {loading ? (
        <div style={s.empty}>Loading files...</div>
      ) : files.length === 0 ? (
        <div style={s.empty}>No files yet. Click "Add file" or drop files here.</div>
      ) : (
        <div style={s.list}>
          {files.map((f) => {
            const t = TYPE_STYLE[extOf(f.name)] || { label: "FILE", color: "#8a8a8a" };
            const mine = f.uploaded_by?.id && f.uploaded_by.id === me?.id;
            return (
              <div key={f.id} style={s.row}>
                <div style={{ ...s.badge, color: t.color, borderColor: t.color }}>{t.label}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={s.name} title={f.name}>{f.name}</div>
                  <div style={s.meta}>
                    {formatSize(f.size)} · {f.uploaded_by?.name || "Unknown"} · {formatWhen(f.created_at)}
                  </div>
                </div>
                <span style={s.action} onClick={() => download(f)}>Download</span>
                {mine && <span style={{ ...s.action, color: "#f87171" }} onClick={() => remove(f)}>Delete</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  wrap:     { flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12, border: "1px dashed transparent" },
  wrapDrag: { border: "1px dashed #3b82f6", background: "rgba(59,130,246,0.05)" },
  topRow:   { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  addBtn:   { fontSize: 12, padding: "7px 16px", borderRadius: 6, background: "transparent", color: "#a5a5a5", border: "0.5px solid #555", cursor: "pointer" },
  hint:     { fontSize: 11, color: "#8a8a8a" },
  errorBox: { fontSize: 12, color: "#f87171", background: "rgba(239,68,68,0.08)", border: "0.5px solid rgba(239,68,68,0.3)", borderRadius: 6, padding: "8px 10px", display: "flex", flexDirection: "column", gap: 4 },
  empty:    { fontSize: 12, color: "#8a8a8a", textAlign: "center", padding: "28px 0" },
  list:     { display: "flex", flexDirection: "column" },
  row:      { display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "0.5px solid #303030" },
  badge:    { fontSize: 9, fontWeight: 700, letterSpacing: "0.5px", border: "1px solid", borderRadius: 4, padding: "4px 5px", minWidth: 28, textAlign: "center", flexShrink: 0 },
  name:     { fontSize: 13, color: "#ddd", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  meta:     { fontSize: 11, color: "#8a8a8a", marginTop: 2 },
  action:   { fontSize: 11, color: "#a5a5a5", cursor: "pointer", padding: "3px 6px", borderRadius: 4, flexShrink: 0 },
};
