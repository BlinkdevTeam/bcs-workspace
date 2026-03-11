import { useState, useMemo } from "react";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const AV_COLORS = ["#e8e0d5","#c8bfb0","#a8a090","#888070","#686050","#484030","#d5e0e8","#b0c0cf","#8090a8","#506080"];
function initials(name){ return name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(); }
function CandidateAvatar({ name, size=32 }) {
  const idx = name.charCodeAt(0) % AV_COLORS.length;
  const bg  = AV_COLORS[idx];
  const fg  = "#000";
  return (
    <div className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
      style={{ width:size, height:size, backgroundColor:bg, color:fg, fontFamily:"system-ui,sans-serif", fontSize:size<28?9:size<40?11:14 }}>
      {initials(name)}
    </div>
  );
}

const IC = "w-full px-3 py-2.5 rounded text-sm text-white placeholder-gray-600 outline-none";
const IS = { backgroundColor:"#111", border:"1px solid #2a2a2a", fontFamily:"system-ui,sans-serif" };

const DEPTS = ["Engineering","Sales","Product","Design","Operations","Marketing","HR & Admin"];
const EMP_TYPES = ["Full-time","Part-time","Contract","Internship"];
const INTERVIEW_TYPES = ["Phone Screen","Video Call","In-Person","Panel","Technical","Final"];

// ── DEFAULT GLOBAL PIPELINE STAGES ───────────────────────────────────────────
const DEFAULT_STAGES_SEED = [
  { id:"s1", label:"Applied",     color:"#555",    icon:"📥" },
  { id:"s2", label:"Screening",   color:"#5a9af0", icon:"🔍" },
  { id:"s3", label:"Interview",   color:"#f0c85a", icon:"🗣" },
  { id:"s4", label:"Assessment",  color:"#c07af0", icon:"📝" },
  { id:"s5", label:"Offer",       color:"#5af07a", icon:"📄" },
  { id:"s6", label:"Hired",       color:"#5af07a", icon:"✅" },
];

// ── SEED DATA ─────────────────────────────────────────────────────────────────
const JOB_OPENINGS_SEED = [
  {
    id:"j1", title:"Senior Frontend Engineer", dept:"Engineering", type:"Full-time",
    location:"Remote", salary:"₱120,000 – ₱150,000", headcount:2, filled:0,
    postedOn:"Feb 15, 2026", deadline:"Mar 31, 2026", status:"Open", priority:"High",
    description:"We are looking for a Senior Frontend Engineer to join our Engineering team. You will be responsible for building and maintaining high-quality web applications.",
    requirements:"5+ years React experience, TypeScript, strong UI/UX sensibility",
    stages:[
      { id:"s1", label:"Applied",           color:"#555",    icon:"📥" },
      { id:"s2", label:"Technical Screen",  color:"#5a9af0", icon:"💻" },
      { id:"s3", label:"HR Interview",      color:"#f0c85a", icon:"🗣" },
      { id:"s4", label:"Technical Interview",color:"#c07af0",icon:"🔬" },
      { id:"s5", label:"Offer",             color:"#5af07a", icon:"📄" },
      { id:"s6", label:"Hired",             color:"#5af07a", icon:"✅" },
    ],
  },
  {
    id:"j2", title:"Sales Account Executive", dept:"Sales", type:"Full-time",
    location:"On-site · Manila", salary:"₱60,000 – ₱80,000 + commission", headcount:3, filled:1,
    postedOn:"Feb 20, 2026", deadline:"Mar 20, 2026", status:"Open", priority:"High",
    description:"Drive revenue growth by managing the full sales cycle from prospecting to close.",
    requirements:"3+ years B2B sales, strong communication, CRM experience",
    stages:[
      { id:"s1", label:"Applied",      color:"#555",    icon:"📥" },
      { id:"s2", label:"HR Interview", color:"#5a9af0", icon:"🗣" },
      { id:"s3", label:"Sales Demo",   color:"#f0c85a", icon:"🎯" },
      { id:"s4", label:"Offer",        color:"#5af07a", icon:"📄" },
      { id:"s5", label:"Hired",        color:"#5af07a", icon:"✅" },
    ],
  },
  {
    id:"j3", title:"UX Designer", dept:"Design", type:"Full-time",
    location:"Hybrid · Manila", salary:"₱70,000 – ₱90,000", headcount:1, filled:0,
    postedOn:"Feb 28, 2026", deadline:"Apr 15, 2026", status:"Open", priority:"Medium",
    description:"Design intuitive and beautiful user experiences across our product suite.",
    requirements:"3+ years UX/UI, Figma proficiency, portfolio required",
    stages:[
      { id:"s1", label:"Applied",          color:"#555",    icon:"📥" },
      { id:"s2", label:"Portfolio Review", color:"#5a9af0", icon:"🖼" },
      { id:"s3", label:"HR Interview",     color:"#f0c85a", icon:"🗣" },
      { id:"s4", label:"Design Test",      color:"#c07af0", icon:"✏" },
      { id:"s5", label:"Offer",            color:"#5af07a", icon:"📄" },
      { id:"s6", label:"Hired",            color:"#5af07a", icon:"✅" },
    ],
  },
  {
    id:"j4", title:"Data Analyst", dept:"Operations", type:"Full-time",
    location:"Remote", salary:"₱65,000 – ₱85,000", headcount:1, filled:0,
    postedOn:"Mar 1, 2026", deadline:"Apr 1, 2026", status:"Open", priority:"Medium",
    description:"Turn complex data into actionable insights that drive business decisions.",
    requirements:"SQL, Python, BI tools (Tableau/PowerBI), statistics background",
    stages:[
      { id:"s1", label:"Applied",        color:"#555",    icon:"📥" },
      { id:"s2", label:"Screening",      color:"#5a9af0", icon:"🔍" },
      { id:"s3", label:"HR Interview",   color:"#f0c85a", icon:"🗣" },
      { id:"s4", label:"Case Study",     color:"#c07af0", icon:"📊" },
      { id:"s5", label:"Offer",          color:"#5af07a", icon:"📄" },
      { id:"s6", label:"Hired",          color:"#5af07a", icon:"✅" },
    ],
  },
  {
    id:"j5", title:"Marketing Manager", dept:"Marketing", type:"Full-time",
    location:"On-site · Manila", salary:"₱80,000 – ₱100,000", headcount:1, filled:1,
    postedOn:"Jan 10, 2026", deadline:"Feb 28, 2026", status:"Closed", priority:"Low",
    description:"Lead our marketing efforts across digital and traditional channels.",
    requirements:"5+ years marketing, team management, digital marketing expertise",
    stages: DEFAULT_STAGES_SEED,
  },
];

