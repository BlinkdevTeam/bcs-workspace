import { useState } from "react";

import {
  DEPTS, EMP_TYPES, IC, IS
} from "../../../data/compData";

export default function JobOpeningDrawer({ job, defaultStages, onClose, onSave }) {
  const editing = !!job;
  const [form, setForm] = useState({
    title:       job?.title       || "",
    dept:        job?.dept        || DEPTS[0],
    type:        job?.type        || EMP_TYPES[0],
    location:    job?.location    || "",
    salary:      job?.salary      || "",
    headcount:   job?.headcount   || 1,
    deadline:    job?.deadline    || "",
    description: job?.description || "",
    requirements:job?.requirements|| "",
    priority:    job?.priority    || "Medium",
    stages:      job?.stages      || defaultStages.map(s=>({...s})),
  });
  function set(k,v){ setForm(f=>({...f,[k]:v})); }

  // Stage customization for this job
  const [newStageLabel, setNewStageLabel] = useState("");
  function addStage() {
    if (!newStageLabel.trim()) return;
    set("stages",[...form.stages,{ id:"s"+Date.now(), label:newStageLabel.trim(), color:"#5a9af0", icon:"🔹" }]);
    setNewStageLabel("");
  }
  function removeStage(id){ set("stages",form.stages.filter(s=>s.id!==id)); }
  function moveStage(i,dir){
    const arr=[...form.stages];
    const ni=i+dir;
    if(ni<0||ni>=arr.length) return;
    [arr[i],arr[ni]]=[arr[ni],arr[i]];
    set("stages",arr);
  }

  const canSave = form.title.trim() && form.location.trim() && form.salary.trim() && form.deadline.trim();

  return (
    <>
      <div className="fixed inset-0 z-20" style={{backgroundColor:"rgba(0,0,0,0.6)"}} onClick={onClose}/>
      <div className="fixed top-0 right-0 h-full z-30 flex flex-col" style={{width:520,backgroundColor:"#080808",borderLeft:"1px solid #222",boxShadow:"-8px 0 40px rgba(0,0,0,0.8)"}}>
        <div className="flex items-center justify-between px-7 py-5 flex-shrink-0" style={{borderBottom:"1px solid #1a1a1a"}}>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-0.5" style={{fontFamily:"system-ui,sans-serif"}}>Job Opening</p>
            <h2 className="text-lg font-normal text-white">{editing?"Edit Opening":"Create Opening"}</h2>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          {/* Basic info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Job Title</label>
              <input className={IC} style={IS} placeholder="e.g. Senior Frontend Engineer" value={form.title} onChange={e=>set("title",e.target.value)}/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Department</label>
                <select className={IC} style={IS} value={form.dept} onChange={e=>set("dept",e.target.value)}>
                  {DEPTS.map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Employment Type</label>
                <select className={IC} style={IS} value={form.type} onChange={e=>set("type",e.target.value)}>
                  {EMP_TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Location</label>
                <input className={IC} style={IS} placeholder="e.g. Remote / Manila" value={form.location} onChange={e=>set("location",e.target.value)}/>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Headcount</label>
                <input type="number" min="1" className={IC} style={IS} value={form.headcount} onChange={e=>set("headcount",Number(e.target.value))}/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Salary Range</label>
                <input className={IC} style={IS} placeholder="e.g. ₱80,000 – ₱100,000" value={form.salary} onChange={e=>set("salary",e.target.value)}/>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Application Deadline</label>
                <input className={IC} style={IS} placeholder="e.g. Mar 31, 2026" value={form.deadline} onChange={e=>set("deadline",e.target.value)}/>
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2" style={{fontFamily:"system-ui,sans-serif"}}>Priority</label>
              <div className="flex gap-2">
                {["High","Medium","Low"].map(p=>(
                  <button key={p} onClick={()=>set("priority",p)}
                    className="px-4 py-1.5 rounded text-xs transition-all"
                    style={{fontFamily:"system-ui,sans-serif",
                      backgroundColor: form.priority===p ? (p==="High"?"#1f0f0f":p==="Medium"?"#1f1a0f":"#0f1f0f") : "#111",
                      color: form.priority===p ? (p==="High"?"#f05a5a":p==="Medium"?"#f0c85a":"#5af07a") : "#555",
                      border:`1px solid ${form.priority===p?(p==="High"?"#3a1515":p==="Medium"?"#3a3010":"#1e3a1e"):"#2a2a2a"}`}}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Description</label>
              <textarea className={IC} style={{...IS,height:80,resize:"none"}} placeholder="Role description…" value={form.description} onChange={e=>set("description",e.target.value)}/>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Requirements</label>
              <textarea className={IC} style={{...IS,height:64,resize:"none"}} placeholder="Key requirements…" value={form.requirements} onChange={e=>set("requirements",e.target.value)}/>
            </div>
          </div>

          {/* Pipeline customization */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs uppercase tracking-widest text-gray-500" style={{fontFamily:"system-ui,sans-serif"}}>Hiring Pipeline</label>
              <span className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>Customized for this role</span>
            </div>
            <div className="space-y-2 mb-3">
              {form.stages.map((s,i)=>(
                <div key={s.id} className="flex items-center gap-2 px-3 py-2 rounded" style={{backgroundColor:"#111",border:"1px solid #1e1e1e"}}>
                  <div className="flex flex-col gap-0.5">
                    <button onClick={()=>moveStage(i,-1)} className="text-gray-700 hover:text-white text-xs leading-none" disabled={i===0}>▲</button>
                    <button onClick={()=>moveStage(i,1)}  className="text-gray-700 hover:text-white text-xs leading-none" disabled={i===form.stages.length-1}>▼</button>
                  </div>
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor:s.color}}/>
                  <span className="text-sm text-gray-300 flex-1" style={{fontFamily:"system-ui,sans-serif"}}>{s.label}</span>
                  <button onClick={()=>removeStage(s.id)} className="text-gray-700 hover:text-red-400 text-xs">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className={IC} style={IS} placeholder="Add stage…" value={newStageLabel} onChange={e=>setNewStageLabel(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&addStage()}/>
              <button onClick={addStage} className="px-3 py-2 rounded text-xs hover:opacity-80 whitespace-nowrap" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#1e1e1e",color:"#aaa",border:"1px solid #2a2a2a"}}>+ Add</button>
            </div>
          </div>
        </div>

        <div className="px-7 py-5 flex items-center justify-between flex-shrink-0" style={{borderTop:"1px solid #1a1a1a"}}>
          <button onClick={onClose} className="px-4 py-2 rounded text-sm" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a"}}>Cancel</button>
          <button onClick={()=>canSave&&onSave(form)} disabled={!canSave}
            className="px-5 py-2 rounded text-sm font-medium hover:opacity-80"
            style={{fontFamily:"system-ui,sans-serif",backgroundColor:canSave?"#fff":"#1a1a1a",color:canSave?"#000":"#444",cursor:canSave?"pointer":"not-allowed"}}>
            {editing?"Save Changes ✓":"Post Opening ✓"}
          </button>
        </div>
      </div>
    </>
  );
}