import { useState, useMemo } from "react";
import ApplicantDrawer from "./ApplicantDrawer";

import {
  stageForApplicant, CandidateAvatar, Stars, StatusBadge
} from "../../../data/compData";

export default function ApplicantsTab({ jobs, applicants, interviews, offers, onUpdateApplicant, onMoveStage, onAddInterview }) {
  const [search,      setSearch]      = useState("");
  const [jobFilter,   setJobFilter]   = useState("All");
  const [statusFilter,setStatusFilter]= useState("All");
  const [selected,    setSelected]    = useState(null);

  const filtered = useMemo(()=>applicants.filter(a=>{
    const q=search.toLowerCase();
    return (!q||a.name.toLowerCase().includes(q)||a.email.toLowerCase().includes(q))
      &&(jobFilter==="All"||a.jobId===jobFilter)
      &&(statusFilter==="All"||a.status===statusFilter);
  }),[applicants,search,jobFilter,statusFilter]);

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            <input className="w-full pl-9 pr-4 py-2 rounded text-sm text-white placeholder-gray-600 outline-none"
              style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",border:"1px solid #2a2a2a"}}
              placeholder="Search applicants…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select className="px-3 py-2 rounded text-sm text-gray-300 outline-none" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",border:"1px solid #2a2a2a"}}
            value={jobFilter} onChange={e=>setJobFilter(e.target.value)}>
            <option value="All">All Roles</option>
            {jobs.map(j=><option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
          <select className="px-3 py-2 rounded text-sm text-gray-300 outline-none" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",border:"1px solid #2a2a2a"}}
            value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
            {["All","Active","Hired","Rejected"].map(s=><option key={s}>{s==="All"?"All Statuses":s}</option>)}
          </select>
          <div className="flex-1"/>
          <span className="text-gray-600 text-sm" style={{fontFamily:"monospace"}}>{filtered.length} applicants</span>
        </div>

        <div className="rounded-lg overflow-hidden" style={{border:"1px solid #1e1e1e"}}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{backgroundColor:"#0a0a0a",borderBottom:"1px solid #1e1e1e"}}>
                {["Applicant","Role","Stage","Source","Applied","Rating","Status",""].map(h=>(
                  <th key={h} className="px-4 py-3 text-left font-normal text-gray-600 whitespace-nowrap"
                    style={{fontFamily:"system-ui,sans-serif",fontSize:10,textTransform:"uppercase",letterSpacing:"0.07em"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((app,i)=>{
                const job   = jobs.find(j=>j.id===app.jobId);
                const stage = stageForApplicant(app,jobs);
                return (
                  <tr key={app.id} className="group cursor-pointer"
                    style={{borderBottom:i<filtered.length-1?"1px solid #141414":"none",backgroundColor:"#0d0d0d"}}
                    onMouseEnter={e=>e.currentTarget.style.backgroundColor="#111"}
                    onMouseLeave={e=>e.currentTarget.style.backgroundColor="#0d0d0d"}
                    onClick={()=>setSelected(app)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CandidateAvatar name={app.name} size={28}/>
                        <div>
                          <p className="text-white text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{app.name}</p>
                          <p className="text-gray-600 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{job?.title}</td>
                    <td className="px-4 py-3">
                      {stage&&<span className="text-xs px-2 py-0.5 rounded" style={{fontFamily:"system-ui,sans-serif",backgroundColor:stage.color+"18",color:stage.color,border:`1px solid ${stage.color}33`}}>{stage.label}</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{app.source}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap" style={{fontFamily:"monospace"}}>{app.appliedOn}</td>
                    <td className="px-4 py-3"><Stars rating={app.rating}/></td>
                    <td className="px-4 py-3"><StatusBadge status={app.status}/></td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a"}}>
                        View →
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <ApplicantDrawer
          applicant={selected}
          job={jobs.find(j=>j.id===selected.jobId)}
          interviews={interviews}
          offers={offers}
          onClose={()=>setSelected(null)}
          onUpdateApplicant={(id,updates)=>{ onUpdateApplicant(id,updates); setSelected(a=>({...a,...updates})); }}
          onAddInterview={onAddInterview}
          onMoveStage={(id,stageId)=>{ onMoveStage(id,stageId); setSelected(a=>({...a,stageId})); }}
        />
      )}
    </>
  );
}