const APPLICANTS_SEED = [
  { id:"a1",  jobId:"j1", name:"Rafael Santos",    email:"rafael.s@email.com",    phone:"+63 917 123 4567", appliedOn:"Feb 16, 2026", source:"LinkedIn",  stageId:"s3", status:"Active",   rating:4, notes:"Strong React background, great portfolio" },
  { id:"a2",  jobId:"j1", name:"Camille Reyes",    email:"cam.reyes@email.com",   phone:"+63 918 234 5678", appliedOn:"Feb 17, 2026", source:"Referral",  stageId:"s4", status:"Active",   rating:5, notes:"Exceptional candidate, highly recommended by Devon" },
  { id:"a3",  jobId:"j1", name:"Miguel Torres",    email:"m.torres@email.com",    phone:"+63 919 345 6789", appliedOn:"Feb 20, 2026", source:"JobStreet", stageId:"s2", status:"Active",   rating:3, notes:"Decent skills, needs assessment" },
  { id:"a4",  jobId:"j1", name:"Bea Villanueva",   email:"bea.v@email.com",       phone:"+63 920 456 7890", appliedOn:"Feb 22, 2026", source:"Indeed",    stageId:"s1", status:"Active",   rating:0, notes:"" },
  { id:"a5",  jobId:"j2", name:"Carlo Domingo",    email:"carlo.d@email.com",     phone:"+63 921 567 8901", appliedOn:"Feb 21, 2026", source:"LinkedIn",  stageId:"s4", status:"Active",   rating:4, notes:"Hit all targets in previous role, great energy" },
  { id:"a6",  jobId:"j2", name:"Anna Lim",         email:"anna.lim@email.com",    phone:"+63 922 678 9012", appliedOn:"Feb 22, 2026", source:"Referral",  stageId:"s3", status:"Active",   rating:3, notes:"Good communication, sales demo pending" },
  { id:"a7",  jobId:"j2", name:"Rico Mercado",     email:"rico.m@email.com",      phone:"+63 923 789 0123", appliedOn:"Feb 24, 2026", source:"JobStreet", stageId:"s2", status:"Active",   rating:2, notes:"Junior profile, might be a stretch" },
  { id:"a8",  jobId:"j2", name:"Diane Cruz",       email:"diane.c@email.com",     phone:"+63 924 890 1234", appliedOn:"Feb 26, 2026", source:"Indeed",    stageId:"s5", status:"Hired",    rating:5, notes:"Outstanding — offer accepted, starts Mar 15" },
  { id:"a9",  jobId:"j3", name:"Marco Evangelista",email:"marco.e@email.com",     phone:"+63 925 901 2345", appliedOn:"Mar 1, 2026",  source:"Behance",   stageId:"s3", status:"Active",   rating:4, notes:"Beautiful portfolio, interview pending" },
  { id:"a10", jobId:"j3", name:"Tricia Santos",    email:"tricia.s@email.com",    phone:"+63 926 012 3456", appliedOn:"Mar 2, 2026",  source:"LinkedIn",  stageId:"s2", status:"Active",   rating:3, notes:"Good Figma skills, needs portfolio review" },
  { id:"a11", jobId:"j4", name:"Jerome Aquino",    email:"jerome.a@email.com",    phone:"+63 927 123 4568", appliedOn:"Mar 2, 2026",  source:"LinkedIn",  stageId:"s2", status:"Active",   rating:3, notes:"SQL strong, Python moderate" },
  { id:"a12", jobId:"j1", name:"Lea Castillo",     email:"lea.c@email.com",       phone:"+63 928 234 5679", appliedOn:"Feb 25, 2026", source:"Referral",  stageId:"s1", status:"Rejected", rating:1, notes:"Not enough experience for senior level" },
];

