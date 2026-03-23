import { useState, useRef, useEffect } from "react";
import {
  PEOPLE, STATUSES, PRIORITIES,
  getStatus, getPriority,
  formatDate, StackedAvatars, PeopleDropdown,
} from "./MyTasks";

const MOCK_COMMENTS = [
  { id: 1, author: "KM", name: "Ken M.",  color: "#3b82f6", time: "2 hours ago", text: "This is blocked by the auth interceptor setup. Will finish after that." },
  { id: 2, author: "JD", name: "Jane D.", color: "#a78bfa", time: "1 hour ago",  text: "Got it. I can help with the silent refresh part if needed." },
];

// ── TaskPanel ─────────────────────────────────────────────────────────────────
export default function TaskPanel({ task, onClose, onUpdate }) {
  const [comments, setComments]       = useState(MOCK_COMMENTS);
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab]     = useState("description");
  const [openField, setOpenField]     = useState(null);
  const [description, setDescription] = useState(task.description || "");
  const editorRef                     = useRef(null);

  useEffect(() => { setDescription(task.description || ""); }, [task.id]);

  const execFormat = (cmd, val = null) => { document.execCommand(cmd, false, val); editorRef.current?.focus(); };

  const submitComment = () => {
    if (!commentText.trim()) return;
    setComments((prev) => [...prev, { id: Date.now(), author: "KM", name: "Ken M.", color: "#3b82f6", time: "Just now", text: commentText.trim() }]);
    setCommentText("");
  };

  const status   = getStatus(task.status);
  const priority = getPriority(task.priority);

  return (
    <div style={s.panel} onClick={() => setOpenField(null)}>

      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <span style={{ ...s.statusPill, color: status.color, background: status.bg }}>{status.label}</span>
          <span style={s.projectName}>{task.project}</span>
        </div>
        <div style={s.closeBtn} onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </div>
      </div>

      {/* Task title */}
      <div
        contentEditable suppressContentEditableWarning style={s.taskTitle}
        onBlur={(e) => onUpdate({ name: e.currentTarget.textContent.trim() })}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.currentTarget.blur(); } }}
      >
        {task.name}
      </div>

      {/* Meta fields */}
      <div style={s.metaGrid} onClick={(e) => e.stopPropagation()}>

        <MetaRow label="Status">
          <div style={{ position: "relative" }}>
            <span style={{ ...s.pill, color: status.color, background: status.bg, cursor: "pointer" }} onClick={() => setOpenField(openField === "status" ? null : "status")}>
              {status.label}
            </span>
            {openField === "status" && (
              <FieldDropdown onClose={() => setOpenField(null)}>
                {STATUSES.map((st) => (
                  <div key={st.value} style={s.ddItem} onClick={() => { onUpdate({ status: st.value, done: st.value === "done" }); setOpenField(null); }}>
                    <span style={{ ...s.pill, color: st.color, background: st.bg }}>{st.label}</span>
                  </div>
                ))}
              </FieldDropdown>
            )}
          </div>
        </MetaRow>

        <MetaRow label="Priority">
          <div style={{ position: "relative" }}>
            <span style={{ ...s.pill, color: priority.color, background: priority.bg, cursor: "pointer" }} onClick={() => setOpenField(openField === "priority" ? null : "priority")}>
              {priority.label}
            </span>
            {openField === "priority" && (
              <FieldDropdown onClose={() => setOpenField(null)}>
                {PRIORITIES.map((pr) => (
                  <div key={pr.value} style={s.ddItem} onClick={() => { onUpdate({ priority: pr.value }); setOpenField(null); }}>
                    <span style={{ ...s.pill, color: pr.color, background: pr.bg }}>{pr.label}</span>
                  </div>
                ))}
              </FieldDropdown>
            )}
          </div>
        </MetaRow>

        {/* People — multi-select */}
        <MetaRow label="People">
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setOpenField(openField === "people" ? null : "people")}>
              <StackedAvatars peopleIds={task.people} max={5} size={24} />
              <span style={{ fontSize: 12, color: "#555" }}>
                {task.people.map((id) => PEOPLE.find((p) => p.id === id)?.name ?? id).join(", ")}
              </span>
            </div>
            {openField === "people" && (
              <PeopleDropdown
                selected={task.people}
                onChange={(next) => onUpdate({ people: next })}
                onClose={() => setOpenField(null)}
              />
            )}
          </div>
        </MetaRow>

        <MetaRow label="Date">
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: 12, color: "#888", cursor: "pointer" }} onClick={() => setOpenField(openField === "date" ? null : "date")}>
              {formatDate(task.due) || "No date"}
            </span>
            {openField === "date" && (
              <FieldDropdown onClose={() => setOpenField(null)} width={180}>
                <div style={{ padding: "8px 12px" }}>
                  <input type="date" defaultValue={task.due} style={s.dateInput}
                    onChange={(e) => { onUpdate({ due: e.target.value }); setOpenField(null); }}
                    onClick={(e) => e.stopPropagation()} />
                </div>
              </FieldDropdown>
            )}
          </div>
        </MetaRow>
      </div>

      <div style={s.divider} />

      {/* Tabs */}
      <div style={s.tabs}>
        {["description", "comments"].map((tab) => (
          <div key={tab} style={{ ...s.tab, ...(activeTab === tab ? s.tabActive : {}) }} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === "comments" && comments.length > 0 && <span style={s.tabBadge}>{comments.length}</span>}
          </div>
        ))}
      </div>

      {/* Tab content */}
      <div style={s.tabContent}>

        {/* Description WYSIWYG */}
        {activeTab === "description" && (
          <div style={s.wysiwyg}>
            <div style={s.toolbar}>
              <ToolBtn onClick={() => execFormat("bold")} title="Bold">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 010 8H6zM6 12h9a4 4 0 010 8H6z"/></svg>
              </ToolBtn>
              <ToolBtn onClick={() => execFormat("italic")} title="Italic">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
              </ToolBtn>
              <ToolBtn onClick={() => execFormat("underline")} title="Underline">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0012 0V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
              </ToolBtn>
              <div style={s.toolSep} />
              <ToolBtn onClick={() => execFormat("insertUnorderedList")} title="Bullet list">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
              </ToolBtn>
              <ToolBtn onClick={() => execFormat("insertOrderedList")} title="Numbered list">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
              </ToolBtn>
              <div style={s.toolSep} />
              <ToolBtn onClick={() => execFormat("formatBlock", "h3")} title="Heading">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16M4 6h7M4 18h7"/></svg>
              </ToolBtn>
              <ToolBtn onClick={() => execFormat("formatBlock", "blockquote")} title="Quote">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
              </ToolBtn>
              <ToolBtn onClick={() => execFormat("removeFormat")} title="Clear formatting">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
              </ToolBtn>
            </div>
            <div ref={editorRef} contentEditable suppressContentEditableWarning style={s.editor}
              dangerouslySetInnerHTML={{ __html: description || "<p style='color:#333'>Add a description...</p>" }}
              onInput={(e) => { setDescription(e.currentTarget.innerHTML); onUpdate({ description: e.currentTarget.innerHTML }); }}
              onFocus={(e) => {
                if (e.currentTarget.innerText.trim() === "Add a description...") {
                  document.execCommand("selectAll"); document.execCommand("delete");
                }
              }}
            />
          </div>
        )}

        {/* Comments */}
        {activeTab === "comments" && (
          <div style={s.commentsSection}>
            <div style={s.commentList}>
              {comments.length === 0 && <div style={s.noComments}>No comments yet.</div>}
              {comments.map((c) => (
                <div key={c.id} style={s.comment}>
                  <div style={{ ...s.commentAvatar, background: c.color }}>{c.author}</div>
                  <div style={s.commentBody}>
                    <div style={s.commentMeta}>
                      <span style={s.commentName}>{c.name}</span>
                      <span style={s.commentTime}>{c.time}</span>
                    </div>
                    <div style={s.commentText}>{c.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={s.commentInput}>
              <div style={{ ...s.commentAvatar, background: "#3b82f6" }}>KM</div>
              <div style={s.commentInputBox}>
                <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitComment(); } }}
                  placeholder="Write a comment... (Enter to send)"
                  style={s.commentTextarea} rows={3} />
                <div style={s.commentActions}>
                  <button style={{ ...s.sendBtn, ...(commentText.trim() ? s.sendBtnActive : {}) }} onClick={submitComment}>Send</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MetaRow ───────────────────────────────────────────────────────────────────
function MetaRow({ label, children }) {
  return (
    <div style={s.metaRow}>
      <div style={s.metaLabel}>{label}</div>
      <div style={s.metaValue}>{children}</div>
    </div>
  );
}

// ── FieldDropdown ─────────────────────────────────────────────────────────────
function FieldDropdown({ children, onClose, width = 180 }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return (
    <div ref={ref} style={{ ...s.fieldDropdown, width }} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  );
}

// ── ToolBtn ───────────────────────────────────────────────────────────────────
function ToolBtn({ onClick, title, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div title={title} onClick={onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ ...s.toolBtn, ...(hovered ? s.toolBtnHover : {}) }}>
      {children}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  panel:           { width: "100%", height: "100%", background: "#0f0f0f", borderLeft: "0.5px solid #1e1e1e", display: "flex", flexDirection: "column", overflow: "hidden" },
  header:          { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "0.5px solid #1e1e1e", flexShrink: 0 },
  headerLeft:      { display: "flex", alignItems: "center", gap: 10 },
  statusPill:      { fontSize: 11, padding: "2px 10px", borderRadius: 4 },
  projectName:     { fontSize: 11, color: "#444" },
  closeBtn:        { width: 26, height: 26, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#555" },
  taskTitle:       { fontSize: 15, fontWeight: 500, color: "#ddd", padding: "14px 16px 10px", outline: "none", lineHeight: 1.5, flexShrink: 0, cursor: "text" },
  metaGrid:        { padding: "4px 16px 12px", flexShrink: 0 },
  metaRow:         { display: "flex", alignItems: "center", padding: "7px 0", borderBottom: "0.5px solid #1a1a1a" },
  metaLabel:       { fontSize: 11, color: "#444", width: 72, flexShrink: 0 },
  metaValue:       { flex: 1 },
  pill:            { display: "inline-flex", alignItems: "center", fontSize: 11, padding: "2px 10px", borderRadius: 4, whiteSpace: "nowrap", cursor: "pointer" },
  fieldDropdown:   { position: "absolute", top: 30, left: 0, background: "#1a1a1a", border: "0.5px solid #333", borderRadius: 8, zIndex: 300, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" },
  ddItem:          { display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", cursor: "pointer", fontSize: 12, color: "#777" },
  dateInput:       { background: "#222", border: "0.5px solid #444", borderRadius: 4, padding: "4px 8px", fontSize: 12, color: "#aaa", outline: "none", width: "100%", colorScheme: "dark" },
  divider:         { height: "0.5px", background: "#1a1a1a", flexShrink: 0 },
  tabs:            { display: "flex", borderBottom: "0.5px solid #1a1a1a", flexShrink: 0 },
  tab:             { fontSize: 12, padding: "10px 16px", color: "#444", cursor: "pointer", borderBottom: "1.5px solid transparent", marginBottom: "-0.5px", display: "flex", alignItems: "center", gap: 6 },
  tabActive:       { color: "#ccc", borderBottomColor: "#ccc" },
  tabBadge:        { fontSize: 10, background: "#1e1e1e", color: "#555", padding: "1px 6px", borderRadius: 10 },
  tabContent:      { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" },
  wysiwyg:         { display: "flex", flexDirection: "column", flex: 1 },
  toolbar:         { display: "flex", alignItems: "center", gap: 2, padding: "8px 12px", borderBottom: "0.5px solid #1a1a1a", flexWrap: "wrap", flexShrink: 0 },
  toolBtn:         { width: 26, height: 26, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#555" },
  toolBtnHover:    { background: "#1e1e1e", color: "#aaa" },
  toolSep:         { width: "0.5px", height: 16, background: "#222", margin: "0 4px" },
  editor:          { flex: 1, padding: "14px 16px", fontSize: 13, color: "#999", lineHeight: 1.7, outline: "none", overflowY: "auto", minHeight: 160 },
  commentsSection: { display: "flex", flexDirection: "column", flex: 1, padding: "12px 16px", gap: 16 },
  commentList:     { display: "flex", flexDirection: "column", gap: 16, flex: 1 },
  noComments:      { fontSize: 12, color: "#333", textAlign: "center", padding: "24px 0" },
  comment:         { display: "flex", gap: 10 },
  commentAvatar:   { width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 600, flexShrink: 0 },
  commentBody:     { flex: 1 },
  commentMeta:     { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 },
  commentName:     { fontSize: 12, color: "#777", fontWeight: 500 },
  commentTime:     { fontSize: 10, color: "#333" },
  commentText:     { fontSize: 12, color: "#888", lineHeight: 1.6 },
  commentInput:    { display: "flex", gap: 10, paddingTop: 12, borderTop: "0.5px solid #1a1a1a", flexShrink: 0 },
  commentInputBox: { flex: 1, display: "flex", flexDirection: "column", gap: 8 },
  commentTextarea: { background: "#1a1a1a", border: "0.5px solid #333", borderRadius: 6, padding: "8px 10px", fontSize: 12, color: "#aaa", outline: "none", resize: "none", width: "100%", lineHeight: 1.6, colorScheme: "dark" },
  commentActions:  { display: "flex", justifyContent: "flex-end" },
  sendBtn:         { fontSize: 11, padding: "5px 14px", borderRadius: 5, background: "transparent", border: "0.5px solid #333", color: "#444", cursor: "pointer" },
  sendBtnActive:   { borderColor: "#3b82f6", color: "#3b82f6" },
};
