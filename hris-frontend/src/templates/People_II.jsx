import { useState, useMemo } from "react";

const NAV_ITEMS = ["Dashboard", "People", "Payroll", "Time & Leave", "Recruitment", "Reports"];
const EMPLOYEES = [
  { id: 1,  name: "Sara Okafor",      role: "Senior Engineer",   dept: "Engineering", location: "New York", status: "Active",   joined: "Jan 12, 2021", salary: "$142,000", manager: "Devon Park",   avatar: "SO", email: "sara.okafor@hera.io",  phone: "+1 212 555 0191", schedule: "Mon–Fri, 9am–5pm",  empType: "Full-time", payFreq: "Bi-weekly",    benefits: "Premium",  gender: "Female", dob: "Mar 14, 1990" },
  { id: 2,  name: "Marcus Chen",      role: "Account Executive", dept: "Sales",       location: "Chicago",  status: "Active",   joined: "Mar 5, 2022",  salary: "$98,000",  manager: "Rita Vance",   avatar: "MC", email: "marcus.chen@hera.io",  phone: "+1 312 555 0144", schedule: "Mon–Fri, Flexible", empType: "Full-time", payFreq: "Bi-weekly",    benefits: "Standard", gender: "Male",   dob: "Jul 22, 1993" },
  { id: 3,  name: "Priya Nair",       role: "Product Manager",   dept: "Product",     location: "Remote",   status: "Active",   joined: "Jul 19, 2023", salary: "$126,000", manager: "Devon Park",   avatar: "PN", email: "priya.nair@hera.io",   phone: "+1 415 555 0172", schedule: "Mon–Fri, Flexible", empType: "Full-time", payFreq: "Semi-monthly", benefits: "Premium",  gender: "Female", dob: "Nov 5, 1991" },
  { id: 4,  name: "James Kowalski",   role: "DevOps Engineer",   dept: "Engineering", location: "Austin",   status: "Active",   joined: "Nov 1, 2020",  salary: "$134,000", manager: "Sara Okafor",  avatar: "JK", email: "james.k@hera.io",      phone: "+1 512 555 0103", schedule: "Mon–Fri, 9am–5pm",  empType: "Full-time", payFreq: "Bi-weekly",    benefits: "Standard", gender: "Male",   dob: "Apr 18, 1988" },
  { id: 5,  name: "Leila Farouk",     role: "Senior PM",         dept: "Product",     location: "New York", status: "Active",   joined: "Feb 28, 2019", salary: "$148,000", manager: "Devon Park",   avatar: "LF", email: "leila.f@hera.io",      phone: "+1 212 555 0165", schedule: "4-day week",        empType: "Full-time", payFreq: "Monthly",      benefits: "Premium",  gender: "Female", dob: "Sep 30, 1987" },
  { id: 6,  name: "Devon Park",       role: "VP Engineering",    dept: "Engineering", location: "New York", status: "Active",   joined: "Jun 14, 2018", salary: "$210,000", manager: "CEO",          avatar: "DP", email: "devon.park@hera.io",   phone: "+1 212 555 0188", schedule: "Mon–Fri, Flexible", empType: "Full-time", payFreq: "Monthly",      benefits: "Premium",  gender: "Male",   dob: "Jan 2, 1982" },
  { id: 7,  name: "Rita Vance",       role: "Sales Director",    dept: "Sales",       location: "Chicago",  status: "Active",   joined: "Sep 3, 2020",  salary: "$175,000", manager: "CEO",          avatar: "RV", email: "rita.vance@hera.io",   phone: "+1 312 555 0121", schedule: "Mon–Fri, 9am–5pm",  empType: "Full-time", payFreq: "Monthly",      benefits: "Premium",  gender: "Female", dob: "Jun 15, 1984" },
  { id: 8,  name: "Tomás Rivera",     role: "UX Designer",       dept: "Design",      location: "Remote",   status: "Active",   joined: "Apr 11, 2022", salary: "$112,000", manager: "Leila Farouk", avatar: "TR", email: "tomas.r@hera.io",      phone: "+1 415 555 0199", schedule: "Mon–Fri, Flexible", empType: "Full-time", payFreq: "Bi-weekly",    benefits: "Standard", gender: "Male",   dob: "Feb 27, 1994" },
  { id: 9,  name: "Ananya Bose",      role: "Data Analyst",      dept: "Operations",  location: "Austin",   status: "On Leave", joined: "Oct 22, 2021", salary: "$95,000",  manager: "Rita Vance",   avatar: "AB", email: "ananya.b@hera.io",     phone: "+1 512 555 0177", schedule: "Mon–Fri, 9am–5pm",  empType: "Full-time", payFreq: "Bi-weekly",    benefits: "Standard", gender: "Female", dob: "Aug 8, 1995" },
  { id: 10, name: "Chris Mendez",     role: "HR Specialist",     dept: "HR & Admin",  location: "New York", status: "Active",   joined: "Jan 7, 2023",  salary: "$88,000",  manager: "Devon Park",   avatar: "CM", email: "chris.m@hera.io",      phone: "+1 212 555 0134", schedule: "Mon–Fri, 9am–5pm",  empType: "Full-time", payFreq: "Bi-weekly",    benefits: "Standard", gender: "Male",   dob: "Dec 3, 1997" },
  { id: 11, name: "Fatima Al-Hassan", role: "Frontend Engineer", dept: "Engineering", location: "Remote",   status: "Active",   joined: "Mar 30, 2022", salary: "$128,000", manager: "Sara Okafor",  avatar: "FA", email: "fatima.a@hera.io",     phone: "+1 415 555 0156", schedule: "Mon–Fri, Flexible", empType: "Full-time", payFreq: "Bi-weekly",    benefits: "Premium",  gender: "Female", dob: "May 11, 1992" },
  { id: 12, name: "Noah Kim",         role: "Marketing Manager", dept: "Marketing",   location: "Chicago",  status: "Active",   joined: "Aug 15, 2021", salary: "$104,000", manager: "Rita Vance",   avatar: "NK", email: "noah.kim@hera.io",     phone: "+1 312 555 0143", schedule: "Mon–Fri, Flexible", empType: "Full-time", payFreq: "Bi-weekly",    benefits: "Standard", gender: "Male",   dob: "Oct 19, 1993" },
];

// Seed departments
const DEPT_SEED = [
  { id: 1, name: "Engineering",  head: 6,  description: "Product development and infrastructure",  color: "#5a9af0", createdOn: "Jan 1, 2021"  },
  { id: 2, name: "Sales",        head: 7,  description: "Revenue generation and client relations", color: "#5af07a", createdOn: "Jan 1, 2021"  },
  { id: 3, name: "Product",      head: 5,  description: "Product strategy and roadmap",             color: "#c07af0", createdOn: "Feb 1, 2021"  },
  { id: 4, name: "Design",       head: 8,  description: "User experience and brand identity",       color: "#f0905a", createdOn: "Apr 1, 2022"  },
  { id: 5, name: "Operations",   head: 9,  description: "Business operations and data analytics",   color: "#50c8c8", createdOn: "Jan 1, 2021"  },
  { id: 6, name: "Marketing",    head: 12, description: "Brand awareness and campaigns",            color: "#f0c85a", createdOn: "Aug 1, 2021"  },
  { id: 7, name: "HR & Admin",   head: 10, description: "People operations and administration",     color: "#f05a5a", createdOn: "Jan 1, 2021"  },
];

const DEPT_COLORS = ["#5a9af0","#5af07a","#c07af0","#f0905a","#50c8c8","#f0c85a","#f05a5a","#d090f0","#80c8f0","#a0f0a0"];

const DEPTS    = ["All","Engineering","Sales","Product","Design","Operations","Marketing","HR & Admin"];
const STATUSES = ["All","Active","On Leave","Inactive"];
const SS = { "Active":{bg:"#0f1f0f",color:"#5af07a"}, "On Leave":{bg:"#1f1a0f",color:"#f0c85a"}, "Inactive":{bg:"#1f0f0f",color:"#f05a5a"} };
const AV = ["#ffffff","#cccccc","#999999","#777777","#555555","#444444","#ffffff","#bbbbbb","#888888","#666666","#aaaaaa","#333333"];
function gc(id){ const bg=AV[id%AV.length]; return{ bg, fg:["#fff","#ddd","#eee","#ccc","#bbb"].some(x=>bg.startsWith(x.slice(0,4)))?"#000":"#fff" }; }
function Avatar({emp,size=36}){ const{bg,fg}=gc(emp.id); return <div className="rounded-full flex items-center justify-center font-bold flex-shrink-0" style={{width:size,height:size,backgroundColor:bg,color:fg,fontFamily:"system-ui,sans-serif",fontSize:size<32?11:size<56?13:20}}>{emp.avatar}</div>; }
const IC = "w-full px-3 py-2.5 rounded text-sm text-white placeholder-gray-600 outline-none";
const IS = {backgroundColor:"#111111",border:"1px solid #2a2a2a",fontFamily:"system-ui,sans-serif"};
function Field({label,children}){ return <div><label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>{label}</label>{children}</div>; }
const BADGE = {
  Approved:    {bg:"#0f1f0f", color:"#5af07a"},
  Pending:     {bg:"#1f1a0f", color:"#f0c85a"},
  Rejected:    {bg:"#1f0f0f", color:"#f05a5a"},
  Flagged:     {bg:"#1f0f0f", color:"#f05a5a"},
  "For Review":{bg:"#0a1a2a", color:"#5a9af0"},
  "—":         {bg:"transparent", color:"#444"},
};

