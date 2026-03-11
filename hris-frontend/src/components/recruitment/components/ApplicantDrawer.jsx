import { useState,} from "react";
import {
  CandidateAvatar, Stars, StatusBadge, INTERVIEW_TYPES, IC, IS
} from "../../../data/compData";

export default function ApplicantDrawer({ applicant, job, interviews, offers, onClose, onUpdateApplicant, onAddInterview, onMoveStage }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [showSchedule, setShowSchedule]   = useState(false);
  const [intForm, setIntForm] = useState({ type:INTERVIEW_TYPES[0], date:"", time:"", interviewer:"", link:"", notes:"" });
  function setIF(k,v){ setIntForm(f=>({...f,[k]:v})); }

  const stage = job?.stages.find(s=>s.id===applicant.stageId) || job?.stages[0];
  const appInterviews = interviews.filter(i=>i.applicantId===applicant.id);
  const appOffer      = offers.find(o=>o.applicantId===applicant.id);

  function scheduleInterview() {
    if (!intForm.date||!intForm.time||!intForm.interviewer) return;
    onAddInterview({ ...intForm, applicantId:applicant.id, jobId:applicant.jobId, status:"Scheduled" });
    setShowSchedule(false);
    setIntForm({ type:INTERVIEW_TYPES[0], date:"", time:"", interviewer:"", link:"", notes:"" });
  }

  const SECTIONS = ["overview","interviews","notes"];

  return (
    <>
      <div className="fixed inset-0 z-20" style={{backgroundColor:"rgba(0,0,0,0.6)"}} onClick={onClose}/>
      <div className="fixed top-0 right-0 h-full z-30 flex flex-col" style={{width:500,backgroundColor:"#080808",borderLeft:"1px solid #222",boxShadow:"-8px 0 40px rgba(0,0,0,0.8)"}}>

        {/* Header */}
        <div className="px-7 py-5 flex-shrink-0" style={{borderBottom:"1px solid #1a1a1a"}}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <CandidateAvatar name={applicant.name} size={44}/>
              <div>
                <h2 className="text-base font-normal text-white">{applicant.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5" style={{fontFamily:"system-ui,sans-serif"}}>{job?.title} · {job?.dept}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Stars rating={applicant.rating} onChange={r=>onUpdateApplicant(applicant.id,{rating:r})}/>
                  <StatusBadge status={applicant.status}/>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-600 hover:text-white text-xl">✕</button>
          </div>

          {/* Pipeline progress */}
          {job && (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>Pipeline</p>
              <div className="flex items-center gap-1 flex-wrap">
                {job.stages.map((s,i)=>{
                  const isCurrent = s.id===applicant.stageId;
                  const isPast    = job.stages.findIndex(x=>x.id===applicant.stageId) > i;
                  return (
                    <button key={s.id} onClick={()=>onMoveStage(applicant.id,s.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all hover:opacity-80"
                      style={{fontFamily:"system-ui,sans-serif",
                        backgroundColor: isCurrent?s.color+"22":isPast?"#0f1f0f":"#111",
                        color: isCurrent?s.color:isPast?"#3a5a3a":"#444",
                        border:`1px solid ${isCurrent?s.color+"55":isPast?"#1e3a1e":"#1e1e1e"}`}}>
                      {isCurrent && <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:s.color}}/>}
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sub-tabs */}
        <div className="flex px-7 gap-4 flex-shrink-0" style={{borderBottom:"1px solid #1a1a1a"}}>
          {SECTIONS.map(s=>(
            <button key={s} onClick={()=>setActiveSection(s)}
              className="py-3 text-xs uppercase tracking-widest capitalize transition-all"
              style={{fontFamily:"system-ui,sans-serif",color:activeSection===s?"#fff":"#444",borderBottom:activeSection===s?"2px solid #fff":"2px solid transparent"}}>
              {s}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-5">

          {/* Overview */}
          {activeSection==="overview" && (
            <div className="space-y-4">
              {[
                ["Email",      applicant.email],
                ["Phone",      applicant.phone],
                ["Applied On", applicant.appliedOn],
                ["Source",     applicant.source],
                ["Current Stage", stage?.label || "—"],
              ].map(([l,v])=>(
                <div key={l} className="flex justify-between py-2" style={{borderBottom:"1px solid #111"}}>
                  <span className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>{l}</span>
                  <span className="text-sm text-gray-300" style={{fontFamily:"system-ui,sans-serif"}}>{v}</span>
                </div>
              ))}

              {/* Offer info */}
              {appOffer && (
                <div className="rounded-lg p-4 mt-2" style={{backgroundColor:"#0a1a0a",border:"1px solid #1e3a1e"}}>
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-3" style={{fontFamily:"system-ui,sans-serif"}}>Offer Details</p>
                  {[["Salary",appOffer.salary],["Start Date",appOffer.startDate],["Expires",appOffer.expiresOn],["Status",""]].map(([l,v])=>(
                    <div key={l} className="flex justify-between py-1.5">
                      <span className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>{l}</span>
                      {l==="Status" ? <StatusBadge status={appOffer.status}/> : <span className="text-xs text-gray-300" style={{fontFamily:"monospace"}}>{v}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {applicant.status==="Active" && (
                  <>
                    <button onClick={()=>onUpdateApplicant(applicant.id,{status:"Rejected"})}
                      className="flex-1 py-2 rounded text-xs hover:opacity-80"
                      style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#1f0f0f",color:"#f05a5a",border:"1px solid #3a1515"}}>
                      Reject
                    </button>
                    {stage?.label==="Offer" && !appOffer && (
                      <button className="flex-1 py-2 rounded text-xs hover:opacity-80"
                        style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#0f1f0f",color:"#5af07a",border:"1px solid #1e3a1e"}}>
                        Generate Offer
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Interviews */}
          {activeSection==="interviews" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest text-gray-500" style={{fontFamily:"system-ui,sans-serif"}}>Scheduled Interviews</p>
                <button onClick={()=>setShowSchedule(!showSchedule)}
                  className="text-xs px-3 py-1.5 rounded hover:opacity-80"
                  style={{fontFamily:"system-ui,sans-serif",backgroundColor:showSchedule?"#111":"#fff",color:showSchedule?"#aaa":"#000",border:"1px solid #2a2a2a"}}>
                  {showSchedule?"Cancel":"+ Schedule"}
                </button>
              </div>

              {showSchedule && (
                <div className="rounded-lg p-4 space-y-3" style={{backgroundColor:"#111",border:"1px solid #2a2a2a"}}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1" style={{fontFamily:"system-ui,sans-serif"}}>Type</label>
                      <select className={IC} style={IS} value={intForm.type} onChange={e=>setIF("type",e.target.value)}>
                        {INTERVIEW_TYPES.map(t=><option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1" style={{fontFamily:"system-ui,sans-serif"}}>Interviewer</label>
                      <input className={IC} style={IS} placeholder="Name" value={intForm.interviewer} onChange={e=>setIF("interviewer",e.target.value)}/>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1" style={{fontFamily:"system-ui,sans-serif"}}>Date</label>
                      <input className={IC} style={IS} placeholder="Mar 10, 2026" value={intForm.date} onChange={e=>setIF("date",e.target.value)}/>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1" style={{fontFamily:"system-ui,sans-serif"}}>Time</label>
                      <input className={IC} style={IS} placeholder="2:00 PM" value={intForm.time} onChange={e=>setIF("time",e.target.value)}/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1" style={{fontFamily:"system-ui,sans-serif"}}>Meeting Link / Location</label>
                    <input className={IC} style={IS} placeholder="https://meet.google.com/…" value={intForm.link} onChange={e=>setIF("link",e.target.value)}/>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1" style={{fontFamily:"system-ui,sans-serif"}}>Notes for Interviewer</label>
                    <textarea className={IC} style={{...IS,height:60,resize:"none"}} placeholder="Topics to cover…" value={intForm.notes} onChange={e=>setIF("notes",e.target.value)}/>
                  </div>
                  <button onClick={scheduleInterview}
                    className="w-full py-2 rounded text-sm font-medium bg-white text-black hover:opacity-80"
                    style={{fontFamily:"system-ui,sans-serif"}}>
                    Schedule Interview ✓
                  </button>
                </div>
              )}

              {appInterviews.length===0 && !showSchedule && (
                <p className="text-center text-gray-600 py-8 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>No interviews scheduled yet.</p>
              )}
              {appInterviews.map(iv=>(
                <div key={iv.id} className="rounded-lg p-4 space-y-2" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white" style={{fontFamily:"system-ui,sans-serif"}}>{iv.type}</p>
                    <StatusBadge status={iv.status}/>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[["Date",iv.date],["Time",iv.time],["Interviewer",iv.interviewer]].map(([l,v])=>(
                      <div key={l}>
                        <p className="text-gray-600"  style={{fontFamily:"system-ui,sans-serif"}}>{l}</p>
                        <p className="text-gray-300 mt-0.5" style={{fontFamily:"system-ui,sans-serif"}}>{v}</p>
                      </div>
                    ))}
                    {iv.link && (
                      <div>
                        <p className="text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>Link</p>
                        <a href={iv.link} className="text-blue-400 text-xs mt-0.5 block truncate" style={{fontFamily:"system-ui,sans-serif"}}>{iv.link}</a>
                      </div>
                    )}
                  </div>
                  {iv.notes && <p className="text-xs text-gray-600 border-t pt-2" style={{fontFamily:"system-ui,sans-serif",borderColor:"#1e1e1e"}}>{iv.notes}</p>}
                  {iv.feedback && (
                    <div className="rounded px-3 py-2 mt-1" style={{backgroundColor:"#0a1a0a",border:"1px solid #1e3a1e"}}>
                      <p className="text-xs text-gray-500 mb-0.5" style={{fontFamily:"system-ui,sans-serif"}}>Feedback</p>
                      <p className="text-xs text-gray-300" style={{fontFamily:"system-ui,sans-serif"}}>{iv.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          {activeSection==="notes" && (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-gray-500" style={{fontFamily:"system-ui,sans-serif"}}>Internal Notes</p>
              <textarea className={IC} style={{...IS,height:160,resize:"none"}}
                placeholder="Add notes about this candidate…"
                value={applicant.notes}
                onChange={e=>onUpdateApplicant(applicant.id,{notes:e.target.value})}/>
              <p className="text-xs text-gray-700" style={{fontFamily:"system-ui,sans-serif"}}>Notes are internal and not visible to the candidate.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}