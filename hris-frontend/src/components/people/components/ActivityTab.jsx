import { useState } from "react";

// ── ACTIVITY TAB ──────────────────────────────────────────────────────────────
export default function ActivityTab() {
  const [filter, setFilter] = useState("All");
  const events = [
    { date: "Feb 10, 2026", time: "2:14 PM",  type: "Review",   icon: "📝", title: "Performance review completed",    detail: "Q4 2025 scored 4.2/5. Reviewer: Devon Park.",     actor: "Devon Park" },
    { date: "Feb 1, 2026",  time: "9:00 AM",  type: "Payroll",  icon: "💳", title: "Payslip generated — Jan 2026",    detail: "Net pay $5,461. Account ••••2847.",               actor: "Payroll System" },
    { date: "Jan 15, 2026", time: "11:30 AM", type: "Document", icon: "📄", title: "Q1 2026 Goal Sheet uploaded",      detail: "Awaiting manager signature.",                    actor: "Sara Okafor" },
    { date: "Jan 1, 2026",  time: "8:00 AM",  type: "Role",     icon: "⬆️", title: "Title updated to Senior Engineer", detail: "Previous: Engineer II. Effective Jan 1, 2026.",  actor: "Devon Park" },
    { date: "Dec 24, 2025", time: "All day",  type: "Leave",    icon: "🏖️", title: "Annual leave started",             detail: "Dec 24 – Jan 1. 6 days. Approved by Devon Park.", actor: "System" },
    { date: "Dec 5, 2025",  time: "3:45 PM",  type: "Training", icon: "🎓", title: "Compliance training completed",    detail: "Cybersecurity & data privacy. Score: 96%.",      actor: "Sara Okafor" },
    { date: "Nov 14, 2025", time: "All day",  type: "Leave",    icon: "🤒", title: "Sick day taken",                   detail: "1 day. Balance updated.",                        actor: "System" },
  ];
  const types = ["All", "Review", "Payroll", "Leave", "Document", "Role", "Training"];
  const tCol = { Review: "#9b8aff", Payroll: "#5af07a", Leave: "#f0c85a", Document: "#5a9af0", Role: "#fff", Training: "#f05a5a" };
  const filtered = filter === "All" ? events : events.filter(e => e.type === filter);
  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} className="px-3 py-1.5 rounded text-xs transition-all flex items-center gap-1.5"
            style={{ fontFamily: "system-ui,sans-serif", backgroundColor: filter === t ? "#fff" : "#111", color: filter === t ? "#000" : "#666", border: filter === t ? "none" : "1px solid #2a2a2a" }}>
            {t !== "All" && <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tCol[t] }} />}{t}
          </button>
        ))}
      </div>
      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-px" style={{ backgroundColor: "#1e1e1e" }} />
        <div className="space-y-1">
          {filtered.map((ev, i) => {
            const showDate = i === 0 || filtered[i - 1].date !== ev.date;
            return (
              <div key={i}>
                {showDate && <div className="pl-12 pt-4 pb-2"><span className="text-xs text-gray-600 uppercase tracking-widest" style={{ fontFamily: "monospace" }}>{ev.date}</span></div>}
                <div className="flex items-start gap-4 py-2 px-3 rounded-lg hover:bg-white hover:bg-opacity-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10" style={{ backgroundColor: "#111", border: `1px solid ${tCol[ev.type] || "#333"}` }}>
                    <span className="text-base">{ev.icon}</span>
                  </div>
                  <div className="flex-1 pt-1.5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-gray-100 text-sm font-medium" style={{ fontFamily: "system-ui,sans-serif" }}>{ev.title}</p>
                        <p className="text-gray-500 text-sm mt-0.5" style={{ fontFamily: "system-ui,sans-serif" }}>{ev.detail}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#1a1a1a", color: tCol[ev.type] || "#888" }}>{ev.type}</span>
                          <span className="text-xs text-gray-600" style={{ fontFamily: "system-ui,sans-serif" }}>by {ev.actor}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 whitespace-nowrap" style={{ fontFamily: "monospace" }}>{ev.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}