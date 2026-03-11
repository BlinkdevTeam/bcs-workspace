import { useState, useMemo } from "react";

const NAV_ITEMS = ["Dashboard", "People", "Payroll", "Time & Leave", "Recruitment", "Reports"];

// ── SHARED DATA ───────────────────────────────────────────────────────────────
// empType: "Regular" | "Contractual" | "Part-time" | "Custom"
// taxExempt: false | "Minimum Wage" | "DOLE Exemption" | "Treaty Exempt" | "Other"
// deductOverrides: per-deduction on/off flags for Custom type
const EMPLOYEES = [
  { id:1,  name:"Sara Okafor",      avatar:"SO", dept:"Engineering", role:"Senior Engineer",   salary:142000, payFreq:"Bi-weekly",    tax:28, benefits:1280, status:"Active",   empType:"Regular",     taxExempt:false,          deductOverrides:{sss:true,  philhealth:true,  pagibig:true}  },
  { id:2,  name:"Marcus Chen",      avatar:"MC", dept:"Sales",       role:"Account Executive", salary:98000,  payFreq:"Bi-weekly",    tax:22, benefits:960,  status:"Active",   empType:"Regular",     taxExempt:false,          deductOverrides:{sss:true,  philhealth:true,  pagibig:true}  },
  { id:3,  name:"Priya Nair",       avatar:"PN", dept:"Product",     role:"Product Manager",   salary:126000, payFreq:"Semi-monthly", tax:26, benefits:1280, status:"Active",   empType:"Regular",     taxExempt:false,          deductOverrides:{sss:true,  philhealth:true,  pagibig:true}  },
  { id:4,  name:"James Kowalski",   avatar:"JK", dept:"Engineering", role:"DevOps Engineer",   salary:134000, payFreq:"Bi-weekly",    tax:27, benefits:960,  status:"Active",   empType:"Regular",     taxExempt:false,          deductOverrides:{sss:true,  philhealth:true,  pagibig:true}  },
  { id:5,  name:"Leila Farouk",     avatar:"LF", dept:"Product",     role:"Senior PM",         salary:148000, payFreq:"Monthly",      tax:30, benefits:1280, status:"Active",   empType:"Regular",     taxExempt:false,          deductOverrides:{sss:true,  philhealth:true,  pagibig:true}  },
  { id:6,  name:"Devon Park",       avatar:"DP", dept:"Engineering", role:"VP Engineering",    salary:210000, payFreq:"Monthly",      tax:35, benefits:1280, status:"Active",   empType:"Regular",     taxExempt:false,          deductOverrides:{sss:true,  philhealth:true,  pagibig:true}  },
  { id:7,  name:"Rita Vance",       avatar:"RV", dept:"Sales",       role:"Sales Director",    salary:175000, payFreq:"Monthly",      tax:32, benefits:1280, status:"Active",   empType:"Regular",     taxExempt:false,          deductOverrides:{sss:true,  philhealth:true,  pagibig:true}  },
  { id:8,  name:"Tomás Rivera",     avatar:"TR", dept:"Design",      role:"UX Designer",       salary:112000, payFreq:"Bi-weekly",    tax:24, benefits:960,  status:"Active",   empType:"Contractual", taxExempt:false,          deductOverrides:{sss:false, philhealth:false, pagibig:false} },
  { id:9,  name:"Ananya Bose",      avatar:"AB", dept:"Operations",  role:"Data Analyst",      salary:95000,  payFreq:"Bi-weekly",    tax:22, benefits:960,  status:"On Leave", empType:"Regular",     taxExempt:false,          deductOverrides:{sss:true,  philhealth:true,  pagibig:true}  },
  { id:10, name:"Chris Mendez",     avatar:"CM", dept:"HR & Admin",  role:"HR Specialist",     salary:88000,  payFreq:"Bi-weekly",    tax:0,  benefits:0,    status:"Active",   empType:"Regular",     taxExempt:"Minimum Wage", deductOverrides:{sss:true,  philhealth:true,  pagibig:true}  },
  { id:11, name:"Fatima Al-Hassan", avatar:"FA", dept:"Engineering", role:"Frontend Engineer", salary:128000, payFreq:"Bi-weekly",    tax:26, benefits:1280, status:"Active",   empType:"Part-time",   taxExempt:false,          deductOverrides:{sss:true,  philhealth:true,  pagibig:false} },
  { id:12, name:"Noah Kim",         avatar:"NK", dept:"Marketing",   role:"Marketing Manager", salary:104000, payFreq:"Bi-weekly",    tax:23, benefits:960,  status:"Active",   empType:"Custom",      taxExempt:false,          deductOverrides:{sss:true,  philhealth:false, pagibig:true}  },
];

const PAYROLL_RUNS = [
  { id:"PR-2026-04", period:"Feb 1 – Feb 15, 2026",  payDate:"Feb 28, 2026", status:"Scheduled", total:142830, headcount:12, type:"Bi-weekly + Monthly" },
  { id:"PR-2026-03", period:"Jan 16 – Jan 31, 2026", payDate:"Feb 14, 2026", status:"Processed", total:138450, headcount:12, type:"Bi-weekly" },
  { id:"PR-2026-02", period:"Jan 1 – Jan 15, 2026",  payDate:"Jan 31, 2026", status:"Processed", total:141200, headcount:12, type:"Bi-weekly + Monthly" },
  { id:"PR-2026-01", period:"Dec 16 – Dec 31, 2025", payDate:"Jan 14, 2026", status:"Processed", total:139800, headcount:12, type:"Bi-weekly" },
  { id:"PR-2025-26", period:"Dec 1 – Dec 15, 2025",  payDate:"Dec 31, 2025", status:"Processed", total:144500, headcount:12, type:"Bi-weekly + Monthly" },
  { id:"PR-2025-25", period:"Nov 16 – Nov 30, 2025", payDate:"Dec 14, 2025", status:"Processed", total:137900, headcount:11, type:"Bi-weekly" },
];

