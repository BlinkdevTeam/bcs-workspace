import { useState, useMemo } from "react";

// ── SEED DATA ─────────────────────────────────────────────────────────────────
const EMPLOYEES = [
  { id:1,  name:"Sara Okafor",      avatar:"SO", dept:"Engineering", role:"Senior Engineer",   status:"Active"   },
  { id:2,  name:"Marcus Chen",      avatar:"MC", dept:"Sales",       role:"Account Executive", status:"Active"   },
  { id:3,  name:"Priya Nair",       avatar:"PN", dept:"Product",     role:"Product Manager",   status:"Active"   },
  { id:4,  name:"James Kowalski",   avatar:"JK", dept:"Engineering", role:"DevOps Engineer",   status:"Active"   },
  { id:5,  name:"Leila Farouk",     avatar:"LF", dept:"Product",     role:"Senior PM",         status:"Active"   },
  { id:6,  name:"Devon Park",       avatar:"DP", dept:"Engineering", role:"VP Engineering",    status:"Active"   },
  { id:7,  name:"Rita Vance",       avatar:"RV", dept:"Sales",       role:"Sales Director",    status:"Active"   },
  { id:8,  name:"Tomás Rivera",     avatar:"TR", dept:"Design",      role:"UX Designer",       status:"Active"   },
  { id:9,  name:"Ananya Bose",      avatar:"AB", dept:"Operations",  role:"Data Analyst",      status:"On Leave" },
  { id:10, name:"Chris Mendez",     avatar:"CM", dept:"HR & Admin",  role:"HR Specialist",     status:"Active"   },
  { id:11, name:"Fatima Al-Hassan", avatar:"FA", dept:"Engineering", role:"Frontend Engineer", status:"Active"   },
  { id:12, name:"Noah Kim",         avatar:"NK", dept:"Marketing",   role:"Marketing Manager", status:"Active"   },
];

// Attendance records — today's status per employee
const ATTENDANCE_TODAY = [
  { empId:1,  status:"Present",  timeIn:"8:52 AM",  breakOut:"12:05 PM", breakIn:"12:58 PM", timeOut:null,       hours:null, breakFlag:null },
  { empId:2,  status:"Remote",   timeIn:"9:10 AM",  breakOut:"12:00 PM", breakIn:"1:00 PM",  timeOut:null,       hours:null, breakFlag:null },
  { empId:3,  status:"Present",  timeIn:"9:01 AM",  breakOut:"12:10 PM", breakIn:"1:25 PM",  timeOut:null,       hours:null, breakFlag:"exceeded" },
  { empId:4,  status:"Late",     timeIn:"10:23 AM", breakOut:null,       breakIn:null,        timeOut:null,       hours:null, breakFlag:null },
  { empId:5,  status:"Present",  timeIn:"8:45 AM",  breakOut:"12:00 PM", breakIn:"12:55 PM", timeOut:null,       hours:null, breakFlag:null },
  { empId:6,  status:"Present",  timeIn:"8:30 AM",  breakOut:"11:45 AM", breakIn:"12:30 PM", timeOut:null,       hours:null, breakFlag:"early" },
  { empId:7,  status:"Remote",   timeIn:"9:00 AM",  breakOut:"12:00 PM", breakIn:"1:00 PM",  timeOut:null,       hours:null, breakFlag:null },
  { empId:8,  status:"Remote",   timeIn:"9:30 AM",  breakOut:null,       breakIn:null,        timeOut:null,       hours:null, breakFlag:null },
  { empId:9,  status:"On Leave", timeIn:null,        breakOut:null,       breakIn:null,        timeOut:null,       hours:null, breakFlag:null },
  { empId:10, status:"Present",  timeIn:"8:58 AM",  breakOut:"12:01 PM", breakIn:"12:59 PM", timeOut:null,       hours:null, breakFlag:null },
  { empId:11, status:"Remote",   timeIn:"9:15 AM",  breakOut:"12:00 PM", breakIn:"1:10 PM",  timeOut:null,       hours:null, breakFlag:"exceeded" },
  { empId:12, status:"Absent",   timeIn:null,        breakOut:null,       breakIn:null,        timeOut:null,       hours:null, breakFlag:null },
];

// Leave requests
const LEAVE_REQUESTS_SEED = [
  { id:1,  empId:9,  type:"Sick Leave",    from:"Mar 1, 2026",  to:"Mar 5, 2026",  days:5, reason:"Medical procedure and recovery",          status:"Approved",  appliedOn:"Feb 25, 2026" },
  { id:2,  empId:4,  type:"Vacation Leave",from:"Mar 10, 2026", to:"Mar 12, 2026", days:3, reason:"Family trip",                              status:"Pending",   appliedOn:"Feb 28, 2026" },
  { id:3,  empId:12, type:"Vacation Leave",from:"Mar 15, 2026", to:"Mar 18, 2026", days:4, reason:"Personal travel",                          status:"Pending",   appliedOn:"Mar 1, 2026"  },
  { id:4,  empId:2,  type:"Emergency Leave",from:"Mar 3, 2026", to:"Mar 3, 2026",  days:1, reason:"Family emergency",                         status:"Approved",  appliedOn:"Mar 3, 2026"  },
  { id:5,  empId:7,  type:"Sick Leave",    from:"Mar 8, 2026",  to:"Mar 8, 2026",  days:1, reason:"Fever",                                    status:"Approved",  appliedOn:"Mar 7, 2026"  },
  { id:6,  empId:11, type:"Vacation Leave",from:"Mar 20, 2026", to:"Mar 24, 2026", days:5, reason:"Annual leave utilization",                 status:"Pending",   appliedOn:"Mar 2, 2026"  },
  { id:7,  empId:3,  type:"Maternity Leave",from:"Apr 1, 2026", to:"Jun 30, 2026", days:90,"reason":"Maternity leave",                        status:"Approved",  appliedOn:"Feb 20, 2026" },
  { id:8,  empId:5,  type:"Vacation Leave",from:"Mar 25, 2026", to:"Mar 26, 2026", days:2, reason:"Personal day",                             status:"Rejected",  appliedOn:"Feb 27, 2026" },
  { id:9,  empId:1,  type:"Sick Leave",    from:"Mar 6, 2026",  to:"Mar 6, 2026",  days:1, reason:"Not feeling well",                         status:"Pending",   appliedOn:"Mar 5, 2026"  },
  { id:10, empId:8,  type:"Vacation Leave",from:"Apr 5, 2026",  to:"Apr 9, 2026",  days:5, reason:"Holiday vacation",                         status:"Pending",   appliedOn:"Mar 1, 2026"  },
];

// Leave balances per employee
const LEAVE_BALANCES = [
  { empId:1,  annual:{total:15,used:3},  sick:{total:15,used:1},  emergency:{total:5,used:0} },
  { empId:2,  annual:{total:15,used:8},  sick:{total:15,used:2},  emergency:{total:5,used:1} },
  { empId:3,  annual:{total:20,used:10}, sick:{total:15,used:0},  emergency:{total:5,used:0} },
  { empId:4,  annual:{total:15,used:5},  sick:{total:15,used:3},  emergency:{total:5,used:0} },
  { empId:5,  annual:{total:20,used:18}, sick:{total:15,used:4},  emergency:{total:5,used:2} },
  { empId:6,  annual:{total:20,used:6},  sick:{total:15,used:1},  emergency:{total:5,used:0} },
  { empId:7,  annual:{total:20,used:12}, sick:{total:15,used:5},  emergency:{total:5,used:1} },
  { empId:8,  annual:{total:15,used:4},  sick:{total:15,used:0},  emergency:{total:5,used:0} },
  { empId:9,  annual:{total:15,used:7},  sick:{total:15,used:5},  emergency:{total:5,used:0} },
  { empId:10, annual:{total:15,used:2},  sick:{total:15,used:1},  emergency:{total:5,used:0} },
  { empId:11, annual:{total:15,used:9},  sick:{total:15,used:2},  emergency:{total:5,used:0} },
  { empId:12, annual:{total:15,used:14}, sick:{total:15,used:3},  emergency:{total:5,used:1} },
];