const INTERVIEWS_SEED = [
  { id:"i1", applicantId:"a2", jobId:"j1", type:"Technical Interview", date:"Mar 5, 2026",  time:"2:00 PM", interviewer:"Devon Park",    link:"https://meet.google.com/abc-defg", notes:"Focus on system design and React architecture", feedback:"", status:"Scheduled" },
  { id:"i2", applicantId:"a1", jobId:"j1", type:"HR Interview",        date:"Mar 4, 2026",  time:"10:00 AM",interviewer:"Chris Mendez",  link:"https://zoom.us/j/123456",          notes:"Culture fit, salary expectations", feedback:"Strong candidate, very articulate", status:"Completed" },
  { id:"i3", applicantId:"a5", jobId:"j2", type:"Sales Demo",          date:"Mar 6, 2026",  time:"3:00 PM", interviewer:"Rita Vance",    link:"",                                  notes:"In-person at office, ask them to present a mock pitch", feedback:"", status:"Scheduled" },
  { id:"i4", applicantId:"a9", jobId:"j3", type:"HR Interview",        date:"Mar 7, 2026",  time:"11:00 AM",interviewer:"Chris Mendez",  link:"https://meet.google.com/xyz-abcd",  notes:"Discuss portfolio, design process", feedback:"", status:"Scheduled" },
  { id:"i5", applicantId:"a6", jobId:"j2", type:"HR Interview",        date:"Mar 3, 2026",  time:"1:00 PM", interviewer:"Chris Mendez",  link:"https://zoom.us/j/789012",          notes:"General HR screening", feedback:"Decent, passed to sales demo stage", status:"Completed" },
];

const OFFERS_SEED = [
  { id:"of1", applicantId:"a8", jobId:"j2", salary:"₱72,000", startDate:"Mar 15, 2026", expiresOn:"Mar 8, 2026",  sentOn:"Mar 3, 2026",  status:"Accepted", notes:"Negotiated ₱72k from initial ₱68k offer" },
  { id:"of2", applicantId:"a2", jobId:"j1", salary:"₱135,000",startDate:"Apr 1, 2026",  expiresOn:"Mar 12, 2026", sentOn:null,           status:"Draft",    notes:"Pending technical interview result" },
];

const ONBOARDING_TEMPLATES = [
  { id:"ot1", label:"Send welcome email",          category:"Pre-start",  daysRelative:-3 },
  { id:"ot2", label:"Prepare laptop & equipment",  category:"Pre-start",  daysRelative:-2 },
  { id:"ot3", label:"Set up accounts (email, Slack, HR system)", category:"Pre-start", daysRelative:-1 },
  { id:"ot4", label:"Orientation & company overview", category:"Day 1",  daysRelative:0  },
  { id:"ot5", label:"Meet the team",               category:"Day 1",  daysRelative:0  },
  { id:"ot6", label:"HR documentation (contracts, ID)", category:"Day 1", daysRelative:0 },
  { id:"ot7", label:"Department briefing",         category:"Week 1", daysRelative:3  },
  { id:"ot8", label:"Assign buddy / mentor",       category:"Week 1", daysRelative:2  },
  { id:"ot9", label:"30-day check-in scheduled",   category:"Month 1",daysRelative:30 },
];

