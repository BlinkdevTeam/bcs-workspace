import React, { useState } from "react";

const DEFAULT_SETTINGS = {
  sss:       { enabled:true,  rate:4.5,  cap:1350,  label:"SSS / Social Security",   note:"Employee share. Employer contributes separately." },
  philhealth:{ enabled:true,  rate:2.0,  cap:3200,  label:"PhilHealth / Medical",     note:"Employee share (2% of basic salary, split equally)." },
  pagibig:   { enabled:true,  rate:2.0,  cap:100,   label:"Pag-IBIG / Housing Fund",  note:"Capped at \u20b1100/month employee share." },
  ot: {
    regular: { rate:1.25, label:"Regular OT (>8h/day)" },
    restDay: { rate:1.30, label:"Rest Day OT" },
    holiday: { rate:2.00, label:"Special Holiday OT" },
    legal:   { rate:2.60, label:"Legal Holiday OT" },
  },
  ut: { deductRate:1.00, graceMins:15 },
  tax: {
    method:"flat",
    flatNote:"Each employee withholding rate is set individually in their compensation record.",
    brackets:[
      { from:0,      to:20833,  rate:0,  fixed:0      },
      { from:20834,  to:33332,  rate:20, fixed:0      },
      { from:33333,  to:66666,  rate:25, fixed:2500   },
      { from:66667,  to:166666, rate:30, fixed:10833  },
      { from:166667, to:666666, rate:32, fixed:40833  },
      { from:666667, to:null,   rate:35, fixed:200833 },
    ],
  },
  schedule: { cutoff1:15, cutoff2:30, payDelay:5, currency:"USD" },
  benefitCategories:[
    { id:1, name:"Health Insurance", defaultAmt:800, enabled:true  },
    { id:2, name:"Dental & Vision",  defaultAmt:240, enabled:true  },
    { id:3, name:"401(k) / Pension", defaultAmt:240, enabled:true  },
    { id:4, name:"Life Insurance",   defaultAmt:60,  enabled:false },
    { id:5, name:"Commuter Benefit", defaultAmt:50,  enabled:false },
  ],
};

const IS = {backgroundColor:"#111",border:"1px solid #2a2a2a",fontFamily:"system-ui,sans-serif"};
const IC = "w-full px-3 py-2.5 rounded text-sm text-white placeholder-gray-600 outline-none";
const BADGE = {
  Processed: {bg:"#0f1f0f",color:"#5af07a"},
  Scheduled: {bg:"#0a1a2a",color:"#5a9af0"},
  Draft:     {bg:"#1a1a0a",color:"#f0c85a"},
  On_Hold:   {bg:"#1f0f0f",color:"#f05a5a"},
};
const ESTATUS = { Active: { bg: "#0f1f0f", color: "#5af07a" }, "On Leave": { bg: "#1f1a0f", color: "#f0c85a" } };


