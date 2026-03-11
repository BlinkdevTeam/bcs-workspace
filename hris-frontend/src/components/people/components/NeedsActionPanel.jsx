// ── NEEDS ACTION PANEL ────────────────────────────────────────────────────────
// Shared left-column panel for both Leave and Overtime tabs.
// Shows a calm "all clear" empty state when nothing is pending.
export default function NeedsActionPanel({ items, type, onSelect, BADGE }) {
  const isEmpty = items.length === 0;
  return (
    <div
      className="rounded-lg p-5"
      style={{
        backgroundColor: isEmpty ? "#0d0d0d" : type === "leave" ? "#0a1a0a" : "#0a0f1a",
        border: `1px solid ${isEmpty ? "#1e1e1e" : type === "leave" ? "#1e3a1e" : "#1e2a3a"}`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-widest text-gray-500" style={{ fontFamily: "system-ui,sans-serif" }}>
          Needs Action
        </p>
        {!isEmpty && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ fontFamily: "monospace", backgroundColor: type === "leave" ? "#0f2a0f" : "#0a1a2a", color: type === "leave" ? "#5af07a" : "#5a9af0" }}
          >
            {items.length}
          </span>
        )}
      </div>

      {isEmpty ? (
        // ── EMPTY STATE ──
        <div className="flex flex-col items-center text-center py-6 gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
            style={{ backgroundColor: "#111", border: "1px solid #2a2a2a" }}
          >
            ✅
          </div>
          <div>
            <p className="text-gray-300 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>
              All caught up
            </p>
            <p className="text-gray-600 text-xs mt-1" style={{ fontFamily: "system-ui,sans-serif" }}>
              No pending {type === "leave" ? "leave requests" : "overtime requests"} to review.
            </p>
          </div>
          <div
            className="w-full mt-1 rounded px-3 py-2.5 text-center"
            style={{ backgroundColor: "#111", border: "1px dashed #2a2a2a" }}
          >
            <p className="text-gray-600 text-xs" style={{ fontFamily: "system-ui,sans-serif" }}>
              New requests will appear here for your review.
            </p>
          </div>
        </div>
      ) : (
        // ── PENDING LIST ──
        <div className="space-y-2">
          {items.map(r => (
            <button
              key={r.id}
              onClick={() => onSelect(r)}
              className="w-full text-left px-3 py-2.5 rounded transition-colors hover:opacity-80"
              style={{ backgroundColor: "#111", border: "1px solid #2a2a2a" }}
            >
              <p className="text-gray-200 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>
                {type === "leave" ? r.type : `${r.date} · ${r.day}`}
              </p>
              <p className="text-gray-500 text-xs" style={{ fontFamily: "system-ui,sans-serif" }}>
                {type === "leave" ? `${r.from} · ${r.days}d` : `+${r.ot.toFixed(2)}h · ${r.reason}`}
              </p>
              <span
                className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                style={{ fontFamily: "system-ui,sans-serif", ...BADGE[r.status] }}
              >
                {r.status}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}