const ONBOARDING_SEED = [
  {
    id:"ob1", applicantId:"a8", jobId:"j2", startDate:"Mar 15, 2026",
    tasks: ONBOARDING_TEMPLATES.map(t => ({ ...t, done:t.daysRelative < 0 })),
  },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function stageForApplicant(applicant, jobs) {
  const job = jobs.find(j => j.id === applicant.jobId);
  if (!job) return null;
  return job.stages.find(s => s.id === applicant.stageId) || job.stages[0];
}

function Stars({ rating, onChange }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <button key={n} onClick={() => onChange?.(n)} style={{ color: n<=rating?"#f0c85a":"#333", fontSize:12, lineHeight:1 }}>★</button>
      ))}
    </div>
  );
}

function PriorityBadge({ priority }) {
  const s = { High:{ bg:"#1f0f0f",color:"#f05a5a" }, Medium:{ bg:"#1f1a0f",color:"#f0c85a" }, Low:{ bg:"#0f1f0f",color:"#5af07a" } }[priority] || {};
  return <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily:"system-ui,sans-serif",...s }}>{priority}</span>;
}

function StatusBadge({ status }) {
  const s = {
    Open:{ bg:"#0f1f0f",color:"#5af07a" }, Closed:{ bg:"#1a1a1a",color:"#555" },
    Active:{ bg:"#0a1a2a",color:"#5a9af0" }, Hired:{ bg:"#0f1f0f",color:"#5af07a" },
    Rejected:{ bg:"#1f0f0f",color:"#f05a5a" }, Draft:{ bg:"#1f1a0f",color:"#f0c85a" },
    Accepted:{ bg:"#0f1f0f",color:"#5af07a" }, Declined:{ bg:"#1f0f0f",color:"#f05a5a" },
    Scheduled:{ bg:"#0a1a2a",color:"#5a9af0" }, Completed:{ bg:"#0f1f0f",color:"#5af07a" },
    Cancelled:{ bg:"#1f0f0f",color:"#f05a5a" },
  }[status] || { bg:"#111",color:"#888" };
  return <span className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap" style={{ fontFamily:"system-ui,sans-serif",...s }}>{status}</span>;
}

