import { useState, useMemo } from "react";

// ── SHARED STYLE CONSTANTS ────────────────────────────────────────────────────
const IC = "w-full px-3 py-2.5 rounded text-sm text-white placeholder-gray-600 outline-none";
const IS = { backgroundColor:"#111", border:"1px solid #2a2a2a", fontFamily:"system-ui,sans-serif" };

// ── SHARED HELPERS ────────────────────────────────────────────────────────────
function parseTime(t) {
  if (!t) return 0;
  const [time, mer] = t.trim().split(" ");
  let [h, m] = time.split(":").map(Number);
  if (mer === "PM" && h !== 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  return h * 60 + (m || 0);
}

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
// Simple model:
//   Source Date  — the day the extra/adjusted hours come FROM
//   Target Date  — the day those hours are being APPLIED TO
//   Type: "OT"   — employee worked beyond 5PM on source date
//         "Adjustment" — schedule shift (e.g. 9AM–6PM instead of 8AM–5PM)
//
// Both types just record: who, from-date + actual schedule, to-date + adjusted schedule
// The system validates the target date still reaches 8 effective working hours.
// ─────────────────────────────────────────────────────────────────────────────

const OFFSET_SEED = [
  {
    id:"off1", empId:1,
    type:"OT",
    sourceDate:"Feb 24, 2026", sourceTimeIn:"8:00 AM", sourceTimeOut:"10:30 PM",
    targetDate:"Mar 7, 2026",  targetTimeIn:"10:30 AM", targetTimeOut:"5:00 PM",
    offsetHours:2.5,
    reason:"Sprint deadline — stayed extra, offsetting to come in late Mar 7",
    status:"Approved", createdOn:"Feb 28, 2026", createdBy:"Admin",
  },
  {
    id:"off2", empId:4,
    type:"OT",
    sourceDate:"Feb 25, 2026", sourceTimeIn:"8:00 AM", sourceTimeOut:"8:00 PM",
    targetDate:"Mar 10, 2026", targetTimeIn:"8:00 AM", targetTimeOut:"2:00 PM",
    offsetHours:3.0,
    reason:"Server migration OT — offsetting to leave early Mar 10",
    status:"Approved", createdOn:"Mar 1, 2026", createdBy:"Admin",
  },
  {
    id:"off3", empId:2,
    type:"Adjustment",
    sourceDate:"Mar 5, 2026",  sourceTimeIn:"8:00 AM", sourceTimeOut:"6:00 PM",
    targetDate:"Mar 12, 2026", targetTimeIn:"9:00 AM", targetTimeOut:"6:00 PM",
    offsetHours:1.0,
    reason:"Employee prefers 9AM start — worked extra on Mar 5 to cover",
    status:"Pending", createdOn:"Mar 2, 2026", createdBy:"Admin",
  },
  {
    id:"off4", empId:8,
    type:"Adjustment",
    sourceDate:"Mar 3, 2026",  sourceTimeIn:"8:00 AM", sourceTimeOut:"7:00 PM",
    targetDate:"Mar 8, 2026",  targetTimeIn:"8:00 AM", targetTimeOut:"3:00 PM",
    offsetHours:2.0,
    reason:"Design presentation ran late Mar 3 — leaving early Mar 8",
    status:"Pending", createdOn:"Mar 2, 2026", createdBy:"Admin",
  },
  {
    id:"off5", empId:6,
    type:"OT",
    sourceDate:"Feb 26, 2026", sourceTimeIn:"8:00 AM", sourceTimeOut:"9:00 PM",
    targetDate:"Mar 6, 2026",  targetTimeIn:"8:00 AM", targetTimeOut:"1:00 PM",
    offsetHours:4.0,
    reason:"Exec presentation prep — offset entire afternoon Mar 6",
    status:"Voided", createdOn:"Mar 1, 2026", createdBy:"Admin",
  },
];

// ── CREATE OFFSET DRAWER ──────────────────────────────────────────────────────
function CreateOffsetDrawer({ onClose, onSave }) {
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

// ── OFFSET TAB ────────────────────────────────────────────────────────────────
function OffsetTab({ offsets, setOffsets }) {
  const [showCreate,   setShowCreate]   = useState(false);
  const [typeFilter,   setTypeFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [empFilter,    setEmpFilter]    = useState("All");

  const filtered = useMemo(() => offsets.filter(o =>
    (typeFilter   === "All" || o.type   === typeFilter) &&
    (statusFilter === "All" || o.status === statusFilter) &&
    (empFilter    === "All" || String(o.empId) === empFilter)
  ), [offsets, typeFilter, statusFilter, empFilter]);

  function createOffset(form) {
    setOffsets(p => [...p, {
      id:           "off" + Date.now(),
      empId:        Number(form.empId),
      type:         form.type,
      sourceDate:   form.sourceDate,
      sourceTimeIn: form.sourceTimeIn,
      sourceTimeOut:form.sourceTimeOut,
      targetDate:   form.targetDate,
      targetTimeIn: form.targetTimeIn,
      targetTimeOut:form.targetTimeOut,
      offsetHours:  form.offsetHours,
      reason:       form.reason,
      status:       "Pending",
      createdOn:    "Mar 2, 2026",
      createdBy:    "Admin",
    }]);
    setShowCreate(false);
  }

  function approve(id) { setOffsets(p => p.map(o => o.id===id ? {...o, status:"Approved"} : o)); }
  function voidOffset(id) { setOffsets(p => p.map(o => o.id===id ? {...o, status:"Voided"} : o)); }

  // Summary stats
  const totalOT  = offsets.filter(o=>o.type==="OT"&&o.status==="Approved").length;
  const totalAdj = offsets.filter(o=>o.type==="Adjustment"&&o.status==="Approved").length;
  const pending  = offsets.filter(o=>o.status==="Pending").length;

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
                      <span className="text-xs font-medium" style={{ fontFamily:"monospace", color:"#5a9af0" }}>+{o.offsetHours.toFixed(1)}h</span>
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

// ── TIME & LEAVE PAGE ─────────────────────────────────────────────────────────
export default function TimeAndLeave() {
  const [activeTab,     setActiveTab]     = useState("overview");
  const [leaveRequests, setLeaveRequests] = useState(LEAVE_REQUESTS_SEED);
  const [otRecords,     setOtRecords]     = useState(OT_UT_RECORDS);
  const [attendance,    setAttendance]    = useState(ATTENDANCE_TODAY);
  const [offsets,       setOffsets]       = useState(OFFSET_SEED);

  function approveLeave(id)  { setLeaveRequests(p => p.map(r => r.id===id ? {...r, status:"Approved"} : r)); }
  function rejectLeave(id)   { setLeaveRequests(p => p.map(r => r.id===id ? {...r, status:"Rejected"} : r)); }
  function approveOT(idx)    { setOtRecords(p => p.map((r,i) => i===idx ? {...r, status:"Approved"} : r)); }

  function correctAttendance(empId, corrected) {
    setAttendance(p => p.map(a => a.empId===empId
      ? { ...a,
          status:           corrected.status,
          timeIn:           corrected.timeIn,
          timeOut:          corrected.timeOut,
          breakOut:         corrected.breakOut,
          breakIn:          corrected.breakIn,
          hours:            corrected.hours,
          breakFlags:       corrected.breakFlags,
          correctedAt:      corrected.correctedAt,
          correctedBy:      corrected.correctedBy,
          correctionReason: corrected.reason,
        }
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

  const pendingLeave   = leaveRequests.filter(r => r.status==="Pending").length;
  const pendingOffsets = offsets.filter(o => o.status==="Pending").length;

  return (
    <div className="flex-1 overflow-hidden flex flex-col" style={{ backgroundColor:"#000" }}>
      <div className="px-8 pt-8 pb-0 flex-shrink-0">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-1" style={{ fontFamily:"system-ui,sans-serif" }}>HR Management</p>
            <h1 className="text-3xl font-normal text-white" style={{ letterSpacing:"-0.02em" }}>Time & Leave</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg px-4 py-2 flex items-center gap-2" style={{ backgroundColor:"#0a1a0a", border:"1px solid #1e3a1e" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor:"#5af07a" }} />
              <span className="text-xs text-gray-400" style={{ fontFamily:"system-ui,sans-serif" }}>Today · Mon, Mar 2, 2026</span>
            </div>
            {pendingLeave > 0 && (
              <div className="rounded-lg px-4 py-2" style={{ backgroundColor:"#1f1a0f", border:"1px solid #3a3010" }}>
                <span className="text-xs" style={{ fontFamily:"system-ui,sans-serif", color:"#f0c85a" }}>⏳ {pendingLeave} leave pending</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-1" style={{ borderBottom:"1px solid #1a1a1a" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className="px-4 py-2.5 text-sm transition-all"
              style={{ fontFamily:"system-ui,sans-serif", color:activeTab===t.key?"#fff":"#555", borderBottom:activeTab===t.key?"2px solid #fff":"2px solid transparent" }}>
              {t.label}
              {t.key==="leave"  && pendingLeave   > 0 && <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" style={{ fontFamily:"monospace", backgroundColor:"#1f1a0f", color:"#f0c85a" }}>{pendingLeave}</span>}
              {t.key==="offset" && pendingOffsets > 0 && <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" style={{ fontFamily:"monospace", backgroundColor:"#1f1a0f", color:"#f0c85a" }}>{pendingOffsets}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {activeTab==="overview"   && <OverviewTab attendance={attendance} leaveRequests={leaveRequests} otRecords={otRecords} onApprove={approveLeave} onReject={rejectLeave} />}
        {activeTab==="attendance" && <AttendanceTab attendance={attendance} onCorrect={correctAttendance} />}
        {activeTab==="leave"      && <LeaveManagementTab leaveRequests={leaveRequests} onApprove={approveLeave} onReject={rejectLeave} />}
        {activeTab==="balances"   && <LeaveBalancesTab />}
        {activeTab==="otut"       && <OTUTTab otRecords={otRecords} onApproveOT={approveOT} />}
        {activeTab==="offset"     && <OffsetTab offsets={offsets} setOffsets={setOffsets} />}
      </div>
    </div>
  );
}
