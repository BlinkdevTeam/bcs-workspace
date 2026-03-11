import { useState } from "react";

import NeedsActionPanel from "./NeedsActionPanel";
import AttachmentModal from "./AttachmentModal";

// ── LEAVE TAB ─────────────────────────────────────────────────────────────────
export default function LeaveTab({ emptyState = false, BADGE }) {
  const [modalItem, setModalItem] = useState(null);
  const [records, setRecords] = useState(
    emptyState ? [
      // All resolved — no pending items
      { id:1, type:"Annual Leave",   from:"Dec 24, 2025",to:"Jan 1, 2026", days:6,status:"Approved",  reason:"Holiday break",   filed:"Dec 10, 2025", attachments:[{name:"Leave_Form_Dec2025.pdf",ext:"pdf",size:"84 KB",label:"Leave form"}] },
      { id:2, type:"Sick Leave",     from:"Nov 14, 2025",to:"Nov 14, 2025",days:1,status:"Approved",  reason:"Flu",              filed:"Nov 13, 2025", attachments:[{name:"Medical_Certificate.pdf",ext:"pdf",size:"156 KB",label:"Medical certificate"}] },
      { id:3, type:"Vacation Leave", from:"Aug 5, 2025", to:"Aug 9, 2025", days:5,status:"Approved",  reason:"Summer vacation",  filed:"Jul 28, 2025", attachments:[{name:"Leave_Form_Aug2025.pdf",ext:"pdf",size:"84 KB",label:"Leave form"}] },
      { id:4, type:"Annual Leave",   from:"Mar 20, 2026",to:"Mar 24, 2026",days:5,status:"Rejected",  reason:"Spring trip",      filed:"Feb 15, 2026", attachments:[{name:"Leave_Form_Mar2026.pdf",ext:"pdf",size:"84 KB",label:"Leave form"},{name:"Flight_Itinerary.pdf",ext:"pdf",size:"212 KB",label:"Travel itinerary"}] },
    ] : [
      { id:1, type:"Annual Leave",   from:"Mar 20, 2026",to:"Mar 24, 2026",days:5,status:"Pending",    reason:"Spring trip",      filed:"Feb 15, 2026", attachments:[{name:"Leave_Form_Mar2026.pdf",ext:"pdf",size:"84 KB",label:"Leave form"},{name:"Flight_Itinerary.pdf",ext:"pdf",size:"212 KB",label:"Travel itinerary"}] },
      { id:2, type:"Sick Leave",     from:"Feb 18, 2026",to:"Feb 18, 2026",days:1,status:"For Review", reason:"Migraine",         filed:"Feb 18, 2026", attachments:[] },
      { id:3, type:"Annual Leave",   from:"Dec 24, 2025",to:"Jan 1, 2026", days:6,status:"Approved",   reason:"Holiday break",    filed:"Dec 10, 2025", attachments:[{name:"Leave_Form_Dec2025.pdf",ext:"pdf",size:"84 KB",label:"Leave form"}] },
      { id:4, type:"Sick Leave",     from:"Nov 14, 2025",to:"Nov 14, 2025",days:1,status:"Approved",   reason:"Flu",              filed:"Nov 13, 2025", attachments:[{name:"Medical_Certificate.pdf",ext:"pdf",size:"156 KB",label:"Medical certificate"}] },
      { id:5, type:"Vacation Leave", from:"Aug 5, 2025", to:"Aug 9, 2025", days:5,status:"Approved",   reason:"Summer vacation",  filed:"Jul 28, 2025", attachments:[{name:"Leave_Form_Aug2025.pdf",ext:"pdf",size:"84 KB",label:"Leave form"}] },
      { id:6, type:"Emergency Leave",from:"Oct 5, 2025", to:"Oct 7, 2025", days:3,status:"Approved",   reason:"Family emergency", filed:"Oct 5, 2025",  attachments:[{name:"Barangay_Cert.pdf",ext:"pdf",size:"198 KB",label:"Supporting document"},{name:"Leave_Form.pdf",ext:"pdf",size:"84 KB",label:"Leave form"}] },
    ]
  );

  function approve(id, remarks) { setRecords(r => r.map(x => x.id === id ? { ...x, status: "Approved", remarks } : x)); }
  function reject(id, remarks)  { setRecords(r => r.map(x => x.id === id ? { ...x, status: "Rejected", remarks } : x)); }

  const pending = records.filter(r => r.status === "Pending" || r.status === "For Review");
  const leaveBalances = [
    { label: "Annual Leave",   used: 8,  total: 20 },
    { label: "Sick Leave",     used: 2,  total: 10 },
    { label: "Vacation Leave", used: 5,  total: 15 },
    { label: "Emergency Leave",used: 3,  total: 5  },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* LEFT */}
      <div className="col-span-1 space-y-5">
        {/* Balances */}
        <div className="rounded-lg p-5" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
          <h3 className="text-sm font-normal text-white mb-4">Leave Balances · 2026</h3>
          <div className="space-y-4">
            {leaveBalances.map(({ label, used, total }) => (
              <div key={label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-gray-400 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{label}</span>
                  <span className="text-xs" style={{ fontFamily: "monospace", color: "#aaa" }}><span className="text-white">{total - used}</span>/{total}</span>
                </div>
                <div className="h-2 rounded-full" style={{ backgroundColor: "#2a2a2a" }}>
                  <div className="h-full rounded-full bg-white" style={{ width: `${(used / total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Action — with empty state */}
        <NeedsActionPanel items={pending} type="leave" onSelect={setModalItem} BADGE={BADGE} />

        {/* Requirement note */}
        <div className="rounded-lg p-4" style={{ backgroundColor: "#0a0a0a", border: "1px solid #1e1e1e" }}>
          <p className="text-xs text-gray-600" style={{ fontFamily: "system-ui,sans-serif" }}>
            📎 <span className="text-gray-400">Required docs:</span> Sick → medical cert + form · Vacation/Annual → leave form · Emergency → supporting doc + form. Missing attachments block approval.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="col-span-2 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-normal text-white">Leave Records</h3>
            <p className="text-xs text-gray-600 mt-0.5" style={{ fontFamily: "system-ui,sans-serif" }}>Click any row to review request and attachments</p>
          </div>
          <button className="px-3 py-1.5 rounded text-xs bg-white text-black hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif" }}>+ File Leave</button>
        </div>

        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #1e1e1e" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid #1e1e1e" }}>
                {["Type", "From", "To", "Days", "Reason", "Attachments", "Status"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-normal text-gray-600" style={{ fontFamily: "system-ui,sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id} onClick={() => setModalItem(r)}
                  className="cursor-pointer transition-colors"
                  style={{ borderBottom: "1px solid #141414", backgroundColor: "#0d0d0d" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#141414"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#0d0d0d"}>
                  <td className="px-4 py-3 text-gray-200 text-sm whitespace-nowrap" style={{ fontFamily: "system-ui,sans-serif" }}>{r.type}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap" style={{ fontFamily: "monospace" }}>{r.from}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap" style={{ fontFamily: "monospace" }}>{r.to}</td>
                  <td className="px-4 py-3 text-gray-300 text-xs" style={{ fontFamily: "monospace" }}>{r.days}d</td>
                  <td className="px-4 py-3 text-gray-500 text-xs" style={{ fontFamily: "system-ui,sans-serif" }}>{r.reason || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs" style={{ fontFamily: "monospace", color: r.attachments.length > 0 ? "#fff" : "#f05a5a" }}>{r.attachments.length}</span>
                      <span className="text-xs text-gray-600" style={{ fontFamily: "system-ui,sans-serif" }}>file{r.attachments.length !== 1 ? "s" : ""}</span>
                      {r.attachments.length === 0 && <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#1f0f0f", color: "#f05a5a", fontFamily: "system-ui,sans-serif" }}>Missing</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: "system-ui,sans-serif", ...BADGE[r.status] }}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalItem && <AttachmentModal item={modalItem} type="leave" onClose={() => setModalItem(null)} onApprove={approve} onReject={reject} />}
    </div>
  );
}