const AV = ["#ffffff","#cccccc","#999999","#777777","#555555","#444444","#ffffff","#bbbbbb","#888888","#666666","#aaaaaa","#333333"];
function gc(id){ const bg=AV[id%AV.length]; return{ bg, fg:["#fff","#ddd","#eee","#ccc","#bbb"].some(x=>bg.startsWith(x.slice(0,4)))?"#000":"#fff" }; }
function Avatar({emp,size=32}){ const{bg,fg}=gc(emp.id); return <div className="rounded-full flex items-center justify-center font-bold flex-shrink-0" style={{width:size,height:size,backgroundColor:bg,color:fg,fontFamily:"system-ui,sans-serif",fontSize:size<28?10:size<44?12:18}}>{emp.avatar}</div>; }
function fmt(n){ return "$"+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}); }
function periodsPerYear(freq){ return freq==="Monthly"?12:freq==="Semi-monthly"?24:26; }
function gross(emp){ return emp.salary/periodsPerYear(emp.payFreq); }
// Returns a full deduction breakdown object for an employee
function calcDeductions(emp, cfg) {
  const g       = gross(emp);
  const periods = periodsPerYear(emp.payFreq);
  const isContractual = emp.empType === "Contractual";
  const isPartTime    = emp.empType === "Part-time";
  const isCustom      = emp.empType === "Custom";
  const ov            = emp.deductOverrides || {};

  // Tax: exempt employees pay nothing regardless of their tax rate
  const taxAmt = emp.taxExempt ? 0 : g * (emp.tax / 100);

  // Statutory: Contractual = none, Part-time = prorated at 0.5, Custom = per override, Regular = full
  function statutoryAmt(key) {
    const globalOn = cfg[key]?.enabled;
    if (!globalOn) return 0;
    if (isContractual) return 0;
    if (isCustom && !ov[key]) return 0;
    const raw = g * (cfg[key].rate / 100);
    const cap = cfg[key].cap / periods;
    const amt = Math.min(raw, cap);
    return isPartTime ? amt * 0.5 : amt;
  }

  const sssAmt  = statutoryAmt("sss");
  const philAmt = statutoryAmt("philhealth");
  const pagAmt  = statutoryAmt("pagibig");
  // Benefits: Contractual gets none, others full
  const benAmt  = isContractual ? 0 : emp.benefits / periods;

  return { g, taxAmt, sssAmt, philAmt, pagAmt, benAmt,
           net: g - taxAmt - sssAmt - philAmt - pagAmt - benAmt };
}
function calcNet(emp, cfg){ return calcDeductions(emp, cfg).net; }

// ── DEFAULT PAYROLL SETTINGS ──────────────────────────────────────────────────
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
const ESTATUS = { Active:{bg:"#0f1f0f",color:"#5af07a"}, "On Leave":{bg:"#1f1a0f",color:"#f0c85a"} };

