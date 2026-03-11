import { useState, useMemo} from "react";
import {
  CandidateAvatar, Stars, StatusBadge, INTERVIEW_TYPES, IC, IS
} from "../../../data/compData";

export default function InterviewsTab({ interviews, jobs, applicants }) {
  const [statusFilter,setStatusFilter]=useState("All");

  const filtered = useMemo(()=>interviews.filter(i=>statusFilter==="All"||i.status===statusFilter),[interviews,statusFilter]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex gap-1 rounded-lg p-0.5" style={{backgroundColor:"#111",border:"1px solid #2a2a2a"}}>
          {["All","Scheduled","Completed","Cancelled"].map(s=>(
            <button key={s} onClick={()=>setStatusFilter(s)}
              className="px-3 py-1.5 rounded text-xs transition-all"
              style={{fontFamily:"system-ui,sans-serif",backgroundColor:statusFilter===s?"#fff":"transparent",color:statusFilter===s?"#000":"#555"}}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex-1"/>
        <span className="text-gray-600 text-sm" style={{fontFamily:"monospace"}}>{filtered.length} interviews</span>
      </div>

      <div className="space-y-3">
        {filtered.map(iv=>{
          const app=applicants.find(a=>a.id===iv.applicantId);
          const job=jobs.find(j=>j.id===iv.jobId);
          return (
            <div key={iv.id} className="rounded-lg p-5" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {app&&<CandidateAvatar name={app.name} size={36}/>}
                  <div>
                    <p className="text-white text-sm font-medium" style={{fontFamily:"system-ui,sans-serif"}}>{app?.name}</p>
                    <p className="text-gray-500 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{job?.title} · {iv.type}</p>
                  </div>
                </div>
                <StatusBadge status={iv.status}/>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[["Date",iv.date],["Time",iv.time],["Interviewer",iv.interviewer],["Format",iv.type]].map(([l,v])=>(
                  <div key={l}>
                    <p className="text-xs text-gray-600 mb-0.5" style={{fontFamily:"system-ui,sans-serif"}}>{l}</p>
                    <p className="text-sm text-gray-300" style={{fontFamily:"system-ui,sans-serif"}}>{v}</p>
                  </div>
                ))}
              </div>
              {iv.link&&(
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>Link:</span>
                  <a href={iv.link} className="text-xs text-blue-400 hover:underline" style={{fontFamily:"system-ui,sans-serif"}}>{iv.link}</a>
                </div>
              )}
              {iv.notes&&<p className="text-xs text-gray-600 mt-2 pt-2" style={{fontFamily:"system-ui,sans-serif",borderTop:"1px solid #1a1a1a"}}>📋 {iv.notes}</p>}
              {iv.feedback&&(
                <div className="mt-3 px-3 py-2 rounded" style={{backgroundColor:"#0a1a0a",border:"1px solid #1e3a1e"}}>
                  <p className="text-xs text-gray-500 mb-0.5" style={{fontFamily:"system-ui,sans-serif"}}>Feedback</p>
                  <p className="text-xs text-gray-300" style={{fontFamily:"system-ui,sans-serif"}}>{iv.feedback}</p>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length===0&&(
          <div className="text-center py-16">
            <p className="text-gray-600 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>No interviews found.</p>
          </div>
        )}
      </div>
    </div>
  );
}