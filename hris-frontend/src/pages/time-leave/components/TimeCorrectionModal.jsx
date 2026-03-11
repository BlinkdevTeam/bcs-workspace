import React, { useState } from "react";
import {
  ATTENDANCE_STYLE, Avatar, parseTime, breakFlags, breakMinutes, breakDurLabel
} from "../../../data/compData";

const ATTENDANCE_STATUSES = [
  "Present",
  "Remote",
  "Late",
  "Absent",
  "On Leave"
];

export default function TimeCorrectionModal({ emp, record, onClose, onSave }) {
  const [form, setForm] = useState({
    status:   record?.status   || "Present",
    timeIn:   record?.timeIn   || "",
    timeOut:  record?.timeOut  || "",
    breakOut: record?.breakOut || "",
    breakIn:  record?.breakIn  || "",
    hours:    record?.hours    || "",
    reason:   "",
  });

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function calcHours(timeIn, timeOut, breakOut, breakIn) {
    try {
      const raw   = parseTime(timeOut) - parseTime(timeIn);
      const brk   = (breakOut && breakIn) ? parseTime(breakIn) - parseTime(breakOut) : 60; // default 1hr break deducted
      const net   = (raw - brk) / 60;
      return net > 0 ? parseFloat(net.toFixed(1)) : "";
    } catch { return ""; }
  }

  function handleChange(k, v) {
    const next = { ...form, [k]: v };
    if (next.timeIn && next.timeOut) {
      next.hours = calcHours(next.timeIn, next.timeOut, next.breakOut, next.breakIn);
    }
    setForm(next);
  }

  const flags    = breakFlags(form.breakOut, form.breakIn);
  const breakDur = breakMinutes(form.breakOut, form.breakIn);
  const canSave  = form.reason.trim().length > 0;

  const IC = "w-full px-3 py-2.5 rounded text-sm text-white placeholder-gray-600 outline-none";
  const IS = { backgroundColor:"#111", border:"1px solid #2a2a2a", fontFamily:"system-ui,sans-serif" };

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(0,0,0,0.8)" }} onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-xl flex flex-col" style={{ backgroundColor:"#0d0d0d", border:"1px solid #2a2a2a", maxHeight:"94vh" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 flex-shrink-0" style={{ borderBottom:"1px solid #1e1e1e" }}>
            <div className="flex items-center gap-3">
              <Avatar emp={emp} size={36} />
              <div>
                <h2 className="text-base font-normal text-white">{emp.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily:"system-ui,sans-serif" }}>Time Correction · Today, Mar 2, 2026</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

            {/* Info banner */}
            <div className="rounded-lg px-4 py-3 flex items-start gap-3" style={{ backgroundColor:"#0a1a2a", border:"1px solid #1e3a5a" }}>
              <span className="text-blue-400 flex-shrink-0 mt-0.5">ℹ</span>
              <p className="text-xs text-gray-400" style={{ fontFamily:"system-ui,sans-serif" }}>
                All corrections are logged with a reason for audit purposes. Original record is preserved in history. Break window: <strong className="text-white">12:00 PM – 1:00 PM</strong>, max <strong className="text-white">1 hour</strong>.
              </p>
            </div>

            {/* Original record */}
            <div className="rounded-lg px-4 py-3" style={{ backgroundColor:"#111", border:"1px solid #1e1e1e" }}>
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-2" style={{ fontFamily:"system-ui,sans-serif" }}>Original Record</p>
              <div className="flex gap-5 flex-wrap">
                {[
                  ["Status",     record?.status    || "—"],
                  ["Time In",    record?.timeIn    || "—"],
                  ["Break Out",  record?.breakOut  || "—"],
                  ["Break In",   record?.breakIn   || "—"],
                  ["Time Out",   record?.timeOut   || "—"],
                  ["Hours",      record?.hours ? `${record.hours}h` : "—"],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>{l}</p>
                    <p className="text-sm text-gray-400 mt-0.5" style={{ fontFamily:"monospace" }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2" style={{ fontFamily:"system-ui,sans-serif" }}>Corrected Status</label>
              <div className="flex flex-wrap gap-2">
                {ATTENDANCE_STATUSES.map(s => {
                  const st = ATTENDANCE_STYLE[s];
                  return (
                    <button key={s} onClick={() => set("status", s)}
                      className="px-3 py-1.5 rounded text-xs font-medium transition-all"
                      style={{ fontFamily:"system-ui,sans-serif", backgroundColor: form.status===s?st.bg:"#111", color: form.status===s?st.color:"#555", border:`1px solid ${form.status===s?st.color+"44":"#2a2a2a"}` }}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time In / Time Out */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2" style={{ fontFamily:"system-ui,sans-serif" }}>Work Hours</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily:"system-ui,sans-serif" }}>Time In</p>
                  <input className={IC} style={IS} placeholder="e.g. 8:00 AM"
                    value={form.timeIn} onChange={e => handleChange("timeIn", e.target.value)} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily:"system-ui,sans-serif" }}>Time Out</p>
                  <input className={IC} style={IS} placeholder="e.g. 5:00 PM"
                    value={form.timeOut} onChange={e => handleChange("timeOut", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Break Out / Break In */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-widest text-gray-500" style={{ fontFamily:"system-ui,sans-serif" }}>Break Time</label>
                <span className="text-xs text-gray-600 px-2 py-0.5 rounded" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", border:"1px solid #2a2a2a" }}>
                  Window: 12:00 PM – 1:00 PM · Max 1 hour
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily:"system-ui,sans-serif" }}>Break Out</p>
                  <input className={IC} style={{ ...IS, borderColor: flags.includes("early") ? "#f0c85a55" : "#2a2a2a" }}
                    placeholder="e.g. 12:00 PM"
                    value={form.breakOut} onChange={e => handleChange("breakOut", e.target.value)} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1" style={{ fontFamily:"system-ui,sans-serif" }}>Break In</p>
                  <input className={IC} style={{ ...IS, borderColor: flags.includes("exceeded") ? "#f05a5a55" : "#2a2a2a" }}
                    placeholder="e.g. 1:00 PM"
                    value={form.breakIn} onChange={e => handleChange("breakIn", e.target.value)} />
                </div>
              </div>

              {/* Break validation feedback */}
              {form.breakOut && form.breakIn && (
                <div className="mt-2 rounded px-3 py-2.5 space-y-1.5" style={{ backgroundColor: flags.length?"#1a0f0a":"#0a1a0a", border:`1px solid ${flags.length?"#3a2010":"#1e3a1e"}` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500" style={{ fontFamily:"system-ui,sans-serif" }}>Break duration</span>
                    <span className="text-xs font-medium" style={{ fontFamily:"monospace", color: breakDur > 60 ? "#f05a5a" : "#5af07a" }}>
                      {breakDurLabel(form.breakOut, form.breakIn)}
                    </span>
                  </div>
                  {flags.includes("early") && (
                    <p className="text-xs" style={{ fontFamily:"system-ui,sans-serif", color:"#f0c85a" }}>
                      ⚠ Break out before 12:00 PM — outside allowed window
                    </p>
                  )}
                  {flags.includes("exceeded") && (
                    <p className="text-xs" style={{ fontFamily:"system-ui,sans-serif", color:"#f05a5a" }}>
                      ⚠ Break exceeded 1 hour — will be flagged for HR review
                    </p>
                  )}
                  {flags.length === 0 && (
                    <p className="text-xs" style={{ fontFamily:"system-ui,sans-serif", color:"#5af07a" }}>✓ Break within allowed window</p>
                  )}
                </div>
              )}
            </div>

            {/* Computed hours */}
            {form.hours !== "" && (
              <div className="rounded-lg px-4 py-2.5 space-y-1" style={{ backgroundColor:"#111", border:"1px solid #1e1e1e" }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500" style={{ fontFamily:"system-ui,sans-serif" }}>Net working hours</span>
                  <span className="text-sm font-medium" style={{ fontFamily:"monospace", color:"#5af07a" }}>{form.hours}h</span>
                </div>
                <p className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>
                  Gross time minus {form.breakOut && form.breakIn ? breakDurLabel(form.breakOut, form.breakIn) : "1h"} break
                </p>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{ fontFamily:"system-ui,sans-serif" }}>
                Reason for Correction <span style={{ color:"#f05a5a" }}>*</span>
              </label>
              <textarea className={IC} style={{ ...IS, height:76, resize:"none" }}
                placeholder="e.g. Employee forgot to clock out for break, biometric error…"
                value={form.reason} onChange={e => set("reason", e.target.value)} />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ borderTop:"1px solid #1e1e1e" }}>
            <button onClick={onClose} className="px-4 py-2 rounded text-sm hover:opacity-80"
              style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", color:"#aaa", border:"1px solid #2a2a2a" }}>Cancel</button>
            <button onClick={() => canSave && onSave({ ...form, breakFlags: flags, correctedAt:"Mar 2, 2026", correctedBy:"Admin" })}
              className="px-5 py-2 rounded text-sm font-medium hover:opacity-80 transition-all"
              style={{ fontFamily:"system-ui,sans-serif", backgroundColor:canSave?"#fff":"#1a1a1a", color:canSave?"#000":"#444", cursor:canSave?"pointer":"not-allowed" }}>
              Save Correction ✓
            </button>
          </div>
        </div>
      </div>
    </>
  );
}