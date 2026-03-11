import React, { useState } from "react";
import {
  EMPLOYEES,CURRENT_CUTOFF_END, IC, IS
} from "../../../data/compData";

export default function GrantCustomOffsetDrawer({ onClose, onSave }) {
  const [form, setForm] = useState({ empId:"", hours:"", reason:"", earnedDate:"Mar 2, 2026", mode:"flexible" });
  function set(k,v){ setForm(f=>({...f,[k]:v})); }
  const canSave = form.empId && form.hours && form.reason.trim();
  const emp = EMPLOYEES.find(e=>String(e.id)===String(form.empId));

  const MODES = [
    { key:"late-in",   label:"Come in Late", desc:"Employee uses this to start later than 8AM", color:"#5a9af0" },
    { key:"early-out", label:"Leave Early",  desc:"Employee uses this to leave before 5PM",     color:"#f0c85a" },
    { key:"flexible",  label:"Flexible",     desc:"Employee decides how to use it",              color:"#5af07a" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-20" style={{backgroundColor:"rgba(0,0,0,0.6)"}} onClick={onClose}/>
      <div className="fixed top-0 right-0 h-full z-30 flex flex-col" style={{width:440,backgroundColor:"#080808",borderLeft:"1px solid #222",boxShadow:"-8px 0 40px rgba(0,0,0,0.8)"}}>
        <div className="flex items-center justify-between px-7 py-5 flex-shrink-0" style={{borderBottom:"1px solid #1a1a1a"}}>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-0.5" style={{fontFamily:"system-ui,sans-serif"}}>Offset Bank</p>
            <h2 className="text-lg font-normal text-white">Grant Custom Offset</h2>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          {/* Info */}
          <div className="rounded-lg px-4 py-3 flex items-start gap-3" style={{backgroundColor:"#0a1a2a",border:"1px solid #1e3a5a"}}>
            <span className="text-blue-400 flex-shrink-0 mt-0.5">ℹ</span>
            <p className="text-xs text-gray-400" style={{fontFamily:"system-ui,sans-serif"}}>
              Custom offsets are non-OT rewards — quota achievement, recognition, etc. Hours are added to the employee's offset bank and expire at end of the current payroll cutoff (<strong className="text-white">{CURRENT_CUTOFF_END}</strong>).
            </p>
          </div>

          {/* Employee */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Employee</label>
            <select className={IC} style={IS} value={form.empId} onChange={e=>set("empId",e.target.value)}>
              <option value="">Select employee…</option>
              {EMPLOYEES.map(e=><option key={e.id} value={e.id}>{e.name} — {e.dept}</option>)}
            </select>
            {emp && (
              <p className="text-xs mt-1.5 text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>
                Current available balance: <span style={{color:"#5af07a"}}>{empAvailableHours(emp.id,[]).toFixed(1)}h</span>
              </p>
            )}
          </div>

          {/* Hours */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Hours to Grant</label>
            <input type="number" step="0.5" min="0.5" max="8" className={IC} style={IS}
              placeholder="e.g. 2.0" value={form.hours} onChange={e=>set("hours",e.target.value)}/>
            <p className="text-xs mt-1 text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>Max 8 hours (1 full working day) per grant.</p>
          </div>

          {/* Mode */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2" style={{fontFamily:"system-ui,sans-serif"}}>How should this offset be used?</label>
            <div className="space-y-2">
              {MODES.map(m=>(
                <button key={m.key} onClick={()=>set("mode",m.key)}
                  className="w-full px-4 py-3 rounded-lg text-left transition-all"
                  style={{fontFamily:"system-ui,sans-serif",backgroundColor:form.mode===m.key?m.color+"15":"#111",border:`1px solid ${form.mode===m.key?m.color+"55":"#2a2a2a"}`}}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:form.mode===m.key?m.color:"#333"}}/>
                    <p className="text-sm font-medium" style={{color:form.mode===m.key?m.color:"#666"}}>{m.label}</p>
                  </div>
                  <p className="text-xs text-gray-600 ml-4">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Effective date */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Effective Date</label>
            <input className={IC} style={IS} value={form.earnedDate} onChange={e=>set("earnedDate",e.target.value)}/>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Reason / Basis for Grant</label>
            <textarea className={IC} style={{...IS,height:96,resize:"none"}}
              placeholder="e.g. Exceeded monthly sales quota by 130%, perfect attendance for Q1…"
              value={form.reason} onChange={e=>set("reason",e.target.value)}/>
          </div>

          {/* Expiry note */}
          <div className="rounded-lg px-4 py-3 flex items-center justify-between" style={{backgroundColor:"#111",border:"1px solid #1e1e1e"}}>
            <span className="text-xs text-gray-500" style={{fontFamily:"system-ui,sans-serif"}}>Expires at cutoff end</span>
            <span className="text-xs font-medium" style={{fontFamily:"monospace",color:"#f0c85a"}}>{CURRENT_CUTOFF_END}</span>
          </div>

          {/* Preview */}
          {canSave && (
            <div className="rounded-lg p-4 space-y-2" style={{backgroundColor:"#0a1a0a",border:"1px solid #1e3a1e"}}>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2" style={{fontFamily:"system-ui,sans-serif"}}>Preview</p>
              <p className="text-sm text-gray-300" style={{fontFamily:"system-ui,sans-serif"}}><span className="text-gray-600">Employee: </span>{emp?.name}</p>
              <p className="text-sm text-gray-300" style={{fontFamily:"system-ui,sans-serif"}}><span className="text-gray-600">Grant: </span><span style={{color:"#5af07a"}}>+{form.hours} hours</span> added to offset bank</p>
              <p className="text-sm text-gray-300" style={{fontFamily:"system-ui,sans-serif"}}><span className="text-gray-600">Mode: </span><span style={{color: MODES.find(m=>m.key===form.mode)?.color}}>{MODES.find(m=>m.key===form.mode)?.label}</span></p>
              <p className="text-sm text-gray-300" style={{fontFamily:"system-ui,sans-serif"}}><span className="text-gray-600">Expires: </span>{CURRENT_CUTOFF_END}</p>
            </div>
          )}
        </div>

        <div className="px-7 py-5 flex items-center justify-between flex-shrink-0" style={{borderTop:"1px solid #1a1a1a"}}>
          <button onClick={onClose} className="px-4 py-2 rounded text-sm hover:opacity-80"
            style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a"}}>Cancel</button>
          <button onClick={()=>canSave&&onSave(form)} disabled={!canSave}
            className="px-5 py-2 rounded text-sm font-medium hover:opacity-80 transition-all"
            style={{fontFamily:"system-ui,sans-serif",backgroundColor:canSave?"#fff":"#1a1a1a",color:canSave?"#000":"#444",cursor:canSave?"pointer":"not-allowed"}}>
            Grant Offset ✓
          </button>
        </div>
      </div>
    </>
  );
}