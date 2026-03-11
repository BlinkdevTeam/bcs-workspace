import React, { useState } from "react";
import { Avatar, fmt } from '../../../data/compData';

// ── CUTOFF ADJUSTMENT MODAL ──────────────────────────────────────────────────
// Per-employee, per-cutoff one-time overrides. Salary/packages managed in People page.
const BONUS_REASONS  = ["Performance bonus","Sales incentive","Project completion","Referral bonus","Anniversary bonus","Signing bonus","Prorated joining (partial period)","Other"];
const DEDUCT_REASONS = ["Salary advance repayment","Late / absence deduction","Equipment damage","Loan repayment","Cash advance","Uniform / ID fee","Prorated exit (partial period)","Other"];

function CutoffEditModal({ emp, cutoffAdj, onClose, onSave }) {
  const [adj, setAdj] = useState(cutoffAdj ? JSON.parse(JSON.stringify(cutoffAdj)) : { proratedSalary: null, adjustments: [] });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type:"bonus", amount:"", reason:"", customReason:"", addedBy:"Admin" });

  const periods = emp.payFreq === "Monthly" ? 12 : emp.payFreq === "Semi-monthly" ? 24 : 26;
  const baseSalary = emp.salaryNumeric;
  const effectiveSalary = adj.proratedSalary !== null ? adj.proratedSalary : baseSalary;
  const grossPeriod = effectiveSalary / periods;
  const bonusTotal  = adj.adjustments.filter(a=>a.type==="bonus").reduce((s,a)=>s+Number(a.amount),0);
  const deductTotal = adj.adjustments.filter(a=>a.type==="deduction").reduce((s,a)=>s+Number(a.amount),0);
  const netAdjusted = grossPeriod + bonusTotal - deductTotal;

  function addAdj() {
    if (!form.amount || !form.reason) return;
    const label = form.reason === "Other" ? (form.customReason || "Other") : form.reason;
    setAdj(a => ({ ...a, adjustments: [...a.adjustments, { id: Date.now(), ...form, reason: label, amount: parseFloat(form.amount) }] }));
    setForm({ type:"bonus", amount:"", reason:"", customReason:"", addedBy:"Admin" });
    setShowForm(false);
  }
  function removeAdj(id) { setAdj(a => ({ ...a, adjustments: a.adjustments.filter(x=>x.id!==id) })); }

  return (
    <>
      <div className="fixed inset-0 z-40" style={{backgroundColor:"rgba(0,0,0,0.75)"}} onClick={onClose}/>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-xl flex flex-col" style={{backgroundColor:"#0d0d0d",border:"1px solid #2a2a2a",maxHeight:"92vh"}}>
          <div className="flex items-center justify-between px-6 py-5 flex-shrink-0" style={{borderBottom:"1px solid #1e1e1e"}}>
            <div className="flex items-center gap-3">
              <Avatar emp={emp} size={36}/>
              <div>
                <h2 className="text-base font-normal text-white">{emp.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5" style={{fontFamily:"system-ui,sans-serif"}}>Cutoff adjustments · this period only</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Info banner */}
            <div className="rounded-lg px-4 py-3 flex items-start gap-3" style={{backgroundColor:"#0a1a2a",border:"1px solid #1e3a5a"}}>
              <span className="text-blue-400 text-sm flex-shrink-0 mt-0.5">ℹ</span>
              <p className="text-xs text-gray-400" style={{fontFamily:"system-ui,sans-serif"}}>
                Salary, contribution sets, and benefits are managed in <strong className="text-white">People → Compensation</strong>. Changes here apply to <strong className="text-white">this cutoff only</strong>.
              </p>
            </div>

            {/* Package summary (read-only) */}
            <div className="rounded-lg p-4 grid grid-cols-3 gap-3" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
              {[
                ["Annual Salary", "$"+Number(emp.salaryNumeric).toLocaleString()],
                ["Pay Frequency", emp.payFreq],
                ["Gross / Period", fmt(baseSalary/periods)],
              ].map(([l,v])=>(
                <div key={l}>
                  <p className="text-xs text-gray-600 uppercase tracking-widest mb-0.5" style={{fontFamily:"system-ui,sans-serif"}}>{l}</p>
                  <p className="text-sm text-gray-300" style={{fontFamily:"monospace"}}>{v}</p>
                </div>
              ))}
            </div>

            {/* Prorated override */}
            <div className="rounded-lg p-4 space-y-3" style={{backgroundColor:"#111",border:"1px solid #1e1e1e"}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white" style={{fontFamily:"system-ui,sans-serif"}}>Prorated Salary Override</p>
                  <p className="text-xs text-gray-600 mt-0.5" style={{fontFamily:"system-ui,sans-serif"}}>Partial-period starts, exits, or unpaid leave.</p>
                </div>
                <button onClick={()=>setAdj(a=>({...a,proratedSalary:a.proratedSalary===null?baseSalary:null}))}
                  className="w-10 h-5 rounded-full relative transition-all flex-shrink-0"
                  style={{backgroundColor:adj.proratedSalary!==null?"#fff":"#333"}}>
                  <div className="w-4 h-4 rounded-full absolute top-0.5 transition-all"
                    style={{backgroundColor:adj.proratedSalary!==null?"#000":"#666",left:adj.proratedSalary!==null?"calc(100% - 1.1rem)":"0.15rem"}}/>
                </button>
              </div>
              {adj.proratedSalary !== null && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Adjusted Annual ($)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input type="number" className="w-full pl-7 pr-3 py-2.5 rounded text-sm text-white outline-none"
                        style={{backgroundColor:"#0d0d0d",border:"1px solid #2a2a2a",fontFamily:"monospace"}}
                        value={adj.proratedSalary} onChange={e=>setAdj(a=>({...a,proratedSalary:parseFloat(e.target.value)||0}))}/>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end">
                    <p className="text-xs text-gray-600 mb-1" style={{fontFamily:"system-ui,sans-serif"}}>Gross this period</p>
                    <p className="text-base font-light" style={{fontFamily:"monospace",color:"#5af07a"}}>{fmt(grossPeriod)}</p>
                    <p className="text-xs mt-0.5" style={{fontFamily:"system-ui,sans-serif",color:"#555"}}>std: {fmt(baseSalary/periods)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* One-time adjustments */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-white" style={{fontFamily:"system-ui,sans-serif"}}>One-time Deductions & Bonuses</p>
                <button onClick={()=>setShowForm(v=>!v)}
                  className="px-3 py-1.5 rounded text-xs font-medium hover:opacity-80"
                  style={{fontFamily:"system-ui,sans-serif",backgroundColor:showForm?"#1a1a1a":"#fff",color:showForm?"#aaa":"#000",border:showForm?"1px solid #2a2a2a":"none"}}>
                  {showForm?"✕ Cancel":"+ Add"}
                </button>
              </div>
              {showForm && (
                <div className="rounded-lg p-4 mb-3 space-y-3" style={{backgroundColor:"#111",border:"1px solid #2a2a2a"}}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Type</label>
                      <div className="flex gap-2">
                        {[["bonus","Bonus","#5af07a"],["deduction","Deduction","#f05a5a"]].map(([val,label,col])=>(
                          <button key={val} onClick={()=>setForm(f=>({...f,type:val,reason:""}))}
                            className="flex-1 py-2 rounded text-xs font-medium"
                            style={{fontFamily:"system-ui,sans-serif",backgroundColor:form.type===val?col+"22":"#0d0d0d",color:form.type===val?col:"#555",border:`1px solid ${form.type===val?col:"#2a2a2a"}`}}>
                            {form.type===val?"✓ ":""}{label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Amount ($)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <input type="number" className="w-full pl-7 pr-3 py-2.5 rounded text-sm text-white outline-none"
                          style={{backgroundColor:"#0d0d0d",border:"1px solid #2a2a2a",fontFamily:"monospace"}}
                          placeholder="0.00" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Reason</label>
                    <select className="w-full px-3 py-2.5 rounded text-sm text-white outline-none"
                      style={{backgroundColor:"#0d0d0d",border:"1px solid #2a2a2a",fontFamily:"system-ui,sans-serif"}}
                      value={form.reason} onChange={e=>setForm(f=>({...f,reason:e.target.value}))}>
                      <option value="">Select reason…</option>
                      {(form.type==="bonus"?BONUS_REASONS:DEDUCT_REASONS).map(r=><option key={r}>{r}</option>)}
                    </select>
                  </div>
                  {form.reason==="Other" && (
                    <input className="w-full px-3 py-2.5 rounded text-sm text-white outline-none"
                      style={{backgroundColor:"#0d0d0d",border:"1px solid #2a2a2a",fontFamily:"system-ui,sans-serif"}}
                      placeholder="Describe the reason…" value={form.customReason} onChange={e=>setForm(f=>({...f,customReason:e.target.value}))}/>
                  )}
                  <input className="w-full px-3 py-2.5 rounded text-sm text-white outline-none"
                    style={{backgroundColor:"#0d0d0d",border:"1px solid #2a2a2a",fontFamily:"system-ui,sans-serif"}}
                    placeholder="Added by…" value={form.addedBy} onChange={e=>setForm(f=>({...f,addedBy:e.target.value}))}/>
                  <div className="flex justify-end">
                    <button onClick={addAdj} disabled={!form.amount||!form.reason}
                      className="px-4 py-2 rounded text-sm font-medium hover:opacity-80"
                      style={{fontFamily:"system-ui,sans-serif",backgroundColor:(!form.amount||!form.reason)?"#1a1a1a":"#fff",color:(!form.amount||!form.reason)?"#444":"#000"}}>
                      Confirm ✓
                    </button>
                  </div>
                </div>
              )}
              {adj.adjustments.length===0 && !showForm ? (
                <div className="flex items-center justify-center py-5 rounded" style={{border:"1px dashed #2a2a2a"}}>
                  <p className="text-gray-600 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>No adjustments this cutoff.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {adj.adjustments.map(a=>(
                    <div key={a.id} className="flex items-center justify-between px-4 py-3 rounded group"
                      style={{backgroundColor:"#111",border:`1px solid ${a.type==="bonus"?"#1a3a1a":"#3a1a1a"}`}}>
                      <div className="flex items-center gap-3">
                        <span>{a.type==="bonus"?"⬆":"⬇"}</span>
                        <div>
                          <p className="text-sm text-gray-200" style={{fontFamily:"system-ui,sans-serif"}}>{a.reason}</p>
                          <p className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>Added by {a.addedBy}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium" style={{fontFamily:"monospace",color:a.type==="bonus"?"#5af07a":"#f05a5a"}}>
                          {a.type==="bonus"?"+":"-"}{fmt(a.amount)}
                        </span>
                        <button onClick={()=>removeAdj(a.id)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Net preview */}
            <div className="rounded-lg p-4" style={{backgroundColor:"#0f1f0f",border:"1px solid #2a4a2a"}}>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-3" style={{fontFamily:"system-ui,sans-serif"}}>Estimated Net · This Cutoff</p>
              <div className="space-y-1.5">
                {[
                  ["Gross (this period)", fmt(grossPeriod), "#fff"],
                  ...(bonusTotal>0  ? [["+ Bonuses", fmt(bonusTotal), "#5af07a"]] : []),
                  ...(deductTotal>0 ? [["− Deductions", fmt(deductTotal), "#f05a5a"]] : []),
                  ["Est. Net (before statutory ded.)", fmt(netAdjusted), "#5af07a"],
                ].map(([l,v,c],i,arr)=>(
                  <div key={l} className="flex justify-between" style={{borderTop:i===arr.length-1?"1px solid #2a4a2a":"none",paddingTop:i===arr.length-1?"0.5rem":"0"}}>
                    <span className="text-gray-400 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{l}</span>
                    <span className="text-sm font-medium" style={{fontFamily:"monospace",color:c}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{borderTop:"1px solid #1e1e1e"}}>
            <button onClick={onClose} className="px-4 py-2 rounded text-sm hover:opacity-80"
              style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a"}}>Cancel</button>
            <button onClick={()=>onSave(adj)} className="px-5 py-2 rounded text-sm font-medium bg-white text-black hover:opacity-80"
              style={{fontFamily:"system-ui,sans-serif"}}>Save Adjustments ✓</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CutoffEditModal;