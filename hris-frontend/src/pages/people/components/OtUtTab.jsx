import { useState } from "react";
import AttachmentModal from "./AttachmentModal";

// ── OT / UT TAB ───────────────────────────────────────────────────────────────
export default function OTUTTab({ emptyState = false, BADGE}) {
  const [modalItem, setModalItem]   = useState(null);
  const [view, setView]             = useState("ot"); // "ot" | "ut"

  // ── OVERTIME RECORDS ──
  const [otRecords, setOtRecords] = useState(
    emptyState ? [
      { id:1, kind:"ot", date:"Feb 13, 2026", day:"Thu", clockIn:"9:05 AM",  clockOut:"7:30 PM", expected:8, actual:10.42, diff:2.42, status:"Approved",  reason:"Deployment support",     filed:"Feb 13, 2026", attachments:[{name:"OT_Auth_Feb13.pdf",ext:"pdf",size:"76 KB",label:"OT authorization form"},{name:"Deployment_Schedule.pdf",ext:"pdf",size:"204 KB",label:"Deployment schedule"}] },
      { id:2, kind:"ot", date:"Feb 11, 2026", day:"Tue", clockIn:"8:45 AM",  clockOut:"5:48 PM", expected:8, actual:9.05,  diff:1.05, status:"Approved",  reason:"Design review meeting",  filed:"Feb 11, 2026", attachments:[{name:"OT_Auth_Feb11.pdf",ext:"pdf",size:"76 KB",label:"OT authorization form"}] },
      { id:3, kind:"ot", date:"Feb 7, 2026",  day:"Fri", clockIn:"9:10 AM",  clockOut:"8:00 PM", expected:8, actual:10.83, diff:2.83, status:"Approved",  reason:"End-of-sprint demo",     filed:"Feb 7, 2026",  attachments:[{name:"OT_Auth_Feb07.pdf",ext:"pdf",size:"76 KB",label:"OT authorization form"},{name:"Sprint_Demo_Agenda.pdf",ext:"pdf",size:"110 KB",label:"Sprint documentation"}] },
      { id:4, kind:"ot", date:"Jan 30, 2026", day:"Fri", clockIn:"9:00 AM",  clockOut:"7:15 PM", expected:8, actual:10.25, diff:2.25, status:"Rejected",  reason:"Infrastructure upgrade",  filed:"Jan 30, 2026", attachments:[{name:"OT_Auth_Jan30.pdf",ext:"pdf",size:"76 KB",label:"OT authorization form"}] },
    ] : [
      { id:1, kind:"ot", date:"Feb 20, 2026", day:"Thu", clockIn:"8:52 AM",  clockOut:"6:45 PM", expected:8, actual:9.88,  diff:1.88, status:"Pending",    reason:"Sprint deadline",        filed:"Feb 20, 2026", attachments:[{name:"OT_Auth_Feb20.pdf",ext:"pdf",size:"76 KB",label:"OT authorization form"},{name:"Project_Deliverable.docx",ext:"docx",size:"128 KB",label:"Deliverable requiring OT"}] },
      { id:2, kind:"ot", date:"Jan 30, 2026", day:"Fri", clockIn:"9:00 AM",  clockOut:"7:15 PM", expected:8, actual:10.25, diff:2.25, status:"For Review",  reason:"Infrastructure upgrade",  filed:"Jan 30, 2026", attachments:[{name:"OT_Auth_Jan30.pdf",ext:"pdf",size:"76 KB",label:"OT authorization form"}] },
      { id:3, kind:"ot", date:"Feb 19, 2026", day:"Wed", clockIn:"9:01 AM",  clockOut:"5:58 PM", expected:8, actual:8.95,  diff:0.95, status:"Approved",   reason:"Client bug fix",          filed:"Feb 19, 2026", attachments:[{name:"OT_Auth_Feb19.pdf",ext:"pdf",size:"76 KB",label:"OT authorization form"},{name:"Client_Ticket.pdf",ext:"pdf",size:"92 KB",label:"Client incident report"}] },
      { id:4, kind:"ot", date:"Feb 13, 2026", day:"Thu", clockIn:"9:05 AM",  clockOut:"7:30 PM", expected:8, actual:10.42, diff:2.42, status:"Approved",   reason:"Deployment support",      filed:"Feb 13, 2026", attachments:[{name:"OT_Auth_Feb13.pdf",ext:"pdf",size:"76 KB",label:"OT authorization form"},{name:"Deployment_Schedule.pdf",ext:"pdf",size:"204 KB",label:"Deployment schedule"},{name:"Manager_Approval.pdf",ext:"pdf",size:"58 KB",label:"Manager email approval"}] },
      { id:5, kind:"ot", date:"Feb 7, 2026",  day:"Fri", clockIn:"9:10 AM",  clockOut:"8:00 PM", expected:8, actual:10.83, diff:2.83, status:"Approved",   reason:"End-of-sprint demo",      filed:"Feb 7, 2026",  attachments:[{name:"OT_Auth_Feb07.pdf",ext:"pdf",size:"76 KB",label:"OT authorization form"},{name:"Sprint_Demo_Agenda.pdf",ext:"pdf",size:"110 KB",label:"Sprint documentation"}] },
    ]
  );

  // ── UNDERTIME RECORDS ──
  const [utRecords, setUtRecords] = useState(
    emptyState ? [
      { id:1, kind:"ut", date:"Feb 5, 2026",  day:"Thu", clockIn:"9:00 AM",  clockOut:"3:45 PM", expected:8, actual:6.75, diff:1.25, status:"Approved",  reason:"Early dismissal – power outage", filed:"Feb 5, 2026",  attachments:[{name:"UT_Form_Feb05.pdf",ext:"pdf",size:"68 KB",label:"Undertime form"},{name:"IT_Incident_Report.pdf",ext:"pdf",size:"144 KB",label:"Incident report – power outage"}] },
      { id:2, kind:"ut", date:"Jan 22, 2026", day:"Thu", clockIn:"9:10 AM",  clockOut:"4:30 PM", expected:8, actual:7.33, diff:0.67, status:"Approved",  reason:"Doctor appointment",             filed:"Jan 22, 2026", attachments:[{name:"UT_Form_Jan22.pdf",ext:"pdf",size:"68 KB",label:"Undertime form"},{name:"Medical_Slip_Jan22.pdf",ext:"pdf",size:"102 KB",label:"Medical appointment slip"}] },
      { id:3, kind:"ut", date:"Jan 10, 2026", day:"Sat", clockIn:"9:05 AM",  clockOut:"2:00 PM", expected:8, actual:4.92, diff:3.08, status:"Rejected",  reason:"Personal errand",                filed:"Jan 10, 2026", attachments:[{name:"UT_Form_Jan10.pdf",ext:"pdf",size:"68 KB",label:"Undertime form"}] },
    ] : [
      { id:1, kind:"ut", date:"Feb 18, 2026", day:"Tue", clockIn:"9:14 AM",  clockOut:"4:30 PM", expected:8, actual:7.27, diff:0.73, status:"Pending",    reason:"Dental appointment",             filed:"Feb 18, 2026", attachments:[{name:"UT_Form_Feb18.pdf",ext:"pdf",size:"68 KB",label:"Undertime form"},{name:"Dental_Appointment_Slip.pdf",ext:"pdf",size:"118 KB",label:"Appointment slip"}] },
      { id:2, kind:"ut", date:"Feb 12, 2026", day:"Wed", clockIn:"9:00 AM",  clockOut:"3:45 PM", expected:8, actual:6.75, diff:1.25, status:"For Review",  reason:"Family emergency",               filed:"Feb 12, 2026", attachments:[] },
      { id:3, kind:"ut", date:"Feb 5, 2026",  day:"Thu", clockIn:"9:00 AM",  clockOut:"3:45 PM", expected:8, actual:6.75, diff:1.25, status:"Approved",   reason:"Early dismissal – power outage", filed:"Feb 5, 2026",  attachments:[{name:"UT_Form_Feb05.pdf",ext:"pdf",size:"68 KB",label:"Undertime form"},{name:"IT_Incident_Report.pdf",ext:"pdf",size:"144 KB",label:"Incident report"}] },
      { id:4, kind:"ut", date:"Jan 22, 2026", day:"Thu", clockIn:"9:10 AM",  clockOut:"4:30 PM", expected:8, actual:7.33, diff:0.67, status:"Approved",   reason:"Doctor appointment",             filed:"Jan 22, 2026", attachments:[{name:"UT_Form_Jan22.pdf",ext:"pdf",size:"68 KB",label:"Undertime form"},{name:"Medical_Slip.pdf",ext:"pdf",size:"102 KB",label:"Medical appointment slip"}] },
    ]
  );

  function approveOT(id, r) { setOtRecords(x => x.map(e => e.id===id ? {...e,status:"Approved",remarks:r} : e)); }
  function rejectOT(id, r)  { setOtRecords(x => x.map(e => e.id===id ? {...e,status:"Rejected",remarks:r} : e)); }
  function approveUT(id, r) { setUtRecords(x => x.map(e => e.id===id ? {...e,status:"Approved",remarks:r} : e)); }
  function rejectUT(id, r)  { setUtRecords(x => x.map(e => e.id===id ? {...e,status:"Rejected",remarks:r} : e)); }

  const otRate       = (142000 / 52 / 40) * 1.25;
  const approvedOTh  = otRecords.filter(r=>r.status==="Approved").reduce((s,r)=>s+r.diff,0);
  const pendingOT    = otRecords.filter(r=>r.status==="Pending"||r.status==="For Review");
  const approvedUTh  = utRecords.filter(r=>r.status==="Approved").reduce((s,r)=>s+r.diff,0);
  const pendingUT    = utRecords.filter(r=>r.status==="Pending"||r.status==="For Review");
  const allPending   = [...pendingOT.map(r=>({...r,_src:"ot"})), ...pendingUT.map(r=>({...r,_src:"ut"}))];

  const activeRecords = view === "ot" ? otRecords : utRecords;

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* LEFT */}
      <div className="col-span-1 space-y-5">

        {/* OT summary card */}
        <div className="rounded-lg p-5" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
          <h3 className="text-sm font-normal text-white mb-4">Summary · Feb 2026</h3>

          {/* OT block */}
          <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily:"system-ui,sans-serif", color:"#5a9af0" }}>Overtime</p>
          {[
            { label:"Approved",    value:`${approvedOTh.toFixed(1)}h`,                  color:"#5af07a" },
            { label:"Pending",     value:`${pendingOT.reduce((s,r)=>s+r.diff,0).toFixed(1)}h`, color: pendingOT.length>0?"#f0c85a":"#555" },
            { label:"Pay Impact",  value:`$${(approvedOTh*otRate).toFixed(2)}`,           color:"#5a9af0" },
          ].map(({label,value,color})=>(
            <div key={label} className="flex justify-between py-2" style={{ borderBottom:"1px solid #1a1a1a" }}>
              <span className="text-gray-500 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{label}</span>
              <span className="text-sm" style={{fontFamily:"monospace",color}}>{value}</span>
            </div>
          ))}

          {/* UT block */}
          <p className="text-xs uppercase tracking-widest mt-4 mb-2" style={{ fontFamily:"system-ui,sans-serif", color:"#f05a5a" }}>Undertime</p>
          {[
            { label:"Approved",    value:`${approvedUTh.toFixed(2)}h`,                  color:"#f05a5a" },
            { label:"Pending",     value:`${pendingUT.reduce((s,r)=>s+r.diff,0).toFixed(2)}h`, color: pendingUT.length>0?"#f0c85a":"#555" },
            { label:"Deduction",   value:`-$${(approvedUTh*(142000/52/40)).toFixed(2)}`, color:"#f05a5a" },
          ].map(({label,value,color})=>(
            <div key={label} className="flex justify-between py-2" style={{ borderBottom:"1px solid #1a1a1a" }}>
              <span className="text-gray-500 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{label}</span>
              <span className="text-sm" style={{fontFamily:"monospace",color}}>{value}</span>
            </div>
          ))}
        </div>

        {/* Needs Action — combined OT+UT pending */}
        <div className="rounded-lg p-5" style={{
          backgroundColor: allPending.length===0 ? "#0d0d0d" : "#0a0f1a",
          border: `1px solid ${allPending.length===0 ? "#1e1e1e" : "#1e2a3a"}`,
        }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-widest text-gray-500" style={{fontFamily:"system-ui,sans-serif"}}>Needs Action</p>
            {allPending.length>0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{fontFamily:"monospace",backgroundColor:"#0a1a2a",color:"#5a9af0"}}>{allPending.length}</span>
            )}
          </div>
          {allPending.length===0 ? (
            <div className="flex flex-col items-center text-center py-6 gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl" style={{backgroundColor:"#111",border:"1px solid #2a2a2a"}}>✅</div>
              <div>
                <p className="text-gray-300 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>All caught up</p>
                <p className="text-gray-600 text-xs mt-1" style={{fontFamily:"system-ui,sans-serif"}}>No pending OT or UT requests to review.</p>
              </div>
              <div className="w-full mt-1 rounded px-3 py-2.5 text-center" style={{backgroundColor:"#111",border:"1px dashed #2a2a2a"}}>
                <p className="text-gray-600 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>New requests will appear here.</p>
              </div>
            </div>
          ):(
            <div className="space-y-2">
              {allPending.map(r=>(
                <button key={`${r._src}-${r.id}`}
                  onClick={()=>{ setView(r._src); setModalItem(r); }}
                  className="w-full text-left px-3 py-2.5 rounded hover:opacity-80"
                  style={{backgroundColor:"#111",border:"1px solid #2a2a2a"}}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{fontFamily:"system-ui,sans-serif",backgroundColor:r._src==="ot"?"#0a1a2a":"#1f0f0f",color:r._src==="ot"?"#5a9af0":"#f05a5a"}}>{r._src==="ot"?"OT":"UT"}</span>
                    <p className="text-gray-200 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{r.date} · {r.day}</p>
                  </div>
                  <p className="text-gray-500 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{r._src==="ot"?"+":"-"}{r.diff.toFixed(2)}h · {r.reason}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block" style={{fontFamily:"system-ui,sans-serif",...BADGE[r.status]}}>{r.status}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Requirement notes */}
        <div className="rounded-lg p-4" style={{backgroundColor:"#0a0a0a",border:"1px solid #1e1e1e"}}>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-1" style={{fontFamily:"system-ui,sans-serif"}}>📎 OT required docs</p>
              <p className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>OT authorization form + supporting doc (client ticket, project brief, deployment schedule, or manager email).</p>
            </div>
            <div style={{borderTop:"1px solid #1a1a1a",paddingTop:"0.75rem"}}>
              <p className="text-xs text-gray-400 mb-1" style={{fontFamily:"system-ui,sans-serif"}}>📎 UT required docs</p>
              <p className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>Undertime form + reason document (appointment slip, medical cert, or incident report). Missing attachments go to "For Review."</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="col-span-2 space-y-5">
        {/* OT / UT toggle */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {[["ot","Overtime"],["ut","Undertime"]].map(([key,label])=>(
              <button key={key} onClick={()=>setView(key)}
                className="px-4 py-2 rounded text-sm transition-all"
                style={{
                  fontFamily:"system-ui,sans-serif",
                  backgroundColor: view===key ? (key==="ot"?"#0a1a2a":"#1f0a0a") : "#111",
                  color: view===key ? (key==="ot"?"#5a9af0":"#f05a5a") : "#666",
                  border: view===key ? `1px solid ${key==="ot"?"#1e3a5a":"#4a1a1a"}` : "1px solid #2a2a2a",
                  fontWeight: view===key ? 600 : 400,
                }}>
                {label}
                {(key==="ot"?pendingOT:pendingUT).length>0&&(
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full" style={{backgroundColor:key==="ot"?"#1e3a5a":"#4a1a1a",color:key==="ot"?"#5a9af0":"#f05a5a"}}>
                    {(key==="ot"?pendingOT:pendingUT).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <button className="px-3 py-1.5 rounded text-xs bg-white text-black hover:opacity-80" style={{fontFamily:"system-ui,sans-serif"}}>
            {view==="ot"?"+ Log Overtime":"+ Log Undertime"}
          </button>
        </div>

        <div>
          <p className="text-xs text-gray-600 mb-4" style={{fontFamily:"system-ui,sans-serif"}}>Click any row to review request and attachments</p>
        </div>

        {/* Table */}
        <div className="rounded-lg overflow-hidden" style={{border:"1px solid #1e1e1e"}}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{backgroundColor:"#0a0a0a",borderBottom:"1px solid #1e1e1e"}}>
                {["Date","In","Out","Expected","Actual", view==="ot"?"OT Hours":"UT Hours", view==="ot"?"Pay Impact":"Deduction","Reason","Attachments","Status"].map(h=>(
                  <th key={h} className="px-3 py-3 text-left font-normal text-gray-600" style={{fontFamily:"system-ui,sans-serif",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeRecords.map(r=>{
                const diffColor = view==="ot" ? "#5a9af0" : "#f05a5a";
                const payVal    = view==="ot"
                  ? (r.status==="Approved" ? `$${(r.diff*otRate).toFixed(2)}` : "—")
                  : (r.status==="Approved" ? `-$${(r.diff*(142000/52/40)).toFixed(2)}` : "—");
                const payColor  = view==="ot"
                  ? (r.status==="Approved" ? "#5af07a" : "#555")
                  : (r.status==="Approved" ? "#f05a5a" : "#555");
                return(
                  <tr key={r.id} onClick={()=>setModalItem(r)}
                    className="cursor-pointer transition-colors"
                    style={{borderBottom:"1px solid #141414",backgroundColor:view==="ot"?"#0d0d10":"#100d0d"}}
                    onMouseEnter={e=>e.currentTarget.style.backgroundColor=view==="ot"?"#101018":"#180e0e"}
                    onMouseLeave={e=>e.currentTarget.style.backgroundColor=view==="ot"?"#0d0d10":"#100d0d"}>
                    <td className="px-3 py-3">
                      <p className="text-gray-200 text-xs whitespace-nowrap" style={{fontFamily:"system-ui,sans-serif"}}>{r.date}</p>
                      <p className="text-gray-600 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{r.day}</p>
                    </td>
                    <td className="px-3 py-3 text-gray-400 text-xs whitespace-nowrap" style={{fontFamily:"monospace"}}>{r.clockIn}</td>
                    <td className="px-3 py-3 text-gray-400 text-xs whitespace-nowrap" style={{fontFamily:"monospace"}}>{r.clockOut}</td>
                    <td className="px-3 py-3 text-gray-500 text-xs" style={{fontFamily:"monospace"}}>{r.expected}h</td>
                    <td className="px-3 py-3 text-white text-xs" style={{fontFamily:"monospace"}}>{r.actual.toFixed(2)}h</td>
                    <td className="px-3 py-3 text-xs font-medium" style={{fontFamily:"monospace",color:diffColor}}>{view==="ot"?"+":"-"}{r.diff.toFixed(2)}h</td>
                    <td className="px-3 py-3 text-xs" style={{fontFamily:"monospace",color:payColor}}>{payVal}</td>
                    <td className="px-3 py-3 text-gray-500 text-xs truncate" style={{fontFamily:"system-ui,sans-serif",maxWidth:"8rem"}}>{r.reason}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs" style={{fontFamily:"monospace",color:r.attachments.length>0?"#fff":"#f05a5a"}}>{r.attachments.length}</span>
                        <span className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>file{r.attachments.length!==1?"s":""}</span>
                        {r.attachments.length===0&&<span className="text-xs px-1.5 py-0.5 rounded" style={{backgroundColor:"#1f0f0f",color:"#f05a5a",fontFamily:"system-ui,sans-serif"}}>Missing</span>}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap" style={{fontFamily:"system-ui,sans-serif",...BADGE[r.status]}}>{r.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalItem && (
        <AttachmentModal
          item={modalItem}
          type={modalItem.kind==="ut" ? "undertime" : "overtime"}
          onClose={()=>setModalItem(null)}
          onApprove={modalItem.kind==="ut" ? approveUT : approveOT}
          onReject={modalItem.kind==="ut"  ? rejectUT  : rejectOT}
        />
      )}
    </div>
  );
}