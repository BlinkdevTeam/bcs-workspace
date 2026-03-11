import React, { useState } from "react";
import FileOffsetRequestDrawer from "./FileOffsetRequestDrawer";
import GrantCustomOffsetDrawer from "./GrandCustomOffsetDrawer";
import {
  EMPLOYEES, IC, IS, parseTime
} from "../../../data/compData";

export default function CreateOffsetDrawer({ onClose, onSave }) {
  const [form, setForm] = useState({
    empId:          "",
    type:           "OT",           // "OT" | "Adjustment"
    sourceDate:     "",
    sourceTimeIn:   "8:00 AM",
    sourceTimeOut:  "",
    targetDate:     "",
    targetTimeIn:   "",
    targetTimeOut:  "",
    reason:         "",
  });

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  // Compute how many extra hours were worked on source date
  const sourceWorked  = form.sourceTimeIn && form.sourceTimeOut
    ? Math.max(0, (parseTime(form.sourceTimeOut) - parseTime(form.sourceTimeIn) - 60) / 60) // minus 1hr break
    : 0;
  const sourceExtra   = Math.max(0, sourceWorked - 8); // hours beyond standard 8

  // Compute actual hours on target date
  const targetWorked  = form.targetTimeIn && form.targetTimeOut
    ? Math.max(0, (parseTime(form.targetTimeOut) - parseTime(form.targetTimeIn) - 60) / 60)
    : 0;

  // Offset hours = difference from standard 8h on target
  const offsetHours   = Math.max(0, parseFloat((8 - targetWorked).toFixed(1)));

  // Effective day = target worked + offset applied
  const effectiveDay  = parseFloat((targetWorked + offsetHours).toFixed(1));
  const isValidTarget = effectiveDay >= 8;

  // For OT: offset hours must not exceed extra hours worked on source
  const otValid       = form.type !== "OT" || sourceExtra >= offsetHours;

  const canSave = form.empId && form.sourceDate && form.sourceTimeOut
    && form.targetDate && form.targetTimeIn && form.targetTimeOut
    && form.reason.trim() && isValidTarget && (form.type !== "OT" || sourceExtra > 0);

  const emp = EMPLOYEES.find(e => String(e.id) === String(form.empId));

  // Standard day reference: 8AM–5PM = 8hrs (excl. 1hr break)
  const STANDARD_IN  = "8:00 AM";
  const STANDARD_OUT = "5:00 PM";

  return (
    <>
      <div className="fixed inset-0 z-20" style={{ backgroundColor:"rgba(0,0,0,0.6)" }} onClick={onClose} />
      <div className="fixed top-0 right-0 h-full z-30 flex flex-col"
        style={{ width:500, backgroundColor:"#080808", borderLeft:"1px solid #222", boxShadow:"-8px 0 40px rgba(0,0,0,0.8)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 flex-shrink-0" style={{ borderBottom:"1px solid #1a1a1a" }}>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-0.5" style={{ fontFamily:"system-ui,sans-serif" }}>Time & Leave</p>
            <h2 className="text-lg font-normal text-white">Create Offset</h2>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">

          {/* Employee */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{ fontFamily:"system-ui,sans-serif" }}>Employee</label>
            <select className={IC} style={IS} value={form.empId} onChange={e => set("empId", e.target.value)}>
              <option value="">Select employee…</option>
              {EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name} — {e.dept}</option>)}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2" style={{ fontFamily:"system-ui,sans-serif" }}>Offset Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key:"OT",         label:"Overtime",    desc:"Worked beyond 5PM on source date",        color:"#5a9af0" },
                { key:"Adjustment", label:"Time Adjust",  desc:"Schedule shift (e.g. 9AM–6PM)",           color:"#f0c85a" },
              ].map(t => (
                <button key={t.key} onClick={() => set("type", t.key)}
                  className="px-4 py-3 rounded-lg text-left transition-all"
                  style={{ fontFamily:"system-ui,sans-serif",
                    backgroundColor: form.type===t.key ? t.color+"18" : "#111",
                    border:`1px solid ${form.type===t.key ? t.color+"55" : "#2a2a2a"}` }}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: form.type===t.key ? t.color : "#333" }} />
                    <p className="text-sm font-medium" style={{ color: form.type===t.key ? t.color : "#666" }}>{t.label}</p>
                  </div>
                  <p className="text-xs text-gray-600 ml-4">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Divider label */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ backgroundColor:"#1a1a1a" }} />
            <span className="text-xs text-gray-600 uppercase tracking-widest" style={{ fontFamily:"system-ui,sans-serif" }}>Source — where hours come from</span>
            <div className="flex-1 h-px" style={{ backgroundColor:"#1a1a1a" }} />
          </div>

          {/* Source date + times */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{ fontFamily:"system-ui,sans-serif" }}>Source Date</label>
              <input className={IC} style={IS} placeholder="e.g. Feb 24, 2026"
                value={form.sourceDate} onChange={e => set("sourceDate", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1" style={{ fontFamily:"system-ui,sans-serif" }}>Time In</label>
                <input className={IC} style={IS} placeholder="8:00 AM"
                  value={form.sourceTimeIn} onChange={e => set("sourceTimeIn", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1" style={{ fontFamily:"system-ui,sans-serif" }}>
                  Time Out {form.type==="OT" && <span className="text-gray-700">(must be after 5:00 PM)</span>}
                </label>
                <input className={IC} style={{ ...IS,
                    borderColor: form.sourceTimeOut && form.type==="OT" && parseTime(form.sourceTimeOut) <= parseTime("5:00 PM") ? "#f05a5a55" : "#2a2a2a" }}
                  placeholder="e.g. 7:00 PM"
                  value={form.sourceTimeOut} onChange={e => set("sourceTimeOut", e.target.value)} />
              </div>
            </div>

            {/* Source day summary */}
            {form.sourceTimeIn && form.sourceTimeOut && (
              <div className="rounded px-4 py-3 space-y-1.5"
                style={{ backgroundColor: form.type==="OT" && sourceExtra===0 ? "#1a0a0a" : "#0a0a0a",
                         border:`1px solid ${form.type==="OT" && sourceExtra===0 ? "#3a1515" : "#1a1a1a"}` }}>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>Hours worked</span>
                  <span className="text-xs" style={{ fontFamily:"monospace", color:"#fff" }}>{sourceWorked.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>Standard day</span>
                  <span className="text-xs" style={{ fontFamily:"monospace", color:"#555" }}>8.0h</span>
                </div>
                <div className="flex justify-between" style={{ borderTop:"1px solid #1e1e1e", paddingTop:6, marginTop:2 }}>
                  <span className="text-xs text-gray-500" style={{ fontFamily:"system-ui,sans-serif" }}>
                    {form.type==="OT" ? "Extra hours available" : "Total hours to carry"}
                  </span>
                  <span className="text-xs font-medium" style={{ fontFamily:"monospace",
                    color: form.type==="OT" ? (sourceExtra > 0 ? "#5af07a" : "#f05a5a") : "#5a9af0" }}>
                    {form.type==="OT" ? `+${sourceExtra.toFixed(1)}h OT` : `${sourceWorked.toFixed(1)}h`}
                  </span>
                </div>
                {form.type==="OT" && sourceExtra === 0 && (
                  <p className="text-xs" style={{ fontFamily:"system-ui,sans-serif", color:"#f05a5a" }}>
                    ⚠ No OT detected — time out must be after 5:00 PM
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Divider label */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ backgroundColor:"#1a1a1a" }} />
            <span className="text-xs text-gray-600 uppercase tracking-widest" style={{ fontFamily:"system-ui,sans-serif" }}>Target — where hours are applied</span>
            <div className="flex-1 h-px" style={{ backgroundColor:"#1a1a1a" }} />
          </div>

          {/* Target date + times */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{ fontFamily:"system-ui,sans-serif" }}>Target Date</label>
              <input className={IC} style={IS} placeholder="e.g. Mar 7, 2026"
                value={form.targetDate} onChange={e => set("targetDate", e.target.value)} />
            </div>

            {/* Quick presets */}
            <div>
              <p className="text-xs text-gray-600 mb-1.5" style={{ fontFamily:"system-ui,sans-serif" }}>Quick schedule presets</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label:"Come in late (9AM–6PM)", timeIn:"9:00 AM",  timeOut:"6:00 PM"  },
                  { label:"Come in late (10AM–7PM)",timeIn:"10:00 AM", timeOut:"7:00 PM"  },
                  { label:"Leave early (8AM–3PM)",  timeIn:"8:00 AM",  timeOut:"3:00 PM"  },
                  { label:"Leave early (8AM–4PM)",  timeIn:"8:00 AM",  timeOut:"4:00 PM"  },
                ].map(p => (
                  <button key={p.label} onClick={() => { set("targetTimeIn", p.timeIn); set("targetTimeOut", p.timeOut); }}
                    className="text-xs px-3 py-1.5 rounded hover:opacity-80 transition-all"
                    style={{ fontFamily:"system-ui,sans-serif",
                      backgroundColor: form.targetTimeIn===p.timeIn && form.targetTimeOut===p.timeOut ? "#1e2a1e" : "#111",
                      color: form.targetTimeIn===p.timeIn && form.targetTimeOut===p.timeOut ? "#5af07a" : "#666",
                      border:`1px solid ${form.targetTimeIn===p.timeIn && form.targetTimeOut===p.timeOut ? "#2a4a2a" : "#2a2a2a"}` }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1" style={{ fontFamily:"system-ui,sans-serif" }}>Time In</label>
                <input className={IC} style={IS} placeholder="e.g. 9:00 AM"
                  value={form.targetTimeIn} onChange={e => set("targetTimeIn", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1" style={{ fontFamily:"system-ui,sans-serif" }}>Time Out</label>
                <input className={IC} style={IS} placeholder="e.g. 6:00 PM"
                  value={form.targetTimeOut} onChange={e => set("targetTimeOut", e.target.value)} />
              </div>
            </div>

            {/* Target day validation */}
            {form.targetTimeIn && form.targetTimeOut && (
              <div className="rounded px-4 py-3 space-y-1.5"
                style={{ backgroundColor: isValidTarget ? "#0a1a0a" : "#1a0a0a",
                         border:`1px solid ${isValidTarget ? "#1e3a1e" : "#3a1515"}` }}>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>Actual hours on target day</span>
                  <span className="text-xs" style={{ fontFamily:"monospace", color:"#fff" }}>{targetWorked.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>Offset applied</span>
                  <span className="text-xs" style={{ fontFamily:"monospace", color:"#5a9af0" }}>+{offsetHours.toFixed(1)}h</span>
                </div>
                {form.type==="OT" && !otValid && (
                  <p className="text-xs" style={{ fontFamily:"system-ui,sans-serif", color:"#f05a5a" }}>
                    ⚠ Offset ({offsetHours.toFixed(1)}h) exceeds OT earned ({sourceExtra.toFixed(1)}h)
                  </p>
                )}
                <div className="flex justify-between" style={{ borderTop:"1px solid #1e1e1e", paddingTop:6, marginTop:2 }}>
                  <span className="text-xs text-gray-500" style={{ fontFamily:"system-ui,sans-serif" }}>Effective day total</span>
                  <span className="text-sm font-medium" style={{ fontFamily:"monospace",
                    color: isValidTarget ? "#5af07a" : "#f05a5a" }}>
                    {effectiveDay.toFixed(1)}h {isValidTarget ? "✓" : "✗"}
                  </span>
                </div>
                {!isValidTarget && (
                  <p className="text-xs" style={{ fontFamily:"system-ui,sans-serif", color:"#f05a5a" }}>
                    Need {(8 - effectiveDay).toFixed(1)}h more to reach a full 8h day
                  </p>
                )}
                {isValidTarget && (
                  <p className="text-xs" style={{ fontFamily:"system-ui,sans-serif", color:"#5af07a" }}>
                    Valid — counts as a complete working day
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{ fontFamily:"system-ui,sans-serif" }}>Reason / Note</label>
            <textarea className={IC} style={{ ...IS, height:80, resize:"none" }}
              placeholder="Brief explanation for this offset…"
              value={form.reason} onChange={e => set("reason", e.target.value)} />
          </div>

          {/* Preview */}
          {canSave && (
            <div className="rounded-lg p-4 space-y-2" style={{ backgroundColor:"#0a1a0a", border:"1px solid #1e3a1e" }}>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2" style={{ fontFamily:"system-ui,sans-serif" }}>Summary</p>
              <p className="text-sm text-gray-300" style={{ fontFamily:"system-ui,sans-serif" }}>
                <span className="text-gray-600">Employee: </span>{emp?.name}
              </p>
              <p className="text-sm text-gray-300" style={{ fontFamily:"system-ui,sans-serif" }}>
                <span className="text-gray-600">Source: </span>{form.sourceDate} · {form.sourceTimeIn} – {form.sourceTimeOut}
                {form.type==="OT" && <span style={{ color:"#5a9af0" }}> (+{sourceExtra.toFixed(1)}h OT)</span>}
              </p>
              <p className="text-sm text-gray-300" style={{ fontFamily:"system-ui,sans-serif" }}>
                <span className="text-gray-600">Target: </span>{form.targetDate} · {form.targetTimeIn} – {form.targetTimeOut}
                <span style={{ color:"#5af07a" }}> = {effectiveDay.toFixed(1)}h effective</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-5 flex items-center justify-between flex-shrink-0" style={{ borderTop:"1px solid #1a1a1a" }}>
          <button onClick={onClose} className="px-4 py-2 rounded text-sm hover:opacity-80"
            style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", color:"#aaa", border:"1px solid #2a2a2a" }}>Cancel</button>
          <button onClick={() => canSave && onSave({ ...form, offsetHours, effectiveDay })} disabled={!canSave}
            className="px-5 py-2 rounded text-sm font-medium hover:opacity-80 transition-all"
            style={{ fontFamily:"system-ui,sans-serif", backgroundColor:canSave?"#fff":"#1a1a1a", color:canSave?"#000":"#444", cursor:canSave?"pointer":"not-allowed" }}>
            Create Offset ✓
          </button>
        </div>
      </div>
    </>
  );
}