// ── TOP NAV ───────────────────────────────────────────────────────────────────
function TopNav({active,setActive}){
  return(
    <header className="border-b px-8 py-4 flex items-center justify-between flex-shrink-0" style={{backgroundColor:"#000",borderColor:"#222"}}>
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-sm bg-white flex items-center justify-center"><span className="text-black font-bold text-sm" style={{fontFamily:"monospace"}}>H</span></div>
          <span className="text-lg" style={{letterSpacing:"0.2em",textTransform:"uppercase"}}>Hera</span>
        </div>
        <nav className="flex gap-1">
          {NAV_ITEMS.map(item=>(
            <button key={item} onClick={()=>setActive(item)} className="px-4 py-1.5 rounded text-sm transition-all"
              style={{fontFamily:"system-ui,sans-serif",backgroundColor:active===item?"#fff":"transparent",color:active===item?"#000":"#666",fontWeight:active===item?600:400}}>
              {item}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-gray-500 hover:text-white">
          <span className="text-xl">🔔</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs text-black bg-white flex items-center justify-center font-bold" style={{fontFamily:"monospace"}}>3</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">AK</div>
      </div>
    </header>
  );
}

// ── RUN PAYROLL MODAL ─────────────────────────────────────────────────────────
function RunPayrollModal({ onClose, onConfirm }) {
  const [step, setStep] = useState(1); // 1=config 2=review 3=success
  const [period, setPeriod]   = useState("Feb 16 – Feb 28, 2026");
  const [payDate, setPayDate] = useState("Mar 14, 2026");
  const [type, setType]       = useState("Bi-weekly");
  const [holds, setHolds]     = useState([]);

  const eligible = EMPLOYEES.filter(e => e.status === "Active");
  const totalGross = eligible.reduce((s,e)=>s+gross(e),0);
  const totalNet   = eligible.reduce((s,e)=>s+calcNet(e, DEFAULT_SETTINGS),0);
  const totalTax   = eligible.reduce((s,e)=>s+(gross(e)*(e.tax/100)),0);

  function toggleHold(id){ setHolds(h=>h.includes(id)?h.filter(x=>x!==id):[...h,id]); }

  return(
    <>
      <div className="fixed inset-0 z-40" style={{backgroundColor:"rgba(0,0,0,0.8)"}} onClick={step!==3?onClose:undefined}/>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl rounded-xl flex flex-col" style={{backgroundColor:"#0d0d0d",border:"1px solid #2a2a2a",maxHeight:"92vh"}}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 flex-shrink-0" style={{borderBottom:"1px solid #1e1e1e"}}>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-0.5" style={{fontFamily:"system-ui,sans-serif"}}>
                {step===1?"Configure":(step===2?"Review & Confirm":"Complete")} · Step {step} of 3
              </p>
              <h2 className="text-lg font-normal text-white">Run Payroll</h2>
            </div>
            {step!==3&&<button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>}
          </div>

          {/* Progress bar */}
          <div className="h-0.5 w-full" style={{backgroundColor:"#1a1a1a"}}>
            <div className="h-full bg-white transition-all" style={{width:`${(step/3)*100}%`}}/>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">

            {step===1&&(
              <div className="px-6 py-5 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Pay Period</label>
                    <input className={IC} style={IS} value={period} onChange={e=>setPeriod(e.target.value)}/>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Pay Date</label>
                    <input className={IC} style={IS} value={payDate} onChange={e=>setPayDate(e.target.value)}/>
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Payroll Type</label>
                  <div className="flex gap-2">
                    {["Bi-weekly","Semi-monthly","Monthly","All"].map(t=>(
                      <button key={t} onClick={()=>setType(t)}
                        className="px-3 py-2 rounded text-sm transition-all"
                        style={{fontFamily:"system-ui,sans-serif",backgroundColor:type===t?"#fff":"#111",color:type===t?"#000":"#666",border:type===t?"none":"1px solid #2a2a2a"}}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs uppercase tracking-widest text-gray-500" style={{fontFamily:"system-ui,sans-serif"}}>Hold Employees</label>
                    <span className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>Toggle to exclude from this run</span>
                  </div>
                  <div className="rounded-lg overflow-hidden" style={{border:"1px solid #1e1e1e"}}>
                    {eligible.map((emp,i)=>(
                      <div key={emp.id} className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white hover:bg-opacity-5"
                        style={{borderBottom:i<eligible.length-1?"1px solid #141414":"none"}}
                        onClick={()=>toggleHold(emp.id)}>
                        <div className="flex items-center gap-3">
                          <Avatar emp={emp} size={30}/>
                          <div>
                            <p className="text-gray-200 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{emp.name}</p>
                            <p className="text-gray-600 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{emp.role} · {fmt(gross(emp))}/period</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {holds.includes(emp.id)&&<span className="text-xs px-2 py-0.5 rounded" style={{backgroundColor:"#1f0f0f",color:"#f05a5a",fontFamily:"system-ui,sans-serif"}}>On Hold</span>}
                          <div className="w-10 h-5 rounded-full transition-all relative" style={{backgroundColor:holds.includes(emp.id)?"#f05a5a22":"#2a2a2a"}}>
                            <div className="w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all" style={{left:holds.includes(emp.id)?"calc(100% - 18px)":"2px",backgroundColor:holds.includes(emp.id)?"#f05a5a":"#666"}}/>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step===2&&(
              <div className="px-6 py-5 space-y-5">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {label:"Employees",    value: eligible.length - holds.length,  color:"#fff",  mono:false},
                    {label:"Total Gross",  value: fmt(totalGross),                  color:"#fff",  mono:true},
                    {label:"Total Net",    value: fmt(totalNet),                    color:"#5af07a",mono:true},
                    {label:"Tax Withheld", value: fmt(totalTax),                    color:"#f0c85a",mono:true},
                    {label:"Pay Date",     value: payDate,                           color:"#aaa",  mono:false},
                    {label:"Period",       value: period,                            color:"#aaa",  mono:false},
                  ].map(({label,value,color,mono})=>(
                    <div key={label} className="rounded-lg p-3" style={{backgroundColor:"#111",border:"1px solid #1e1e1e"}}>
                      <p className="text-xs uppercase tracking-widest text-gray-600 mb-1" style={{fontFamily:"system-ui,sans-serif"}}>{label}</p>
                      <p className="text-sm font-medium" style={{fontFamily:mono?"monospace":"system-ui,sans-serif",color}}>{value}</p>
                    </div>
                  ))}
                </div>

                {holds.length>0&&(
                  <div className="rounded-lg p-4" style={{backgroundColor:"#1f0f0f",border:"1px solid #3a1515"}}>
                    <p className="text-xs text-red-400 mb-1" style={{fontFamily:"system-ui,sans-serif"}}>⚠ {holds.length} employee{holds.length>1?"s":""} on hold</p>
                    <p className="text-xs text-gray-500" style={{fontFamily:"system-ui,sans-serif"}}>{EMPLOYEES.filter(e=>holds.includes(e.id)).map(e=>e.name).join(", ")} will not receive payment in this run.</p>
                  </div>
                )}

                {/* Per-employee breakdown */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-3" style={{fontFamily:"system-ui,sans-serif"}}>Breakdown by Employee</p>
                  <div className="rounded-lg overflow-hidden" style={{border:"1px solid #1e1e1e"}}>
                    <table className="w-full text-sm">
                      <thead><tr style={{backgroundColor:"#0a0a0a",borderBottom:"1px solid #1e1e1e"}}>
                        {["Employee","Gross","Tax","Benefits","Net",""].map(h=>(
                          <th key={h} className="px-4 py-2.5 text-left font-normal text-gray-600" style={{fontFamily:"system-ui,sans-serif",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {eligible.map((emp,i)=>{
                          const g=gross(emp), t=g*(emp.tax/100), b=emp.benefits/( emp.payFreq==="Monthly"?12 : emp.payFreq==="Semi-monthly"?24:26 ), n=g-t-b;
                          const held=holds.includes(emp.id);
                          return(
                            <tr key={emp.id} style={{borderBottom:i<eligible.length-1?"1px solid #141414":"none",backgroundColor:"#0d0d0d",opacity:held?0.4:1}}>
                              <td className="px-4 py-2.5"><div className="flex items-center gap-2"><Avatar emp={emp} size={24}/><span className="text-gray-200 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{emp.name}</span></div></td>
                              <td className="px-4 py-2.5 text-gray-300 text-xs" style={{fontFamily:"monospace"}}>{fmt(g)}</td>
                              <td className="px-4 py-2.5 text-yellow-400 text-xs" style={{fontFamily:"monospace",color:"#f0c85a"}}>-{fmt(t)}</td>
                              <td className="px-4 py-2.5 text-xs" style={{fontFamily:"monospace",color:"#888"}}>-{fmt(b)}</td>
                              <td className="px-4 py-2.5 text-xs font-medium" style={{fontFamily:"monospace",color:"#5af07a"}}>{fmt(n)}</td>
                              <td className="px-4 py-2.5">{held&&<span className="text-xs px-1.5 py-0.5 rounded" style={{backgroundColor:"#1f0f0f",color:"#f05a5a",fontFamily:"system-ui,sans-serif"}}>Hold</span>}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {step===3&&(
              <div className="px-6 py-10 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{backgroundColor:"#0f1f0f",border:"1px solid #2a4a2a"}}>✅</div>
                <div>
                  <h3 className="text-xl font-normal text-white mb-1">Payroll Scheduled</h3>
                  <p className="text-gray-400 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>
                    Payroll run <strong className="text-white">PR-2026-05</strong> has been created for <strong className="text-white">{period}</strong>.
                  </p>
                  <p className="text-gray-500 text-sm mt-1" style={{fontFamily:"system-ui,sans-serif"}}>
                    {eligible.length - holds.length} employees · Pay date {payDate}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-2">
                  {[["Total Gross",fmt(totalGross),"#fff"],["Net Payout",fmt(totalNet),"#5af07a"]].map(([l,v,c])=>(
                    <div key={l} className="rounded-lg p-3 text-center" style={{backgroundColor:"#111",border:"1px solid #1e1e1e"}}>
                      <p className="text-xs text-gray-600 mb-1" style={{fontFamily:"system-ui,sans-serif"}}>{l}</p>
                      <p className="text-sm font-medium" style={{fontFamily:"monospace",color:c}}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{borderTop:"1px solid #1e1e1e"}}>
            {step===3?(
              <button onClick={onConfirm} className="w-full py-2.5 rounded text-sm font-medium bg-white text-black hover:opacity-80" style={{fontFamily:"system-ui,sans-serif"}}>
                Done
              </button>
            ):(
              <>
                <button onClick={step===1?onClose:()=>setStep(s=>s-1)} className="px-4 py-2 rounded text-sm hover:opacity-80" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a"}}>
                  {step===1?"Cancel":"← Back"}
                </button>
                <button onClick={()=>setStep(s=>s+1)} className="px-5 py-2 rounded text-sm font-medium bg-white text-black hover:opacity-80" style={{fontFamily:"system-ui,sans-serif"}}>
                  {step===1?"Review →":"Confirm & Schedule"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── CUTOFF ADJUSTMENT MODAL ──────────────────────────────────────────────────
// Per-employee, per-cutoff one-time overrides. Salary/packages managed in People page.
const BONUS_REASONS  = ["Performance bonus","Sales incentive","Project completion","Referral bonus","Anniversary bonus","Signing bonus","Prorated joining (partial period)","Other"];
const DEDUCT_REASONS = ["Salary advance repayment","Late / absence deduction","Equipment damage","Loan repayment","Cash advance","Uniform / ID fee","Prorated exit (partial period)","Other"];

function CutoffEditModal({ emp, cutoffAdj, onClose, onSave }) {
  const [adj, setAdj] = useState(cutoffAdj ? JSON.parse(JSON.stringify(cutoffAdj)) : { proratedSalary: null, adjustments: [] });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type:"bonus", amount:"", reason:"", customReason:"", addedBy:"Admin" });

  const periods = emp.payFreq === "Monthly" ? 12 : emp.payFreq === "Semi-monthly" ? 24 : 26;
  const baseSalary = emp.salary;
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
                ["Annual Salary", "$"+Number(emp.salary).toLocaleString()],
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

// ── PAYROLL PAGE ──────────────────────────────────────────────────────────────
export default function PayrollPageii() {
  const [activeNav,    setActiveNav]    = useState("Payroll");
  const [activeTab,    setActiveTab]    = useState("overview");
  const [showRunModal, setShowRunModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings,     setSettings]     = useState(DEFAULT_SETTINGS);
  const [editEmp,      setEditEmp]      = useState(null);
  const [payslipData,  setPayslipData]  = useState(null); // {emp, run}
  const [employees,    setEmployees]    = useState(EMPLOYEES);
  const [cutoffAdjs,   setCutoffAdjs]   = useState({}); // per-emp cutoff overrides keyed by emp.id
  const [runs,         setRuns]         = useState(PAYROLL_RUNS);
  const [search,       setSearch]       = useState("");
  const [deptFilter,   setDeptFilter]   = useState("All");

  const totalPayroll  = employees.reduce((s,e)=>s+e.salary,0);
  const avgSalary     = totalPayroll / employees.length;
  const nextRun       = runs.find(r=>r.status==="Scheduled");
  const lastRun       = runs.find(r=>r.status==="Processed");

  const DEPTS = ["All","Engineering","Sales","Product","Design","Operations","Marketing","HR & Admin"];
  const filtered = useMemo(()=>employees.filter(e=>{
    const q=search.toLowerCase();
    return(!q||e.name.toLowerCase().includes(q)||e.role.toLowerCase().includes(q))
      &&(deptFilter==="All"||e.dept===deptFilter);
  }),[employees,search,deptFilter]);

  function handleSave(updated){ setEmployees(p=>p.map(e=>e.id===updated.id?updated:e)); }
  function getCutoffAdj(id){ return cutoffAdjs[id] || { proratedSalary: null, adjustments: [] }; }

  const TABS = [
    {key:"overview",  label:"Overview"},
    {key:"runs",      label:"Payroll Runs"},
    {key:"employees", label:"Compensation"},
    {key:"tax",       label:"Tax & Deductions"},
  ];

  return(
    <div className="min-h-screen text-white flex flex-col" style={{fontFamily:"'Georgia',serif",backgroundColor:"#000"}}>
      {/* <TopNav active={activeNav} setActive={setActiveNav}/> */}

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Page header */}
        <div className="px-8 pt-8 pb-0 flex-shrink-0">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-gray-600 text-xs uppercase tracking-widest mb-1" style={{fontFamily:"system-ui,sans-serif"}}>Payroll</p>
              <h1 className="text-3xl font-normal" style={{letterSpacing:"-0.02em"}}>Payroll Management</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>setShowSettings(true)} className="w-10 h-10 rounded flex items-center justify-center hover:opacity-80 transition-opacity" style={{backgroundColor:"#111",border:"1px solid #2a2a2a"}} title="Payroll Settings">
                <span style={{fontSize:16}}>⚙️</span>
              </button>
              <button onClick={()=>setShowRunModal(true)} className="px-5 py-2.5 rounded text-sm font-medium bg-white text-black hover:opacity-80 flex items-center gap-2" style={{fontFamily:"system-ui,sans-serif"}}>
                ▶ Run Payroll
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              {label:"Total Annual Payroll", value:fmt(totalPayroll),        sub:"All active employees",      color:"#fff"},
              {label:"Avg. Salary",          value:fmt(avgSalary),           sub:"Across all departments",    color:"#fff"},
              {label:"Next Pay Date",        value:nextRun?.payDate||"—",    sub:nextRun?.period||"",         color:"#5a9af0"},
              {label:"Last Run",             value:fmt(lastRun?.total||0),   sub:lastRun?.period||"",         color:"#5af07a"},
            ].map(({label,value,sub,color})=>(
              <div key={label} className="rounded-lg p-5" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
                <p className="text-xs uppercase tracking-widest text-gray-600 mb-2" style={{fontFamily:"system-ui,sans-serif"}}>{label}</p>
                <p className="text-xl font-light mb-0.5" style={{fontFamily:"monospace",color}}>{value}</p>
                <p className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {TABS.map(t=>(
              <button key={t.key} onClick={()=>setActiveTab(t.key)} className="px-4 py-2 text-sm transition-all"
                style={{fontFamily:"system-ui,sans-serif",color:activeTab===t.key?"#fff":"#555",borderBottom:activeTab===t.key?"2px solid #fff":"2px solid transparent"}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">

          {/* ── OVERVIEW ── */}
          {activeTab==="overview"&&(
            <div className="grid grid-cols-3 gap-6">
              {/* Dept breakdown */}
              <div className="col-span-2 rounded-lg p-5" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
                <h3 className="text-sm font-normal text-white mb-5">Payroll by Department</h3>
                <div className="space-y-4">
                  {Object.entries(
                    employees.reduce((acc,e)=>{
                      if(!acc[e.dept]) acc[e.dept]={total:0,count:0};
                      acc[e.dept].total+=e.salary; acc[e.dept].count+=1; return acc;
                    },{})
                  ).sort((a,b)=>b[1].total-a[1].total).map(([dept,{total,count}])=>(
                    <div key={dept}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-200 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{dept}</span>
                          <span className="text-gray-600 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{count} employee{count>1?"s":""}</span>
                        </div>
                        <span className="text-gray-300 text-sm" style={{fontFamily:"monospace"}}>{fmt(total)}</span>
                      </div>
                      <div className="h-2 rounded-full" style={{backgroundColor:"#1e1e1e"}}>
                        <div className="h-full rounded-full bg-white transition-all" style={{width:`${(total/totalPayroll)*100}%`,opacity:0.7}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right col */}
              <div className="space-y-5">
                {/* Recent runs */}
                <div className="rounded-lg p-5" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
                  <h3 className="text-sm font-normal text-white mb-4">Recent Runs</h3>
                  <div className="space-y-3">
                    {runs.slice(0,4).map(r=>(
                      <div key={r.id} className="flex items-center justify-between py-2" style={{borderBottom:"1px solid #1a1a1a"}}>
                        <div>
                          <p className="text-gray-200 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{r.period}</p>
                          <p className="text-gray-600 text-xs" style={{fontFamily:"monospace"}}>{r.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-300 text-xs" style={{fontFamily:"monospace"}}>{fmt(r.total)}</p>
                          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{fontFamily:"system-ui,sans-serif",...BADGE[r.status]}}>{r.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pay freq breakdown */}
                <div className="rounded-lg p-5" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
                  <h3 className="text-sm font-normal text-white mb-4">Pay Frequency</h3>
                  {["Bi-weekly","Monthly","Semi-monthly"].map(freq=>{
                    const count = employees.filter(e=>e.payFreq===freq).length;
                    return(
                      <div key={freq} className="flex justify-between py-2" style={{borderBottom:"1px solid #1a1a1a"}}>
                        <span className="text-gray-400 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{freq}</span>
                        <span className="text-gray-300 text-sm" style={{fontFamily:"monospace"}}>{count} emp.</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── PAYROLL RUNS ── */}
          {activeTab==="runs"&&(
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-normal text-white">All Payroll Runs</h3>
                <button onClick={()=>setShowRunModal(true)} className="px-3 py-1.5 rounded text-xs bg-white text-black hover:opacity-80" style={{fontFamily:"system-ui,sans-serif"}}>▶ New Run</button>
              </div>
              <div className="rounded-lg overflow-hidden" style={{border:"1px solid #1e1e1e"}}>
                <table className="w-full text-sm">
                  <thead><tr style={{backgroundColor:"#0a0a0a",borderBottom:"1px solid #1e1e1e"}}>
                    {["Run ID","Period","Pay Date","Type","Headcount","Total Payout","Status",""].map(h=>(
                      <th key={h} className="px-4 py-3 text-left font-normal text-gray-600" style={{fontFamily:"system-ui,sans-serif",fontSize:11,textTransform:"uppercase",letterSpacing:"0.07em"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {runs.map((r,i)=>(
                      <tr key={r.id} className="group transition-colors"
                        style={{borderBottom:"1px solid #141414",backgroundColor:"#0d0d0d"}}
                        onMouseEnter={e=>e.currentTarget.style.backgroundColor="#111"}
                        onMouseLeave={e=>e.currentTarget.style.backgroundColor="#0d0d0d"}>
                        <td className="px-4 py-3 text-gray-400 text-xs" style={{fontFamily:"monospace"}}>{r.id}</td>
                        <td className="px-4 py-3 text-gray-200 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{r.period}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs" style={{fontFamily:"monospace"}}>{r.payDate}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{r.type}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs" style={{fontFamily:"monospace"}}>{r.headcount}</td>
                        <td className="px-4 py-3 text-gray-200 text-sm" style={{fontFamily:"monospace"}}>{fmt(r.total)}</td>
                        <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{fontFamily:"system-ui,sans-serif",...BADGE[r.status]}}>{r.status}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-xs px-2 py-1 rounded hover:opacity-80" style={{backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a",fontFamily:"system-ui,sans-serif"}}>View</button>
                            <button className="text-xs px-2 py-1 rounded hover:opacity-80" style={{backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a",fontFamily:"system-ui,sans-serif"}}>↓</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── COMPENSATION ── */}
          {activeTab==="employees"&&(
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
                  <input className="w-full pl-9 pr-4 py-2 rounded text-sm text-white placeholder-gray-600 outline-none" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",border:"1px solid #2a2a2a"}} placeholder="Search employees…" value={search} onChange={e=>setSearch(e.target.value)}/>
                </div>
                <select className="px-3 py-2 rounded text-sm text-gray-300 outline-none cursor-pointer" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",border:"1px solid #2a2a2a"}} value={deptFilter} onChange={e=>setDeptFilter(e.target.value)}>
                  {DEPTS.map(d=><option key={d}>{d==="All"?"All Departments":d}</option>)}
                </select>
                <div className="flex-1"/>
                <span className="text-gray-600 text-sm" style={{fontFamily:"monospace"}}>{filtered.length} employees</span>
              </div>

              <div className="rounded-lg overflow-hidden" style={{border:"1px solid #1e1e1e"}}>
                <table className="w-full text-sm">
                  <thead><tr style={{backgroundColor:"#0a0a0a",borderBottom:"1px solid #1e1e1e"}}>
                    {["Employee","Type","Department","Annual Salary","Pay Freq.","Per Period (Gross)","Tax Rate","Net/Period","Cutoff Adj.","Status",""].map(h=>(
                      <th key={h} className="px-4 py-3 text-left font-normal text-gray-600" style={{fontFamily:"system-ui,sans-serif",fontSize:10,textTransform:"uppercase",letterSpacing:"0.07em",whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filtered.map((emp,i)=>{
                      const d = calcDeductions(emp, settings);
                      const typeColors = {Regular:"#5af07a",Contractual:"#f0c85a","Part-time":"#5a9af0",Custom:"#aaaaaa"};
                      const tc = typeColors[emp.empType] || "#aaa";
                      return(
                        <tr key={emp.id} className="group transition-colors"
                          style={{borderBottom:"1px solid #141414",backgroundColor:"#0d0d0d"}}
                          onMouseEnter={e=>e.currentTarget.style.backgroundColor="#111"}
                          onMouseLeave={e=>e.currentTarget.style.backgroundColor="#0d0d0d"}>
                          <td className="px-4 py-3"><div className="flex items-center gap-3"><Avatar emp={emp} size={30}/><div><p className="text-white text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{emp.name}</p><p className="text-gray-500 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{emp.role}</p></div></div></td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs px-1.5 py-0.5 rounded w-fit" style={{fontFamily:"system-ui,sans-serif",backgroundColor:tc+"22",color:tc}}>{emp.empType}</span>
                              {emp.taxExempt&&<span className="text-xs px-1.5 py-0.5 rounded w-fit" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#1a0a1a",color:"#c07af0"}}>Tax Exempt</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{emp.dept}</td>
                          <td className="px-4 py-3 text-gray-200 text-sm" style={{fontFamily:"monospace"}}>{fmt(emp.salary)}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{emp.payFreq}</td>
                          <td className="px-4 py-3 text-gray-300 text-xs" style={{fontFamily:"monospace"}}>{fmt(d.g)}</td>
                          <td className="px-4 py-3 text-xs" style={{fontFamily:"monospace",color:emp.taxExempt?"#c07af0":"#f0c85a"}}>{emp.taxExempt?"Exempt":`${emp.tax}%`}</td>
                          <td className="px-4 py-3 text-xs font-medium" style={{fontFamily:"monospace",color:"#5af07a"}}>{fmt(d.net)}</td>
                          <td className="px-4 py-3">
                            {(()=>{ const ca=cutoffAdjs[emp.id]; if(!ca||!ca.adjustments?.length) return <span className="text-gray-700 text-xs" style={{fontFamily:"monospace"}}>—</span>;
                              const b=ca.adjustments.filter(a=>a.type==="bonus").reduce((s,a)=>s+Number(a.amount),0);
                              const d2=ca.adjustments.filter(a=>a.type==="deduction").reduce((s,a)=>s+Number(a.amount),0);
                              return <span className="text-xs" style={{fontFamily:"monospace",color:b>=d2?"#5af07a":"#f05a5a"}}>{b>=d2?"+":""}{fmt(b-d2)}</span>;
                            })()}
                          </td>
                          <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{fontFamily:"system-ui,sans-serif",...ESTATUS[emp.status]}}>{emp.status}</span></td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={()=>setPayslipData({emp,run:lastRun})} className="text-xs px-2 py-1 rounded hover:opacity-80" style={{backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a",fontFamily:"system-ui,sans-serif"}}>Payslip</button>
                              <button onClick={()=>setEditEmp(emp)} className="text-xs px-2 py-1 rounded hover:opacity-80" style={{backgroundColor:cutoffAdjs[emp.id]?.adjustments?.length?"#0a1a0a":"#111",color:cutoffAdjs[emp.id]?.adjustments?.length?"#5af07a":"#aaa",border:`1px solid ${cutoffAdjs[emp.id]?.adjustments?.length?"#2a4a2a":"#2a2a2a"}`,fontFamily:"system-ui,sans-serif"}}>Adjust{cutoffAdjs[emp.id]?.adjustments?.length?` (${cutoffAdjs[emp.id].adjustments.length})`:""}</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CUTOFF ADJUSTMENTS SUMMARY ── */}
          {activeTab==="employees"&&(()=>{
            const allAdjs = employees.filter(e=>cutoffAdjs[e.id]?.adjustments?.length||cutoffAdjs[e.id]?.proratedSalary!==undefined&&cutoffAdjs[e.id]?.proratedSalary!==null);
            if(!allAdjs.length) return null;
            return(
              <div className="mt-5 rounded-lg p-5" style={{backgroundColor:"#0a1a0a",border:"1px solid #1e3a1e"}}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-normal text-white">Pending Cutoff Adjustments</h3>
                    <p className="text-xs text-gray-600 mt-0.5" style={{fontFamily:"system-ui,sans-serif"}}>These one-time items will be included in the next payroll run.</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{fontFamily:"monospace",backgroundColor:"#0f2a0f",color:"#5af07a"}}>{allAdjs.length} employee{allAdjs.length>1?"s":""}</span>
                </div>
                <div className="space-y-2">
                  {allAdjs.map(emp=>{
                    const ca=cutoffAdjs[emp.id];
                    const bonuses  = ca.adjustments.filter(a=>a.type==="bonus");
                    const deducts  = ca.adjustments.filter(a=>a.type==="deduction");
                    return(
                      <div key={emp.id} className="flex items-center justify-between px-4 py-3 rounded" style={{backgroundColor:"#111",border:"1px solid #1e3a1e"}}>
                        <div className="flex items-center gap-3">
                          <Avatar emp={emp} size={28}/>
                          <div>
                            <p className="text-sm text-gray-200" style={{fontFamily:"system-ui,sans-serif"}}>{emp.name}</p>
                            <p className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>
                              {ca.proratedSalary!==null?"Prorated · ":""}
                              {bonuses.length?`${bonuses.length} bonus${bonuses.length>1?"es":""}`:""}{bonuses.length&&deducts.length?", ":""}
                              {deducts.length?`${deducts.length} deduction${deducts.length>1?"s":""}`:""}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {bonuses.length>0&&<span className="text-xs" style={{fontFamily:"monospace",color:"#5af07a"}}>+{fmt(bonuses.reduce((s,a)=>s+Number(a.amount),0))}</span>}
                          {deducts.length>0&&<span className="text-xs" style={{fontFamily:"monospace",color:"#f05a5a"}}>-{fmt(deducts.reduce((s,a)=>s+Number(a.amount),0))}</span>}
                          <button onClick={()=>setEditEmp(emp)} className="text-xs px-2 py-1 rounded hover:opacity-80" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#1a3a1a",color:"#5af07a",border:"1px solid #2a4a2a"}}>Edit</button>
                          <button onClick={()=>setCutoffAdjs(m=>({...m,[emp.id]:{proratedSalary:null,adjustments:[]}}))} className="text-xs px-2 py-1 rounded hover:opacity-80 text-gray-600 hover:text-red-400" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#1a1a1a",border:"1px solid #2a2a2a"}}>Clear</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ── TAX & DEDUCTIONS ── */}
          {activeTab==="tax"&&(
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-5">
                <div className="rounded-lg p-5" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
                  <h3 className="text-sm font-normal text-white mb-5">Tax & Deductions by Employee</h3>
                  <div className="rounded-lg overflow-hidden" style={{border:"1px solid #1e1e1e"}}>
                    <table className="w-full text-sm">
                      <thead><tr style={{backgroundColor:"#0a0a0a",borderBottom:"1px solid #1e1e1e"}}>
                        {["Employee","Gross/Period","Fed. Tax","Soc. Sec.","Medicare","Benefits","Net/Period"].map(h=>(
                          <th key={h} className="px-4 py-2.5 text-left font-normal text-gray-600" style={{fontFamily:"system-ui,sans-serif",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {employees.map((emp,i)=>{
                          const g=gross(emp);
                          const ss=g*0.062, med=g*0.0145;
                          const fedTax=g*(emp.tax/100)-ss-med;
                          const ben=emp.benefits/(emp.payFreq==="Monthly"?12:emp.payFreq==="Semi-monthly"?24:26);
                          const n=g-fedTax-ss-med-ben;
                          return(
                            <tr key={emp.id} style={{borderBottom:i<employees.length-1?"1px solid #141414":"none",backgroundColor:"#0d0d0d"}}>
                              <td className="px-4 py-2.5"><div className="flex items-center gap-2"><Avatar emp={emp} size={24}/><span className="text-gray-200 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{emp.name}</span></div></td>
                              <td className="px-4 py-2.5 text-gray-300 text-xs" style={{fontFamily:"monospace"}}>{fmt(g)}</td>
                              <td className="px-4 py-2.5 text-xs" style={{fontFamily:"monospace",color:"#f0c85a"}}>{fmt(fedTax)}</td>
                              <td className="px-4 py-2.5 text-xs" style={{fontFamily:"monospace",color:"#f0c85a"}}>{fmt(ss)}</td>
                              <td className="px-4 py-2.5 text-xs" style={{fontFamily:"monospace",color:"#f0c85a"}}>{fmt(med)}</td>
                              <td className="px-4 py-2.5 text-xs" style={{fontFamily:"monospace",color:"#888"}}>{fmt(ben)}</td>
                              <td className="px-4 py-2.5 text-xs font-medium" style={{fontFamily:"monospace",color:"#5af07a"}}>{fmt(n)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Tax summary */}
              <div className="space-y-5">
                <div className="rounded-lg p-5" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
                  <h3 className="text-sm font-normal text-white mb-4">Company Tax Summary · Per Period</h3>
                  {(()=>{
                    const totals = employees.reduce((acc,e)=>{
                      const g=gross(e), ss=g*0.062, med=g*0.0145;
                      const fed=g*(e.tax/100)-ss-med, ben=e.benefits/(e.payFreq==="Monthly"?12:e.payFreq==="Semi-monthly"?24:26);
                      acc.gross+=g; acc.fed+=fed; acc.ss+=ss; acc.med+=med; acc.ben+=ben; acc.net+=g-fed-ss-med-ben;
                      return acc;
                    },{gross:0,fed:0,ss:0,med:0,ben:0,net:0});
                    return[
                      {label:"Total Gross",     value:fmt(totals.gross), color:"#fff"},
                      {label:"Federal Tax",     value:fmt(totals.fed),   color:"#f0c85a"},
                      {label:"Social Security", value:fmt(totals.ss),    color:"#f0c85a"},
                      {label:"Medicare",        value:fmt(totals.med),   color:"#f0c85a"},
                      {label:"Benefits",        value:fmt(totals.ben),   color:"#888"},
                      {label:"Total Net",       value:fmt(totals.net),   color:"#5af07a"},
                    ].map(({label,value,color})=>(
                      <div key={label} className="flex justify-between py-2.5" style={{borderBottom:"1px solid #1a1a1a"}}>
                        <span className="text-gray-500 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{label}</span>
                        <span className="text-sm" style={{fontFamily:"monospace",color}}>{value}</span>
                      </div>
                    ));
                  })()}
                </div>

                <div className="rounded-lg p-4" style={{backgroundColor:"#0a0a0a",border:"1px solid #1e1e1e"}}>
                  <p className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>
                    📋 Tax rates are estimates based on employee-set withholding. Actual amounts may vary by jurisdiction. Consult your tax advisor for accurate filings.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {showRunModal&&<RunPayrollModal onClose={()=>setShowRunModal(false)} onConfirm={()=>setShowRunModal(false)}/>}
      {showSettings&&<PayrollSettingsDrawer settings={settings} onSave={s=>{setSettings(s);setShowSettings(false);}} onClose={()=>setShowSettings(false)}/>}
      {editEmp&&<CutoffEditModal emp={editEmp} cutoffAdj={cutoffAdjs[editEmp.id]} onClose={()=>setEditEmp(null)} onSave={adj=>{setCutoffAdjs(m=>({...m,[editEmp.id]:adj}));setEditEmp(null);}}/>}
      {payslipData&&<PayslipModal emp={payslipData.emp} run={payslipData.run} onClose={()=>setPayslipData(null)}/>}
    </div>
  );
}
