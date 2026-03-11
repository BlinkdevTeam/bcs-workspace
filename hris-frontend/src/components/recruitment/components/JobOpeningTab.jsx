import { useState, useMemo } from "react";
import JobOpeningDrawer from "./JobOpeningDrawer";
import {
  PriorityBadge, DEPTS, StatusBadge
} from "../../../data/compData";

export default function JobOpeningsTab({ jobs, applicants, defaultStages, onAddJob, onEditJob, onToggleStatus }) {
  const [showCreate,    setShowCreate]    = useState(false);
  const [editingJob,    setEditingJob]    = useState(null);
  const [statusFilter,  setStatusFilter]  = useState("All");
  const [deptFilter,    setDeptFilter]    = useState("All");

  const filtered = useMemo(()=>jobs.filter(j=>
    (statusFilter==="All"||j.status===statusFilter) &&
    (deptFilter==="All"||j.dept===deptFilter)
  ),[jobs,statusFilter,deptFilter]);

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <select className="px-3 py-2 rounded text-sm text-gray-300 outline-none" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",border:"1px solid #2a2a2a"}}
            value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
            {["All","Open","Closed"].map(s=><option key={s}>{s==="All"?"All Statuses":s}</option>)}
          </select>
          <select className="px-3 py-2 rounded text-sm text-gray-300 outline-none" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",border:"1px solid #2a2a2a"}}
            value={deptFilter} onChange={e=>setDeptFilter(e.target.value)}>
            <option value="All">All Departments</option>
            {DEPTS.map(d=><option key={d}>{d}</option>)}
          </select>
          <div className="flex-1"/>
          <button onClick={()=>setShowCreate(true)}
            className="px-4 py-2 rounded text-sm font-medium bg-white text-black hover:opacity-80"
            style={{fontFamily:"system-ui,sans-serif"}}>
            + Post Opening
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filtered.map(job=>{
            const count = applicants.filter(a=>a.jobId===job.id).length;
            const hired = applicants.filter(a=>a.jobId===job.id&&a.status==="Hired").length;
            return (
              <div key={job.id} className="rounded-lg p-5 space-y-4 group" style={{backgroundColor:"#0d0d0d",border:`1px solid ${job.status==="Open"?"#1e2a1e":"#1e1e1e"}`}}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={job.status}/>
                      <PriorityBadge priority={job.priority}/>
                    </div>
                    <h3 className="text-base font-normal text-white" style={{fontFamily:"system-ui,sans-serif"}}>{job.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5" style={{fontFamily:"system-ui,sans-serif"}}>{job.dept} · {job.type} · {job.location}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={()=>setEditingJob(job)}
                      className="text-xs px-2 py-1 rounded" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a"}}>Edit</button>
                    <button onClick={()=>onToggleStatus(job.id)}
                      className="text-xs px-2 py-1 rounded" style={{fontFamily:"system-ui,sans-serif",backgroundColor:job.status==="Open"?"#1f0f0f":"#0f1f0f",color:job.status==="Open"?"#f05a5a":"#5af07a",border:`1px solid ${job.status==="Open"?"#3a1515":"#1e3a1e"}`}}>
                      {job.status==="Open"?"Close":"Reopen"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[["Applicants",count,"#fff"],["Headcount",`${job.filled}/${job.headcount}`,"#5a9af0"],["Hired",hired,"#5af07a"]].map(([l,v,c])=>(
                    <div key={l} className="rounded p-2 text-center" style={{backgroundColor:"#111",border:"1px solid #1a1a1a"}}>
                      <p className="text-xs text-gray-600 mb-0.5" style={{fontFamily:"system-ui,sans-serif"}}>{l}</p>
                      <p className="text-base font-light" style={{fontFamily:"monospace",color:c}}>{v}</p>
                    </div>
                  ))}
                </div>

                {/* Pipeline stages preview */}
                <div className="flex items-center gap-1 flex-wrap">
                  {job.stages.map((s,i)=>(
                    <span key={s.id} className="flex items-center gap-1">
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{fontFamily:"system-ui,sans-serif",backgroundColor:s.color+"18",color:s.color,border:`1px solid ${s.color}33`}}>{s.label}</span>
                      {i<job.stages.length-1&&<span className="text-gray-700 text-xs">›</span>}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>
                  <span>{job.salary}</span>
                  <span>Deadline: {job.deadline}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {(showCreate||editingJob) && (
        <JobOpeningDrawer
          job={editingJob}
          defaultStages={defaultStages}
          onClose={()=>{ setShowCreate(false); setEditingJob(null); }}
          onSave={form=>{ editingJob?onEditJob(editingJob.id,form):onAddJob(form); setShowCreate(false); setEditingJob(null); }}
        />
      )}
    </>
  );
}