// ── PAYROLL SETTINGS DRAWER ───────────────────────────────────────────────────
function PayrollSettingsDrawer({ settings, onSave, onClose }) {
  const [s, setS] = useState(JSON.parse(JSON.stringify(settings))); // deep clone
  const [activeSection, setActiveSection] = useState("statutory");

  function setStatutory(key, field, val) {
    setS(prev => ({ ...prev, [key]: { ...prev[key], [field]: val } }));
  }
  function setOT(key, field, val) {
    setS(prev => ({ ...prev, ot: { ...prev.ot, [key]: { ...prev.ot[key], [field]: val } } }));
  }
  function setUT(field, val) {
    setS(prev => ({ ...prev, ut: { ...prev.ut, [field]: val } }));
  }
  function setSchedule(field, val) {
    setS(prev => ({ ...prev, schedule: { ...prev.schedule, [field]: val } }));
  }
  function setBracket(i, field, val) {
    const brackets = s.tax.brackets.map((b,idx) => idx===i ? {...b,[field]:val} : b);
    setS(prev => ({ ...prev, tax: { ...prev.tax, brackets } }));
  }
  function toggleBenefit(id) {
    setS(prev => ({ ...prev, benefitCategories: prev.benefitCategories.map(b => b.id===id ? {...b,enabled:!b.enabled} : b) }));
  }
  function setBenefit(id, field, val) {
    setS(prev => ({ ...prev, benefitCategories: prev.benefitCategories.map(b => b.id===id ? {...b,[field]:val} : b) }));
  }

  const SECTIONS = [
    { key:"statutory", label:"Statutory Contributions" },
    { key:"ot",        label:"OT & UT Rates" },
    { key:"tax",       label:"Tax / Withholding" },
    { key:"benefits",  label:"Benefit Categories" },
    { key:"schedule",  label:"Pay Schedule" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-20" style={{backgroundColor:"rgba(0,0,0,0.6)"}} onClick={onClose}/>
      <div className="fixed top-0 right-0 h-full z-30 flex flex-col" style={{width:520,backgroundColor:"#080808",borderLeft:"1px solid #222",boxShadow:"-8px 0 40px rgba(0,0,0,0.8)"}}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 flex-shrink-0" style={{borderBottom:"1px solid #1a1a1a"}}>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-0.5" style={{fontFamily:"system-ui,sans-serif"}}>Payroll</p>
            <h2 className="text-lg font-normal text-white">Computation Settings</h2>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white text-xl">✕</button>
        </div>

        {/* Section tabs */}
        <div className="flex border-b overflow-x-auto flex-shrink-0" style={{borderColor:"#1a1a1a"}}>
          {SECTIONS.map(sec => (
            <button key={sec.key} onClick={()=>setActiveSection(sec.key)}
              className="px-4 py-3 text-xs whitespace-nowrap transition-all flex-shrink-0"
              style={{fontFamily:"system-ui,sans-serif",color:activeSection===sec.key?"#fff":"#555",borderBottom:activeSection===sec.key?"2px solid #fff":"2px solid transparent"}}>
              {sec.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6">

          {/* ── STATUTORY ── */}
          {activeSection==="statutory" && (
            <div className="space-y-6">
              <p className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>
                Configure employee-share contribution rates. These are deducted from gross pay each period.
              </p>
              {[["sss","SSS / Social Security"],["philhealth","PhilHealth / Medical"],["pagibig","Pag-IBIG / Housing"]].map(([key, title]) => (
                <div key={key} className="rounded-lg p-5 space-y-4" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{title}</p>
                      <p className="text-gray-600 text-xs mt-0.5" style={{fontFamily:"system-ui,sans-serif"}}>{s[key].note}</p>
                    </div>
                    {/* Toggle */}
                    <button onClick={()=>setStatutory(key,"enabled",!s[key].enabled)}
                      className="w-12 h-6 rounded-full relative transition-all flex-shrink-0"
                      style={{backgroundColor:s[key].enabled?"#fff":"#2a2a2a"}}>
                      <div className="w-5 h-5 rounded-full absolute top-0.5 transition-all"
                        style={{backgroundColor:s[key].enabled?"#000":"#666",left:s[key].enabled?"calc(100% - 22px)":"2px"}}/>
                    </button>
                  </div>
                  {s[key].enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Rate (%)</label>
                        <input type="number" step="0.01"
                          className="w-full px-3 py-2 rounded text-sm text-white outline-none"
                          style={{backgroundColor:"#111",border:"1px solid #2a2a2a",fontFamily:"monospace"}}
                          value={s[key].rate}
                          onChange={e=>setStatutory(key,"rate",parseFloat(e.target.value)||0)}/>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Monthly Cap ($)</label>
                        <input type="number"
                          className="w-full px-3 py-2 rounded text-sm text-white outline-none"
                          style={{backgroundColor:"#111",border:"1px solid #2a2a2a",fontFamily:"monospace"}}
                          value={s[key].cap}
                          onChange={e=>setStatutory(key,"cap",parseFloat(e.target.value)||0)}/>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── OT & UT ── */}
          {activeSection==="ot" && (
            <div className="space-y-6">
              {/* OT multipliers */}
              <div className="rounded-lg p-5 space-y-4" style={{backgroundColor:"#0d0d0d",border:"1px solid #0a1a2a"}}>
                <p className="text-xs uppercase tracking-widest mb-1" style={{fontFamily:"system-ui,sans-serif",color:"#5a9af0"}}>Overtime Multipliers</p>
                <p className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>Applied to the employee's base hourly rate per OT hour.</p>
                {Object.entries(s.ot).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-gray-300 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{val.label}</label>
                    <div className="flex items-center gap-2">
                      <input type="number" step="0.05" min="1"
                        className="w-24 px-3 py-1.5 rounded text-sm text-white text-right outline-none"
                        style={{backgroundColor:"#111",border:"1px solid #2a2a2a",fontFamily:"monospace"}}
                        value={val.rate}
                        onChange={e=>setOT(key,"rate",parseFloat(e.target.value)||1)}/>
                      <span className="text-gray-500 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>× base</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* UT settings */}
              <div className="rounded-lg p-5 space-y-4" style={{backgroundColor:"#0d0d0d",border:"1px solid #2a0a0a"}}>
                <p className="text-xs uppercase tracking-widest mb-1" style={{fontFamily:"system-ui,sans-serif",color:"#f05a5a"}}>Undertime Rules</p>
                <div className="flex items-center justify-between">
                  <label className="text-gray-300 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>Deduction rate per UT hour</label>
                  <div className="flex items-center gap-2">
                    <input type="number" step="0.05" min="0" max="2"
                      className="w-24 px-3 py-1.5 rounded text-sm text-white text-right outline-none"
                      style={{backgroundColor:"#111",border:"1px solid #2a2a2a",fontFamily:"monospace"}}
                      value={s.ut.deductRate}
                      onChange={e=>setUT("deductRate",parseFloat(e.target.value)||0)}/>
                    <span className="text-gray-500 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>× base</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-gray-300 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>Grace period (minutes)</label>
                  <input type="number" min="0"
                    className="w-24 px-3 py-1.5 rounded text-sm text-white text-right outline-none"
                    style={{backgroundColor:"#111",border:"1px solid #2a2a2a",fontFamily:"monospace"}}
                    value={s.ut.graceMins}
                    onChange={e=>setUT("graceMins",parseInt(e.target.value)||0)}/>
                </div>
                <p className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>
                  Tardiness within the grace period is not counted as undertime.
                </p>
              </div>
            </div>
          )}

          {/* ── TAX ── */}
          {activeSection==="tax" && (
            <div className="space-y-5">
              {/* Method toggle */}
              <div className="flex gap-2">
                {[["flat","Flat Rate (per employee)"],["bracket","Tax Bracket Table"]].map(([key,label])=>(
                  <button key={key} onClick={()=>setS(prev=>({...prev,tax:{...prev.tax,method:key}}))}
                    className="flex-1 py-2.5 rounded text-sm transition-all"
                    style={{fontFamily:"system-ui,sans-serif",backgroundColor:s.tax.method===key?"#fff":"#111",color:s.tax.method===key?"#000":"#666",border:s.tax.method===key?"none":"1px solid #2a2a2a"}}>
                    {label}
                  </button>
                ))}
              </div>

              {s.tax.method==="flat" ? (
                <div className="rounded-lg p-4" style={{backgroundColor:"#111",border:"1px solid #1e1e1e"}}>
                  <p className="text-gray-400 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{s.tax.flatNote}</p>
                  <p className="text-xs text-gray-600 mt-2" style={{fontFamily:"system-ui,sans-serif"}}>
                    To adjust individual tax rates, go to <span className="text-white">Compensation tab → Edit</span> on the employee row.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>
                    Monthly income brackets (per period). Rate applied to income above the bracket floor.
                  </p>
                  <div className="rounded-lg overflow-hidden" style={{border:"1px solid #1e1e1e"}}>
                    <table className="w-full text-xs">
                      <thead><tr style={{backgroundColor:"#0a0a0a",borderBottom:"1px solid #1e1e1e"}}>
                        {["From ($)","To ($)","Rate (%)","Fixed ($)"].map(h=>(
                          <th key={h} className="px-3 py-2.5 text-left font-normal text-gray-600" style={{fontFamily:"system-ui,sans-serif",textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {s.tax.brackets.map((b,i)=>(
                          <tr key={i} style={{borderBottom:i<s.tax.brackets.length-1?"1px solid #141414":"none",backgroundColor:"#0d0d0d"}}>
                            {[["from",b.from],["to",b.to],["rate",b.rate],["fixed",b.fixed]].map(([field,val])=>(
                              <td key={field} className="px-3 py-2">
                                <input type="number"
                                  className="w-full px-2 py-1 rounded text-xs text-white outline-none"
                                  style={{backgroundColor:"#111",border:"1px solid #222",fontFamily:"monospace"}}
                                  value={val===null?"∞":val}
                                  placeholder={field==="to"?"No limit":""}
                                  onChange={e=>setBracket(i,field,e.target.value===""?null:parseFloat(e.target.value)||0)}/>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── BENEFIT CATEGORIES ── */}
          {activeSection==="benefits" && (
            <div className="space-y-4">
              <p className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>
                Toggle categories and set default monthly deduction amounts. Individual employee overrides are set in their compensation record.
              </p>
              {s.benefitCategories.map(b=>(
                <div key={b.id} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
                  <div className="flex items-center gap-3">
                    <button onClick={()=>toggleBenefit(b.id)}
                      className="w-10 h-5 rounded-full relative transition-all flex-shrink-0"
                      style={{backgroundColor:b.enabled?"#fff":"#2a2a2a"}}>
                      <div className="w-3.5 h-3.5 rounded-full absolute top-0.5 transition-all"
                        style={{backgroundColor:b.enabled?"#000":"#666",left:b.enabled?"calc(100% - 18px)":"2px"}}/>
                    </button>
                    <span className="text-gray-200 text-sm" style={{fontFamily:"system-ui,sans-serif",opacity:b.enabled?1:0.4}}>{b.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>Default/yr</span>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                      <input type="number"
                        className="w-24 pl-6 pr-2 py-1.5 rounded text-xs text-white outline-none"
                        style={{backgroundColor:"#111",border:"1px solid #2a2a2a",fontFamily:"monospace",opacity:b.enabled?1:0.4}}
                        disabled={!b.enabled}
                        value={b.defaultAmt}
                        onChange={e=>setBenefit(b.id,"defaultAmt",parseFloat(e.target.value)||0)}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── PAY SCHEDULE ── */}
          {activeSection==="schedule" && (
            <div className="space-y-5">
              <div className="rounded-lg p-5 space-y-4" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
                <p className="text-xs uppercase tracking-widest text-gray-500" style={{fontFamily:"system-ui,sans-serif"}}>Semi-Monthly Cut-off Days</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>1st Cut-off (day of month)</label>
                    <input type="number" min="1" max="28"
                      className="w-full px-3 py-2 rounded text-sm text-white outline-none"
                      style={{backgroundColor:"#111",border:"1px solid #2a2a2a",fontFamily:"monospace"}}
                      value={s.schedule.cutoff1}
                      onChange={e=>setSchedule("cutoff1",parseInt(e.target.value)||1)}/>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>2nd Cut-off (day of month)</label>
                    <input type="number" min="1" max="31"
                      className="w-full px-3 py-2 rounded text-sm text-white outline-none"
                      style={{backgroundColor:"#111",border:"1px solid #2a2a2a",fontFamily:"monospace"}}
                      value={s.schedule.cutoff2}
                      onChange={e=>setSchedule("cutoff2",parseInt(e.target.value)||1)}/>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Pay delay after cut-off (days)</label>
                  <input type="number" min="0"
                    className="w-full px-3 py-2 rounded text-sm text-white outline-none"
                    style={{backgroundColor:"#111",border:"1px solid #2a2a2a",fontFamily:"monospace"}}
                    value={s.schedule.payDelay}
                    onChange={e=>setSchedule("payDelay",parseInt(e.target.value)||0)}/>
                  <p className="text-xs text-gray-600 mt-1.5" style={{fontFamily:"system-ui,sans-serif"}}>
                    e.g. Cut-off on the 15th + 5 days = pay date on the 20th.
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Currency</label>
                  <select className="w-full px-3 py-2 rounded text-sm text-white outline-none"
                    style={{backgroundColor:"#111",border:"1px solid #2a2a2a",fontFamily:"system-ui,sans-serif"}}
                    value={s.schedule.currency}
                    onChange={e=>setSchedule("currency",e.target.value)}>
                    {["USD","PHP","SGD","EUR","GBP","AUD"].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-7 py-5 flex items-center justify-between flex-shrink-0" style={{borderTop:"1px solid #1a1a1a"}}>
          <div>
            <p className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>Changes apply to the next payroll computation.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded text-sm hover:opacity-80"
              style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a"}}>
              Cancel
            </button>
            <button onClick={()=>onSave(s)} className="px-5 py-2 rounded text-sm font-medium bg-white text-black hover:opacity-80"
              style={{fontFamily:"system-ui,sans-serif"}}>
              Save Settings ✓
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

export default PayrollSettingsDrawer;