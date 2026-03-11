import React, { useState, useMemo } from "react";
import {
  EMPLOYEES, Avatar, LEAVE_TYPES, LEAVE_STATUS_STYLE
} from "../../../data/compData";

export default function LeaveManagementTab({ leaveRequests, onApprove, onReject }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return leaveRequests.filter(req => {
      const emp = EMPLOYEES.find(e=>e.id===req.empId);
      const q = search.toLowerCase();
      return (statusFilter === "All" || req.status === statusFilter)
        && (typeFilter === "All" || req.type === typeFilter)
        && (!q || emp?.name.toLowerCase().includes(q));
    });
  }, [leaveRequests, statusFilter, typeFilter, search]);

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          ["Pending",  leaveRequests.filter(r=>r.status==="Pending").length,  "#f0c85a", "#1f1a0f"],
          ["Approved", leaveRequests.filter(r=>r.status==="Approved").length, "#5af07a", "#0f1f0f"],
          ["Rejected", leaveRequests.filter(r=>r.status==="Rejected").length, "#f05a5a", "#1f0f0f"],
          ["Total",    leaveRequests.length,                                   "#fff",    "#111"   ],
        ].map(([label, count, color, bg]) => (
          <div key={label} className="rounded-lg p-4" style={{ backgroundColor: bg, border:"1px solid #1e1e1e" }}>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily:"system-ui,sans-serif", color:"#666" }}>{label}</p>
            <p className="text-2xl font-light" style={{ fontFamily:"monospace", color }}>{count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input className="w-full pl-9 pr-4 py-2 rounded text-sm text-white placeholder-gray-600 outline-none"
            style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", border:"1px solid #2a2a2a" }}
            placeholder="Search employee…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="px-3 py-2 rounded text-sm text-gray-300 outline-none" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", border:"1px solid #2a2a2a" }}
          value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          {["All","Pending","Approved","Rejected"].map(s=><option key={s}>{s==="All"?"All Statuses":s}</option>)}
        </select>
        <select className="px-3 py-2 rounded text-sm text-gray-300 outline-none" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", border:"1px solid #2a2a2a" }}
          value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
          {LEAVE_TYPES.map(t=><option key={t}>{t==="All"?"All Types":t}</option>)}
        </select>
        <div className="flex-1" />
        <span className="text-gray-600 text-sm" style={{ fontFamily:"monospace" }}>{filtered.length} requests</span>
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden" style={{ border:"1px solid #1e1e1e" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor:"#0a0a0a", borderBottom:"1px solid #1e1e1e" }}>
              {["Employee","Type","From","To","Days","Reason","Applied","Status",""].map(h=>(
                <th key={h} className="px-4 py-3 text-left font-normal text-gray-600" style={{ fontFamily:"system-ui,sans-serif", fontSize:10, textTransform:"uppercase", letterSpacing:"0.07em", whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((req, i) => {
              const emp = EMPLOYEES.find(e=>e.id===req.empId);
              const st = LEAVE_STATUS_STYLE[req.status];
              return (
                <tr key={req.id} style={{ borderBottom: i < filtered.length-1 ? "1px solid #141414" : "none", backgroundColor:"#0d0d0d" }}
                  onMouseEnter={e=>e.currentTarget.style.backgroundColor="#111"}
                  onMouseLeave={e=>e.currentTarget.style.backgroundColor="#0d0d0d"}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {emp && <Avatar emp={emp} size={26} />}
                      <span className="text-gray-200 text-sm" style={{ fontFamily:"system-ui,sans-serif" }}>{emp?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs" style={{ fontFamily:"system-ui,sans-serif" }}>{req.type}</td>
                  <td className="px-4 py-3 text-gray-300 text-xs" style={{ fontFamily:"monospace" }}>{req.from}</td>
                  <td className="px-4 py-3 text-gray-300 text-xs" style={{ fontFamily:"monospace" }}>{req.to}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs text-center" style={{ fontFamily:"monospace" }}>{req.days}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate" style={{ fontFamily:"system-ui,sans-serif" }}>{req.reason}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs" style={{ fontFamily:"monospace" }}>{req.appliedOn}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily:"system-ui,sans-serif", ...st }}>{req.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {req.status === "Pending" && (
                      <div className="flex gap-1.5">
                        <button onClick={() => onApprove(req.id)} className="text-xs px-2 py-1 rounded hover:opacity-80" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#0f2a0f", color:"#5af07a", border:"1px solid #2a4a2a" }}>✓</button>
                        <button onClick={() => onReject(req.id)} className="text-xs px-2 py-1 rounded hover:opacity-80" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#1a1a1a", color:"#888", border:"1px solid #2a2a2a" }}>✕</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}