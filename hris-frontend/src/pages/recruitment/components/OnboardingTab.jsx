import { useState, useMemo} from "react";
import {
  CandidateAvatar, Stars, StatusBadge, INTERVIEW_TYPES, IC, IS
} from "../../../data/compData";

export default function OnboardingTab({ onboarding, setOnboarding, applicants, jobs }) {
  const CATEGORIES = ["Pre-start","Day 1","Week 1","Month 1"];

  return (
    <div className="space-y-5">
      {onboarding.length===0&&(
        <div className="text-center py-16 rounded-lg" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
          <p className="text-gray-600 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>No active onboarding checklists. Hire a candidate to begin.</p>
        </div>
      )}
      {onboarding.map(ob=>{
        const app=applicants.find(a=>a.id===ob.applicantId);
        const job=jobs.find(j=>j.id===ob.jobId);
        const done=ob.tasks.filter(t=>t.done).length;
        const total=ob.tasks.length;
        const pct=Math.round((done/total)*100);

        function toggleTask(tid){
          setOnboarding(p=>p.map(o=>o.id===ob.id?{...o,tasks:o.tasks.map(t=>t.id===tid?{...t,done:!t.done}:t)}:o));
        }

        return (
          <div key={ob.id} className="rounded-lg p-5" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e3a1e"}}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {app&&<CandidateAvatar name={app.name} size={40}/>}
                <div>
                  <p className="text-white text-base" style={{fontFamily:"system-ui,sans-serif"}}>{app?.name}</p>
                  <p className="text-gray-500 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{job?.title} · Starts {ob.startDate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-light" style={{fontFamily:"monospace",color:"#5af07a"}}>{pct}%</p>
                <p className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>{done}/{total} tasks</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full mb-5" style={{backgroundColor:"#1e1e1e"}}>
              <div className="h-full rounded-full transition-all" style={{width:`${pct}%`,backgroundColor:"#5af07a"}}/>
            </div>

            {/* Tasks by category */}
            {CATEGORIES.map(cat=>{
              const tasks=ob.tasks.filter(t=>t.category===cat);
              if(!tasks.length) return null;
              return (
                <div key={cat} className="mb-4">
                  <p className="text-xs uppercase tracking-widest text-gray-600 mb-2" style={{fontFamily:"system-ui,sans-serif"}}>{cat}</p>
                  <div className="space-y-2">
                    {tasks.map(task=>(
                      <div key={task.id}
                        onClick={()=>toggleTask(task.id)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded cursor-pointer hover:bg-opacity-80 transition-all"
                        style={{backgroundColor:task.done?"#0a1a0a":"#111",border:`1px solid ${task.done?"#1e3a1e":"#1e1e1e"}`}}>
                        <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                          style={{backgroundColor:task.done?"#5af07a":"transparent",border:`1.5px solid ${task.done?"#5af07a":"#333"}`}}>
                          {task.done&&<span style={{color:"#000",fontSize:9,lineHeight:1}}>✓</span>}
                        </div>
                        <p className="text-sm flex-1" style={{fontFamily:"system-ui,sans-serif",color:task.done?"#5a8a5a":"#bbb",textDecoration:task.done?"line-through":"none"}}>{task.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}