// ── PIPELINE SETTINGS MODAL ───────────────────────────────────────────────────
function PipelineSettingsModal({ stages, onClose, onSave }) {
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

// ── JOB OPENING DRAWER ────────────────────────────────────────────────────────
function JobOpeningDrawer({ job, defaultStages, onClose, onSave }) {
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

// ── APPLICANT DRAWER ──────────────────────────────────────────────────────────
function ApplicantDrawer({ applicant, job, interviews, offers, onClose, onUpdateApplicant, onAddInterview, onMoveStage }) {
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

// ── OVERVIEW TAB ──────────────────────────────────────────────────────────────
function RecruitmentOverview({ jobs, applicants, interviews }) {
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

// ── JOB OPENINGS TAB ──────────────────────────────────────────────────────────
function JobOpeningsTab({ jobs, applicants, defaultStages, onAddJob, onEditJob, onToggleStatus }) {
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

// ── PIPELINE / KANBAN TAB ─────────────────────────────────────────────────────
function PipelineTab({ jobs, applicants, onMoveApplicant, onSelectApplicant }) {
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

// ── APPLICANTS TAB ────────────────────────────────────────────────────────────
function ApplicantsTab({ jobs, applicants, interviews, offers, onUpdateApplicant, onMoveStage, onAddInterview }) {
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

// ── INTERVIEWS TAB ────────────────────────────────────────────────────────────
function InterviewsTab({ interviews, jobs, applicants }) {
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

// ── OFFERS TAB ────────────────────────────────────────────────────────────────
function OffersTab({ offers, jobs, applicants }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {[["Total Offers",offers.length,"#fff"],["Accepted",offers.filter(o=>o.status==="Accepted").length,"#5af07a"],["Pending",offers.filter(o=>o.status==="Draft"||o.status==="Sent").length,"#f0c85a"],["Declined",offers.filter(o=>o.status==="Declined").length,"#f05a5a"]].map(([l,v,c])=>(
          <div key={l} className="rounded-lg p-4" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
            <p className="text-xs uppercase tracking-widest mb-2 text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>{l}</p>
            <p className="text-2xl font-light" style={{fontFamily:"monospace",color:c}}>{v}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {offers.map(offer=>{
          const app=applicants.find(a=>a.id===offer.applicantId);
          const job=jobs.find(j=>j.id===offer.jobId);
          return (
            <div key={offer.id} className="rounded-lg p-5" style={{backgroundColor:"#0d0d0d",border:`1px solid ${offer.status==="Accepted"?"#1e3a1e":offer.status==="Declined"?"#3a1515":"#1e1e1e"}`}}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {app&&<CandidateAvatar name={app.name} size={40}/>}
                  <div>
                    <p className="text-white text-base" style={{fontFamily:"system-ui,sans-serif"}}>{app?.name}</p>
                    <p className="text-gray-500 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{job?.title} · {job?.dept}</p>
                  </div>
                </div>
                <StatusBadge status={offer.status}/>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {[["Offered Salary",offer.salary,"#5af07a"],["Start Date",offer.startDate,"#fff"],["Sent On",offer.sentOn||"Not sent yet","#aaa"],["Expires",offer.expiresOn,"#f0c85a"]].map(([l,v,c])=>(
                  <div key={l} className="rounded p-3" style={{backgroundColor:"#111",border:"1px solid #1a1a1a"}}>
                    <p className="text-xs text-gray-600 mb-1" style={{fontFamily:"system-ui,sans-serif"}}>{l}</p>
                    <p className="text-sm font-medium" style={{fontFamily:"monospace",color:c}}>{v}</p>
                  </div>
                ))}
              </div>
              {offer.notes&&<p className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>📝 {offer.notes}</p>}
              {offer.status==="Draft"&&(
                <div className="flex gap-2 mt-4">
                  <button className="px-4 py-2 rounded text-xs hover:opacity-80" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#0f2a0f",color:"#5af07a",border:"1px solid #2a4a2a"}}>Send Offer Letter</button>
                  <button className="px-4 py-2 rounded text-xs hover:opacity-80" style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a"}}>Edit Offer</button>
                </div>
              )}
            </div>
          );
        })}
        {offers.length===0&&(
          <div className="text-center py-16">
            <p className="text-gray-600 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>No offers created yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ONBOARDING TAB ────────────────────────────────────────────────────────────
function OnboardingTab({ onboarding, setOnboarding, applicants, jobs }) {
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

// ── RECRUITMENT PAGE ROOT ─────────────────────────────────────────────────────
export default function RecruitmentPage() {
  const [activeTab,      setActiveTab]      = useState("overview");
  const [jobs,           setJobs]           = useState(JOB_OPENINGS_SEED);
  const [applicants,     setApplicants]     = useState(APPLICANTS_SEED);
  const [interviews,     setInterviews]     = useState(INTERVIEWS_SEED);
  const [offers,         setOffers]         = useState(OFFERS_SEED);
  const [onboarding,     setOnboarding]     = useState(ONBOARDING_SEED);
  const [defaultStages,  setDefaultStages]  = useState(DEFAULT_STAGES_SEED);
  const [showPipeline,   setShowPipeline]   = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Job actions
  function addJob(form)        { setJobs(p=>[...p,{ id:"j"+Date.now(), ...form, filled:0, postedOn:"Mar 2, 2026", status:"Open" }]); }
  function editJob(id,form)    { setJobs(p=>p.map(j=>j.id===id?{...j,...form}:j)); }
  function toggleStatus(id)    { setJobs(p=>p.map(j=>j.id===id?{...j,status:j.status==="Open"?"Closed":"Open"}:j)); }

  // Applicant actions
  function updateApplicant(id,updates) { setApplicants(p=>p.map(a=>a.id===id?{...a,...updates}:a)); }
  function moveStage(id,stageId)       { setApplicants(p=>p.map(a=>a.id===id?{...a,stageId}:a)); }
  function moveApplicant(id,stageId)   { moveStage(id,stageId); }

  // Interview actions
  function addInterview(iv) { setInterviews(p=>[...p,{ id:"i"+Date.now(), ...iv }]); }

  const TABS = [
    { key:"overview",    label:"Overview"    },
    { key:"openings",    label:"Job Openings" },
    { key:"pipeline",    label:"Pipeline"    },
    { key:"applicants",  label:"Applicants"  },
    { key:"interviews",  label:"Interviews"  },
    { key:"offers",      label:"Offers"      },
    { key:"onboarding",  label:"Onboarding"  },
  ];

  const pendingInterviews = interviews.filter(i=>i.status==="Scheduled").length;
  const openRoles         = jobs.filter(j=>j.status==="Open").length;

  return (
    <div className="flex-1 overflow-hidden flex flex-col" style={{backgroundColor:"#000"}}>
      {/* Page header */}
      <div className="px-8 pt-8 pb-0 flex-shrink-0">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-1" style={{fontFamily:"system-ui,sans-serif"}}>HR Management</p>
            <h1 className="text-3xl font-normal text-white" style={{letterSpacing:"-0.02em"}}>Recruitment</h1>
          </div>
          <div className="flex items-center gap-3">
            {openRoles>0&&(
              <div className="rounded-lg px-4 py-2 flex items-center gap-2" style={{backgroundColor:"#0a1a0a",border:"1px solid #1e3a1e"}}>
                <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:"#5af07a"}}/>
                <span className="text-xs text-gray-400" style={{fontFamily:"system-ui,sans-serif"}}>{openRoles} open role{openRoles!==1?"s":""}</span>
              </div>
            )}
            {pendingInterviews>0&&(
              <div className="rounded-lg px-4 py-2" style={{backgroundColor:"#0a1a2a",border:"1px solid #1e3a5a"}}>
                <span className="text-xs" style={{fontFamily:"system-ui,sans-serif",color:"#5a9af0"}}>📅 {pendingInterviews} interview{pendingInterviews!==1?"s":""} scheduled</span>
              </div>
            )}
            <button onClick={()=>setShowPipeline(true)}
              className="px-4 py-2 rounded text-xs hover:opacity-80"
              style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a"}}>
              ⚙ Pipeline Settings
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1" style={{borderBottom:"1px solid #1a1a1a"}}>
          {TABS.map(t=>(
            <button key={t.key} onClick={()=>setActiveTab(t.key)}
              className="px-4 py-2.5 text-sm transition-all"
              style={{fontFamily:"system-ui,sans-serif",color:activeTab===t.key?"#fff":"#555",borderBottom:activeTab===t.key?"2px solid #fff":"2px solid transparent"}}>
              {t.label}
              {t.key==="interviews"&&pendingInterviews>0&&<span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" style={{fontFamily:"monospace",backgroundColor:"#0a1a2a",color:"#5a9af0"}}>{pendingInterviews}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {activeTab==="overview"   && <RecruitmentOverview jobs={jobs} applicants={applicants} interviews={interviews}/>}
        {activeTab==="openings"   && <JobOpeningsTab jobs={jobs} applicants={applicants} defaultStages={defaultStages} onAddJob={addJob} onEditJob={editJob} onToggleStatus={toggleStatus}/>}
        {activeTab==="pipeline"   && <PipelineTab jobs={jobs} applicants={applicants} onMoveApplicant={moveApplicant} onSelectApplicant={setSelectedApplicant}/>}
        {activeTab==="applicants" && <ApplicantsTab jobs={jobs} applicants={applicants} interviews={interviews} offers={offers} onUpdateApplicant={updateApplicant} onMoveStage={moveStage} onAddInterview={addInterview}/>}
        {activeTab==="interviews" && <InterviewsTab interviews={interviews} jobs={jobs} applicants={applicants}/>}
        {activeTab==="offers"     && <OffersTab offers={offers} jobs={jobs} applicants={applicants}/>}
        {activeTab==="onboarding" && <OnboardingTab onboarding={onboarding} setOnboarding={setOnboarding} applicants={applicants} jobs={jobs}/>}
      </div>

      {/* Pipeline Settings Modal */}
      {showPipeline&&(
        <PipelineSettingsModal
          stages={defaultStages}
          onClose={()=>setShowPipeline(false)}
          onSave={stages=>{ setDefaultStages(stages); setShowPipeline(false); }}
        />
      )}

      {/* Applicant drawer from Pipeline tab */}
      {selectedApplicant&&(
        <ApplicantDrawer
          applicant={selectedApplicant}
          job={jobs.find(j=>j.id===selectedApplicant.jobId)}
          interviews={interviews}
          offers={offers}
          onClose={()=>setSelectedApplicant(null)}
          onUpdateApplicant={(id,updates)=>{ updateApplicant(id,updates); setSelectedApplicant(a=>({...a,...updates})); }}
          onAddInterview={addInterview}
          onMoveStage={(id,stageId)=>{ moveStage(id,stageId); setSelectedApplicant(a=>({...a,stageId})); }}
        />
      )}
    </div>
  );
}
