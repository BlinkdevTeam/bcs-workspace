import React, { useState } from "react";
import { Avatar, gross, fmt } from '../../../data/compData';

// ── PAYSLIP MODAL ─────────────────────────────────────────────────────────────
function PayslipModal({ emp, run, onClose }) {
  const g = gross(emp);
  const t = g * (emp.tax / 100);
  const b = emp.benefits / (emp.payFreq==="Monthly"?12:emp.payFreq==="Semi-monthly"?24:26);
  const n = g - t - b;
  const ss = g * 0.062, med = g * 0.0145;

  return(
    <>
      <div className="fixed inset-0 z-40" style={{backgroundColor:"rgba(0,0,0,0.8)"}} onClick={onClose}/>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-xl flex flex-col" style={{backgroundColor:"#0d0d0d",border:"1px solid #2a2a2a",maxHeight:"92vh"}}>
          <div className="flex items-center justify-between px-6 py-5 flex-shrink-0" style={{borderBottom:"1px solid #1e1e1e"}}>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-0.5" style={{fontFamily:"system-ui,sans-serif"}}>Payslip · {run?.period||"Jan 16 – Jan 31, 2026"}</p>
              <h2 className="text-base font-normal text-white">{emp.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded text-xs hover:opacity-80" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a"}}>↓ Download</button>
              <button onClick={onClose} className="text-gray-500 hover:text-white text-xl ml-1">✕</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* Employee info */}
            <div className="flex items-center gap-3 p-4 rounded-lg" style={{backgroundColor:"#111",border:"1px solid #1e1e1e"}}>
              <Avatar emp={emp} size={40}/>
              <div className="flex-1">
                <p className="text-white text-sm font-medium" style={{fontFamily:"system-ui,sans-serif"}}>{emp.name}</p>
                <p className="text-gray-500 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{emp.role} · {emp.dept}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>Pay Freq.</p>
                <p className="text-gray-300 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{emp.payFreq}</p>
              </div>
            </div>

            {/* Earnings */}
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2" style={{fontFamily:"system-ui,sans-serif"}}>Earnings</p>
              <div className="rounded-lg overflow-hidden" style={{border:"1px solid #1e1e1e"}}>
                {[
                  ["Base Salary",    fmt(g),        "#fff"],
                  ["Overtime Pay",   fmt(0),         "#888"],
                  ["Bonus",          fmt(0),         "#888"],
                ].map(([l,v,c],i,arr)=>(
                  <div key={l} className="flex justify-between px-4 py-2.5" style={{borderBottom:i<arr.length-1?"1px solid #141414":"none",backgroundColor:"#0d0d0d"}}>
                    <span className="text-gray-400 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{l}</span>
                    <span className="text-sm" style={{fontFamily:"monospace",color:c}}>{v}</span>
                  </div>
                ))}
                <div className="flex justify-between px-4 py-2.5" style={{backgroundColor:"#111",borderTop:"1px solid #222"}}>
                  <span className="text-white text-sm font-medium" style={{fontFamily:"system-ui,sans-serif"}}>Gross Pay</span>
                  <span className="text-white text-sm font-medium" style={{fontFamily:"monospace"}}>{fmt(g)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2" style={{fontFamily:"system-ui,sans-serif"}}>Deductions</p>
              <div className="rounded-lg overflow-hidden" style={{border:"1px solid #1e1e1e"}}>
                {[
                  ["Federal Income Tax",  `-${fmt(t - ss - med)}`,  "#f0c85a"],
                  ["Social Security",     `-${fmt(ss)}`,             "#f0c85a"],
                  ["Medicare",            `-${fmt(med)}`,            "#f0c85a"],
                  ["Health Benefits",     `-${fmt(b * 0.7)}`,        "#888"],
                  ["401(k)",              `-${fmt(b * 0.3)}`,        "#888"],
                ].map(([l,v,c],i,arr)=>(
                  <div key={l} className="flex justify-between px-4 py-2.5" style={{borderBottom:i<arr.length-1?"1px solid #141414":"none",backgroundColor:"#0d0d0d"}}>
                    <span className="text-gray-400 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{l}</span>
                    <span className="text-sm" style={{fontFamily:"monospace",color:c}}>{v}</span>
                  </div>
                ))}
                <div className="flex justify-between px-4 py-2.5" style={{backgroundColor:"#111",borderTop:"1px solid #222"}}>
                  <span className="text-gray-300 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>Total Deductions</span>
                  <span className="text-sm" style={{fontFamily:"monospace",color:"#f05a5a"}}>-{fmt(g-n)}</span>
                </div>
              </div>
            </div>

            {/* Net */}
            <div className="rounded-lg p-4 flex items-center justify-between" style={{backgroundColor:"#0f1f0f",border:"1px solid #2a4a2a"}}>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-0.5" style={{fontFamily:"system-ui,sans-serif"}}>Net Pay</p>
                <p className="text-gray-400 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>→ Account ••••2847</p>
              </div>
              <p className="text-2xl font-light" style={{fontFamily:"monospace",color:"#5af07a"}}>{fmt(n)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PayslipModal;