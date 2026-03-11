import { useState } from "react";

import {
  CandidateAvatar, Stars, StatusBadge
} from "../../../data/compData";

export default function PipelineTab({ jobs, applicants, onMoveApplicant, onSelectApplicant }) {
  const [selectedJob, setSelectedJob] = useState(jobs.find(j=>j.status==="Open")?.id || jobs[0]?.id);
  const job = jobs.find(j=>j.id===selectedJob);

  return (
    <div className="space-y-5 h-full flex flex-col">
      {/* Job selector */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex gap-1 flex-wrap">
          {jobs.map(j=>(
            <button key={j.id} onClick={()=>setSelectedJob(j.id)}
              className="px-3 py-1.5 rounded text-xs transition-all"
              style={{fontFamily:"system-ui,sans-serif",
                backgroundColor:selectedJob===j.id?"#fff":"#111",
                color:selectedJob===j.id?"#000":"#555",
                border:"1px solid #2a2a2a",
                opacity:j.status==="Closed"?0.5:1}}>
              {j.title}
              {j.status==="Closed"&&<span className="ml-1 text-gray-600">(Closed)</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban board */}
      {job && (
        <div className="flex gap-3 overflow-x-auto pb-4 flex-1">
          {job.stages.map(stage=>{
            const stageApps = applicants.filter(a=>a.jobId===job.id&&a.stageId===stage.id);
            return (
              <div key={stage.id} className="flex-shrink-0 w-60 flex flex-col rounded-lg" style={{backgroundColor:"#0a0a0a",border:"1px solid #1a1a1a"}}>
                {/* Column header */}
                <div className="px-3 py-3 flex-shrink-0" style={{borderBottom:"1px solid #1a1a1a"}}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor:stage.color}}/>
                      <p className="text-xs font-medium text-white" style={{fontFamily:"system-ui,sans-serif"}}>{stage.label}</p>
                    </div>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{fontFamily:"monospace",backgroundColor:"#111",color:"#555"}}>{stageApps.length}</span>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {stageApps.map(app=>(
                    <div key={app.id}
                      onClick={()=>onSelectApplicant(app)}
                      className="rounded-lg p-3 cursor-pointer hover:border-opacity-100 transition-all"
                      style={{backgroundColor:"#111",border:"1px solid #1e1e1e"}}>
                      <div className="flex items-start gap-2 mb-2">
                        <CandidateAvatar name={app.name} size={26}/>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate" style={{fontFamily:"system-ui,sans-serif"}}>{app.name}</p>
                          <p className="text-xs text-gray-600 truncate" style={{fontFamily:"system-ui,sans-serif"}}>{app.source}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Stars rating={app.rating}/>
                        <StatusBadge status={app.status}/>
                      </div>
                      {app.notes && <p className="text-xs text-gray-600 mt-2 line-clamp-2" style={{fontFamily:"system-ui,sans-serif"}}>{app.notes}</p>}
                      {/* Move buttons */}
                      <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100">
                        {job.stages.filter(s=>s.id!==stage.id).slice(0,2).map(s=>(
                          <button key={s.id}
                            onClick={e=>{e.stopPropagation();onMoveApplicant(app.id,s.id);}}
                            className="flex-1 py-1 rounded text-xs hover:opacity-80"
                            style={{fontFamily:"system-ui,sans-serif",backgroundColor:s.color+"22",color:s.color,border:`1px solid ${s.color}33`,fontSize:9}}>
                            → {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {stageApps.length===0&&(
                    <div className="py-6 text-center">
                      <p className="text-gray-700 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>No applicants</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}