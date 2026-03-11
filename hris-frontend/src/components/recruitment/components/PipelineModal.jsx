import { useState } from "react";

import {
  IC, IS
} from "../../../data/compData";

export default function PipelineSettingsModal({ stages, onClose, onSave }) {
  const [local, setLocal] = useState(stages.map(s=>({...s})));
  const [newLabel, setNewLabel] = useState("");

  const COLORS = ["#5af07a","#5a9af0","#f0c85a","#c07af0","#f05a5a","#f0905a","#aaaaaa","#555555"];

  function addStage() {
    if (!newLabel.trim()) return;
    setLocal(p=>[...p, { id:"s"+Date.now(), label:newLabel.trim(), color:"#5a9af0", icon:"🔹" }]);
    setNewLabel("");
  }
  function removeStage(id) { setLocal(p=>p.filter(s=>s.id!==id)); }
  function moveUp(i)   { if(i===0) return; setLocal(p=>{ const a=[...p]; [a[i-1],a[i]]=[a[i],a[i-1]]; return a; }); }
  function moveDown(i) { if(i===local.length-1) return; setLocal(p=>{ const a=[...p]; [a[i],a[i+1]]=[a[i+1],a[i]]; return a; }); }
  function updateLabel(id,v){ setLocal(p=>p.map(s=>s.id===id?{...s,label:v}:s)); }
  function updateColor(id,v){ setLocal(p=>p.map(s=>s.id===id?{...s,color:v}:s)); }

  return (
    <>
      <div className="fixed inset-0 z-40" style={{backgroundColor:"rgba(0,0,0,0.8)"}} onClick={onClose}/>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-xl flex flex-col" style={{backgroundColor:"#0d0d0d",border:"1px solid #2a2a2a",maxHeight:"90vh"}}>
          <div className="flex items-center justify-between px-6 py-5 flex-shrink-0" style={{borderBottom:"1px solid #1e1e1e"}}>
            <div>
              <h2 className="text-base font-normal text-white">Global Pipeline Stages</h2>
              <p className="text-xs text-gray-500 mt-0.5" style={{fontFamily:"system-ui,sans-serif"}}>Default stages applied to all new job openings</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
            <div className="rounded-lg px-4 py-3 flex items-start gap-2" style={{backgroundColor:"#0a1a2a",border:"1px solid #1e3a5a"}}>
              <span className="text-blue-400 flex-shrink-0 mt-0.5 text-xs">ℹ</span>
              <p className="text-xs text-gray-400" style={{fontFamily:"system-ui,sans-serif"}}>Changes here apply to new job openings only. Existing openings keep their own pipeline.</p>
            </div>

            {local.map((stage,i) => (
              <div key={stage.id} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{backgroundColor:"#111",border:"1px solid #1e1e1e"}}>
                <div className="flex flex-col gap-0.5">
                  <button onClick={()=>moveUp(i)} className="text-gray-600 hover:text-white text-xs leading-none" disabled={i===0}>▲</button>
                  <button onClick={()=>moveDown(i)} className="text-gray-600 hover:text-white text-xs leading-none" disabled={i===local.length-1}>▼</button>
                </div>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:stage.color}}/>
                <input className="flex-1 bg-transparent text-sm text-white outline-none border-b border-transparent focus:border-gray-600 pb-0.5"
                  style={{fontFamily:"system-ui,sans-serif"}} value={stage.label} onChange={e=>updateLabel(stage.id,e.target.value)}/>
                <div className="flex gap-1">
                  {COLORS.map(c=>(
                    <button key={c} onClick={()=>updateColor(stage.id,c)}
                      className="w-4 h-4 rounded-full border-2 transition-all"
                      style={{backgroundColor:c, borderColor:stage.color===c?"#fff":"transparent"}}/>
                  ))}
                </div>
                <button onClick={()=>removeStage(stage.id)} className="text-gray-600 hover:text-red-400 text-sm ml-1">✕</button>
              </div>
            ))}

            {/* Add new stage */}
            <div className="flex gap-2">
              <input className={IC} style={IS} placeholder="New stage name…" value={newLabel} onChange={e=>setNewLabel(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&addStage()}/>
              <button onClick={addStage} className="px-4 py-2 rounded text-sm whitespace-nowrap hover:opacity-80"
                style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#fff",color:"#000"}}>+ Add</button>
            </div>
          </div>

          <div className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{borderTop:"1px solid #1e1e1e"}}>
            <button onClick={onClose} className="px-4 py-2 rounded text-sm" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a"}}>Cancel</button>
            <button onClick={()=>onSave(local)} className="px-5 py-2 rounded text-sm font-medium bg-white text-black hover:opacity-80" style={{fontFamily:"system-ui,sans-serif"}}>Save Pipeline ✓</button>
          </div>
        </div>
      </div>
    </>
  );
}