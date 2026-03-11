import React, { useState } from "react";
import {
  EMPLOYEES, hoursWorked, IC, IS
} from "../../../data/compData";

export default function FileOffsetRequestDrawer({ bank, onClose, onSave, filedBy = "HR" }) {
  const [form, setForm] = useState({
    empId:"", bankId:"", useDate:"", mode:"late-in",
    timeIn:"", timeOut:"", note:"",
  });
  function set(k,v){ setForm(f=>({...f,[k]:v})); }

  const emp        = EMPLOYEES.find(e=>String(e.id)===String(form.empId));
  const empBank    = bank.filter(b=>String(b.empId)===String(form.empId)&&b.status==="Available");
  const selectedEntry = empBank.find(b=>b.id===form.bankId);
  const availableHrs  = empBank.reduce((s,b)=>s+b.hours,0);

  // Validate the schedule makes sense
  const worked   = form.timeIn && form.timeOut ? hoursWorked(form.timeIn, form.timeOut) : 0;
  const hoursUsed = selectedEntry ? selectedEntry.hours : 0;
  const effective = worked + hoursUsed;
  const isValidDay = effective >= 8; // 8 working hours (excl. break)

  // Mode labels
  const MODES = [
    { key:"late-in",   label:"Come in Late",  desc:"Start later, leave at 5PM",  eg:"e.g. 10AM–5PM" },
    { key:"early-out", label:"Leave Early",   desc:"Start at 8AM, leave early",  eg:"e.g. 8AM–3PM"  },
    { key:"flexible",  label:"Flexible",      desc:"Custom start and end times",  eg:"Any time window" },
  ];

  const canSave = form.empId && form.bankId && form.useDate && form.timeIn && form.timeOut && form.note.trim() && isValidDay;

  return (
    <>
      <div className="fixed inset-0 z-20" style={{backgroundColor:"rgba(0,0,0,0.6)"}} onClick={onClose}/>
      <div className="fixed top-0 right-0 h-full z-30 flex flex-col" style={{width:480,backgroundColor:"#080808",borderLeft:"1px solid #222",boxShadow:"-8px 0 40px rgba(0,0,0,0.8)"}}>
        <div className="flex items-center justify-between px-7 py-5 flex-shrink-0" style={{borderBottom:"1px solid #1a1a1a"}}>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-0.5" style={{fontFamily:"system-ui,sans-serif"}}>Offset Request</p>
            <h2 className="text-lg font-normal text-white">File Offset Request</h2>
            {filedBy==="HR" && <p className="text-xs text-gray-600 mt-0.5" style={{fontFamily:"system-ui,sans-serif"}}>Filing on behalf of employee</p>}
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">

          {/* Employee */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Employee</label>
            <select className={IC} style={IS} value={form.empId} onChange={e=>set("empId",e.target.value)}>
              <option value="">Select employee…</option>
              {EMPLOYEES.map(e=><option key={e.id} value={e.id}>{e.name} — {e.dept}</option>)}
            </select>
          </div>

          {/* Bank entry */}
          {form.empId && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>
                Offset Bank Entry <span className="text-gray-600 normal-case ml-1">({availableHrs.toFixed(1)}h available)</span>
              </label>
              {empBank.length === 0 ? (
                <div className="rounded px-4 py-3 text-center" style={{backgroundColor:"#111",border:"1px solid #2a2a2a"}}>
                  <p className="text-sm text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>No available offset hours for this employee.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {empBank.map(b=>(
                    <button key={b.id} onClick={()=>set("bankId",b.id)}
                      className="w-full px-4 py-3 rounded-lg text-left transition-all"
                      style={{fontFamily:"system-ui,sans-serif",backgroundColor:form.bankId===b.id?"#0a1a2a":"#111",border:`1px solid ${form.bankId===b.id?"#5a9af0":"#2a2a2a"}`}}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{fontFamily:"system-ui,sans-serif",backgroundColor:b.source==="OT"?"#0a1a2a":"#1a0a1a",color:b.source==="OT"?"#5a9af0":"#c07af0"}}>{b.source==="OT"?"OT":"Custom"}</span>
                          <span className="text-white text-sm">{b.hours}h available</span>
                        </div>
                        <span className="text-xs text-gray-600" style={{fontFamily:"monospace"}}>expires {b.expiresAt}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{b.reason}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Use date */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Date to Use Offset</label>
            <input className={IC} style={IS} placeholder="e.g. Mar 10, 2026"
              value={form.useDate} onChange={e=>set("useDate",e.target.value)}/>
          </div>

          {/* Mode */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2" style={{fontFamily:"system-ui,sans-serif"}}>How will the offset be used?</label>
            <div className="grid grid-cols-3 gap-2">
              {MODES.map(m=>(
                <button key={m.key} onClick={()=>set("mode",m.key)}
                  className="px-3 py-3 rounded-lg text-left transition-all"
                  style={{fontFamily:"system-ui,sans-serif",backgroundColor:form.mode===m.key?"#0a1a2a":"#111",border:`1px solid ${form.mode===m.key?"#5a9af0":"#2a2a2a"}`}}>
                  <p className="text-xs font-medium mb-0.5" style={{color:form.mode===m.key?"#5a9af0":"#888"}}>{m.label}</p>
                  <p className="text-xs text-gray-600">{m.eg}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Time in / out */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Actual Time In & Out on {form.useDate||"that day"}</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-600 mb-1" style={{fontFamily:"system-ui,sans-serif"}}>Time In</p>
                <input className={IC} style={IS} placeholder="e.g. 10:00 AM"
                  value={form.timeIn} onChange={e=>set("timeIn",e.target.value)}/>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1" style={{fontFamily:"system-ui,sans-serif"}}>Time Out</p>
                <input className={IC} style={IS} placeholder="e.g. 5:00 PM"
                  value={form.timeOut} onChange={e=>set("timeOut",e.target.value)}/>
              </div>
            </div>
          </div>

          {/* Live validation */}
          {form.timeIn && form.timeOut && selectedEntry && (
            <div className="rounded-lg p-4 space-y-2" style={{backgroundColor: isValidDay?"#0a1a0a":"#1a0a0a", border:`1px solid ${isValidDay?"#1e3a1e":"#3a1515"}`}}>
              <p className="text-xs uppercase tracking-widest mb-2" style={{fontFamily:"system-ui,sans-serif",color:"#666"}}>Day Computation</p>
              {[
                ["Actual hours worked",  `${worked.toFixed(1)}h`,    "#fff"     ],
                ["Offset hours used",    `+${hoursUsed.toFixed(1)}h`,"#5a9af0"  ],
                ["Effective total",      `${effective.toFixed(1)}h`, isValidDay?"#5af07a":"#f05a5a"],
                ["Required",             "8.0h",                    "#555"     ],
              ].map(([l,v,c])=>(
                <div key={l} className="flex justify-between">
                  <span className="text-xs text-gray-500" style={{fontFamily:"system-ui,sans-serif"}}>{l}</span>
                  <span className="text-xs font-medium" style={{fontFamily:"monospace",color:c}}>{v}</span>
                </div>
              ))}
              {!isValidDay && (
                <p className="text-xs mt-1" style={{fontFamily:"system-ui,sans-serif",color:"#f05a5a"}}>
                  ⚠ Effective hours must reach 8.0h. Need {(8-effective).toFixed(1)}h more.
                </p>
              )}
              {isValidDay && (
                <p className="text-xs mt-1" style={{fontFamily:"system-ui,sans-serif",color:"#5af07a"}}>✓ Valid — counts as a complete working day</p>
              )}
            </div>
          )}

          {/* Note */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Note / Reason</label>
            <textarea className={IC} style={{...IS,height:72,resize:"none"}}
              placeholder="Brief reason for using offset on this date…"
              value={form.note} onChange={e=>set("note",e.target.value)}/>
          </div>
        </div>

        <div className="px-7 py-5 flex items-center justify-between flex-shrink-0" style={{borderTop:"1px solid #1a1a1a"}}>
          <button onClick={onClose} className="px-4 py-2 rounded text-sm hover:opacity-80"
            style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a"}}>Cancel</button>
          <button onClick={()=>canSave&&onSave({...form,filedBy,hoursUsed})} disabled={!canSave}
            className="px-5 py-2 rounded text-sm font-medium hover:opacity-80 transition-all"
            style={{fontFamily:"system-ui,sans-serif",backgroundColor:canSave?"#fff":"#1a1a1a",color:canSave?"#000":"#444",cursor:canSave?"pointer":"not-allowed"}}>
            Submit Request ✓
          </button>
        </div>
      </div>
    </>
  );
}