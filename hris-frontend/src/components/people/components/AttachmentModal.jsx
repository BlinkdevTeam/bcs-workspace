import {useState} from "react"
import { IS } from "../../../data/compData";

// ── ATTACHMENT MODAL ──────────────────────────────────────────────────────────
export default function AttachmentModal({ item, type, onClose, onApprove, onReject }) {
  const [decision, setDecision] = useState(null);
  const [remarks, setRemarks] = useState("");
  const isLeave = type === "leave";
  const isUT    = type === "undertime";
  const isPending = item.status === "Pending" || item.status === "For Review";

  function submit(action) {
    if (action === "approve") onApprove(item.id, remarks);
    else onReject(item.id, remarks);
    onClose();
  }

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.75)" }} onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-xl flex flex-col" style={{ backgroundColor: "#0d0d0d", border: "1px solid #2a2a2a", maxHeight: "90vh" }}>
          <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #1e1e1e" }}>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-0.5" style={{ fontFamily: "system-ui,sans-serif" }}>
                {isLeave ? "Leave Request" : isUT ? "Undertime Request" : "Overtime Request"} · Review
              </p>
              <h2 className="text-lg font-normal text-white">
                {isLeave ? item.type : isUT ? `Undertime — ${item.date}` : `Overtime — ${item.date}`}
              </h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Details */}
            <div className="rounded-lg p-4" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-3" style={{ fontFamily: "system-ui,sans-serif" }}>Request Details</p>
              <div className="grid grid-cols-2 gap-3">
                {(isLeave
                  ? [["Type",item.type],["From",item.from],["To",item.to],["Duration",`${item.days} day${item.days>1?"s":""}`],["Reason",item.reason],["Filed",item.filed]]
                  : isUT
                    ? [["Date",item.date],["Day",item.day],["Clock In",item.clockIn],["Clock Out",item.clockOut],["UT Hours",`-${item.diff?.toFixed(2)}h`],["Deduction",`-$${(item.diff*(142000/52/40)).toFixed(2)}`],["Reason",item.reason],["Filed",item.filed]]
                    : [["Date",item.date],["Day",item.day],["Clock In",item.clockIn],["Clock Out",item.clockOut],["OT Hours",`+${item.diff?.toFixed(2)}h`],["Pay Impact",`$${(item.diff*(142000/52/40)*1.25).toFixed(2)}`],["Reason",item.reason],["Filed",item.filed]]
                ).map(([l,v]) => (
                  <div key={l}>
                    <p className="text-gray-600 text-xs" style={{ fontFamily: "system-ui,sans-serif" }}>{l}</p>
                    <p className="text-gray-200 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{v || "—"}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-3" style={{ fontFamily: "system-ui,sans-serif" }}>
                Attachments <span className="text-gray-700 normal-case">({item.attachments.length} file{item.attachments.length !== 1 ? "s" : ""})</span>
              </p>
              {item.attachments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-20 rounded-lg gap-1" style={{ border: "1px dashed #3a1515", backgroundColor: "#110808" }}>
                  <p className="text-red-400 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>⚠ No attachments submitted</p>
                  <p className="text-gray-600 text-xs" style={{ fontFamily: "system-ui,sans-serif" }}>Request cannot be approved without required documents.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {item.attachments.map((att, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 rounded-lg group" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold" style={{ fontFamily: "monospace", backgroundColor: "#1a1a1a", color: att.ext === "pdf" ? "#f05a5a" : "#5a9af0" }}>{att.ext.toUpperCase()}</div>
                        <div>
                          <p className="text-gray-200 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{att.name}</p>
                          <p className="text-gray-600 text-xs" style={{ fontFamily: "system-ui,sans-serif" }}>{att.size} · {att.label}</p>
                        </div>
                      </div>
                      <button className="text-gray-500 hover:text-white text-sm opacity-0 group-hover:opacity-100">↓ View</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Remarks */}
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2" style={{ fontFamily: "system-ui,sans-serif" }}>HR Remarks <span className="text-gray-700 normal-case">(optional)</span></p>
              <textarea className="w-full px-3 py-2.5 rounded text-sm text-white placeholder-gray-600 outline-none resize-none" style={{ ...IS, height: 72 }} placeholder="Add remarks or conditions…" value={remarks} onChange={e => setRemarks(e.target.value)} />
            </div>

            {/* Decision */}
            {isPending ? (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-3" style={{ fontFamily: "system-ui,sans-serif" }}>Decision</p>
                <div className="flex gap-3">
                  <button onClick={() => setDecision("approve")} className="flex-1 py-2.5 rounded text-sm font-medium transition-all"
                    style={{ fontFamily: "system-ui,sans-serif", backgroundColor: decision === "approve" ? "#0f1f0f" : "#111", color: decision === "approve" ? "#5af07a" : "#666", border: decision === "approve" ? "1px solid #2a4a2a" : "1px solid #2a2a2a" }}>
                    ✓ Approve
                  </button>
                  <button onClick={() => setDecision("reject")} className="flex-1 py-2.5 rounded text-sm font-medium transition-all"
                    style={{ fontFamily: "system-ui,sans-serif", backgroundColor: decision === "reject" ? "#1f0f0f" : "#111", color: decision === "reject" ? "#f05a5a" : "#666", border: decision === "reject" ? "1px solid #4a2a2a" : "1px solid #2a2a2a" }}>
                    ✕ Reject
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded" style={{ backgroundColor: "#111", border: "1px solid #222" }}>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: "system-ui,sans-serif", ...BADGE[item.status] }}>{item.status}</span>
                <span className="text-gray-500 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>This request has already been {item.status.toLowerCase()}.</span>
              </div>
            )}
          </div>

          <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: "1px solid #1e1e1e" }}>
            <button onClick={onClose} className="px-4 py-2 rounded text-sm hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", color: "#aaa", border: "1px solid #2a2a2a" }}>Cancel</button>
            {isPending && (
              <button
                onClick={() => decision && submit(decision)}
                className="px-5 py-2 rounded text-sm font-medium transition-all"
                style={{
                  fontFamily: "system-ui,sans-serif",
                  backgroundColor: !decision ? "#1a1a1a" : decision === "approve" ? "#fff" : "#f05a5a",
                  color: !decision ? "#444" : decision === "approve" ? "#000" : "#fff",
                  cursor: !decision ? "not-allowed" : "pointer",
                  opacity: !decision ? 0.5 : 1,
                }}>
                {!decision ? "Select a decision first" : decision === "approve" ? "Confirm Approval" : "Confirm Rejection"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}