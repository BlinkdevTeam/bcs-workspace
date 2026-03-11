import React from "react";
import {
  PriorityBadge, CandidateAvatar,
} from "../../../data/compData";

export default function RecruitmentOverview({ jobs, applicants, interviews }) {
  const openJobs     = jobs.filter(j=>j.status==="Open").length;
  const totalApps    = applicants.length;
  const hired        = applicants.filter(a=>a.status==="Hired").length;
  const scheduled    = interviews.filter(i=>i.status==="Scheduled").length;
  const pendingOffer = applicants.filter(a=>{
    const job = jobs.find(j=>j.id===a.jobId);
    return a.status==="Active" && job?.stages.find(s=>s.id===a.stageId)?.label==="Offer";
  }).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          ["Open Roles",       openJobs,     "#5af07a"],
          ["Total Applicants", totalApps,    "#fff"   ],
          ["Interviews Today", scheduled,    "#5a9af0"],
          ["Pending Offers",   pendingOffer, "#f0c85a"],
          ["Hired This Month", hired,        "#5af07a"],
        ].map(([l,v,c])=>(
          <div key={l} className="rounded-lg p-5" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-2" style={{fontFamily:"system-ui,sans-serif"}}>{l}</p>
            <p className="text-3xl font-light" style={{fontFamily:"monospace",color:c}}>{v}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Open roles */}
        <div className="rounded-lg p-5" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
          <h3 className="text-sm font-normal text-white mb-4">Open Roles</h3>
          <div className="space-y-3">
            {jobs.filter(j=>j.status==="Open").map(job=>{
              const count = applicants.filter(a=>a.jobId===job.id).length;
              const pct   = (job.filled/job.headcount)*100;
              return (
                <div key={job.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white" style={{fontFamily:"system-ui,sans-serif"}}>{job.title}</p>
                      <p className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>{job.dept} · {count} applicant{count!==1?"s":""}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={job.priority}/>
                      <span className="text-xs" style={{fontFamily:"monospace",color:"#555"}}>{job.filled}/{job.headcount}</span>
                    </div>
                  </div>
                  <div className="h-1 rounded-full" style={{backgroundColor:"#1e1e1e"}}>
                    <div className="h-full rounded-full" style={{width:`${pct}%`,backgroundColor:"#5af07a"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming interviews */}
        <div className="rounded-lg p-5" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
          <h3 className="text-sm font-normal text-white mb-4">Upcoming Interviews</h3>
          {interviews.filter(i=>i.status==="Scheduled").length===0 ? (
            <p className="text-gray-600 text-sm text-center py-6" style={{fontFamily:"system-ui,sans-serif"}}>No interviews scheduled</p>
          ) : (
            <div className="space-y-3">
              {interviews.filter(i=>i.status==="Scheduled").map(iv=>{
                const app = applicants.find(a=>a.id===iv.applicantId);
                const job = jobs.find(j=>j.id===iv.jobId);
                return (
                  <div key={iv.id} className="flex items-center justify-between py-2" style={{borderBottom:"1px solid #141414"}}>
                    <div className="flex items-center gap-3">
                      {app && <CandidateAvatar name={app.name} size={28}/>}
                      <div>
                        <p className="text-sm text-white" style={{fontFamily:"system-ui,sans-serif"}}>{app?.name}</p>
                        <p className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>{iv.type} · {job?.title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400" style={{fontFamily:"monospace"}}>{iv.date}</p>
                      <p className="text-xs text-gray-600" style={{fontFamily:"monospace"}}>{iv.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pipeline funnel across all jobs */}
      <div className="rounded-lg p-5" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
        <h3 className="text-sm font-normal text-white mb-4">Applicant Pipeline · All Roles</h3>
        <div className="flex items-end gap-2">
          {["Applied","Screening","Interview","Assessment","Offer","Hired"].map((stage,i,arr)=>{
            const count = applicants.filter(a=>{
              const job=jobs.find(j=>j.id===a.jobId);
              const s=job?.stages.find(s=>s.id===a.stageId);
              return s?.label===stage || (stage==="Applied"&&s?.label==="Applied");
            }).length + (i===0?applicants.filter(a=>{const job=jobs.find(j=>j.id===a.jobId);const s=job?.stages.find(s=>s.id===a.stageId);return !["Screening","Interview","Assessment","Offer","Hired"].includes(s?.label)&&s?.label!=="Applied";}).length:0);
            const maxCount = applicants.length || 1;
            const h = Math.max(24, (count/maxCount)*120);
            return (
              <div key={stage} className="flex-1 flex flex-col items-center gap-2">
                <p className="text-xs font-medium" style={{fontFamily:"monospace",color:"#5af07a"}}>{count}</p>
                <div className="w-full rounded-t" style={{height:h,backgroundColor:"#1e1e1e",position:"relative"}}>
                  <div className="absolute bottom-0 left-0 right-0 rounded-t transition-all"
                    style={{height:"100%",backgroundColor:`rgba(90,160,240,${0.9-(i*0.12)})`}}/>
                </div>
                <p className="text-xs text-gray-600 text-center" style={{fontFamily:"system-ui,sans-serif",fontSize:9}}>{stage}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}