// OT/UT records — current month
const OT_UT_RECORDS = [
  { empId:1,  date:"Feb 24", type:"OT", hours:2.5, reason:"Sprint deadline",        status:"Approved" },
  { empId:4,  date:"Feb 25", type:"OT", hours:3.0, reason:"Server migration",       status:"Approved" },
  { empId:6,  date:"Feb 26", type:"OT", hours:4.0, reason:"Executive presentation", status:"Approved" },
  { empId:2,  date:"Feb 27", type:"OT", hours:1.5, reason:"Client call overrun",    status:"Pending"  },
  { empId:11, date:"Feb 28", type:"OT", hours:2.0, reason:"Bug fix deployment",     status:"Approved" },
  { empId:4,  date:"Mar 1",  type:"UT", hours:1.0, reason:"Late arrival",           status:"Flagged"  },
  { empId:12, date:"Mar 1",  type:"UT", hours:8.0, reason:"Unexcused absence",      status:"Flagged"  },
  { empId:8,  date:"Feb 20", type:"OT", hours:1.5, reason:"Design review",          status:"Approved" },
  { empId:3,  date:"Feb 22", type:"OT", hours:2.0, reason:"Product launch prep",    status:"Pending"  },
  { empId:7,  date:"Feb 23", type:"OT", hours:3.5, reason:"Quarterly close",        status:"Approved" },
  { empId:5,  date:"Feb 19", type:"UT", hours:0.5, reason:"Left early (approved)",  status:"Approved" },
  { empId:10, date:"Feb 28", type:"OT", hours:1.0, reason:"Audit support",          status:"Pending"  },
];

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const AV = ["#ffffff","#cccccc","#999999","#777777","#555555","#444444","#ffffff","#bbbbbb","#888888","#666666","#aaaaaa","#333333"];
function gc(id){ const bg=AV[id%AV.length]; return{ bg, fg:["#fff","#ddd","#eee","#ccc","#bbb"].some(x=>bg.startsWith(x.slice(0,4)))?"#000":"#fff" }; }
function Avatar({emp,size=32}){ const{bg,fg}=gc(emp.id); return <div className="rounded-full flex items-center justify-center font-bold flex-shrink-0" style={{width:size,height:size,backgroundColor:bg,color:fg,fontFamily:"system-ui,sans-serif",fontSize:size<28?10:size<44?12:18}}>{emp.avatar}</div>; }

const ATTENDANCE_STYLE = {
  Present:  { bg:"#0f1f0f", color:"#5af07a", dot:"#5af07a"  },
  Remote:   { bg:"#0a1a2a", color:"#5a9af0", dot:"#5a9af0"  },
  Late:     { bg:"#1f1a0f", color:"#f0c85a", dot:"#f0c85a"  },
  Absent:   { bg:"#1f0f0f", color:"#f05a5a", dot:"#f05a5a"  },
  "On Leave":{ bg:"#1a0f1a",color:"#c07af0", dot:"#c07af0"  },
};

const LEAVE_STATUS_STYLE = {
  Approved: { bg:"#0f1f0f", color:"#5af07a" },
  Pending:  { bg:"#1f1a0f", color:"#f0c85a" },
  Rejected: { bg:"#1f0f0f", color:"#f05a5a" },
};

const OT_STATUS_STYLE = {
  Approved: { bg:"#0f1f0f", color:"#5af07a" },
  Pending:  { bg:"#1f1a0f", color:"#f0c85a" },
  Flagged:  { bg:"#1f0f0f", color:"#f05a5a" },
};

const LEAVE_TYPES = ["All","Vacation Leave","Sick Leave","Emergency Leave","Maternity Leave","Paternity Leave"];
const DEPTS = ["All","Engineering","Sales","Product","Design","Operations","Marketing","HR & Admin"];

function fmt(n){ return n.toLocaleString("en-US",{minimumFractionDigits:1,maximumFractionDigits:1}); }

// ── STAT CARD ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color="#fff", accent=false }) {
  return (
    <div className="rounded-lg p-5" style={{ backgroundColor: accent?"#111":"#0d0d0d", border:`1px solid ${accent?"#2a2a2a":"#1e1e1e"}` }}>
      <p className="text-xs uppercase tracking-widest text-gray-600 mb-2" style={{ fontFamily:"system-ui,sans-serif" }}>{label}</p>
      <p className="text-2xl font-light mb-0.5" style={{ fontFamily:"monospace", color }}>{value}</p>
      {sub && <p className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>{sub}</p>}
    </div>
  );
}

