import React, { useState, useMemo } from "react";
import {
  EMPLOYEES, Avatar, fmt, OT_STATUS_STYLE
} from "../../../data/compData";

export default function OTUTTab({ otRecords, onApproveOT }) {
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => otRecords.filter(r =>
    (typeFilter === "All" || r.type === typeFilter) &&
    (statusFilter === "All" || r.status === statusFilter)
  ), [otRecords, typeFilter, statusFilter]);

  const totalOT = otRecords.filter(r=>r.type==="OT"&&r.status==="Approved").reduce((s,r)=>s+r.hours,0);
  const totalUT = otRecords.filter(r=>r.type==="UT").reduce((s,r)=>s+r.hours,0);
  const pending = otRecords.filter(r=>r.status==="Pending").length;
  const flagged = otRecords.filter(r=>r.status==="Flagged").length;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          ["OT Hours (Approved)", `${fmt(totalOT)} hrs`, "#5af07a", "#0d0d0d"],
          ["UT Hours",            `${fmt(totalUT)} hrs`, "#f05a5a", "#0d0d0d"],
          ["OT Pending",          `${pending}`,          "#f0c85a", "#1f1a0f"],
          ["UT Flagged",          `${flagged}`,          "#f05a5a", "#1f0f0f"],
        ].map(([l,v,c,bg]) => (
          <div key={l} className="rounded-lg p-4" style={{ backgroundColor:bg, border:"1px solid #1e1e1e" }}>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily:"system-ui,sans-serif", color:"#666" }}>{l}</p>
            <p className="text-2xl font-light" style={{ fontFamily:"monospace", color:c }}>{v}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {["All","OT","UT"].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className="px-4 py-2 text-sm rounded transition-all"
              style={{ fontFamily:"system-ui,sans-serif", backgroundColor: typeFilter===t?"#fff":"#111", color: typeFilter===t?"#000":"#666", border: typeFilter===t?"none":"1px solid #2a2a2a" }}>
              {t === "All" ? "All Types" : t === "OT" ? "Overtime" : "Undertime"}
            </button>
          ))}
        </div>
        <select className="px-3 py-2 rounded text-sm text-gray-300 outline-none" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", border:"1px solid #2a2a2a" }}
          value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          {["All","Approved","Pending","Flagged"].map(s=><option key={s}>{s==="All"?"All Statuses":s}</option>)}
        </select>
        <div className="flex-1" />
        <span className="text-gray-600 text-sm" style={{ fontFamily:"monospace" }}>{filtered.length} records</span>
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden" style={{ border:"1px solid #1e1e1e" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor:"#0a0a0a", borderBottom:"1px solid #1e1e1e" }}>
              {["Employee","Department","Date","Type","Hours","Reason","Status",""].map(h=>(
                <th key={h} className="px-4 py-3 text-left font-normal text-gray-600" style={{ fontFamily:"system-ui,sans-serif", fontSize:10, textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((rec, i) => {
              const emp = EMPLOYEES.find(e=>e.id===rec.empId);
              const st = OT_STATUS_STYLE[rec.status];
              return (
                <tr key={i} style={{ borderBottom: i < filtered.length-1 ? "1px solid #141414":"none", backgroundColor:"#0d0d0d" }}
                  onMouseEnter={e=>e.currentTarget.style.backgroundColor="#111"}
                  onMouseLeave={e=>e.currentTarget.style.backgroundColor="#0d0d0d"}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {emp && <Avatar emp={emp} size={26} />}
                      <span className="text-gray-200 text-sm" style={{ fontFamily:"system-ui,sans-serif" }}>{emp?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs" style={{ fontFamily:"system-ui,sans-serif" }}>{emp?.dept}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs" style={{ fontFamily:"monospace" }}>{rec.date}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded" style={{ fontFamily:"system-ui,sans-serif", backgroundColor: rec.type==="OT"?"#0a1a2a":"#1f0f0f", color: rec.type==="OT"?"#5a9af0":"#f05a5a" }}>{rec.type}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-xs font-medium" style={{ fontFamily:"monospace" }}>{fmt(rec.hours)}h</td>
                  <td className="px-4 py-3 text-gray-500 text-xs" style={{ fontFamily:"system-ui,sans-serif" }}>{rec.reason}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily:"system-ui,sans-serif", ...st }}>{rec.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {rec.status === "Pending" && (
                      <button onClick={() => onApproveOT(i)} className="text-xs px-2 py-1 rounded hover:opacity-80" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#0f2a0f", color:"#5af07a", border:"1px solid #2a4a2a" }}>Approve</button>
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