// ── CREATE DEPARTMENT DRAWER ──────────────────────────────────────────────────
function CreateDepartmentDrawer({ onClose, onSave, employees }) {
  const [form, setForm] = useState({
    name: "",
    head: "",
    description: "",
    color: DEPT_COLORS[0],
  });
  const [saved, setSaved] = useState(false);
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }
  const canSave = form.name.trim().length >= 2;

  function handleSave() {
    if (!canSave) return;
    onSave({ ...form, id: Date.now(), createdOn: "Mar 18, 2026" });
    setSaved(true);
  }

  const selectedHead = employees.find(e => String(e.id) === String(form.head));

  if (saved) return (
    <>
      <div className="fixed inset-0 z-20" style={{ backgroundColor:"rgba(0,0,0,0.6)" }} onClick={onClose}/>
      <div className="fixed top-0 right-0 h-full z-30 flex flex-col items-center justify-center px-10"
        style={{ width:480, backgroundColor:"#080808", borderLeft:"1px solid #222" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
          style={{ backgroundColor:form.color+"22", border:`1px solid ${form.color}44` }}>
          <span className="text-2xl">🏢</span>
        </div>
        <h3 className="text-lg font-normal text-white mb-2 text-center">Department created</h3>
        <p className="text-sm text-gray-500 text-center leading-relaxed mb-1" style={{ fontFamily:"system-ui,sans-serif" }}>
          <strong style={{ color: form.color }}>{form.name}</strong> has been added
          {selectedHead && <> with <strong className="text-white">{selectedHead.name}</strong> as department head</>}.
        </p>
        <button onClick={onClose} className="mt-5 px-5 py-2 rounded text-sm bg-white text-black hover:opacity-80"
          style={{ fontFamily:"system-ui,sans-serif" }}>Done</button>
      </div>
    </>
  );

  return (
    <>
      <div className="fixed inset-0 z-20" style={{ backgroundColor:"rgba(0,0,0,0.6)" }} onClick={onClose}/>
      <div className="fixed top-0 right-0 h-full z-30 flex flex-col"
        style={{ width:480, backgroundColor:"#080808", borderLeft:"1px solid #222", boxShadow:"-8px 0 40px rgba(0,0,0,0.8)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 flex-shrink-0" style={{ borderBottom:"1px solid #1a1a1a" }}>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-0.5" style={{ fontFamily:"system-ui,sans-serif" }}>People · Departments</p>
            <h2 className="text-lg font-normal text-white">Create Department</h2>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">

          {/* Name */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{ fontFamily:"system-ui,sans-serif" }}>Department Name</label>
            <input className={IC} style={IS} placeholder="e.g. Legal & Compliance" value={form.name} onChange={e => set("name", e.target.value)}/>
          </div>

          {/* Department Head */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{ fontFamily:"system-ui,sans-serif" }}>
              Department Head <span className="text-gray-700 normal-case">(optional)</span>
            </label>
            <select className={IC} style={IS} value={form.head} onChange={e => set("head", e.target.value)}>
              <option value="">— Select an employee —</option>
              {employees
                .filter(e => e.status === "Active")
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(e => (
                  <option key={e.id} value={e.id}>{e.name} · {e.role} · {e.dept}</option>
                ))}
            </select>
            {/* Head preview card */}
            {selectedHead && (
              <div className="mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg"
                style={{ backgroundColor:"#0d0d0d", border:`1px solid ${form.color}22` }}>
                <Avatar emp={selectedHead} size={32}/>
                <div>
                  <p className="text-white text-sm" style={{ fontFamily:"system-ui,sans-serif" }}>{selectedHead.name}</p>
                  <p className="text-gray-500 text-xs" style={{ fontFamily:"system-ui,sans-serif" }}>{selectedHead.role} · {selectedHead.dept}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{ fontFamily:"system-ui,sans-serif" }}>
              Description <span className="text-gray-700 normal-case">(optional)</span>
            </label>
            <textarea className={IC} style={{ ...IS, resize:"none", height:80 }}
              placeholder="Brief overview of this department's function…"
              value={form.description} onChange={e => set("description", e.target.value)}/>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2" style={{ fontFamily:"system-ui,sans-serif" }}>Color Tag</label>
            <div className="flex flex-wrap gap-2">
              {DEPT_COLORS.map(c => (
                <button key={c} onClick={() => set("color", c)}
                  className="w-8 h-8 rounded-full transition-all"
                  style={{ backgroundColor:c+"22", border:`2px solid ${form.color===c ? c : c+"44"}`,
                    outline: form.color===c ? `2px solid ${c}55` : "none", outlineOffset:2 }}>
                  <div className="w-full h-full rounded-full" style={{ backgroundColor: c+"88" }}/>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {form.name.trim() && (
            <div className="rounded-lg p-4" style={{ backgroundColor:"#0d0d0d", border:`1px solid ${form.color}22` }}>
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-3" style={{ fontFamily:"system-ui,sans-serif" }}>Preview</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor:form.color+"18", border:`1px solid ${form.color}33` }}>🏢</div>
                <div>
                  <p className="text-white text-sm font-medium" style={{ fontFamily:"system-ui,sans-serif" }}>{form.name}</p>
                  <p className="text-gray-500 text-xs" style={{ fontFamily:"system-ui,sans-serif" }}>
                    {selectedHead ? `Head: ${selectedHead.name}` : "No head assigned"}
                    {form.description && ` · ${form.description.slice(0,40)}${form.description.length>40?"…":""}`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-7 py-5 flex items-center justify-between flex-shrink-0" style={{ borderTop:"1px solid #1a1a1a" }}>
          <button onClick={onClose} className="px-4 py-2 rounded text-sm"
            style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", color:"#aaa", border:"1px solid #2a2a2a" }}>Cancel</button>
          <button onClick={handleSave} disabled={!canSave}
            className="px-5 py-2 rounded text-sm font-medium hover:opacity-80"
            style={{ fontFamily:"system-ui,sans-serif",
              backgroundColor: canSave ? "#fff" : "#1a1a1a",
              color: canSave ? "#000" : "#444",
              cursor: canSave ? "pointer" : "not-allowed" }}>
            Create Department 🏢
          </button>
        </div>
      </div>
    </>
  );
}

// ── CHANGE HEAD MODAL ─────────────────────────────────────────────────────────
function ChangeHeadModal({ dept, employees, onClose, onSave }) {
  const currentHead = employees.find(e => e.id === dept.head);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(dept.head || null);
  const [confirmed, setConfirmed] = useState(false);

  const candidates = employees
    .filter(e => e.status === "Active")
    .filter(e => !search.trim() ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      // dept members first
      const aInDept = a.dept === dept.name;
      const bInDept = b.dept === dept.name;
      if (aInDept && !bInDept) return -1;
      if (!aInDept && bInDept) return 1;
      return a.name.localeCompare(b.name);
    });

  const selectedEmp = employees.find(e => e.id === selected);
  const isUnchanged = selected === dept.head;

  function handleConfirm() {
    onSave(dept.id, selected);
    setConfirmed(true);
  }

  if (confirmed) {
    const newHead = employees.find(e => e.id === selected);
    return (
      <>
        <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(0,0,0,0.75)" }} onClick={onClose}/>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-sm rounded-xl flex flex-col items-center py-10 px-8 text-center"
            style={{ backgroundColor:"#0d0d0d", border:"1px solid #2a2a2a" }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor:dept.color+"18", border:`1px solid ${dept.color}44` }}>
              <span className="text-2xl">👑</span>
            </div>
            <h3 className="text-lg font-normal text-white mb-2">Head updated</h3>
            {newHead ? (
              <>
                <div className="flex items-center gap-3 justify-center mb-1">
                  <Avatar emp={newHead} size={32}/>
                  <p className="text-white text-sm" style={{ fontFamily:"system-ui,sans-serif" }}>{newHead.name}</p>
                </div>
                <p className="text-gray-500 text-sm mt-1" style={{ fontFamily:"system-ui,sans-serif" }}>
                  is now the head of <span style={{ color:dept.color }}>{dept.name}</span>.
                </p>
              </>
            ) : (
              <p className="text-gray-500 text-sm" style={{ fontFamily:"system-ui,sans-serif" }}>
                Department head has been cleared for <span style={{ color:dept.color }}>{dept.name}</span>.
              </p>
            )}
            <button onClick={onClose}
              className="mt-6 px-5 py-2 rounded text-sm bg-white text-black hover:opacity-80"
              style={{ fontFamily:"system-ui,sans-serif" }}>Done</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor:"rgba(0,0,0,0.75)" }} onClick={onClose}/>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-xl flex flex-col"
          style={{ backgroundColor:"#0d0d0d", border:"1px solid #2a2a2a", maxHeight:"85vh" }}>

          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 flex-shrink-0"
            style={{ borderBottom:"1px solid #1e1e1e" }}>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-0.5"
                style={{ fontFamily:"system-ui,sans-serif" }}>
                {dept.name} · Department Head
              </p>
              <h2 className="text-lg font-normal text-white">Change Department Head</h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-xl mt-0.5">✕</button>
          </div>

          {/* Current head */}
          <div className="px-6 pt-4 pb-3 flex-shrink-0">
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-2"
              style={{ fontFamily:"system-ui,sans-serif" }}>Current Head</p>
            {currentHead ? (
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                style={{ backgroundColor:"#111", border:`1px solid ${dept.color}33` }}>
                <Avatar emp={currentHead} size={32}/>
                <div className="flex-1">
                  <p className="text-gray-200 text-sm" style={{ fontFamily:"system-ui,sans-serif" }}>{currentHead.name}</p>
                  <p className="text-gray-500 text-xs" style={{ fontFamily:"system-ui,sans-serif" }}>{currentHead.role} · {currentHead.dept}</p>
                </div>
                <span className="text-xs px-1.5 py-0.5 rounded"
                  style={{ fontFamily:"system-ui,sans-serif", backgroundColor:dept.color+"18", color:dept.color }}>
                  Current
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                style={{ backgroundColor:"#111", border:"1px solid #2a2a2a" }}>
                <span className="text-gray-600 text-sm" style={{ fontFamily:"system-ui,sans-serif" }}>No head assigned</span>
              </div>
            )}
          </div>

          {/* Arrow */}
          <div className="flex justify-center flex-shrink-0 py-1">
            <span className="text-gray-700 text-sm">↓</span>
          </div>

          {/* Search */}
          <div className="px-6 pb-3 flex-shrink-0">
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-2"
              style={{ fontFamily:"system-ui,sans-serif" }}>Select New Head</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
              <input
                className="w-full pl-9 pr-4 py-2 rounded text-sm text-white placeholder-gray-600 outline-none"
                style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", border:"1px solid #2a2a2a" }}
                placeholder="Search by name or role…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Employee list */}
          <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-1">
            {/* Clear option */}
            <button
              onClick={() => setSelected(null)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
              style={{
                backgroundColor: selected === null ? "#1a1a0a" : "#111",
                border: `1px solid ${selected === null ? "#3a3010" : "#2a2a2a"}`,
              }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor:"#1a1a1a", border:"1px solid #2a2a2a" }}>
                <span className="text-xs text-gray-500">—</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-400 text-sm" style={{ fontFamily:"system-ui,sans-serif" }}>No head assigned</p>
                <p className="text-gray-600 text-xs" style={{ fontFamily:"system-ui,sans-serif" }}>Clear current assignment</p>
              </div>
              {selected === null && (
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor:"#f0c85a22", border:"1.5px solid #f0c85a" }}>
                  <span style={{ fontSize:8, color:"#f0c85a", lineHeight:1 }}>✓</span>
                </div>
              )}
            </button>

            {/* Dept members group header */}
            {candidates.some(e => e.dept === dept.name) && (
              <p className="text-xs uppercase tracking-widest text-gray-700 pt-2 pb-1 px-1"
                style={{ fontFamily:"system-ui,sans-serif" }}>
                {dept.name} members
              </p>
            )}

            {candidates.map((emp, i) => {
              const isSelected = selected === emp.id;
              const isCurrent  = emp.id === dept.head;
              const inDept     = emp.dept === dept.name;
              // group separator between dept members and others
              const prevEmp = candidates[i - 1];
              const showOtherHeader = !inDept && prevEmp?.dept === dept.name;

              return (
                <div key={emp.id}>
                  {showOtherHeader && (
                    <p className="text-xs uppercase tracking-widest text-gray-700 pt-2 pb-1 px-1"
                      style={{ fontFamily:"system-ui,sans-serif" }}>
                      Other employees
                    </p>
                  )}
                  <button
                    onClick={() => setSelected(emp.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
                    style={{
                      backgroundColor: isSelected ? dept.color+"10" : "#111",
                      border: `1px solid ${isSelected ? dept.color+"44" : "#2a2a2a"}`,
                    }}>
                    <Avatar emp={emp} size={32}/>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-200 text-sm" style={{ fontFamily:"system-ui,sans-serif" }}>{emp.name}</p>
                        {isCurrent && (
                          <span className="text-xs px-1.5 py-0.5 rounded"
                            style={{ fontFamily:"system-ui,sans-serif", backgroundColor:dept.color+"18", color:dept.color }}>
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs" style={{ fontFamily:"system-ui,sans-serif" }}>
                        {emp.role}
                        {!inDept && <span className="text-gray-700"> · {emp.dept}</span>}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor:dept.color+"22", border:`1.5px solid ${dept.color}` }}>
                        <span style={{ fontSize:8, color:dept.color, lineHeight:1 }}>✓</span>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}

            {candidates.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-600 text-sm" style={{ fontFamily:"system-ui,sans-serif" }}>No employees match "{search}"</p>
              </div>
            )}
          </div>

          {/* Selected preview + confirm */}
          <div className="px-6 py-4 flex-shrink-0" style={{ borderTop:"1px solid #1e1e1e" }}>
            {!isUnchanged && selectedEmp && (
              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg"
                style={{ backgroundColor:"#0a0a0a", border:"1px solid #1e1e1e" }}>
                <span className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>New head:</span>
                <Avatar emp={selectedEmp} size={20}/>
                <span className="text-gray-200 text-sm" style={{ fontFamily:"system-ui,sans-serif" }}>{selectedEmp.name}</span>
                <span className="text-gray-600 text-xs" style={{ fontFamily:"system-ui,sans-serif" }}>· {selectedEmp.role}</span>
              </div>
            )}
            {!isUnchanged && selected === null && (
              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg"
                style={{ backgroundColor:"#1a1a0a", border:"1px solid #3a3010" }}>
                <span className="text-xs" style={{ fontFamily:"system-ui,sans-serif", color:"#f0c85a" }}>⚠ This will remove the current department head assignment.</span>
              </div>
            )}
            <div className="flex items-center justify-between gap-3">
              <button onClick={onClose}
                className="px-4 py-2 rounded text-sm hover:opacity-80"
                style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", color:"#aaa", border:"1px solid #2a2a2a" }}>
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isUnchanged}
                className="flex-1 py-2 rounded text-sm font-medium transition-all"
                style={{
                  fontFamily:"system-ui,sans-serif",
                  backgroundColor: isUnchanged ? "#1a1a1a" : "#fff",
                  color: isUnchanged ? "#444" : "#000",
                  cursor: isUnchanged ? "not-allowed" : "pointer",
                }}>
                {isUnchanged ? "No changes made" : selected === null ? "Remove Head" : "Confirm Change"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── DEPARTMENTS TAB ───────────────────────────────────────────────────────────
function DepartmentsTab({ employees, allDepts, onCreateDept, onChangeHead }) {
  const [selected, setSelected] = useState(null);
  const [changingHeadFor, setChangingHeadFor] = useState(null); // dept object

  const deptStats = allDepts.map(dept => {
    const members = employees.filter(e => e.dept === dept.name);
    const head = employees.find(e => e.id === dept.head);
    const active = members.filter(e => e.status === "Active").length;
    const onLeave = members.filter(e => e.status === "On Leave").length;
    return { ...dept, members, head, active, onLeave };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-normal text-white">{allDepts.length} departments</p>
          <p className="text-xs text-gray-600 mt-0.5" style={{ fontFamily:"system-ui,sans-serif" }}>Click a department to see its members</p>
        </div>
        <button onClick={onCreateDept}
          className="px-4 py-2 rounded text-sm font-medium bg-white text-black hover:opacity-80"
          style={{ fontFamily:"system-ui,sans-serif" }}>
          + New Department
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {deptStats.map(dept => {
          const isSelected = selected === dept.id;
          return (
            <div key={dept.id}>
              <div
                onClick={() => setSelected(isSelected ? null : dept.id)}
                className="rounded-lg p-5 cursor-pointer transition-all"
                style={{
                  backgroundColor: isSelected ? dept.color+"0a" : "#0d0d0d",
                  border: `1px solid ${isSelected ? dept.color+"55" : "#1e1e1e"}`,
                }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor:dept.color+"18", border:`1px solid ${dept.color}33` }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor:dept.color }}/>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium" style={{ fontFamily:"system-ui,sans-serif" }}>{dept.name}</p>
                      {dept.description && (
                        <p className="text-gray-600 text-xs mt-0.5" style={{ fontFamily:"system-ui,sans-serif" }}>{dept.description}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs" style={{ color:dept.color, fontFamily:"monospace" }}>
                    {dept.members.length} {dept.members.length === 1 ? "member" : "members"}
                  </span>
                </div>

                {/* Head row */}
                <div className="flex items-center justify-between">
                  {dept.head ? (
                    <div className="flex items-center gap-2">
                      <Avatar emp={dept.head} size={24}/>
                      <div>
                        <p className="text-gray-300 text-xs" style={{ fontFamily:"system-ui,sans-serif" }}>{dept.head.name}</p>
                        <p className="text-gray-600 text-xs" style={{ fontFamily:"system-ui,sans-serif" }}>Department Head</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>No head assigned</span>
                  )}
                  <div className="flex items-center gap-2">
                    {/* Change Head button — stops card toggle propagation */}
                    <button
                      onClick={e => { e.stopPropagation(); setChangingHeadFor(dept); }}
                      className="text-xs px-2.5 py-1 rounded hover:opacity-80 transition-all"
                      style={{
                        fontFamily:"system-ui,sans-serif",
                        backgroundColor: dept.color+"12",
                        color: dept.color,
                        border: `1px solid ${dept.color}33`,
                      }}>
                      {dept.head ? "Change Head" : "Assign Head"}
                    </button>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#0f1f0f", color:"#5af07a" }}>{dept.active} active</span>
                    {dept.onLeave > 0 && <span className="text-xs px-2 py-0.5 rounded" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#1f1a0f", color:"#f0c85a" }}>{dept.onLeave} on leave</span>}
                  </div>
                </div>

                {/* Created on */}
                <p className="text-xs text-gray-700 mt-2 pt-2" style={{ fontFamily:"monospace", borderTop:"1px solid #1a1a1a" }}>
                  Created {dept.createdOn}
                </p>
              </div>

              {/* Expandable members list */}
              {isSelected && dept.members.length > 0 && (
                <div className="rounded-b-lg overflow-hidden -mt-1" style={{ border:`1px solid ${dept.color}33`, borderTop:"none", backgroundColor:"#080808" }}>
                  {dept.members.map((emp, i) => (
                    <div key={emp.id}
                      className="flex items-center gap-3 px-5 py-2.5"
                      style={{ borderTop: i > 0 ? "1px solid #141414" : "none" }}>
                      <Avatar emp={emp} size={28}/>
                      <div className="flex-1">
                        <p className="text-gray-200 text-sm" style={{ fontFamily:"system-ui,sans-serif" }}>{emp.name}</p>
                        <p className="text-gray-600 text-xs" style={{ fontFamily:"system-ui,sans-serif" }}>{emp.role}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {emp.id === dept.head?.id && (
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:dept.color+"18", color:dept.color }}>Head</span>
                        )}
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily:"system-ui,sans-serif", ...SS[emp.status] }}>{emp.status}</span>
                        {/* Make head from member list */}
                        {emp.id !== dept.head?.id && (
                          <button
                            onClick={e => { e.stopPropagation(); onChangeHead(dept.id, emp.id); }}
                            className="text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 hover:opacity-80"
                            style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#1a1a1a", color:"#888", border:"1px solid #2a2a2a" }}>
                            Set as Head
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {isSelected && dept.members.length === 0 && (
                <div className="rounded-b-lg flex items-center justify-center py-5 -mt-1"
                  style={{ border:`1px solid ${dept.color}22`, borderTop:"none", backgroundColor:"#080808" }}>
                  <p className="text-gray-600 text-xs" style={{ fontFamily:"system-ui,sans-serif" }}>No employees assigned to this department yet.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Change Head Modal */}
      {changingHeadFor && (
        <ChangeHeadModal
          dept={changingHeadFor}
          employees={employees}
          onClose={() => setChangingHeadFor(null)}
          onSave={(deptId, newHeadId) => {
            onChangeHead(deptId, newHeadId);
            setChangingHeadFor(null);
          }}
        />
      )}
    </div>
  );
}

// ── NEEDS ACTION PANEL ────────────────────────────────────────────────────────
function NeedsActionPanel({ items, type, onSelect }) {
  const isEmpty = items.length === 0;
  return (
    <div className="rounded-lg p-5" style={{ backgroundColor: isEmpty ? "#0d0d0d" : type === "leave" ? "#0a1a0a" : "#0a0f1a", border: `1px solid ${isEmpty ? "#1e1e1e" : type === "leave" ? "#1e3a1e" : "#1e2a3a"}` }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-widest text-gray-500" style={{ fontFamily: "system-ui,sans-serif" }}>Needs Action</p>
        {!isEmpty && <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ fontFamily: "monospace", backgroundColor: type === "leave" ? "#0f2a0f" : "#0a1a2a", color: type === "leave" ? "#5af07a" : "#5a9af0" }}>{items.length}</span>}
      </div>
      {isEmpty ? (
        <div className="flex flex-col items-center text-center py-6 gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: "#111", border: "1px solid #2a2a2a" }}>✅</div>
          <div>
            <p className="text-gray-300 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>All caught up</p>
            <p className="text-gray-600 text-xs mt-1" style={{ fontFamily: "system-ui,sans-serif" }}>No pending {type === "leave" ? "leave requests" : "overtime requests"} to review.</p>
          </div>
          <div className="w-full mt-1 rounded px-3 py-2.5 text-center" style={{ backgroundColor: "#111", border: "1px dashed #2a2a2a" }}>
            <p className="text-gray-600 text-xs" style={{ fontFamily: "system-ui,sans-serif" }}>New requests will appear here for your review.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(r => (
            <button key={r.id} onClick={() => onSelect(r)} className="w-full text-left px-3 py-2.5 rounded hover:opacity-80" style={{ backgroundColor: "#111", border: "1px solid #2a2a2a" }}>
              <p className="text-gray-200 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{type === "leave" ? r.type : `${r.date} · ${r.day}`}</p>
              <p className="text-gray-500 text-xs" style={{ fontFamily: "system-ui,sans-serif" }}>{type === "leave" ? `${r.from} · ${r.days}d` : `+${r.ot?.toFixed(2)}h · ${r.reason}`}</p>
              <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block" style={{ fontFamily: "system-ui,sans-serif", ...BADGE[r.status] }}>{r.status}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ATTACHMENT MODAL ──────────────────────────────────────────────────────────
function AttachmentModal({ item, type, onClose, onApprove, onReject }) {
  const [decision, setDecision] = useState(null);
  const [remarks, setRemarks] = useState("");
  const isLeave = type === "leave";
  const isUT    = type === "undertime";
  const isPending = item.status === "Pending" || item.status === "For Review";
  function submit(action) { if (action === "approve") onApprove(item.id, remarks); else onReject(item.id, remarks); onClose(); }
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.75)" }} onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-xl flex flex-col" style={{ backgroundColor: "#0d0d0d", border: "1px solid #2a2a2a", maxHeight: "90vh" }}>
          <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #1e1e1e" }}>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-0.5" style={{ fontFamily: "system-ui,sans-serif" }}>{isLeave ? "Leave Request" : isUT ? "Undertime Request" : "Overtime Request"} · Review</p>
              <h2 className="text-lg font-normal text-white">{isLeave ? item.type : isUT ? `Undertime — ${item.date}` : `Overtime — ${item.date}`}</h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="rounded-lg p-4" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-3" style={{ fontFamily: "system-ui,sans-serif" }}>Request Details</p>
              <div className="grid grid-cols-2 gap-3">
                {(isLeave
                  ? [["Type",item.type],["From",item.from],["To",item.to],["Duration",`${item.days} day${item.days>1?"s":""}`],["Reason",item.reason],["Filed",item.filed]]
                  : isUT
                    ? [["Date",item.date],["Day",item.day],["Clock In",item.clockIn],["Clock Out",item.clockOut],["UT Hours",`-${item.diff?.toFixed(2)}h`],["Reason",item.reason],["Filed",item.filed]]
                    : [["Date",item.date],["Day",item.day],["Clock In",item.clockIn],["Clock Out",item.clockOut],["OT Hours",`+${item.diff?.toFixed(2)}h`],["Reason",item.reason],["Filed",item.filed]]
                ).map(([l,v]) => (
                  <div key={l}>
                    <p className="text-gray-600 text-xs" style={{ fontFamily: "system-ui,sans-serif" }}>{l}</p>
                    <p className="text-gray-200 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{v || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-3" style={{ fontFamily: "system-ui,sans-serif" }}>Attachments <span className="text-gray-700 normal-case">({item.attachments.length} file{item.attachments.length !== 1 ? "s" : ""})</span></p>
              {item.attachments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-20 rounded-lg gap-1" style={{ border: "1px dashed #3a1515", backgroundColor: "#110808" }}>
                  <p className="text-red-400 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>⚠ No attachments submitted</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {item.attachments.map((att, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 rounded-lg group" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold" style={{ fontFamily: "monospace", backgroundColor: "#1a1a1a", color: att.ext === "pdf" ? "#f05a5a" : "#5a9af0" }}>{att.ext.toUpperCase()}</div>
                        <div>
                          <p className="text-gray-200 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{att.name}</p>
                          <p className="text-gray-600 text-xs" style={{ fontFamily: "system-ui,sans-serif" }}>{att.size} · {att.label}</p>
                        </div>
                      </div>
                      <button className="text-gray-500 hover:text-white text-sm opacity-0 group-hover:opacity-100">↓ View</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2" style={{ fontFamily: "system-ui,sans-serif" }}>HR Remarks <span className="text-gray-700 normal-case">(optional)</span></p>
              <textarea className="w-full px-3 py-2.5 rounded text-sm text-white placeholder-gray-600 outline-none resize-none" style={{ ...IS, height: 72 }} placeholder="Add remarks…" value={remarks} onChange={e => setRemarks(e.target.value)} />
            </div>
            {isPending ? (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-3" style={{ fontFamily: "system-ui,sans-serif" }}>Decision</p>
                <div className="flex gap-3">
                  <button onClick={() => setDecision("approve")} className="flex-1 py-2.5 rounded text-sm font-medium" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: decision === "approve" ? "#0f1f0f" : "#111", color: decision === "approve" ? "#5af07a" : "#666", border: decision === "approve" ? "1px solid #2a4a2a" : "1px solid #2a2a2a" }}>✓ Approve</button>
                  <button onClick={() => setDecision("reject")} className="flex-1 py-2.5 rounded text-sm font-medium" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: decision === "reject" ? "#1f0f0f" : "#111", color: decision === "reject" ? "#f05a5a" : "#666", border: decision === "reject" ? "1px solid #4a2a2a" : "1px solid #2a2a2a" }}>✕ Reject</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded" style={{ backgroundColor: "#111", border: "1px solid #222" }}>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: "system-ui,sans-serif", ...BADGE[item.status] }}>{item.status}</span>
                <span className="text-gray-500 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>This request has already been {item.status.toLowerCase()}.</span>
              </div>
            )}
          </div>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: "1px solid #1e1e1e" }}>
            <button onClick={onClose} className="px-4 py-2 rounded text-sm hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", color: "#aaa", border: "1px solid #2a2a2a" }}>Cancel</button>
            {isPending && (
              <button onClick={() => decision && submit(decision)} className="px-5 py-2 rounded text-sm font-medium" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: !decision ? "#1a1a1a" : decision === "approve" ? "#fff" : "#f05a5a", color: !decision ? "#444" : decision === "approve" ? "#000" : "#fff", cursor: !decision ? "not-allowed" : "pointer", opacity: !decision ? 0.5 : 1 }}>
                {!decision ? "Select a decision first" : decision === "approve" ? "Confirm Approval" : "Confirm Rejection"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── LEAVE TAB ─────────────────────────────────────────────────────────────────
function LeaveTab({ emptyState = false }) {
  const [modalItem, setModalItem] = useState(null);
  const [records, setRecords] = useState(
    emptyState ? [
      { id:1, type:"Annual Leave",   from:"Dec 24, 2025",to:"Jan 1, 2026", days:6,status:"Approved",  reason:"Holiday break",   filed:"Dec 10, 2025", attachments:[{name:"Leave_Form_Dec2025.pdf",ext:"pdf",size:"84 KB",label:"Leave form"}] },
      { id:2, type:"Sick Leave",     from:"Nov 14, 2025",to:"Nov 14, 2025",days:1,status:"Approved",  reason:"Flu",              filed:"Nov 13, 2025", attachments:[{name:"Medical_Certificate.pdf",ext:"pdf",size:"156 KB",label:"Medical certificate"}] },
    ] : [
      { id:1, type:"Annual Leave",   from:"Mar 20, 2026",to:"Mar 24, 2026",days:5,status:"Pending",    reason:"Spring trip",      filed:"Feb 15, 2026", attachments:[{name:"Leave_Form_Mar2026.pdf",ext:"pdf",size:"84 KB",label:"Leave form"},{name:"Flight_Itinerary.pdf",ext:"pdf",size:"212 KB",label:"Travel itinerary"}] },
      { id:2, type:"Sick Leave",     from:"Feb 18, 2026",to:"Feb 18, 2026",days:1,status:"For Review", reason:"Migraine",         filed:"Feb 18, 2026", attachments:[] },
      { id:3, type:"Annual Leave",   from:"Dec 24, 2025",to:"Jan 1, 2026", days:6,status:"Approved",   reason:"Holiday break",    filed:"Dec 10, 2025", attachments:[{name:"Leave_Form_Dec2025.pdf",ext:"pdf",size:"84 KB",label:"Leave form"}] },
      { id:4, type:"Sick Leave",     from:"Nov 14, 2025",to:"Nov 14, 2025",days:1,status:"Approved",   reason:"Flu",              filed:"Nov 13, 2025", attachments:[{name:"Medical_Certificate.pdf",ext:"pdf",size:"156 KB",label:"Medical certificate"}] },
    ]
  );
  function approve(id, remarks) { setRecords(r => r.map(x => x.id === id ? { ...x, status: "Approved", remarks } : x)); }
  function reject(id, remarks)  { setRecords(r => r.map(x => x.id === id ? { ...x, status: "Rejected", remarks } : x)); }
  const pending = records.filter(r => r.status === "Pending" || r.status === "For Review");
  const leaveBalances = [{ label: "Annual Leave", used: 8, total: 20 },{ label: "Sick Leave", used: 2, total: 10 },{ label: "Vacation Leave", used: 5, total: 15 },{ label: "Emergency Leave", used: 3, total: 5 }];
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-1 space-y-5">
        <div className="rounded-lg p-5" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
          <h3 className="text-sm font-normal text-white mb-4">Leave Balances · 2026</h3>
          <div className="space-y-4">
            {leaveBalances.map(({ label, used, total }) => (
              <div key={label}>
                <div className="flex justify-between mb-1.5"><span className="text-gray-400 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{label}</span><span className="text-xs" style={{ fontFamily: "monospace", color: "#aaa" }}><span className="text-white">{total - used}</span>/{total}</span></div>
                <div className="h-2 rounded-full" style={{ backgroundColor: "#2a2a2a" }}><div className="h-full rounded-full bg-white" style={{ width: `${(used / total) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <NeedsActionPanel items={pending} type="leave" onSelect={setModalItem} />
      </div>
      <div className="col-span-2 space-y-5">
        <div className="flex items-center justify-between">
          <div><h3 className="text-sm font-normal text-white">Leave Records</h3><p className="text-xs text-gray-600 mt-0.5" style={{ fontFamily: "system-ui,sans-serif" }}>Click any row to review</p></div>
          <button className="px-3 py-1.5 rounded text-xs bg-white text-black hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif" }}>+ File Leave</button>
        </div>
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #1e1e1e" }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid #1e1e1e" }}>{["Type", "From", "To", "Days", "Reason", "Attachments", "Status"].map(h => <th key={h} className="px-4 py-3 text-left font-normal text-gray-600" style={{ fontFamily: "system-ui,sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>)}</tr></thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id} onClick={() => setModalItem(r)} className="cursor-pointer" style={{ borderBottom: "1px solid #141414", backgroundColor: "#0d0d0d" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#141414"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#0d0d0d"}>
                  <td className="px-4 py-3 text-gray-200 text-sm whitespace-nowrap" style={{ fontFamily: "system-ui,sans-serif" }}>{r.type}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap" style={{ fontFamily: "monospace" }}>{r.from}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap" style={{ fontFamily: "monospace" }}>{r.to}</td>
                  <td className="px-4 py-3 text-gray-300 text-xs" style={{ fontFamily: "monospace" }}>{r.days}d</td>
                  <td className="px-4 py-3 text-gray-500 text-xs" style={{ fontFamily: "system-ui,sans-serif" }}>{r.reason || "—"}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-1.5"><span className="text-xs" style={{ fontFamily: "monospace", color: r.attachments.length > 0 ? "#fff" : "#f05a5a" }}>{r.attachments.length}</span><span className="text-xs text-gray-600" style={{ fontFamily: "system-ui,sans-serif" }}>files</span>{r.attachments.length === 0 && <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#1f0f0f", color: "#f05a5a", fontFamily: "system-ui,sans-serif" }}>Missing</span>}</div></td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: "system-ui,sans-serif", ...BADGE[r.status] }}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modalItem && <AttachmentModal item={modalItem} type="leave" onClose={() => setModalItem(null)} onApprove={approve} onReject={reject} />}
    </div>
  );
}

// ── OT / UT TAB ───────────────────────────────────────────────────────────────
function OTUTTab({ emptyState = false }) {
  const [modalItem, setModalItem] = useState(null);
  const [view, setView] = useState("ot");
  const [otRecords, setOtRecords] = useState([
    { id:1, kind:"ot", date:"Feb 20, 2026", day:"Thu", clockIn:"8:52 AM", clockOut:"6:45 PM", expected:8, actual:9.88,  diff:1.88, status:"Pending",   reason:"Sprint deadline",       filed:"Feb 20, 2026", attachments:[{name:"OT_Auth_Feb20.pdf",ext:"pdf",size:"76 KB",label:"OT authorization form"}] },
    { id:2, kind:"ot", date:"Feb 13, 2026", day:"Thu", clockIn:"9:05 AM", clockOut:"7:30 PM", expected:8, actual:10.42, diff:2.42, status:"Approved",  reason:"Deployment support",    filed:"Feb 13, 2026", attachments:[{name:"OT_Auth_Feb13.pdf",ext:"pdf",size:"76 KB",label:"OT authorization form"}] },
  ]);
  const [utRecords, setUtRecords] = useState([
    { id:1, kind:"ut", date:"Feb 18, 2026", day:"Tue", clockIn:"9:14 AM", clockOut:"4:30 PM", expected:8, actual:7.27, diff:0.73, status:"Pending",  reason:"Dental appointment", filed:"Feb 18, 2026", attachments:[{name:"UT_Form_Feb18.pdf",ext:"pdf",size:"68 KB",label:"Undertime form"}] },
    { id:2, kind:"ut", date:"Feb 5, 2026",  day:"Thu", clockIn:"9:00 AM", clockOut:"3:45 PM", expected:8, actual:6.75, diff:1.25, status:"Approved", reason:"Power outage",       filed:"Feb 5, 2026",  attachments:[{name:"UT_Form_Feb05.pdf",ext:"pdf",size:"68 KB",label:"Undertime form"}] },
  ]);
  function approveOT(id, r) { setOtRecords(x => x.map(e => e.id===id ? {...e,status:"Approved",remarks:r} : e)); }
  function rejectOT(id, r)  { setOtRecords(x => x.map(e => e.id===id ? {...e,status:"Rejected",remarks:r} : e)); }
  function approveUT(id, r) { setUtRecords(x => x.map(e => e.id===id ? {...e,status:"Approved",remarks:r} : e)); }
  function rejectUT(id, r)  { setUtRecords(x => x.map(e => e.id===id ? {...e,status:"Rejected",remarks:r} : e)); }
  const otRate = (142000 / 52 / 40) * 1.25;
  const pendingOT = otRecords.filter(r=>r.status==="Pending"||r.status==="For Review");
  const pendingUT = utRecords.filter(r=>r.status==="Pending"||r.status==="For Review");
  const activeRecords = view === "ot" ? otRecords : utRecords;
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-1 space-y-5">
        <div className="rounded-lg p-5" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
          <h3 className="text-sm font-normal text-white mb-4">Summary · Feb 2026</h3>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily:"system-ui,sans-serif", color:"#5a9af0" }}>Overtime</p>
          {[["Approved", `${otRecords.filter(r=>r.status==="Approved").reduce((s,r)=>s+r.diff,0).toFixed(1)}h`, "#5af07a"],["Pending", `${pendingOT.reduce((s,r)=>s+r.diff,0).toFixed(1)}h`, pendingOT.length>0?"#f0c85a":"#555"]].map(([l,v,c])=>(
            <div key={l} className="flex justify-between py-2" style={{ borderBottom:"1px solid #1a1a1a" }}><span className="text-gray-500 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{l}</span><span className="text-sm" style={{fontFamily:"monospace",color:c}}>{v}</span></div>
          ))}
          <p className="text-xs uppercase tracking-widest mt-4 mb-2" style={{ fontFamily:"system-ui,sans-serif", color:"#f05a5a" }}>Undertime</p>
          {[["Approved", `${utRecords.filter(r=>r.status==="Approved").reduce((s,r)=>s+r.diff,0).toFixed(2)}h`, "#f05a5a"],["Pending", `${pendingUT.reduce((s,r)=>s+r.diff,0).toFixed(2)}h`, pendingUT.length>0?"#f0c85a":"#555"]].map(([l,v,c])=>(
            <div key={l} className="flex justify-between py-2" style={{ borderBottom:"1px solid #1a1a1a" }}><span className="text-gray-500 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{l}</span><span className="text-sm" style={{fontFamily:"monospace",color:c}}>{v}</span></div>
          ))}
        </div>
        <div className="rounded-lg p-5" style={{ backgroundColor:"#0d0d0d", border:"1px solid #1e1e1e" }}>
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3" style={{fontFamily:"system-ui,sans-serif"}}>Needs Action</p>
          {[...pendingOT,...pendingUT].length===0 ? (
            <p className="text-gray-600 text-xs text-center py-4" style={{fontFamily:"system-ui,sans-serif"}}>All caught up ✅</p>
          ) : [...pendingOT,...pendingUT].map(r=>(
            <button key={`${r.kind}-${r.id}`} onClick={()=>{ setView(r.kind); setModalItem(r); }}
              className="w-full text-left px-3 py-2.5 rounded mb-2 hover:opacity-80"
              style={{backgroundColor:"#111",border:"1px solid #2a2a2a"}}>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs px-1.5 py-0.5 rounded" style={{fontFamily:"system-ui,sans-serif",backgroundColor:r.kind==="ot"?"#0a1a2a":"#1f0f0f",color:r.kind==="ot"?"#5a9af0":"#f05a5a"}}>{r.kind==="ot"?"OT":"UT"}</span>
                <p className="text-gray-200 text-sm" style={{fontFamily:"system-ui,sans-serif"}}>{r.date}</p>
              </div>
              <p className="text-gray-500 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{r.kind==="ot"?"+":"-"}{r.diff.toFixed(2)}h · {r.reason}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="col-span-2 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {[["ot","Overtime"],["ut","Undertime"]].map(([key,label])=>(
              <button key={key} onClick={()=>setView(key)} className="px-4 py-2 rounded text-sm"
                style={{fontFamily:"system-ui,sans-serif",backgroundColor:view===key?(key==="ot"?"#0a1a2a":"#1f0a0a"):"#111",color:view===key?(key==="ot"?"#5a9af0":"#f05a5a"):"#666",border:view===key?`1px solid ${key==="ot"?"#1e3a5a":"#4a1a1a"}`:"1px solid #2a2a2a"}}>
                {label}
              </button>
            ))}
          </div>
          <button className="px-3 py-1.5 rounded text-xs bg-white text-black hover:opacity-80" style={{fontFamily:"system-ui,sans-serif"}}>{view==="ot"?"+ Log OT":"+ Log UT"}</button>
        </div>
        <div className="rounded-lg overflow-hidden" style={{border:"1px solid #1e1e1e"}}>
          <table className="w-full text-sm">
            <thead><tr style={{backgroundColor:"#0a0a0a",borderBottom:"1px solid #1e1e1e"}}>{["Date","In","Out","Expected","Actual",view==="ot"?"OT Hrs":"UT Hrs","Reason","Status"].map(h=><th key={h} className="px-3 py-3 text-left font-normal text-gray-600" style={{fontFamily:"system-ui,sans-serif",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
            <tbody>
              {activeRecords.map(r=>(
                <tr key={r.id} onClick={()=>setModalItem(r)} className="cursor-pointer" style={{borderBottom:"1px solid #141414",backgroundColor:view==="ot"?"#0d0d10":"#100d0d"}} onMouseEnter={e=>e.currentTarget.style.backgroundColor=view==="ot"?"#101018":"#180e0e"} onMouseLeave={e=>e.currentTarget.style.backgroundColor=view==="ot"?"#0d0d10":"#100d0d"}>
                  <td className="px-3 py-3"><p className="text-gray-200 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{r.date}</p><p className="text-gray-600 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{r.day}</p></td>
                  <td className="px-3 py-3 text-gray-400 text-xs whitespace-nowrap" style={{fontFamily:"monospace"}}>{r.clockIn}</td>
                  <td className="px-3 py-3 text-gray-400 text-xs whitespace-nowrap" style={{fontFamily:"monospace"}}>{r.clockOut}</td>
                  <td className="px-3 py-3 text-gray-500 text-xs" style={{fontFamily:"monospace"}}>{r.expected}h</td>
                  <td className="px-3 py-3 text-white text-xs" style={{fontFamily:"monospace"}}>{r.actual.toFixed(2)}h</td>
                  <td className="px-3 py-3 text-xs font-medium" style={{fontFamily:"monospace",color:view==="ot"?"#5a9af0":"#f05a5a"}}>{view==="ot"?"+":"-"}{r.diff.toFixed(2)}h</td>
                  <td className="px-3 py-3 text-gray-500 text-xs truncate" style={{fontFamily:"system-ui,sans-serif",maxWidth:"7rem"}}>{r.reason}</td>
                  <td className="px-3 py-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{fontFamily:"system-ui,sans-serif",...BADGE[r.status]}}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modalItem && <AttachmentModal item={modalItem} type={modalItem.kind==="ut"?"undertime":"overtime"} onClose={()=>setModalItem(null)} onApprove={modalItem.kind==="ut"?approveUT:approveOT} onReject={modalItem.kind==="ut"?rejectUT:rejectOT}/>}
    </div>
  );
}

// ── DOCUMENTS TAB ─────────────────────────────────────────────────────────────
function DocumentsTab() {
  const [filter, setFilter] = useState("All");
  const docs = [
    { name: "Employment Contract",      type: "Contract", size: "248 KB", uploaded: "Jan 12, 2021", uploader: "HR Admin",    status: "Signed",  ext: "pdf" },
    { name: "NDA — Mutual",             type: "Legal",    size: "112 KB", uploaded: "Jan 12, 2021", uploader: "HR Admin",    status: "Signed",  ext: "pdf" },
    { name: "Benefits Enrollment Form", type: "Benefits", size: "89 KB",  uploaded: "Feb 1, 2021",  uploader: "Sara Okafor", status: "Signed",  ext: "pdf" },
    { name: "2025 Performance Review",  type: "Review",   size: "340 KB", uploaded: "Feb 10, 2026", uploader: "Devon Park",  status: "Signed",  ext: "pdf" },
    { name: "Q1 2026 Goal Sheet",       type: "Review",   size: "76 KB",  uploaded: "Jan 15, 2026", uploader: "Sara Okafor", status: "Pending", ext: "docx" },
    { name: "Payslip — Jan 2026",       type: "Payroll",  size: "42 KB",  uploaded: "Feb 1, 2026",  uploader: "Payroll Sys", status: "Auto",    ext: "pdf" },
  ];
  const cats = ["All", "Contract", "Legal", "Benefits", "Review", "Policy", "Payroll"];
  const filtered = filter === "All" ? docs : docs.filter(d => d.type === filter);
  const dSS = { Signed: { bg: "#0f1f0f", color: "#5af07a" }, Pending: { bg: "#1f1a0f", color: "#f0c85a" }, Auto: { bg: "#111", color: "#888" } };
  const extCol = { pdf: "#f05a5a", docx: "#5a9af0" };
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">{cats.map(c => <button key={c} onClick={() => setFilter(c)} className="px-3 py-1.5 rounded text-xs" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: filter === c ? "#fff" : "#111", color: filter === c ? "#000" : "#666", border: filter === c ? "none" : "1px solid #2a2a2a" }}>{c}</button>)}</div>
        <button className="px-3 py-1.5 rounded text-xs bg-white text-black hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif" }}>⬆ Upload</button>
      </div>
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #1e1e1e" }}>
        <table className="w-full text-sm">
          <thead><tr style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid #1e1e1e" }}>{["Document", "Type", "Size", "Uploaded", "By", "Status", ""].map(h => <th key={h} className="px-4 py-3 text-left font-normal text-gray-600" style={{ fontFamily: "system-ui,sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((doc, i) => (
              <tr key={i} className="group cursor-pointer" style={{ borderBottom: "1px solid #141414", backgroundColor: "#0d0d0d" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#111"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#0d0d0d"}>
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold" style={{ fontFamily: "monospace", backgroundColor: "#1a1a1a", color: extCol[doc.ext] || "#888" }}>{doc.ext.toUpperCase()}</div><span className="text-gray-200 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{doc.name}</span></div></td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#1a1a1a", color: "#888" }}>{doc.type}</span></td>
                <td className="px-4 py-3 text-gray-500 text-xs" style={{ fontFamily: "monospace" }}>{doc.size}</td>
                <td className="px-4 py-3 text-gray-500 text-xs" style={{ fontFamily: "monospace" }}>{doc.uploaded}</td>
                <td className="px-4 py-3 text-gray-400 text-xs" style={{ fontFamily: "system-ui,sans-serif" }}>{doc.uploader}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: "system-ui,sans-serif", ...dSS[doc.status] }}>{doc.status}</span></td>
                <td className="px-4 py-3"><div className="flex gap-2 opacity-0 group-hover:opacity-100"><button className="text-xs text-gray-400 hover:text-white">↓</button><button className="text-xs text-gray-400 hover:text-white">⋯</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── ACTIVITY TAB ──────────────────────────────────────────────────────────────
function ActivityTab() {
  const [filter, setFilter] = useState("All");
  const events = [
    { date: "Feb 10, 2026", time: "2:14 PM",  type: "Review",   icon: "📝", title: "Performance review completed",    detail: "Q4 2025 scored 4.2/5. Reviewer: Devon Park.",     actor: "Devon Park" },
    { date: "Feb 1, 2026",  time: "9:00 AM",  type: "Payroll",  icon: "💳", title: "Payslip generated — Jan 2026",    detail: "Net pay $5,461. Account ••••2847.",               actor: "Payroll System" },
    { date: "Jan 15, 2026", time: "11:30 AM", type: "Document", icon: "📄", title: "Q1 2026 Goal Sheet uploaded",      detail: "Awaiting manager signature.",                    actor: "Sara Okafor" },
    { date: "Jan 1, 2026",  time: "8:00 AM",  type: "Role",     icon: "⬆️", title: "Title updated to Senior Engineer", detail: "Previous: Engineer II. Effective Jan 1, 2026.",  actor: "Devon Park" },
    { date: "Dec 24, 2025", time: "All day",  type: "Leave",    icon: "🏖️", title: "Annual leave started",             detail: "Dec 24 – Jan 1. 6 days. Approved by Devon Park.", actor: "System" },
  ];
  const types = ["All", "Review", "Payroll", "Leave", "Document", "Role", "Training"];
  const tCol = { Review: "#9b8aff", Payroll: "#5af07a", Leave: "#f0c85a", Document: "#5a9af0", Role: "#fff", Training: "#f05a5a" };
  const filtered = filter === "All" ? events : events.filter(e => e.type === filter);
  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">{types.map(t => <button key={t} onClick={() => setFilter(t)} className="px-3 py-1.5 rounded text-xs flex items-center gap-1.5" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: filter === t ? "#fff" : "#111", color: filter === t ? "#000" : "#666", border: filter === t ? "none" : "1px solid #2a2a2a" }}>{t !== "All" && <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tCol[t] }} />}{t}</button>)}</div>
      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-px" style={{ backgroundColor: "#1e1e1e" }} />
        <div className="space-y-1">
          {filtered.map((ev, i) => {
            const showDate = i === 0 || filtered[i - 1].date !== ev.date;
            return (
              <div key={i}>
                {showDate && <div className="pl-12 pt-4 pb-2"><span className="text-xs text-gray-600 uppercase tracking-widest" style={{ fontFamily: "monospace" }}>{ev.date}</span></div>}
                <div className="flex items-start gap-4 py-2 px-3 rounded-lg hover:bg-white hover:bg-opacity-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10" style={{ backgroundColor: "#111", border: `1px solid ${tCol[ev.type] || "#333"}` }}><span className="text-base">{ev.icon}</span></div>
                  <div className="flex-1 pt-1.5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-gray-100 text-sm font-medium" style={{ fontFamily: "system-ui,sans-serif" }}>{ev.title}</p>
                        <p className="text-gray-500 text-sm mt-0.5" style={{ fontFamily: "system-ui,sans-serif" }}>{ev.detail}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#1a1a1a", color: tCol[ev.type] || "#888" }}>{ev.type}</span>
                          <span className="text-xs text-gray-600" style={{ fontFamily: "system-ui,sans-serif" }}>by {ev.actor}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 whitespace-nowrap" style={{ fontFamily: "monospace" }}>{ev.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── OVERVIEW TAB ──────────────────────────────────────────────────────────────
function OverviewTab({ emp }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          {[{ label: "Email", value: emp.email, icon: "📧" }, { label: "Phone", value: emp.phone, icon: "📞" }, { label: "Location", value: emp.location, icon: "📍" }, { label: "Schedule", value: emp.schedule, icon: "🗓️" }, { label: "Manager", value: emp.manager, icon: "👤" }, { label: "Employment", value: emp.empType, icon: "💼" }].map(({ label, value, icon }) => (
            <div key={label} className="rounded-lg p-4 flex items-start gap-3" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
              <span className="text-lg">{icon}</span>
              <div><p className="text-gray-500 text-xs uppercase tracking-widest" style={{ fontFamily: "system-ui,sans-serif" }}>{label}</p><p className="text-gray-200 text-sm mt-0.5" style={{ fontFamily: "system-ui,sans-serif" }}>{value}</p></div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-lg p-5" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
          <h3 className="text-sm font-normal text-white mb-4">Compensation</h3>
          {[["Annual Salary", emp.salary], ["Pay Frequency", emp.payFreq], ["Benefits", emp.benefits]].map(([l, v]) => (
            <div key={l} className="flex justify-between py-2" style={{ borderBottom: "1px solid #1a1a1a" }}><span className="text-gray-500 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{l}</span><span className="text-gray-200 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{v}</span></div>
          ))}
        </div>
        <div className="rounded-lg p-5" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
          <h3 className="text-sm font-normal text-white mb-4">Leave Balance</h3>
          {[{ label: "Annual", used: 8, total: 20 }, { label: "Sick", used: 2, total: 10 }, { label: "Personal", used: 1, total: 3 }].map(({ label, used, total }) => (
            <div key={label} className="mb-3"><div className="flex justify-between mb-1"><span className="text-gray-400 text-xs" style={{ fontFamily: "system-ui,sans-serif" }}>{label}</span><span className="text-gray-500 text-xs" style={{ fontFamily: "monospace" }}>{used}/{total}d</span></div><div className="h-1.5 rounded-full" style={{ backgroundColor: "#2a2a2a" }}><div className="h-full rounded-full bg-white" style={{ width: `${(used / total) * 100}%` }} /></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PROFILE PAGE ──────────────────────────────────────────────────────────────
function ProfilePage({ emp, onBack, onEdit }) {
  const { bg, fg } = gc(emp.id);
  const [showEmpty, setShowEmpty] = useState(false);
  const TABS = ["Overview", "Leave", "OT / UT", "Documents", "Activity"];
  const [tab, setTab] = useState("Overview");
  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#000" }}>
      <div className="px-8 pt-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-white text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>← Back to Directory</button>
          <button onClick={() => setShowEmpty(e => !e)} className="text-xs px-3 py-1.5 rounded" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: showEmpty ? "#fff" : "#111", color: showEmpty ? "#000" : "#666", border: showEmpty ? "none" : "1px solid #2a2a2a" }}>
            {showEmpty ? "Preview: Empty state ON" : "Preview: Empty state OFF"}
          </button>
        </div>
        <div className="flex items-end justify-between pb-6" style={{ borderBottom: "1px solid #222" }}>
          <div className="flex items-center gap-5">
            <div className="rounded-full flex items-center justify-center font-bold" style={{ width: 72, height: 72, backgroundColor: bg, color: fg, fontFamily: "system-ui,sans-serif", fontSize: 22 }}>{emp.avatar}</div>
            <div>
              <h1 className="text-3xl font-normal text-white mb-1" style={{ letterSpacing: "-0.02em" }}>{emp.name}</h1>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{emp.role} · {emp.dept}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: "system-ui,sans-serif", ...SS[emp.status] }}>{emp.status}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onEdit} className="px-4 py-2 rounded text-sm hover:opacity-80 flex items-center gap-2" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", color: "#aaa", border: "1px solid #2a2a2a" }}>✏️ Edit Profile</button>
            <button className="px-4 py-2 rounded text-sm bg-white text-black hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif" }}>📧 Send Message</button>
          </div>
        </div>
        <div className="flex gap-1 mt-4">
          {TABS.map(t => <button key={t} onClick={() => setTab(t)} className="px-4 py-2 text-sm" style={{ fontFamily: "system-ui,sans-serif", color: tab === t ? "#fff" : "#555", borderBottom: tab === t ? "2px solid #fff" : "2px solid transparent" }}>{t}</button>)}
        </div>
      </div>
      <div className="px-8 py-6">
        {tab === "Overview"  && <OverviewTab emp={emp} />}
        {tab === "Leave"     && <LeaveTab emptyState={showEmpty} />}
        {tab === "OT / UT"   && <OTUTTab emptyState={showEmpty} />}
        {tab === "Documents" && <DocumentsTab />}
        {tab === "Activity"  && <ActivityTab />}
      </div>
    </div>
  );
}

// ── EDIT DRAWER ───────────────────────────────────────────────────────────────
function EditDrawer({ emp, onClose, onSave }) {
  const [form, setForm] = useState({ ...emp });
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }
  return (
    <>
      <div className="fixed inset-0 z-20" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onClose} />
      <div className="fixed top-0 right-0 h-full z-30 flex flex-col" style={{ width: 480, backgroundColor: "#080808", borderLeft: "1px solid #222", boxShadow: "-8px 0 40px rgba(0,0,0,0.8)" }}>
        <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: "1px solid #1a1a1a" }}>
          <div className="flex items-center gap-3"><Avatar emp={emp} size={38} /><div><h2 className="text-base font-normal text-white">Edit Employee</h2><p className="text-gray-500 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{emp.name}</p></div></div>
          <button onClick={onClose} className="text-gray-600 hover:text-white text-xl">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name"><input className={IC} style={IS} value={form.name.split(" ")[0]} onChange={e => set("name", e.target.value + " " + form.name.split(" ").slice(1).join(" "))} /></Field>
            <Field label="Last Name"><input className={IC} style={IS} value={form.name.split(" ").slice(1).join(" ")} onChange={e => set("name", form.name.split(" ")[0] + " " + e.target.value)} /></Field>
          </div>
          <Field label="Work Email"><input className={IC} style={IS} value={form.email} onChange={e => set("email", e.target.value)} /></Field>
          <Field label="Job Title"><input className={IC} style={IS} value={form.role} onChange={e => set("role", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Department"><select className={IC} style={IS} value={form.dept} onChange={e => set("dept", e.target.value)}>{["Engineering","Sales","Product","Design","Operations","Marketing","HR & Admin"].map(d => <option key={d}>{d}</option>)}</select></Field>
            <Field label="Status"><select className={IC} style={IS} value={form.status} onChange={e => set("status", e.target.value)}><option>Active</option><option>On Leave</option><option>Inactive</option></select></Field>
          </div>
        </div>
        <div className="px-7 py-5 flex items-center justify-between" style={{ borderTop: "1px solid #1a1a1a" }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded text-sm hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", color: "#aaa", border: "1px solid #2a2a2a" }}>Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} className="px-5 py-2.5 rounded text-sm font-medium bg-white text-black hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif" }}>Save Changes ✓</button>
        </div>
      </div>
    </>
  );
}

// ── DIRECTORY ─────────────────────────────────────────────────────────────────
function Directory({ onViewProfile, onEditEmployee }) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEmp, setSelectedEmp] = useState(null);
  const filtered = useMemo(() => EMPLOYEES.filter(e => {
    const q = search.toLowerCase();
    return (!q || e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.dept.toLowerCase().includes(q))
      && (deptFilter === "All" || e.dept === deptFilter)
      && (statusFilter === "All" || e.status === statusFilter);
  }), [search, deptFilter, statusFilter]);

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-8 pt-8 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div><p className="text-gray-600 text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "system-ui,sans-serif" }}>People</p><h1 className="text-3xl font-normal" style={{ letterSpacing: "-0.02em" }}>Employee Directory</h1></div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded text-sm flex items-center gap-2 hover:opacity-70" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", color: "#aaa", border: "1px solid #2a2a2a" }}>⬇ Export CSV</button>
              <button className="px-4 py-2 rounded text-sm font-medium bg-white text-black flex items-center gap-2 hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif" }}>＋ Add Employee</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span><input className="w-full pl-9 pr-4 py-2 rounded text-sm text-white placeholder-gray-600 outline-none" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", border: "1px solid #2a2a2a" }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} /></div>
            <select className="px-3 py-2 rounded text-sm text-gray-300 outline-none cursor-pointer" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", border: "1px solid #2a2a2a" }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>{DEPTS.map(d => <option key={d}>{d === "All" ? "All Departments" : d}</option>)}</select>
            <select className="px-3 py-2 rounded text-sm text-gray-300 outline-none cursor-pointer" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", border: "1px solid #2a2a2a" }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>{STATUSES.map(s => <option key={s}>{s === "All" ? "All Statuses" : s}</option>)}</select>
            <div className="flex-1" /><span className="text-gray-600 text-sm" style={{ fontFamily: "monospace" }}>{filtered.length} of {EMPLOYEES.length}</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto px-8 pb-8">
          <table className="w-full text-sm border-collapse">
            <thead><tr style={{ borderBottom: "1px solid #222" }}>{["Employee", "Department", "Role", "Location", "Status", "Joined"].map(h => <th key={h} className="pb-3 pr-6 text-left font-normal text-gray-600" style={{ fontFamily: "system-ui,sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>)}<th /></tr></thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} onClick={() => setSelectedEmp(selectedEmp?.id === emp.id ? null : emp)} className="cursor-pointer group"
                  style={{ borderBottom: "1px solid #181818", backgroundColor: selectedEmp?.id === emp.id ? "#111" : "transparent" }}
                  onMouseEnter={e => { if (selectedEmp?.id !== emp.id) e.currentTarget.style.backgroundColor = "#0a0a0a"; }}
                  onMouseLeave={e => { if (selectedEmp?.id !== emp.id) e.currentTarget.style.backgroundColor = "transparent"; }}>
                  <td className="py-3 pr-6"><div className="flex items-center gap-3"><Avatar emp={emp} size={34} /><div><p className="text-white font-medium">{emp.name}</p><p className="text-gray-500 text-xs" style={{ fontFamily: "system-ui,sans-serif" }}>{emp.email}</p></div></div></td>
                  <td className="py-3 pr-6 text-gray-400" style={{ fontFamily: "system-ui,sans-serif" }}>{emp.dept}</td>
                  <td className="py-3 pr-6 text-gray-300" style={{ fontFamily: "system-ui,sans-serif" }}>{emp.role}</td>
                  <td className="py-3 pr-6 text-gray-400" style={{ fontFamily: "system-ui,sans-serif" }}>{emp.location}</td>
                  <td className="py-3 pr-6"><span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: "system-ui,sans-serif", ...SS[emp.status] }}>{emp.status}</span></td>
                  <td className="py-3 pr-6 text-gray-500 text-xs" style={{ fontFamily: "monospace" }}>{emp.joined}</td>
                  <td className="py-3"><span className="opacity-0 group-hover:opacity-100 text-gray-500 text-sm">→</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedEmp && (
        <div className="w-72 flex-shrink-0 border-l overflow-y-auto" style={{ backgroundColor: "#080808", borderColor: "#222" }}>
          <div className="p-6">
            <div className="flex justify-end mb-4"><button onClick={() => setSelectedEmp(null)} className="text-gray-600 hover:text-white">✕</button></div>
            <div className="flex flex-col items-center text-center mb-5">
              <Avatar emp={selectedEmp} size={56} />
              <h2 className="text-lg font-normal mt-3 mb-1">{selectedEmp.name}</h2>
              <p className="text-gray-400 text-sm mb-2" style={{ fontFamily: "system-ui,sans-serif" }}>{selectedEmp.role}</p>
              <span className="text-xs px-3 py-1 rounded-full" style={{ fontFamily: "system-ui,sans-serif", ...SS[selectedEmp.status] }}>{selectedEmp.status}</span>
            </div>
            <div className="border-b mb-4" style={{ borderColor: "#222" }} />
            <div className="space-y-3">{[["Department", selectedEmp.dept], ["Location", selectedEmp.location], ["Manager", selectedEmp.manager], ["Joined", selectedEmp.joined], ["Salary", selectedEmp.salary], ["Email", selectedEmp.email]].map(([l, v]) => <div key={l}><p className="text-gray-600 text-xs uppercase tracking-widest" style={{ fontFamily: "system-ui,sans-serif" }}>{l}</p><p className="text-gray-200 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{v}</p></div>)}</div>
            <div className="border-b my-4" style={{ borderColor: "#222" }} />
            <div className="space-y-2">
              <button onClick={() => onViewProfile(selectedEmp)} className="w-full py-2.5 rounded text-sm bg-white text-black hover:opacity-80 font-medium" style={{ fontFamily: "system-ui,sans-serif" }}>View Full Profile</button>
              <button onClick={() => onEditEmployee(selectedEmp)} className="w-full py-2.5 rounded text-sm hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", color: "#aaa", border: "1px solid #2a2a2a" }}>Edit Employee</button>
              <button className="w-full py-2.5 rounded text-sm hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#1f0f0f", color: "#f05a5a", border: "1px solid #3a1515" }}>Deactivate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function People() {
  const [view, setView] = useState("directory"); // "directory" | "profile" | "departments"
  const [profileEmp, setProfileEmp] = useState(null);
  const [editEmp, setEditEmp] = useState(null);
  const [employees, setEmployees] = useState(EMPLOYEES);
  const [departments, setDepartments] = useState(DEPT_SEED);
  const [showCreateDept, setShowCreateDept] = useState(false);

  // Top-level tabs for the People section
  const TOP_TABS = ["Directory", "Departments"];
  const [topTab, setTopTab] = useState("Directory");

  function handleSave(u) { setEmployees(p => p.map(e => e.id === u.id ? u : e)); if (profileEmp?.id === u.id) setProfileEmp(u); }
  function handleCreateDept(dept) { setDepartments(p => [...p, dept]); setShowCreateDept(false); }
  function handleChangeHead(deptId, newHeadId) { setDepartments(p => p.map(d => d.id === deptId ? { ...d, head: newHeadId } : d)); }

  // If on profile view, show profile
  if (view === "profile" && profileEmp) {
    return (
      <div className="min-h-screen text-white flex flex-col" style={{ fontFamily:"'Georgia',serif", backgroundColor:"#000" }}>
        <ProfilePage emp={employees.find(e => e.id === profileEmp.id) || profileEmp} onBack={() => setView("main")} onEdit={() => setEditEmp(employees.find(e => e.id === profileEmp.id) || profileEmp)} />
        {editEmp && <EditDrawer emp={employees.find(e => e.id === editEmp.id) || editEmp} onClose={() => setEditEmp(null)} onSave={handleSave} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ fontFamily:"'Georgia',serif", backgroundColor:"#000" }}>
      {/* Top-level section tabs */}
      <div className="px-8 pt-8 pb-0 flex-shrink-0">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-1" style={{ fontFamily:"system-ui,sans-serif" }}>People</p>
            <h1 className="text-3xl font-normal" style={{ letterSpacing:"-0.02em" }}>
              {topTab === "Directory" ? "Employee Directory" : "Departments"}
            </h1>
          </div>
          {topTab === "Departments" && (
            <button onClick={() => setShowCreateDept(true)}
              className="px-4 py-2 rounded text-sm font-medium bg-white text-black hover:opacity-80"
              style={{ fontFamily:"system-ui,sans-serif" }}>
              + New Department
            </button>
          )}
          {topTab === "Directory" && (
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded text-sm flex items-center gap-2 hover:opacity-70" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", color:"#aaa", border:"1px solid #2a2a2a" }}>⬇ Export CSV</button>
              <button className="px-4 py-2 rounded text-sm font-medium bg-white text-black flex items-center gap-2 hover:opacity-80" style={{ fontFamily:"system-ui,sans-serif" }}>＋ Add Employee</button>
            </div>
          )}
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 border-b" style={{ borderColor:"#222" }}>
          {TOP_TABS.map(t => (
            <button key={t} onClick={() => setTopTab(t)}
              className="px-4 py-2 text-sm"
              style={{ fontFamily:"system-ui,sans-serif", color: topTab===t ? "#fff" : "#555",
                borderBottom: topTab===t ? "2px solid #fff" : "2px solid transparent" }}>
              {t}
              {t === "Departments" && (
                <span className="ml-1.5 text-xs" style={{ fontFamily:"monospace", color:"#555" }}>{departments.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {topTab === "Directory" && (
        <Directory
          onViewProfile={emp => { setProfileEmp(emp); setView("profile"); }}
          onEditEmployee={emp => setEditEmp(emp)}
        />
      )}

      {topTab === "Departments" && (
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <DepartmentsTab
            employees={employees}
            allDepts={departments}
            onCreateDept={() => setShowCreateDept(true)}
            onChangeHead={handleChangeHead}
          />
        </div>
      )}

      {editEmp && <EditDrawer emp={employees.find(e => e.id === editEmp.id) || editEmp} onClose={() => setEditEmp(null)} onSave={handleSave} />}
      {showCreateDept && (
        <CreateDepartmentDrawer
          employees={employees}
          onClose={() => setShowCreateDept(false)}
          onSave={handleCreateDept}
        />
      )}
    </div>
  );
}
