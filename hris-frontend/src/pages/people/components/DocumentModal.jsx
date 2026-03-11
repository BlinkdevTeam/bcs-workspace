// ── DOCUMENT ACTION MODAL ─────────────────────────────────────────────────────
export default function DocumentModal({ doc, onClose }) {
  const extCol = { pdf: "#f05a5a", docx: "#5a9af0", xlsx: "#5af07a", pptx: "#f0c85a" };
  const dSS    = { Signed: { bg: "#0f1f0f", color: "#5af07a" }, Pending: { bg: "#1f1a0f", color: "#f0c85a" }, Auto: { bg: "#111", color: "#888" } };

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.75)" }} onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-xl flex flex-col" style={{ backgroundColor: "#0d0d0d", border: "1px solid #2a2a2a" }}>

          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5" style={{ borderBottom: "1px solid #1e1e1e" }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ fontFamily: "monospace", backgroundColor: "#1a1a1a", color: extCol[doc.ext] || "#888", border: "1px solid #2a2a2a" }}>
                {doc.ext.toUpperCase()}
              </div>
              <div>
                <h2 className="text-base font-normal text-white leading-snug">{doc.name}</h2>
                <p className="text-gray-500 text-xs mt-0.5" style={{ fontFamily: "system-ui,sans-serif" }}>
                  {doc.ext.toUpperCase()} · {doc.size} · {doc.version}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-xl ml-4 flex-shrink-0">✕</button>
          </div>

          {/* File details */}
          <div className="px-6 py-4 grid grid-cols-2 gap-4" style={{ borderBottom: "1px solid #1e1e1e" }}>
            {[
              ["Category",    doc.type],
              ["Status",      null],
              ["Uploaded",    doc.uploaded],
              ["Uploaded by", doc.uploader],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="text-xs uppercase tracking-widest text-gray-600 mb-1" style={{ fontFamily: "system-ui,sans-serif" }}>{label}</p>
                {label === "Status"
                  ? <span className="text-xs px-2 py-0.5 rounded-full inline-block" style={{ fontFamily: "system-ui,sans-serif", ...dSS[doc.status] }}>{doc.status}</span>
                  : <p className="text-gray-200 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{val}</p>
                }
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="px-6 py-5 space-y-3">
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-3" style={{ fontFamily: "system-ui,sans-serif" }}>Actions</p>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-left hover:opacity-80 transition-opacity"
              style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#fff", color: "#000" }}>
              <span className="text-base">↗</span>
              <div>
                <p className="font-medium text-sm">View Document</p>
                <p className="text-xs opacity-60">Opens in a new tab</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-left hover:opacity-80 transition-opacity"
              style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", color: "#ccc", border: "1px solid #2a2a2a" }}>
              <span className="text-base">↓</span>
              <div>
                <p className="font-medium text-sm">Download</p>
                <p className="text-xs opacity-50">Save a copy to your device</p>
              </div>
            </button>

            {doc.status === "Pending" && (
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-left hover:opacity-80 transition-opacity"
                style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#0a1a2a", color: "#5a9af0", border: "1px solid #1e3a5a" }}>
                <span className="text-base">✍</span>
                <div>
                  <p className="font-medium text-sm">Request Signature</p>
                  <p className="text-xs opacity-60">Send a signing request to the employee</p>
                </div>
              </button>
            )}

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-left hover:opacity-80 transition-opacity"
              style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#1f0f0f", color: "#f05a5a", border: "1px solid #3a1515" }}>
              <span className="text-base">🗑</span>
              <div>
                <p className="font-medium text-sm">Delete</p>
                <p className="text-xs opacity-60">Permanently remove this document</p>
              </div>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}