// ── BALANCE BAR ───────────────────────────────────────────────────────────────
function BalanceBar({ label, used, total }) {
  const remaining = total - used;
  const pct = total > 0 ? (used / total) * 100 : 0;
  const color = pct >= 90 ? "#f05a5a" : pct >= 70 ? "#f0c85a" : "#5af07a";
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500" style={{ fontFamily:"system-ui,sans-serif" }}>{label}</span>
        <span className="text-xs" style={{ fontFamily:"monospace", color }}>{remaining} / {total} left</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ backgroundColor:"#1e1e1e" }}>
        <div className="h-full rounded-full transition-all" style={{ width:`${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ── OVERVIEW TAB ──────────────────────────────────────────────────────────────
function OverviewTab({ attendance, leaveRequests, otRecords, onApprove, onReject }) {
  const counts = {
    Present:   attendance.filter(a=>a.status==="Present").length,
    Remote:    attendance.filter(a=>a.status==="Remote").length,
    Late:      attendance.filter(a=>a.status==="Late").length,
    Absent:    attendance.filter(a=>a.status==="Absent").length,
    "On Leave":attendance.filter(a=>a.status==="On Leave").length,
  };

  const pending     = leaveRequests.filter(r=>r.status==="Pending");
  const otPending   = otRecords.filter(r=>r.status==="Pending");
  const otFlagged   = otRecords.filter(r=>r.status==="Flagged");
  const totalOTHrs  = otRecords.filter(r=>r.type==="OT"&&r.status==="Approved").reduce((s,r)=>s+r.hours,0);
  const totalUTHrs  = otRecords.filter(r=>r.type==="UT").reduce((s,r)=>s+r.hours,0);

  return (
    <div className="space-y-6">
      {/* Stat row */}
      <div className="grid grid-cols-5 gap-4">
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} className="rounded-lg p-4 flex flex-col gap-2" style={{ backgroundColor:"#0d0d0d", border:"1px solid #1e1e1e" }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ATTENDANCE_STYLE[status].dot }} />
              <span className="text-xs text-gray-500 uppercase tracking-widest" style={{ fontFamily:"system-ui,sans-serif" }}>{status}</span>
            </div>
            <p className="text-3xl font-light" style={{ fontFamily:"monospace", color: ATTENDANCE_STYLE[status].color }}>{count}</p>
            <p className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>of {EMPLOYEES.length} employees</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Pending leave requests */}
        <div className="col-span-2 rounded-lg p-5" style={{ backgroundColor:"#0d0d0d", border:"1px solid #1e1e1e" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-normal text-white">Pending Leave Requests</h3>
            {pending.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily:"monospace", backgroundColor:"#1f1a0f", color:"#f0c85a" }}>{pending.length} pending</span>
            )}
          </div>
          {pending.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2">
              <span className="text-3xl">✅</span>
              <p className="text-gray-500 text-sm" style={{ fontFamily:"system-ui,sans-serif" }}>All caught up — no pending requests</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pending.map(req => {
                const emp = EMPLOYEES.find(e=>e.id===req.empId);
                return (
                  <div key={req.id} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ backgroundColor:"#111", border:"1px solid #1e3a1e" }}>
                    <div className="flex items-center gap-3">
                      {emp && <Avatar emp={emp} size={30} />}
                      <div>
                        <p className="text-sm text-white" style={{ fontFamily:"system-ui,sans-serif" }}>{emp?.name}</p>
                        <p className="text-xs text-gray-500" style={{ fontFamily:"system-ui,sans-serif" }}>{req.type} · {req.from}{req.days > 1 ? ` → ${req.to}` : ""} · {req.days}d</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 mr-2" style={{ fontFamily:"system-ui,sans-serif" }}>Applied {req.appliedOn}</span>
                      <button onClick={() => onApprove(req.id)} className="px-3 py-1.5 rounded text-xs font-medium hover:opacity-80" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#0f2a0f", color:"#5af07a", border:"1px solid #2a4a2a" }}>Approve</button>
                      <button onClick={() => onReject(req.id)} className="px-3 py-1.5 rounded text-xs hover:opacity-80" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#1a1a1a", color:"#aaa", border:"1px solid #2a2a2a" }}>Reject</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* OT/UT summary + flags */}
        <div className="space-y-4">
          <div className="rounded-lg p-5" style={{ backgroundColor:"#0d0d0d", border:"1px solid #1e1e1e" }}>
            <h3 className="text-sm font-normal text-white mb-4">OT / UT · This Month</h3>
            <div className="space-y-3">
              {[
                ["Total OT Hours",  `${fmt(totalOTHrs)} hrs`, "#5af07a"],
                ["Total UT Hours",  `${fmt(totalUTHrs)} hrs`, "#f05a5a"],
                ["OT Pending",      `${otPending.length} requests`, "#f0c85a"],
                ["UT Flagged",      `${otFlagged.length} employees`, "#f05a5a"],
              ].map(([l,v,c]) => (
                <div key={l} className="flex justify-between py-2" style={{ borderBottom:"1px solid #1a1a1a" }}>
                  <span className="text-gray-500 text-sm" style={{ fontFamily:"system-ui,sans-serif" }}>{l}</span>
                  <span className="text-sm font-medium" style={{ fontFamily:"monospace", color:c }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Low balance warnings */}
          <div className="rounded-lg p-5" style={{ backgroundColor:"#1f0a0a", border:"1px solid #3a1515" }}>
            <h3 className="text-sm font-normal text-white mb-3">⚠ Low Leave Balance</h3>
            {LEAVE_BALANCES.filter(b => (b.annual.total - b.annual.used) <= 2).map(b => {
              const emp = EMPLOYEES.find(e=>e.id===b.empId);
              return (
                <div key={b.empId} className="flex items-center justify-between py-2" style={{ borderBottom:"1px solid #2a1515" }}>
                  <div className="flex items-center gap-2">
                    {emp && <Avatar emp={emp} size={24} />}
                    <span className="text-xs text-gray-300" style={{ fontFamily:"system-ui,sans-serif" }}>{emp?.name}</span>
                  </div>
                  <span className="text-xs" style={{ fontFamily:"monospace", color:"#f05a5a" }}>{b.annual.total - b.annual.used}d left</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Break window rule: 12:00 PM – 1:00 PM (in minutes from midnight)
const BREAK_WINDOW_START = 12 * 60;      // 720
const BREAK_WINDOW_END   = 13 * 60;      // 780
const BREAK_MAX_MINS     = 60;

function breakMinutes(breakOut, breakIn) {
  if (!breakOut || !breakIn) return null;
  return Math.round((parseTime(breakIn) - parseTime(breakOut)));
}

function breakFlags(breakOut, breakIn) {
  if (!breakOut && !breakIn) return [];
  const flags = [];
  const outMins = parseTime(breakOut);
  const inMins  = parseTime(breakIn);
  const dur     = inMins - outMins;
  if (outMins < BREAK_WINDOW_START) flags.push("early");       // clocked out before 12PM
  if (inMins  > BREAK_WINDOW_END)   flags.push("exceeded");    // came back after 1PM
  if (dur > BREAK_MAX_MINS)         flags.push("exceeded");    // duration > 60 min
  return [...new Set(flags)];
}

function breakDurLabel(breakOut, breakIn) {
  const mins = breakMinutes(breakOut, breakIn);
  if (mins === null) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// ── TIME CORRECTION MODAL ─────────────────────────────────────────────────────
const ATTENDANCE_STATUSES = ["Present","Remote","Late","Absent","On Leave"];

function TimeCorrectionModal({ emp, record, onClose, onSave }) {
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

// ── ATTENDANCE TAB ────────────────────────────────────────────────────────────
function AttendanceTab({ attendance, onCorrect }) {
  const [search,       setSearch]       = useState("");
  const [deptFilter,   setDeptFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [breakFilter,  setBreakFilter]  = useState("All"); // "All" | "Flagged"
  const [correcting,   setCorrecting]   = useState(null);

  const filtered = useMemo(() => {
    return EMPLOYEES.filter(emp => {
      const q = search.toLowerCase();
      const a = attendance.find(a => a.empId === emp.id);
      const flags = breakFlags(a?.breakOut, a?.breakIn);
      return (!q || emp.name.toLowerCase().includes(q) || emp.role.toLowerCase().includes(q))
        && (deptFilter   === "All" || emp.dept    === deptFilter)
        && (statusFilter === "All" || a?.status   === statusFilter)
        && (breakFilter  === "All" || flags.length > 0);
    });
  }, [search, deptFilter, statusFilter, breakFilter, attendance]);

  const flaggedCount = attendance.filter(a => breakFlags(a.breakOut, a.breakIn).length > 0).length;

  return (
    <>
      <div className="space-y-5">

        {/* Break flags banner */}
        {flaggedCount > 0 && (
          <div className="rounded-lg px-5 py-3 flex items-center justify-between" style={{ backgroundColor:"#1a0f0a", border:"1px solid #3a2010" }}>
            <div className="flex items-center gap-3">
              <span style={{ color:"#f0c85a" }}>⚠</span>
              <p className="text-sm" style={{ fontFamily:"system-ui,sans-serif", color:"#f0c85a" }}>
                {flaggedCount} employee{flaggedCount>1?"s":""} with break violations pending review
              </p>
            </div>
            <button onClick={() => setBreakFilter(f => f==="Flagged"?"All":"Flagged")}
              className="text-xs px-3 py-1.5 rounded hover:opacity-80 transition-all"
              style={{ fontFamily:"system-ui,sans-serif", backgroundColor: breakFilter==="Flagged"?"#f0c85a":"#111", color: breakFilter==="Flagged"?"#000":"#f0c85a", border:"1px solid #3a2010" }}>
              {breakFilter==="Flagged" ? "Show All" : "Show Flagged"}
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            <input className="w-full pl-9 pr-4 py-2 rounded text-sm text-white placeholder-gray-600 outline-none"
              style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", border:"1px solid #2a2a2a" }}
              placeholder="Search employee…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="px-3 py-2 rounded text-sm text-gray-300 outline-none" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", border:"1px solid #2a2a2a" }}
            value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
            {DEPTS.map(d => <option key={d}>{d==="All"?"All Departments":d}</option>)}
          </select>
          <select className="px-3 py-2 rounded text-sm text-gray-300 outline-none" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", border:"1px solid #2a2a2a" }}
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {["All","Present","Remote","Late","Absent","On Leave"].map(s => <option key={s}>{s==="All"?"All Statuses":s}</option>)}
          </select>
          <div className="flex-1" />
          <span className="text-gray-600 text-sm" style={{ fontFamily:"monospace" }}>{filtered.length} of {EMPLOYEES.length}</span>
        </div>

        {/* Table */}
        <div className="rounded-lg overflow-x-auto" style={{ border:"1px solid #1e1e1e" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor:"#0a0a0a", borderBottom:"1px solid #1e1e1e" }}>
                {["Employee","Dept","Status","Time In","Break Out","Break In","Break Dur.","Time Out","Net Hours",""].map(h => (
                  <th key={h} className="px-3 py-3 text-left font-normal text-gray-600 whitespace-nowrap"
                    style={{ fontFamily:"system-ui,sans-serif", fontSize:10, textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp, i) => {
                const a     = attendance.find(a => a.empId === emp.id);
                const st    = ATTENDANCE_STYLE[a?.status] || ATTENDANCE_STYLE.Absent;
                const flags = breakFlags(a?.breakOut, a?.breakIn);
                const dur   = breakMinutes(a?.breakOut, a?.breakIn);
                const hasFlag = flags.length > 0;

                return (
                  <tr key={emp.id} className="group"
                    style={{ borderBottom:i<filtered.length-1?"1px solid #141414":"none", backgroundColor: hasFlag?"#120d08":"#0d0d0d" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor=hasFlag?"#1a1208":"#111"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor=hasFlag?"#120d08":"#0d0d0d"}>

                    {/* Employee */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar emp={emp} size={28} />
                        <div>
                          <p className="text-white text-sm" style={{ fontFamily:"system-ui,sans-serif" }}>{emp.name}</p>
                          <p className="text-gray-600 text-xs" style={{ fontFamily:"system-ui,sans-serif" }}>{emp.role}</p>
                        </div>
                      </div>
                    </td>

                    {/* Dept */}
                    <td className="px-3 py-3 text-gray-500 text-xs" style={{ fontFamily:"system-ui,sans-serif" }}>{emp.dept}</td>

                    {/* Status */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor:st.dot }} />
                        <span className="text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap"
                          style={{ fontFamily:"system-ui,sans-serif", backgroundColor:st.bg, color:st.color }}>
                          {a?.status || "—"}
                        </span>
                        {a?.correctedAt && <span className="text-gray-600 text-xs" title="Corrected">✎</span>}
                      </div>
                    </td>

                    {/* Time In */}
                    <td className="px-3 py-3 text-gray-300 text-xs whitespace-nowrap" style={{ fontFamily:"monospace" }}>{a?.timeIn || "—"}</td>

                    {/* Break Out */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="text-xs" style={{ fontFamily:"monospace", color: flags.includes("early")?"#f0c85a":"#888" }}>
                          {a?.breakOut || "—"}
                        </span>
                        {flags.includes("early") && <span title="Before 12PM" style={{ fontSize:10, color:"#f0c85a" }}>⚠</span>}
                      </div>
                    </td>

                    {/* Break In */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="text-xs" style={{ fontFamily:"monospace", color: flags.includes("exceeded")?"#f05a5a":"#888" }}>
                          {a?.breakIn || "—"}
                        </span>
                        {flags.includes("exceeded") && <span title="Exceeded 1hr" style={{ fontSize:10, color:"#f05a5a" }}>⚠</span>}
                      </div>
                    </td>

                    {/* Break Duration */}
                    <td className="px-3 py-3">
                      {dur !== null ? (
                        <span className="text-xs px-1.5 py-0.5 rounded whitespace-nowrap"
                          style={{ fontFamily:"monospace", backgroundColor: dur>60?"#1f0f0f":dur===60?"#0f1f0f":"#111", color: dur>60?"#f05a5a":dur===60?"#5af07a":"#aaa" }}>
                          {breakDurLabel(a?.breakOut, a?.breakIn)}
                        </span>
                      ) : <span className="text-gray-700 text-xs">—</span>}
                    </td>

                    {/* Time Out */}
                    <td className="px-3 py-3 text-gray-500 text-xs whitespace-nowrap" style={{ fontFamily:"monospace" }}>{a?.timeOut || "—"}</td>

                    {/* Net Hours */}
                    <td className="px-3 py-3 text-gray-500 text-xs whitespace-nowrap" style={{ fontFamily:"monospace" }}>{a?.hours ? `${a.hours}h` : "—"}</td>

                    {/* Actions */}
                    <td className="px-3 py-3">
                      <button onClick={() => setCorrecting({ emp, record:a })}
                        className="text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                        style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", color:"#aaa", border:"1px solid #2a2a2a" }}>
                        ✎ Correct
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {correcting && (
        <TimeCorrectionModal
          emp={correcting.emp}
          record={correcting.record}
          onClose={() => setCorrecting(null)}
          onSave={corrected => { onCorrect(correcting.emp.id, corrected); setCorrecting(null); }}
        />
      )}
    </>
  );
}

// ── LEAVE MANAGEMENT TAB ──────────────────────────────────────────────────────
function LeaveManagementTab({ leaveRequests, onApprove, onReject }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return leaveRequests.filter(req => {
      const emp = EMPLOYEES.find(e=>e.id===req.empId);
      const q = search.toLowerCase();
      return (statusFilter === "All" || req.status === statusFilter)
        && (typeFilter === "All" || req.type === typeFilter)
        && (!q || emp?.name.toLowerCase().includes(q));
    });
  }, [leaveRequests, statusFilter, typeFilter, search]);

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          ["Pending",  leaveRequests.filter(r=>r.status==="Pending").length,  "#f0c85a", "#1f1a0f"],
          ["Approved", leaveRequests.filter(r=>r.status==="Approved").length, "#5af07a", "#0f1f0f"],
          ["Rejected", leaveRequests.filter(r=>r.status==="Rejected").length, "#f05a5a", "#1f0f0f"],
          ["Total",    leaveRequests.length,                                   "#fff",    "#111"   ],
        ].map(([label, count, color, bg]) => (
          <div key={label} className="rounded-lg p-4" style={{ backgroundColor: bg, border:"1px solid #1e1e1e" }}>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily:"system-ui,sans-serif", color:"#666" }}>{label}</p>
            <p className="text-2xl font-light" style={{ fontFamily:"monospace", color }}>{count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input className="w-full pl-9 pr-4 py-2 rounded text-sm text-white placeholder-gray-600 outline-none"
            style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", border:"1px solid #2a2a2a" }}
            placeholder="Search employee…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="px-3 py-2 rounded text-sm text-gray-300 outline-none" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", border:"1px solid #2a2a2a" }}
          value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          {["All","Pending","Approved","Rejected"].map(s=><option key={s}>{s==="All"?"All Statuses":s}</option>)}
        </select>
        <select className="px-3 py-2 rounded text-sm text-gray-300 outline-none" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", border:"1px solid #2a2a2a" }}
          value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
          {LEAVE_TYPES.map(t=><option key={t}>{t==="All"?"All Types":t}</option>)}
        </select>
        <div className="flex-1" />
        <span className="text-gray-600 text-sm" style={{ fontFamily:"monospace" }}>{filtered.length} requests</span>
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden" style={{ border:"1px solid #1e1e1e" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor:"#0a0a0a", borderBottom:"1px solid #1e1e1e" }}>
              {["Employee","Type","From","To","Days","Reason","Applied","Status",""].map(h=>(
                <th key={h} className="px-4 py-3 text-left font-normal text-gray-600" style={{ fontFamily:"system-ui,sans-serif", fontSize:10, textTransform:"uppercase", letterSpacing:"0.07em", whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((req, i) => {
              const emp = EMPLOYEES.find(e=>e.id===req.empId);
              const st = LEAVE_STATUS_STYLE[req.status];
              return (
                <tr key={req.id} style={{ borderBottom: i < filtered.length-1 ? "1px solid #141414" : "none", backgroundColor:"#0d0d0d" }}
                  onMouseEnter={e=>e.currentTarget.style.backgroundColor="#111"}
                  onMouseLeave={e=>e.currentTarget.style.backgroundColor="#0d0d0d"}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {emp && <Avatar emp={emp} size={26} />}
                      <span className="text-gray-200 text-sm" style={{ fontFamily:"system-ui,sans-serif" }}>{emp?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs" style={{ fontFamily:"system-ui,sans-serif" }}>{req.type}</td>
                  <td className="px-4 py-3 text-gray-300 text-xs" style={{ fontFamily:"monospace" }}>{req.from}</td>
                  <td className="px-4 py-3 text-gray-300 text-xs" style={{ fontFamily:"monospace" }}>{req.to}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs text-center" style={{ fontFamily:"monospace" }}>{req.days}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate" style={{ fontFamily:"system-ui,sans-serif" }}>{req.reason}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs" style={{ fontFamily:"monospace" }}>{req.appliedOn}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily:"system-ui,sans-serif", ...st }}>{req.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {req.status === "Pending" && (
                      <div className="flex gap-1.5">
                        <button onClick={() => onApprove(req.id)} className="text-xs px-2 py-1 rounded hover:opacity-80" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#0f2a0f", color:"#5af07a", border:"1px solid #2a4a2a" }}>✓</button>
                        <button onClick={() => onReject(req.id)} className="text-xs px-2 py-1 rounded hover:opacity-80" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#1a1a1a", color:"#888", border:"1px solid #2a2a2a" }}>✕</button>
                      </div>
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

// ── LEAVE BALANCES TAB ────────────────────────────────────────────────────────
function LeaveBalancesTab() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  const filtered = useMemo(() => EMPLOYEES.filter(emp => {
    const q = search.toLowerCase();
    return (!q || emp.name.toLowerCase().includes(q))
      && (deptFilter === "All" || emp.dept === deptFilter);
  }), [search, deptFilter]);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input className="w-full pl-9 pr-4 py-2 rounded text-sm text-white placeholder-gray-600 outline-none"
            style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", border:"1px solid #2a2a2a" }}
            placeholder="Search employee…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="px-3 py-2 rounded text-sm text-gray-300 outline-none" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", border:"1px solid #2a2a2a" }}
          value={deptFilter} onChange={e=>setDeptFilter(e.target.value)}>
          {DEPTS.map(d=><option key={d}>{d==="All"?"All Departments":d}</option>)}
        </select>
        <div className="flex-1" />
        <span className="text-gray-600 text-sm" style={{ fontFamily:"monospace" }}>{filtered.length} employees</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map(emp => {
          const b = LEAVE_BALANCES.find(b=>b.empId===emp.id);
          if (!b) return null;
          const annualPct = (b.annual.used/b.annual.total)*100;
          const isLow = (b.annual.total - b.annual.used) <= 2;
          return (
            <div key={emp.id} className="rounded-lg p-5" style={{ backgroundColor:"#0d0d0d", border:`1px solid ${isLow?"#3a1515":"#1e1e1e"}` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar emp={emp} size={34} />
                  <div>
                    <p className="text-white text-sm" style={{ fontFamily:"system-ui,sans-serif" }}>{emp.name}</p>
                    <p className="text-gray-500 text-xs" style={{ fontFamily:"system-ui,sans-serif" }}>{emp.dept}</p>
                  </div>
                </div>
                {isLow && <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#1f0f0f", color:"#f05a5a" }}>Low</span>}
              </div>
              <div className="space-y-3">
                <BalanceBar label="Annual Leave"    used={b.annual.used}    total={b.annual.total} />
                <BalanceBar label="Sick Leave"      used={b.sick.used}      total={b.sick.total} />
                <BalanceBar label="Emergency Leave" used={b.emergency.used} total={b.emergency.total} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── OT/UT TAB ─────────────────────────────────────────────────────────────────
function OTUTTab({ otRecords, onApproveOT }) {
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


// ── OFFSET SYSTEM ─────────────────────────────────────────────────────────────
// Offset Bank — hours an employee has earned (from OT or custom grant)
// Offset Request — employee's intent to USE those hours on a specific day
//
// Expiry: all offset hours expire at end of current payroll cutoff
// Current cutoff: Mar 1–15, 2026  →  expires Mar 15, 2026
// ─────────────────────────────────────────────────────────────────────────────

const CURRENT_CUTOFF_END = "Mar 15, 2026";

// Offset bank — where earned hours sit until used/expired/voided
const OFFSET_BANK_SEED = [
  { id:"ob1", empId:1,  source:"OT",     hours:2.5, earnedDate:"Feb 24, 2026", otRef:"OT-001", grantedBy:null,    reason:"Sprint deadline OT — 8AM to 10:30PM",          mode:"flexible",   expiresAt:CURRENT_CUTOFF_END, status:"Available" },
  { id:"ob2", empId:4,  source:"OT",     hours:3.0, earnedDate:"Feb 25, 2026", otRef:"OT-002", grantedBy:null,    reason:"Server migration — stayed until 8PM",           mode:"flexible",   expiresAt:CURRENT_CUTOFF_END, status:"Available" },
  { id:"ob3", empId:6,  source:"OT",     hours:4.0, earnedDate:"Feb 26, 2026", otRef:"OT-003", grantedBy:null,    reason:"Executive presentation prep — worked until 9PM", mode:"early-out",  expiresAt:CURRENT_CUTOFF_END, status:"Used"      },
  { id:"ob4", empId:11, source:"OT",     hours:2.0, earnedDate:"Feb 28, 2026", otRef:"OT-005", grantedBy:null,    reason:"Bug fix deployment — 8AM to 7PM",               mode:"flexible",   expiresAt:CURRENT_CUTOFF_END, status:"Available" },
  { id:"ob5", empId:7,  source:"OT",     hours:3.5, earnedDate:"Feb 23, 2026", otRef:"OT-007", grantedBy:null,    reason:"Quarterly close — stayed until 8:30PM",         mode:"flexible",   expiresAt:CURRENT_CUTOFF_END, status:"Available" },
  { id:"ob6", empId:2,  source:"Custom", hours:4.0, earnedDate:"Mar 1, 2026",  otRef:null,     grantedBy:"Admin", reason:"Exceeded Q1 sales quota by 130% — reward offset", mode:"flexible",  expiresAt:CURRENT_CUTOFF_END, status:"Available" },
  { id:"ob7", empId:8,  source:"Custom", hours:2.0, earnedDate:"Mar 1, 2026",  otRef:null,     grantedBy:"Admin", reason:"Best design award — March recognition",          mode:"early-out",  expiresAt:CURRENT_CUTOFF_END, status:"Available" },
  { id:"ob8", empId:3,  source:"OT",     hours:2.0, earnedDate:"Feb 22, 2026", otRef:"OT-009", grantedBy:null,    reason:"Product launch prep — stayed until 7PM",         mode:"late-in",    expiresAt:CURRENT_CUTOFF_END, status:"Expired"   },
];

// Offset requests — employee's intent to use bank hours on a specific day
const OFFSET_REQUESTS_SEED = [
  // empId 6 used ob3 (4hrs) — filed by HR
  { id:"or1", empId:6,  bankId:"ob3", hoursUsed:4.0, useDate:"Mar 5, 2026",
    mode:"early-out", timeIn:"8:00 AM", timeOut:"1:00 PM",
    note:"Compensatory for Feb 26 OT", filedBy:"HR",
    status:"Approved", reviewedBy:"Admin", reviewedOn:"Mar 2, 2026" },
  // Pending requests
  { id:"or2", empId:1,  bankId:"ob1", hoursUsed:2.5, useDate:"Mar 7, 2026",
    mode:"late-in",   timeIn:"10:30 AM", timeOut:"5:00 PM",
    note:"Need to attend morning appointment", filedBy:"Employee",
    status:"Pending", reviewedBy:null, reviewedOn:null },
  { id:"or3", empId:4,  bankId:"ob2", hoursUsed:3.0, useDate:"Mar 10, 2026",
    mode:"early-out", timeIn:"8:00 AM", timeOut:"2:00 PM",
    note:"Family commitment in the afternoon", filedBy:"Employee",
    status:"Pending", reviewedBy:null, reviewedOn:null },
  { id:"or4", empId:2,  bankId:"ob6", hoursUsed:4.0, useDate:"Mar 12, 2026",
    mode:"late-in",   timeIn:"12:00 PM", timeOut:"5:00 PM",
    note:"Using reward offset for medical check-up", filedBy:"HR",
    status:"Pending", reviewedBy:null, reviewedOn:null },
];

// Helpers
function empAvailableHours(empId, bank) {
  return bank.filter(b => b.empId===empId && b.status==="Available")
             .reduce((s,b) => s+b.hours, 0);
}
function parseTime(t) {
  if (!t) return 0;
  const [time, mer] = t.trim().split(" ");
  let [h, m] = time.split(":").map(Number);
  if (mer==="PM" && h!==12) h+=12;
  if (mer==="AM" && h===12) h=0;
  return h*60+(m||0);
}
function hoursWorked(timeIn, timeOut) {
  const diff = (parseTime(timeOut) - parseTime(timeIn)) / 60;
  return diff > 0 ? parseFloat(diff.toFixed(1)) : 0;
}
function effectiveHours(timeIn, timeOut, offsetHours) {
  return hoursWorked(timeIn, timeOut) + offsetHours;
}

const IC = "w-full px-3 py-2.5 rounded text-sm text-white placeholder-gray-600 outline-none";
const IS = { backgroundColor:"#111", border:"1px solid #2a2a2a", fontFamily:"system-ui,sans-serif" };

// ── GRANT CUSTOM OFFSET DRAWER ────────────────────────────────────────────────
function GrantCustomOffsetDrawer({ onClose, onSave }) {
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

// ── FILE OFFSET REQUEST DRAWER ────────────────────────────────────────────────
function FileOffsetRequestDrawer({ bank, onClose, onSave, filedBy="HR" }) {
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

// ── OFFSET TAB ────────────────────────────────────────────────────────────────
function OffsetTab({ bank, setBank, requests, setRequests }) {
  const [subTab,        setSubTab]       = useState("bank");      // "bank" | "requests"
  const [showGrant,     setShowGrant]    = useState(false);
  const [showFile,      setShowFile]     = useState(false);
  const [empFilter,     setEmpFilter]    = useState("All");
  const [statusFilter,  setStatusFilter] = useState("All");

  const pendingRequests = requests.filter(r=>r.status==="Pending").length;

  // ── Bank helpers
  function grantCustom(form) {
    setBank(p=>[...p,{
      id:        "ob"+Date.now(),
      empId:     Number(form.empId),
      source:    "Custom",
      hours:     parseFloat(form.hours),
      earnedDate: form.earnedDate,
      otRef:     null,
      grantedBy: "Admin",
      reason:    form.reason,
      mode:      form.mode,
      expiresAt: CURRENT_CUTOFF_END,
      status:    "Available",
    }]);
    setShowGrant(false);
  }

  function voidBankEntry(id) {
    setBank(p=>p.map(b=>b.id===id?{...b,status:"Voided"}:b));
  }

  // ── Request helpers
  function fileRequest(form) {
    setRequests(p=>[...p,{
      id:        "or"+Date.now(),
      empId:     Number(form.empId),
      bankId:    form.bankId,
      hoursUsed: parseFloat(form.hoursUsed)||0,
      useDate:   form.useDate,
      mode:      form.mode,
      timeIn:    form.timeIn,
      timeOut:   form.timeOut,
      note:      form.note,
      filedBy:   form.filedBy,
      status:    "Pending",
      reviewedBy:null,
      reviewedOn:null,
    }]);
    setShowFile(false);
  }

  function approveRequest(id) {
    // Mark request approved, mark bank entry as Used
    const req = requests.find(r=>r.id===id);
    setRequests(p=>p.map(r=>r.id===id?{...r,status:"Approved",reviewedBy:"Admin",reviewedOn:"Mar 2, 2026"}:r));
    if (req) setBank(p=>p.map(b=>b.id===req.bankId?{...b,status:"Used"}:b));
  }

  function rejectRequest(id) {
    setRequests(p=>p.map(r=>r.id===id?{...r,status:"Rejected",reviewedBy:"Admin",reviewedOn:"Mar 2, 2026"}:r));
  }

  // ── Filtered bank
  const filteredBank = useMemo(()=>bank.filter(b=>{
    const empMatch = empFilter==="All" || String(b.empId)===empFilter;
    const stMatch  = statusFilter==="All" || b.status===statusFilter;
    return empMatch && stMatch;
  }),[bank,empFilter,statusFilter]);

  const filteredReqs = useMemo(()=>requests.filter(r=>{
    const empMatch = empFilter==="All" || String(r.empId)===empFilter;
    const stMatch  = statusFilter==="All" || r.status===statusFilter;
    return empMatch && stMatch;
  }),[requests,empFilter,statusFilter]);

  // Summary stats
  const totalAvailable = bank.filter(b=>b.status==="Available").reduce((s,b)=>s+b.hours,0);
  const totalUsed      = bank.filter(b=>b.status==="Used").reduce((s,b)=>s+b.hours,0);
  const totalExpired   = bank.filter(b=>b.status==="Expired").reduce((s,b)=>s+b.hours,0);
  const customGrants   = bank.filter(b=>b.source==="Custom").length;

  const MODE_LABELS = { "late-in":"Come in Late","early-out":"Leave Early","flexible":"Flexible" };
  const SOURCE_STYLE = { OT:{ bg:"#0a1a2a",color:"#5a9af0" }, Custom:{ bg:"#1a0a2a",color:"#c07af0" } };

  return (
    <>
      <div className="space-y-5">

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            ["Available Hours",  `${totalAvailable.toFixed(1)}h`, "#5af07a", "#0d0d0d"],
            ["Used This Cutoff", `${totalUsed.toFixed(1)}h`,      "#5a9af0", "#0d0d0d"],
            ["Expired / Voided", `${totalExpired.toFixed(1)}h`,   "#555",    "#0d0d0d"],
            ["Custom Grants",    `${customGrants}`,               "#c07af0", "#0d0d0d"],
          ].map(([l,v,c,bg])=>(
            <div key={l} className="rounded-lg p-4" style={{backgroundColor:bg,border:"1px solid #1e1e1e"}}>
              <p className="text-xs uppercase tracking-widest mb-2" style={{fontFamily:"system-ui,sans-serif",color:"#555"}}>{l}</p>
              <p className="text-2xl font-light" style={{fontFamily:"monospace",color:c}}>{v}</p>
            </div>
          ))}
        </div>

        {/* Sub-tabs + actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 rounded-lg p-0.5" style={{backgroundColor:"#111",border:"1px solid #2a2a2a"}}>
            <button onClick={()=>setSubTab("bank")}
              className="px-4 py-1.5 rounded text-sm transition-all"
              style={{fontFamily:"system-ui,sans-serif",backgroundColor:subTab==="bank"?"#fff":"transparent",color:subTab==="bank"?"#000":"#555"}}>
              Offset Bank
            </button>
            <button onClick={()=>setSubTab("requests")}
              className="px-4 py-1.5 rounded text-sm transition-all relative"
              style={{fontFamily:"system-ui,sans-serif",backgroundColor:subTab==="requests"?"#fff":"transparent",color:subTab==="requests"?"#000":"#555"}}>
              Requests
              {pendingRequests>0&&<span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" style={{fontFamily:"monospace",backgroundColor:subTab==="requests"?"#1f1a0f":"#1f1a0f",color:"#f0c85a"}}>{pendingRequests}</span>}
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <select className="px-3 py-1.5 rounded text-xs text-gray-300 outline-none" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",border:"1px solid #2a2a2a"}}
              value={empFilter} onChange={e=>setEmpFilter(e.target.value)}>
              <option value="All">All Employees</option>
              {EMPLOYEES.map(e=><option key={e.id} value={String(e.id)}>{e.name}</option>)}
            </select>
            <select className="px-3 py-1.5 rounded text-xs text-gray-300 outline-none" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",border:"1px solid #2a2a2a"}}
              value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
              {subTab==="bank"
                ? ["All","Available","Used","Expired","Voided"].map(s=><option key={s}>{s}</option>)
                : ["All","Pending","Approved","Rejected"].map(s=><option key={s}>{s}</option>)
              }
            </select>
            <div className="flex gap-2 ml-2">
              <button onClick={()=>setShowFile(true)}
                className="px-3 py-1.5 rounded text-xs hover:opacity-80"
                style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a"}}>
                + File Request
              </button>
              <button onClick={()=>setShowGrant(true)}
                className="px-3 py-1.5 rounded text-xs font-medium bg-white text-black hover:opacity-80"
                style={{fontFamily:"system-ui,sans-serif"}}>
                + Grant Custom
              </button>
            </div>
          </div>
        </div>

        {/* ── BANK TABLE ── */}
        {subTab==="bank" && (
          <div className="rounded-lg overflow-hidden" style={{border:"1px solid #1e1e1e"}}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{backgroundColor:"#0a0a0a",borderBottom:"1px solid #1e1e1e"}}>
                  {["Employee","Source","Mode","Hours","Earned Date","Reason","Expires","Status",""].map(h=>(
                    <th key={h} className="px-4 py-3 text-left font-normal text-gray-600" style={{fontFamily:"system-ui,sans-serif",fontSize:10,textTransform:"uppercase",letterSpacing:"0.07em",whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBank.length===0?(
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>No offset bank entries found.</td></tr>
                ):filteredBank.map((b,i)=>{
                  const emp=EMPLOYEES.find(e=>e.id===b.empId);
                  const ss=SOURCE_STYLE[b.source]||SOURCE_STYLE.Custom;
                  const statusStyle={Available:{bg:"#0f1f0f",color:"#5af07a"},Used:{bg:"#0a1a2a",color:"#5a9af0"},Expired:{bg:"#1a1a1a",color:"#555"},Voided:{bg:"#1f0f0f",color:"#f05a5a"}}[b.status]||{bg:"#111",color:"#aaa"};
                  return(
                    <tr key={b.id} className="group" style={{borderBottom:i<filteredBank.length-1?"1px solid #141414":"none",backgroundColor:"#0d0d0d"}}
                      onMouseEnter={e=>e.currentTarget.style.backgroundColor="#111"}
                      onMouseLeave={e=>e.currentTarget.style.backgroundColor="#0d0d0d"}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {emp&&<Avatar emp={emp} size={26}/>}
                          <div>
                            <p className="text-gray-200 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{emp?.name}</p>
                            <p className="text-gray-600 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{emp?.dept}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded" style={{fontFamily:"system-ui,sans-serif",...ss}}>{b.source}</span>
                      </td>
                      <td className="px-4 py-3">
                        {b.mode ? (
                          <span className="text-xs px-2 py-0.5 rounded" style={{fontFamily:"system-ui,sans-serif",
                            backgroundColor: b.mode==="late-in"?"#0a1a2a":b.mode==="early-out"?"#1a1a0a":"#0a1a0a",
                            color: b.mode==="late-in"?"#5a9af0":b.mode==="early-out"?"#f0c85a":"#5af07a"}}>
                            {b.mode==="late-in"?"Come in Late":b.mode==="early-out"?"Leave Early":"Flexible"}
                          </span>
                        ) : <span className="text-gray-700 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3 font-medium" style={{fontFamily:"monospace",color:"#5af07a",fontSize:13}}>{b.hours.toFixed(1)}h</td>
                      <td className="px-4 py-3 text-gray-400 text-xs" style={{fontFamily:"monospace"}}>{b.earnedDate}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-xs" style={{fontFamily:"system-ui,sans-serif"}}>
                        <span className="line-clamp-2">{b.reason}</span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{fontFamily:"monospace",color:"#f0c85a"}}>{b.expiresAt}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{fontFamily:"system-ui,sans-serif",...statusStyle}}>{b.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        {b.status==="Available"&&(
                          <button onClick={()=>voidBankEntry(b.id)}
                            className="text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#1f0f0f",color:"#f05a5a",border:"1px solid #3a1515"}}>
                            Void
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── REQUESTS TABLE ── */}
        {subTab==="requests" && (
          <div className="rounded-lg overflow-hidden" style={{border:"1px solid #1e1e1e"}}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{backgroundColor:"#0a0a0a",borderBottom:"1px solid #1e1e1e"}}>
                  {["Employee","Use Date","Mode","Schedule","Hours Used","Effective Day","Filed By","Status",""].map(h=>(
                    <th key={h} className="px-4 py-3 text-left font-normal text-gray-600" style={{fontFamily:"system-ui,sans-serif",fontSize:10,textTransform:"uppercase",letterSpacing:"0.07em",whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredReqs.length===0?(
                  <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>No offset requests found.</td></tr>
                ):filteredReqs.map((r,i)=>{
                  const emp=EMPLOYEES.find(e=>e.id===r.empId);
                  const worked=hoursWorked(r.timeIn,r.timeOut);
                  const eff=effectiveHours(r.timeIn,r.timeOut,r.hoursUsed);
                  const valid=eff>=8;
                  const statusStyle={Pending:{bg:"#1f1a0f",color:"#f0c85a"},Approved:{bg:"#0f1f0f",color:"#5af07a"},Rejected:{bg:"#1f0f0f",color:"#f05a5a"}}[r.status]||{bg:"#111",color:"#aaa"};
                  return(
                    <tr key={r.id} className="group" style={{borderBottom:i<filteredReqs.length-1?"1px solid #141414":"none",backgroundColor:"#0d0d0d"}}
                      onMouseEnter={e=>e.currentTarget.style.backgroundColor="#111"}
                      onMouseLeave={e=>e.currentTarget.style.backgroundColor="#0d0d0d"}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {emp&&<Avatar emp={emp} size={26}/>}
                          <span className="text-gray-200 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{emp?.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-xs" style={{fontFamily:"monospace"}}>{r.useDate}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#0a1a2a",color:"#5a9af0"}}>{MODE_LABELS[r.mode]}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-xs" style={{fontFamily:"monospace"}}>{r.timeIn} – {r.timeOut}</td>
                      <td className="px-4 py-3 text-xs font-medium" style={{fontFamily:"monospace",color:"#5a9af0"}}>+{r.hoursUsed.toFixed(1)}h</td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="text-sm font-medium" style={{fontFamily:"monospace",color:valid?"#5af07a":"#f05a5a"}}>{eff.toFixed(1)}h</span>
                          <p className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>{worked.toFixed(1)}h + {r.hoursUsed.toFixed(1)}h offset</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded" style={{fontFamily:"system-ui,sans-serif",backgroundColor:r.filedBy==="HR"?"#1a1a0a":"#0a0a1a",color:r.filedBy==="HR"?"#f0c85a":"#5a9af0"}}>{r.filedBy}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{fontFamily:"system-ui,sans-serif",...statusStyle}}>{r.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        {r.status==="Pending"&&(
                          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={()=>approveRequest(r.id)}
                              className="text-xs px-2 py-1 rounded hover:opacity-80"
                              style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#0f2a0f",color:"#5af07a",border:"1px solid #2a4a2a"}}>✓ Approve</button>
                            <button onClick={()=>rejectRequest(r.id)}
                              className="text-xs px-2 py-1 rounded hover:opacity-80"
                              style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#1a1a1a",color:"#888",border:"1px solid #2a2a2a"}}>✕</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showGrant && <GrantCustomOffsetDrawer onClose={()=>setShowGrant(false)} onSave={grantCustom}/>}
      {showFile  && <FileOffsetRequestDrawer bank={bank} onClose={()=>setShowFile(false)} onSave={fileRequest} filedBy="HR"/>}
    </>
  );
}

// ── TIME & LEAVE PAGE ─────────────────────────────────────────────────────────
export default function TimeAndLeave() {
  const [activeTab,     setActiveTab]     = useState("overview");
  const [leaveRequests, setLeaveRequests] = useState(LEAVE_REQUESTS_SEED);
  const [otRecords,     setOtRecords]     = useState(OT_UT_RECORDS);
  const [attendance,    setAttendance]    = useState(ATTENDANCE_TODAY);
  const [offsetBank,    setOffsetBank]    = useState(OFFSET_BANK_SEED);
  const [offsetRequests,setOffsetRequests]= useState(OFFSET_REQUESTS_SEED);

  function approveLeave(id)  { setLeaveRequests(p=>p.map(r=>r.id===id?{...r,status:"Approved"}:r)); }
  function rejectLeave(id)   { setLeaveRequests(p=>p.map(r=>r.id===id?{...r,status:"Rejected"}:r)); }
  function approveOT(idx)    { setOtRecords(p=>p.map((r,i)=>i===idx?{...r,status:"Approved"}:r)); }

  function correctAttendance(empId, corrected) {
    setAttendance(p=>p.map(a=>a.empId===empId
      ? { ...a,
          status:    corrected.status,
          timeIn:    corrected.timeIn,
          timeOut:   corrected.timeOut,
          breakOut:  corrected.breakOut,
          breakIn:   corrected.breakIn,
          hours:     corrected.hours,
          breakFlags:corrected.breakFlags,
          correctedAt:  corrected.correctedAt,
          correctedBy:  corrected.correctedBy,
          correctionReason: corrected.reason }
      : a
    ));
  }

  const TABS = [
    { key:"overview",   label:"Overview"      },
    { key:"attendance", label:"Attendance"     },
    { key:"leave",      label:"Leave Requests" },
    { key:"balances",   label:"Leave Balances" },
    { key:"otut",       label:"OT / UT"        },
    { key:"offset",     label:"Offset"         },
  ];

  const pendingLeave  = leaveRequests.filter(r=>r.status==="Pending").length;
  const pendingOffset = offsetRequests.filter(r=>r.status==="Pending").length;

  return (
    <div className="flex-1 overflow-hidden flex flex-col" style={{backgroundColor:"#000"}}>
      <div className="px-8 pt-8 pb-0 flex-shrink-0">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-1" style={{fontFamily:"system-ui,sans-serif"}}>HR Management</p>
            <h1 className="text-3xl font-normal text-white" style={{letterSpacing:"-0.02em"}}>Time & Leave</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg px-4 py-2 flex items-center gap-2" style={{backgroundColor:"#0a1a0a",border:"1px solid #1e3a1e"}}>
              <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:"#5af07a"}}/>
              <span className="text-xs text-gray-400" style={{fontFamily:"system-ui,sans-serif"}}>Today · Mon, Mar 2, 2026</span>
            </div>
            <div className="rounded-lg px-4 py-2" style={{backgroundColor:"#0a1020",border:"1px solid #1a2a3a"}}>
              <span className="text-xs text-gray-500" style={{fontFamily:"system-ui,sans-serif"}}>Cutoff ends <strong className="text-white">{CURRENT_CUTOFF_END}</strong></span>
            </div>
            {pendingLeave>0&&(
              <div className="rounded-lg px-4 py-2" style={{backgroundColor:"#1f1a0f",border:"1px solid #3a3010"}}>
                <span className="text-xs" style={{fontFamily:"system-ui,sans-serif",color:"#f0c85a"}}>⏳ {pendingLeave} leave pending</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-1" style={{borderBottom:"1px solid #1a1a1a"}}>
          {TABS.map(t=>(
            <button key={t.key} onClick={()=>setActiveTab(t.key)}
              className="px-4 py-2.5 text-sm transition-all"
              style={{fontFamily:"system-ui,sans-serif",color:activeTab===t.key?"#fff":"#555",borderBottom:activeTab===t.key?"2px solid #fff":"2px solid transparent"}}>
              {t.label}
              {t.key==="leave"&&pendingLeave>0&&<span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" style={{fontFamily:"monospace",backgroundColor:"#1f1a0f",color:"#f0c85a"}}>{pendingLeave}</span>}
              {t.key==="offset"&&pendingOffset>0&&<span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" style={{fontFamily:"monospace",backgroundColor:"#1f1a0f",color:"#f0c85a"}}>{pendingOffset}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {activeTab==="overview"   && <OverviewTab attendance={attendance} leaveRequests={leaveRequests} otRecords={otRecords} onApprove={approveLeave} onReject={rejectLeave}/>}
        {activeTab==="attendance" && <AttendanceTab attendance={attendance} onCorrect={correctAttendance}/>}
        {activeTab==="leave"      && <LeaveManagementTab leaveRequests={leaveRequests} onApprove={approveLeave} onReject={rejectLeave}/>}
        {activeTab==="balances"   && <LeaveBalancesTab/>}
        {activeTab==="otut"       && <OTUTTab otRecords={otRecords} onApproveOT={approveOT}/>}
        {activeTab==="offset"     && <OffsetTab bank={offsetBank} setBank={setOffsetBank} requests={offsetRequests} setRequests={setOffsetRequests}/>}
      </div>
    </div>
  );
}
