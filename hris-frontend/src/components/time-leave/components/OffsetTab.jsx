import React, { useState, useMemo } from "react";
import FileOffsetRequestDrawer from "./FileOffsetRequestDrawer";
import GrantCustomOffsetDrawer from "./GrandCustomOffsetDrawer";
import CreateOffsetDrawer from "./CreateOffsetDrawer";
import {
  EMPLOYEES, Avatar, parseTime
} from "../../../data/compData";
export default function OffsetTab({ requests, setRequests }) {

  const [showCreate,   setShowCreate]   = useState(false);
  const [typeFilter,   setTypeFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [empFilter,    setEmpFilter]    = useState("All");

  const filtered = useMemo(() => requests.filter(o =>
    (typeFilter   === "All" || o.type   === typeFilter) &&
    (statusFilter === "All" || o.status === statusFilter) &&
    (empFilter    === "All" || String(o.empId) === empFilter)
  ), [requests, typeFilter, statusFilter, empFilter]);

  function createOffset(form) {
  setRequests(p => [...p, {
    id: "off" + Date.now(),
    empId: Number(form.empId),
    type: form.type,
    sourceDate: form.sourceDate,
    sourceTimeIn: form.sourceTimeIn,
    sourceTimeOut: form.sourceTimeOut,
    targetDate: form.targetDate,
    targetTimeIn: form.targetTimeIn,
    targetTimeOut: form.targetTimeOut,
    offsetHours: Number(form.offsetHours) || 0, // ✅ FIX
    reason: form.reason,
    status: "Pending",
    createdOn: "Mar 2, 2026",
    createdBy: "Admin",
  }]);
}

  function approve(id) { setRequests(p => p.map(o => o.id===id ? {...o, status:"Approved"} : o)); }
  function voidOffset(id) { setRequests(p => p.map(o => o.id===id ? {...o, status:"Voided"} : o)); }

  // Summary stats
  const totalOT  = requests.filter(o=>o.type==="OT"&&o.status==="Approved").length;
  const totalAdj = requests.filter(o=>o.type==="Adjustment"&&o.status==="Approved").length;
  const pending  = requests.filter(o=>o.status==="Pending").length;

  const TYPE_STYLE = {
    OT:         { bg:"#0a1a2a", color:"#5a9af0" },
    Adjustment: { bg:"#1a1a0a", color:"#f0c85a" },
  };
  const STATUS_STYLE = {
    Pending:  { bg:"#1f1a0f", color:"#f0c85a" },
    Approved: { bg:"#0f1f0f", color:"#5af07a" },
    Voided:   { bg:"#1f0f0f", color:"#f05a5a" },
  };

  return (
    <>
      <div className="space-y-5">

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            ["OT Offsets (Approved)",    totalOT,  "#5a9af0"],
            ["Adjustments (Approved)",   totalAdj, "#f0c85a"],
            ["Pending Review",           pending,  "#f0c85a"],
          ].map(([l,v,c]) => (
            <div key={l} className="rounded-lg p-4" style={{ backgroundColor:"#0d0d0d", border:"1px solid #1e1e1e" }}>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily:"system-ui,sans-serif", color:"#555" }}>{l}</p>
              <p className="text-2xl font-light" style={{ fontFamily:"monospace", color:c }}>{v}</p>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="rounded-lg px-5 py-3 flex items-start gap-3" style={{ backgroundColor:"#0a0f1a", border:"1px solid #1a2a3a" }}>
          <span className="text-blue-400 flex-shrink-0 mt-0.5 text-sm">ℹ</span>
          <div className="text-xs text-gray-400 space-y-1" style={{ fontFamily:"system-ui,sans-serif" }}>
            <p><strong className="text-white">Overtime offset</strong> — employee worked beyond 5PM on the source date. Those extra hours cover the shortfall on the target date.</p>
            <p><strong className="text-white">Time adjustment</strong> — employee shifts their schedule (e.g. 9AM–6PM instead of 8AM–5PM). Hours worked on source date cover the gap on the target date. Standard day is <strong className="text-white">8:00 AM – 5:00 PM (8 hrs excl. 1hr break)</strong>.</p>
          </div>
        </div>

        {/* Filters + action */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1 rounded-lg p-0.5" style={{ backgroundColor:"#111", border:"1px solid #2a2a2a" }}>
            {["All","OT","Adjustment"].map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className="px-3 py-1.5 rounded text-xs transition-all"
                style={{ fontFamily:"system-ui,sans-serif", backgroundColor:typeFilter===t?"#fff":"transparent", color:typeFilter===t?"#000":"#555" }}>
                {t === "All" ? "All Types" : t}
              </button>
            ))}
          </div>
          <select className="px-3 py-1.5 rounded text-xs text-gray-300 outline-none"
            style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", border:"1px solid #2a2a2a" }}
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {["All","Pending","Approved","Voided"].map(s => <option key={s}>{s === "All" ? "All Statuses" : s}</option>)}
          </select>
          <select className="px-3 py-1.5 rounded text-xs text-gray-300 outline-none"
            style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", border:"1px solid #2a2a2a" }}
            value={empFilter} onChange={e => setEmpFilter(e.target.value)}>
            <option value="All">All Employees</option>
            {EMPLOYEES.map(e => <option key={e.id} value={String(e.id)}>{e.name}</option>)}
          </select>
          <div className="flex-1" />
          <span className="text-gray-600 text-sm mr-2" style={{ fontFamily:"monospace" }}>{filtered.length} records</span>
          <button onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded text-sm font-medium bg-white text-black hover:opacity-80"
            style={{ fontFamily:"system-ui,sans-serif" }}>
            + Create Offset
          </button>
        </div>

        {/* Table */}
        <div className="rounded-lg overflow-hidden" style={{ border:"1px solid #1e1e1e" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor:"#0a0a0a", borderBottom:"1px solid #1e1e1e" }}>
                {["Employee","Type","Source Date","Source Hours","Target Date","Target Schedule","Offset","Status",""].map(h => (
                  <th key={h} className="px-3 py-3 text-left font-normal text-gray-600 whitespace-nowrap"
                    style={{ fontFamily:"system-ui,sans-serif", fontSize:10, textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>No offset records found.</td></tr>
              ) : filtered.map((o, i) => {
                const emp      = EMPLOYEES.find(e => e.id === o.empId);
                const srcWorked = Math.max(0, (parseTime(o.sourceTimeOut) - parseTime(o.sourceTimeIn) - 60) / 60);
                const srcExtra  = Math.max(0, srcWorked - 8);
                const tgtWorked = Math.max(0, (parseTime(o.targetTimeOut) - parseTime(o.targetTimeIn) - 60) / 60);
                const effective = parseFloat((tgtWorked + o.offsetHours).toFixed(1));
                const ts        = TYPE_STYLE[o.type]   || { bg:"#111", color:"#aaa" };
                const ss        = STATUS_STYLE[o.status] || { bg:"#111", color:"#aaa" };

                return (
                  <tr key={o.id} className="group"
                    style={{ borderBottom:i<filtered.length-1?"1px solid #141414":"none", backgroundColor:"#0d0d0d" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor="#111"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor="#0d0d0d"}>

                    {/* Employee */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        {emp && <Avatar emp={emp} size={26} />}
                        <div>
                          <p className="text-gray-200 text-sm" style={{ fontFamily:"system-ui,sans-serif" }}>{emp?.name}</p>
                          <p className="text-gray-600 text-xs" style={{ fontFamily:"system-ui,sans-serif" }}>{emp?.dept}</p>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-3 py-3">
                      <span className="text-xs px-2 py-0.5 rounded" style={{ fontFamily:"system-ui,sans-serif", ...ts }}>{o.type}</span>
                    </td>

                    {/* Source date */}
                    <td className="px-3 py-3">
                      <p className="text-gray-300 text-xs whitespace-nowrap" style={{ fontFamily:"monospace" }}>{o.sourceDate}</p>
                      <p className="text-gray-600 text-xs whitespace-nowrap" style={{ fontFamily:"monospace" }}>{o.sourceTimeIn} – {o.sourceTimeOut}</p>
                    </td>

                    {/* Source hours */}
                    <td className="px-3 py-3">
                      <p className="text-xs" style={{ fontFamily:"monospace", color:"#fff" }}>{srcWorked.toFixed(1)}h total</p>
                      {o.type==="OT" && (
                        <p className="text-xs" style={{ fontFamily:"monospace", color:"#5a9af0" }}>+{srcExtra.toFixed(1)}h OT</p>
                      )}
                    </td>

                    {/* Target date */}
                    <td className="px-3 py-3">
                      <p className="text-gray-300 text-xs whitespace-nowrap" style={{ fontFamily:"monospace" }}>{o.targetDate}</p>
                    </td>

                    {/* Target schedule */}
                    <td className="px-3 py-3">
                      <p className="text-gray-300 text-xs whitespace-nowrap" style={{ fontFamily:"monospace" }}>{o.targetTimeIn} – {o.targetTimeOut}</p>
                      <p className="text-xs whitespace-nowrap" style={{ fontFamily:"monospace", color:"#5af07a" }}>{effective.toFixed(1)}h effective</p>
                    </td>

                    {/* Offset hours */}
                    <td className="px-3 py-3">
                      <span className="text-xs font-medium" style={{ fontFamily:"monospace", color:"#5a9af0" }}>+{Number(o.offsetHours ?? 0).toFixed(1)}h</span>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily:"system-ui,sans-serif", ...ss }}>{o.status}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {o.status === "Pending" && (
                          <button onClick={() => approve(o.id)}
                            className="text-xs px-2 py-1 rounded hover:opacity-80"
                            style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#0f2a0f", color:"#5af07a", border:"1px solid #2a4a2a" }}>
                            ✓
                          </button>
                        )}
                        {o.status !== "Voided" && (
                          <button onClick={() => voidOffset(o.id)}
                            className="text-xs px-2 py-1 rounded hover:opacity-80"
                            style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#1a1a1a", color:"#888", border:"1px solid #2a2a2a" }}>
                            Void
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && <CreateOffsetDrawer onClose={() => setShowCreate(false)} onSave={createOffset} />}
    </>
  );
}