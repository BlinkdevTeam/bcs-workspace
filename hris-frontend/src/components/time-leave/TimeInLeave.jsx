import { useState, useMemo } from "react";
import StatCard from "./components/StatCard";
import OverviewTab from "./components/OverviewTab";
import AttendanceTab from "./components/AttendanceTab";
import LeaveManagementTab from "./components/LeaveManagementTab";
import LeaveBalancesTab from "./components/LeaveBalancesTab";
import OTUTTab from "./components/OTUTTab";
import OffsetTab from "./components/OffsetTab";
import {
  EMPLOYEES, ATTENDANCE_TODAY, LEAVE_REQUESTS_SEED, LEAVE_BALANCES, OT_UT_RECORDS, ATTENDANCE_STYLE, OFFSET_BANK_SEED, OFFSET_REQUESTS_SEED, CURRENT_CUTOFF_END 
} from "../../data/compData";


// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────

function fmt(n){ return n.toLocaleString("en-US",{minimumFractionDigits:1,maximumFractionDigits:1}); }

// ── STAT CARD ─────────────────────────────────────────────────────────────────
<StatCard
    label="Total Annual Payroll"
    // value={fmt(totalPayroll)}
    sub="All active employees"
  />

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
        {activeTab === "overview" && (
          <OverviewTab
            attendance={attendance}
            leaveRequests={leaveRequests}
            otRecords={otRecords}
            employees={EMPLOYEES}
            leaveBalances={LEAVE_BALANCES}
            attendanceStyle={ATTENDANCE_STYLE}
            fmt={fmt}
            onApprove={approveLeave}
            onReject={rejectLeave}
          />
        )}
        {activeTab==="attendance" && <AttendanceTab attendance={attendance} onCorrect={correctAttendance}/>}
        {activeTab==="leave"      && <LeaveManagementTab leaveRequests={leaveRequests} onApprove={approveLeave} onReject={rejectLeave}/>}
        {activeTab==="balances"   && <LeaveBalancesTab/>}
        {activeTab==="otut"       && <OTUTTab otRecords={otRecords} onApproveOT={approveOT}/>}
        {activeTab==="offset"     && <OffsetTab bank={offsetBank} setBank={setOffsetBank} requests={offsetRequests} setRequests={setOffsetRequests}/>}
      </div>
    </div>
  );
}
