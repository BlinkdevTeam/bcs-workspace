import { useState, useMemo } from "react";

// ── SETTINGS PAGE ─────────────────────────────────────────────────────────────
// Tabs:
//   Company        — name, industry, size, timezone, logo
//   Leave Types    — configure leave types and default allocations
//   Payroll        — cutoff schedule, pay frequency defaults
//   Permissions    — HRIS access management + permission overrides (Super Admin)
// ─────────────────────────────────────────────────────────────────────────────

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const FIXED_ROLES = {
  super_admin: { label:"Super Admin", color:"#f05a5a", bg:"#1f0a0a", desc:"Full system access. No restrictions."              },
  hr_admin:    { label:"HR Admin",    color:"#5af07a", bg:"#0a1f0a", desc:"All HR functions. Cannot manage roles or settings." },
  manager:     { label:"Manager",     color:"#5a9af0", bg:"#0a1020", desc:"Department-level access only."                      },
};

const ALL_PERMISSIONS = {
  payroll: [
    { key:"payroll.view",         label:"View Payroll",          desc:"See payslips and cutoffs"              },
    { key:"payroll.run",          label:"Run Payroll",           desc:"Process payroll for a cutoff"          },
    { key:"payroll.adjust",       label:"Payroll Adjustments",   desc:"Add bonuses and deductions"            },
    { key:"compensation.view",    label:"View Compensation",     desc:"See salary and package data"           },
    { key:"compensation.edit",    label:"Edit Compensation",     desc:"Change salary and packages"            },
  ],
  attendance: [
    { key:"attendance.view",      label:"View Attendance",       desc:"See time in/out records"               },
    { key:"attendance.correct",   label:"Correct Attendance",    desc:"Edit attendance records"               },
    { key:"offset.manage",        label:"Manage Offsets",        desc:"Approve and create offsets"            },
  ],
  leave: [
    { key:"leave.view",           label:"View Leave",            desc:"See leave requests and balances"       },
    { key:"leave.approve",        label:"Approve Leave",         desc:"Approve or reject leave requests"      },
    { key:"leave.configure",      label:"Configure Leave Types", desc:"Add and edit leave types"              },
  ],
  recruitment: [
    { key:"recruitment.view",     label:"View Recruitment",      desc:"See job openings and candidates"       },
    { key:"recruitment.manage",   label:"Manage Recruitment",    desc:"Post jobs, move pipeline stages"       },
    { key:"recruitment.offer",    label:"Send Offers",           desc:"Create and send job offers"            },
  ],
  employees: [
    { key:"employees.view",       label:"View Employees",        desc:"See employee profiles"                 },
    { key:"employees.invite",     label:"Invite Employees",      desc:"Send Task Management invites"          },
    { key:"employees.edit",       label:"Edit Employees",        desc:"Update employee profiles"              },
  ],
  system: [
    { key:"hris.grant_access",    label:"Grant HRIS Access",     desc:"Give employees HRIS access"            },
    { key:"hris.revoke_access",   label:"Revoke HRIS Access",    desc:"Remove HRIS access"                    },
    { key:"permissions.override", label:"Override Permissions",  desc:"Grant/revoke individual permissions"   },
    { key:"system.settings",      label:"System Settings",       desc:"Configure global HRIS settings"        },
  ],
};

const ROLE_PERMISSIONS = {
  super_admin: Object.values(ALL_PERMISSIONS).flat().map(p => p.key),
  hr_admin: [
    "payroll.view","payroll.run","payroll.adjust",
    "compensation.view","compensation.edit",
    "attendance.view","attendance.correct","offset.manage",
    "leave.view","leave.approve","leave.configure",
    "recruitment.view","recruitment.manage","recruitment.offer",
    "employees.view","employees.invite","employees.edit",
  ],
  manager: [
    "attendance.view","leave.view","leave.approve","employees.view",
  ],
};

const MODULE_COLORS = {
  payroll:     { color:"#5af07a", bg:"#0a1a0a" },
  attendance:  { color:"#5a9af0", bg:"#0a1020" },
  leave:       { color:"#f0c85a", bg:"#1f1a0a" },
  recruitment: { color:"#c07af0", bg:"#150a1f" },
  employees:   { color:"#50c8c8", bg:"#0a1a1a" },
  system:      { color:"#f05a5a", bg:"#1f0a0a" },
};

const AV = ["#5a9af0","#5af07a","#f0c85a","#c07af0","#f05a5a","#f0905a","#50c8c8","#d090f0"];
const avatarBg = id  => AV[id % AV.length];
const initials = name => name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

function getEffectivePermissions(role, overrides = []) {
  const base = new Set(ROLE_PERMISSIONS[role] || []);
  overrides.forEach(o => {
    if (o.type === "grant")  base.add(o.key);
    if (o.type === "revoke") base.delete(o.key);
  });
  return base;
}

// ── SEED DATA ─────────────────────────────────────────────────────────────────
const HRIS_USERS = [
  { id:1, name:"System Admin",  email:"admin@co.com",  dept:null,          role:"super_admin", grantedAt:"Jan 10, 2026", grantedBy:null,            overrides:[] },
  { id:2, name:"Chris Mendez",  email:"chris@co.com",  dept:"HR & Admin",  role:"hr_admin",    grantedAt:"Jan 15, 2026", grantedBy:"System Admin",  overrides:[{ key:"payroll.run", type:"revoke" }] },
  { id:3, name:"Devon Park",    email:"devon@co.com",  dept:"Engineering", role:"manager",     grantedAt:"Jan 15, 2026", grantedBy:"System Admin",  overrides:[{ key:"recruitment.view", type:"grant" }] },
  { id:4, name:"Rita Vance",    email:"rita@co.com",   dept:"Sales",       role:"manager",     grantedAt:"Feb 3, 2026",  grantedBy:"Chris Mendez",  overrides:[] },
  { id:5, name:"Lena Torres",   email:"lena@co.com",   dept:"HR & Admin",  role:"hr_admin",    grantedAt:"Feb 10, 2026", grantedBy:"Chris Mendez",  overrides:[] },
];

const COMPANY_SEED = {
  name:"Acme Corporation", industry:"Technology",
  size:"51–200 employees", timezone:"Asia/Manila",
};

const LEAVE_TYPES_SEED = [
  { id:1, name:"Annual Leave",    days:15, paid:true,  requiresDocs:false, color:"#5af07a" },
  { id:2, name:"Sick Leave",      days:10, paid:true,  requiresDocs:true,  color:"#5a9af0" },
  { id:3, name:"Emergency Leave", days:3,  paid:true,  requiresDocs:false, color:"#f05a5a" },
  { id:4, name:"Maternity Leave", days:105,paid:true,  requiresDocs:true,  color:"#c07af0" },
  { id:5, name:"Paternity Leave", days:7,  paid:true,  requiresDocs:false, color:"#f0c85a" },
];

// ── SHARED UI ─────────────────────────────────────────────────────────────────
function Avatar({ name, id, size=32 }) {
  const bg = avatarBg(id);
  return (
    <div className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
      style={{ width:size, height:size, backgroundColor:bg+"28", color:bg,
               border:`1.5px solid ${bg}44`, fontFamily:"system-ui,sans-serif",
               fontSize:size < 30 ? 10 : 13 }}>
      {initials(name)}
    </div>
  );
}

const IC  = "w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all";
const IS  = { backgroundColor:"#111", border:"1px solid #2a2a2a", fontFamily:"system-ui,sans-serif" };

function SectionHeader({ title, desc, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-lg font-normal text-white mb-1" style={{ letterSpacing:"-0.01em" }}>{title}</h2>
        <p className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>{desc}</p>
      </div>
      {action}
    </div>
  );
}

function SaveButton({ onClick, saved }) {
  return (
    <button onClick={onClick}
      className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
      style={{ fontFamily:"system-ui,sans-serif",
        backgroundColor: saved ? "#0a1a0a" : "#fff",
        color:           saved ? "#5af07a" : "#000",
        border:          saved ? "1px solid #1e3a1e" : "none" }}>
      {saved ? "✓ Saved" : "Save Changes"}
    </button>
  );
}

// ── TAB: COMPANY ──────────────────────────────────────────────────────────────
function CompanyTab() {
  const [form, setForm] = useState(COMPANY_SEED);
  const [saved, setSaved] = useState(false);

  function set(k,v) { setForm(f=>({...f,[k]:v})); setSaved(false); }
  function save() { setSaved(true); setTimeout(()=>setSaved(false), 2000); }

  return (
    <div className="max-w-xl space-y-6">
      <SectionHeader
        title="Company Information"
        desc="Basic details about your organisation shown throughout the HRIS."
        action={<SaveButton onClick={save} saved={saved}/>}
      />

      {[
        { key:"name",     label:"Company Name",    placeholder:"Acme Corporation"   },
        { key:"industry", label:"Industry",         placeholder:"Technology"         },
        { key:"size",     label:"Company Size",     placeholder:"51–200 employees"   },
        { key:"timezone", label:"Timezone",         placeholder:"Asia/Manila"        },
      ].map(f => (
        <div key={f.key} className="space-y-1.5">
          <label className="text-xs uppercase tracking-widest text-gray-500"
            style={{ fontFamily:"system-ui,sans-serif" }}>{f.label}</label>
          <input className={IC} style={IS} placeholder={f.placeholder}
            value={form[f.key]} onChange={e=>set(f.key,e.target.value)}/>
        </div>
      ))}

      {/* Logo upload placeholder */}
      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-widest text-gray-500"
          style={{ fontFamily:"system-ui,sans-serif" }}>Company Logo</label>
        <div className="flex items-center gap-4 p-4 rounded-lg"
          style={{ backgroundColor:"#111", border:"1px dashed #2a2a2a" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white flex-shrink-0">
            <span className="text-black font-bold text-xl">A</span>
          </div>
          <div>
            <p className="text-sm text-white mb-0.5" style={{ fontFamily:"system-ui,sans-serif" }}>Acme Corporation</p>
            <button className="text-xs text-gray-600 hover:text-white transition-colors"
              style={{ fontFamily:"system-ui,sans-serif" }}>Upload new logo →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TAB: LEAVE TYPES ──────────────────────────────────────────────────────────
function LeaveTypesTab() {
  const [types,      setTypes]      = useState(LEAVE_TYPES_SEED);
  const [editTarget, setEditTarget] = useState(null);
  const [showAdd,    setShowAdd]    = useState(false);
  const [newForm,    setNewForm]    = useState({ name:"", days:0, paid:true, requiresDocs:false, color:"#5af07a" });

  function togglePaid(id)     { setTypes(t=>t.map(x=>x.id===id?{...x,paid:!x.paid}:x)); }
  function toggleDocs(id)     { setTypes(t=>t.map(x=>x.id===id?{...x,requiresDocs:!x.requiresDocs}:x)); }
  function updateDays(id,val) { setTypes(t=>t.map(x=>x.id===id?{...x,days:Number(val)}:x)); }
  function deleteType(id)     { setTypes(t=>t.filter(x=>x.id!==id)); }
  function addType()          {
    if (!newForm.name.trim()) return;
    setTypes(t=>[...t,{...newForm,id:Date.now()}]);
    setNewForm({ name:"", days:0, paid:true, requiresDocs:false, color:"#5af07a" });
    setShowAdd(false);
  }

  const COLORS = ["#5af07a","#5a9af0","#f0c85a","#c07af0","#f05a5a","#f0905a","#50c8c8"];

  return (
    <div className="max-w-2xl">
      <SectionHeader
        title="Leave Types"
        desc="Configure available leave types, default allocations, and rules."
        action={
          <button onClick={()=>setShowAdd(s=>!s)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-black hover:opacity-80 transition-all"
            style={{ fontFamily:"system-ui,sans-serif" }}>
            + Add Leave Type
          </button>
        }
      />

      {/* Add form */}
      {showAdd && (
        <div className="rounded-xl p-5 mb-4 space-y-4"
          style={{ backgroundColor:"#0d0d0d", border:"1px solid #2a2a2a" }}>
          <p className="text-xs uppercase tracking-widest text-gray-500"
            style={{ fontFamily:"system-ui,sans-serif" }}>New Leave Type</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-widest text-gray-600"
                style={{ fontFamily:"system-ui,sans-serif" }}>Name</label>
              <input className={IC} style={IS} placeholder="e.g. Emergency Leave"
                value={newForm.name} onChange={e=>setNewForm(f=>({...f,name:e.target.value}))}/>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-widest text-gray-600"
                style={{ fontFamily:"system-ui,sans-serif" }}>Default Days</label>
              <input className={IC} style={IS} type="number" min="0"
                value={newForm.days} onChange={e=>setNewForm(f=>({...f,days:Number(e.target.value)}))}/>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={()=>setNewForm(f=>({...f,paid:!f.paid}))}
                className="w-8 h-4.5 rounded-full flex items-center px-0.5 transition-all cursor-pointer"
                style={{ backgroundColor:newForm.paid?"#0a1a0a":"#111", border:`1px solid ${newForm.paid?"#5af07a44":"#2a2a2a"}` }}>
                <div className="w-3.5 h-3.5 rounded-full transition-all"
                  style={{ backgroundColor:newForm.paid?"#5af07a":"#333", marginLeft:newForm.paid?"auto":0 }}/>
              </div>
              <span className="text-xs text-gray-500" style={{ fontFamily:"system-ui,sans-serif" }}>Paid leave</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={()=>setNewForm(f=>({...f,requiresDocs:!f.requiresDocs}))}
                className="w-8 h-4.5 rounded-full flex items-center px-0.5 transition-all cursor-pointer"
                style={{ backgroundColor:newForm.requiresDocs?"#0a1020":"#111", border:`1px solid ${newForm.requiresDocs?"#5a9af044":"#2a2a2a"}` }}>
                <div className="w-3.5 h-3.5 rounded-full transition-all"
                  style={{ backgroundColor:newForm.requiresDocs?"#5a9af0":"#333", marginLeft:newForm.requiresDocs?"auto":0 }}/>
              </div>
              <span className="text-xs text-gray-500" style={{ fontFamily:"system-ui,sans-serif" }}>Requires documents</span>
            </label>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest text-gray-600"
              style={{ fontFamily:"system-ui,sans-serif" }}>Color</label>
            <div className="flex gap-2">
              {COLORS.map(c=>(
                <button key={c} onClick={()=>setNewForm(f=>({...f,color:c}))}
                  className="w-6 h-6 rounded-full transition-all"
                  style={{ backgroundColor:c, border:`2px solid ${newForm.color===c?"#fff":"transparent"}` }}/>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>setShowAdd(false)}
              className="px-4 py-2 rounded-lg text-sm hover:opacity-80"
              style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", color:"#666", border:"1px solid #2a2a2a" }}>
              Cancel
            </button>
            <button onClick={addType}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-black hover:opacity-80"
              style={{ fontFamily:"system-ui,sans-serif" }}>
              Add Leave Type
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="rounded-xl overflow-hidden" style={{ border:"1px solid #1e1e1e" }}>
        {types.map((lt,i) => (
          <div key={lt.id} className="flex items-center gap-4 px-5 py-4"
            style={{ borderBottom:i<types.length-1?"1px solid #111":"none", backgroundColor:"#0d0d0d" }}>
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor:lt.color }}/>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white" style={{ fontFamily:"system-ui,sans-serif" }}>{lt.name}</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>
                  {lt.paid ? "Paid" : "Unpaid"}
                </span>
                {lt.requiresDocs && (
                  <span className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>
                    · Requires docs
                  </span>
                )}
              </div>
            </div>

            {/* Days input */}
            <div className="flex items-center gap-2">
              <input type="number" min="0"
                className="w-16 text-center px-2 py-1.5 rounded-lg text-sm text-white outline-none"
                style={{ fontFamily:"monospace", backgroundColor:"#111", border:"1px solid #2a2a2a" }}
                value={lt.days} onChange={e=>updateDays(lt.id,e.target.value)}/>
              <span className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>days</span>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-3">
              <button onClick={()=>togglePaid(lt.id)}
                className="w-8 rounded-full flex items-center px-0.5 transition-all"
                style={{ height:18, backgroundColor:lt.paid?"#0a1a0a":"#111", border:`1px solid ${lt.paid?"#5af07a44":"#2a2a2a"}` }}>
                <div className="rounded-full transition-all"
                  style={{ width:14, height:14, backgroundColor:lt.paid?"#5af07a":"#333", marginLeft:lt.paid?"auto":0 }}/>
              </button>
              <span className="text-xs text-gray-600 w-8" style={{ fontFamily:"system-ui,sans-serif" }}>
                {lt.paid?"Paid":"Free"}
              </span>
            </div>

            <button onClick={()=>deleteType(lt.id)}
              className="text-gray-700 hover:text-red-400 transition-colors text-sm">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TAB: PAYROLL CONFIG ───────────────────────────────────────────────────────
function PayrollTab() {
  const [saved, setSaved] = useState(false);
  const [form, setForm]   = useState({
    cutoffType:"semi-monthly", cutoffDay1:"15", cutoffDay2:"end",
    payDay:"5", payFrequency:"semi-monthly",
  });
  function set(k,v) { setForm(f=>({...f,[k]:v})); setSaved(false); }

  return (
    <div className="max-w-xl space-y-6">
      <SectionHeader
        title="Payroll Configuration"
        desc="Default payroll schedule and cutoff settings."
        action={<SaveButton onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000)}} saved={saved}/>}
      />

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-widest text-gray-500"
          style={{ fontFamily:"system-ui,sans-serif" }}>Cutoff Schedule</label>
        <div className="grid grid-cols-3 gap-2">
          {["semi-monthly","monthly","bi-weekly"].map(opt => (
            <button key={opt} onClick={()=>set("cutoffType",opt)}
              className="px-3 py-2.5 rounded-lg text-sm capitalize transition-all"
              style={{ fontFamily:"system-ui,sans-serif",
                backgroundColor: form.cutoffType===opt ? "#fff" : "#111",
                color:           form.cutoffType===opt ? "#000" : "#555",
                border:          `1px solid ${form.cutoffType===opt?"transparent":"#2a2a2a"}` }}>
              {opt.replace("-"," ")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-widest text-gray-500"
            style={{ fontFamily:"system-ui,sans-serif" }}>First Cutoff Day</label>
          <input className={IC} style={IS} placeholder="15"
            value={form.cutoffDay1} onChange={e=>set("cutoffDay1",e.target.value)}/>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-widest text-gray-500"
            style={{ fontFamily:"system-ui,sans-serif" }}>Second Cutoff Day</label>
          <input className={IC} style={IS} placeholder="End of month"
            value={form.cutoffDay2} onChange={e=>set("cutoffDay2",e.target.value)}/>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-widest text-gray-500"
          style={{ fontFamily:"system-ui,sans-serif" }}>Pay Day (days after cutoff)</label>
        <input className={IC} style={IS} placeholder="5"
          value={form.payDay} onChange={e=>set("payDay",e.target.value)}/>
        <p className="text-xs text-gray-700 mt-1" style={{ fontFamily:"system-ui,sans-serif" }}>
          e.g. 5 means salaries are released 5 days after each cutoff ends
        </p>
      </div>
    </div>
  );
}

// ── TAB: PERMISSIONS ──────────────────────────────────────────────────────────
function PermissionsTab() {
  const [users,      setUsers]      = useState(HRIS_USERS);
  const [selected,   setSelected]   = useState(null); // employee being edited
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [grantRole,  setGrantRole]  = useState("hr_admin");
  const [search,     setSearch]     = useState("");

  const filtered = useMemo(() =>
    users.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase())
      || u.email.toLowerCase().includes(search.toLowerCase()))
  , [users, search]);

  const selectedUser = selected ? users.find(u => u.id === selected) : null;
  const rm = selectedUser ? FIXED_ROLES[selectedUser.role] : null;

  function togglePermission(key) {
    setUsers(prev => prev.map(u => {
      if (u.id !== selected) return u;
      const has = u.overrides.find(o => o.key === key);
      if (has) return { ...u, overrides: u.overrides.filter(o => o.key !== key) };
      const inBase = (ROLE_PERMISSIONS[u.role] || []).includes(key);
      return { ...u, overrides: [...u.overrides, { key, type: inBase ? "revoke" : "grant" }] };
    }));
  }

  function resetOverrides() {
    setUsers(prev => prev.map(u => u.id === selected ? { ...u, overrides:[] } : u));
  }

  function handleRevoke(id) {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (selected === id) setSelected(null);
    setRevokeTarget(null);
  }

  function getPermState(key) {
    if (!selectedUser) return "default-off";
    const override = selectedUser.overrides.find(o => o.key === key);
    const inBase   = (ROLE_PERMISSIONS[selectedUser.role] || []).includes(key);
    if (!override) return inBase ? "default-on" : "default-off";
    return override.type === "grant" ? "override-on" : "override-off";
  }

  const effective = selectedUser
    ? getEffectivePermissions(selectedUser.role, selectedUser.overrides)
    : new Set();

  const overrideCount = selectedUser?.overrides?.length || 0;

  return (
    <div>
      <SectionHeader
        title="HRIS Permissions"
        desc="Manage who has access to the HRIS system and what they can do."
      />

      <div className="flex gap-6" style={{ minHeight:520 }}>

        {/* Left — HRIS users list */}
        <div className="flex-shrink-0" style={{ width:280 }}>
          {/* Search */}
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs">🔍</span>
            <input className="w-full pl-8 pr-3 py-2 rounded-lg text-xs text-white placeholder-gray-600 outline-none"
              style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", border:"1px solid #2a2a2a" }}
              placeholder="Search HRIS users…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>

          {/* User list */}
          <div className="rounded-xl overflow-hidden" style={{ border:"1px solid #1e1e1e" }}>
            {filtered.map((user, i) => {
              const urm      = FIXED_ROLES[user.role];
              const isActive = selected === user.id;
              const oc       = user.overrides?.length || 0;
              return (
                <button key={user.id}
                  onClick={() => setSelected(isActive ? null : user.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all"
                  style={{ borderBottom:i<filtered.length-1?"1px solid #111":"none",
                           backgroundColor: isActive ? "#111" : "#0d0d0d",
                           borderLeft: isActive ? `2px solid ${urm.color}` : "2px solid transparent",
                           outline:"none" }}
                  onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.backgroundColor="#0f0f0f"; }}
                  onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.backgroundColor="#0d0d0d"; }}>
                  <Avatar name={user.name} id={user.id} size={30}/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs text-white truncate" style={{ fontFamily:"system-ui,sans-serif" }}>
                        {user.name}
                      </p>
                      {oc > 0 && (
                        <span className="text-xs flex-shrink-0"
                          style={{ fontFamily:"monospace", color:"#f0c85a", fontSize:9 }}>
                          +{oc}
                        </span>
                      )}
                    </div>
                    <span className="text-xs px-1.5 py-px rounded"
                      style={{ fontFamily:"system-ui,sans-serif", backgroundColor:urm.bg, color:urm.color, fontSize:9 }}>
                      {urm.label}
                    </span>
                  </div>
                  {isActive && <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor:urm.color }}/>}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-gray-700 mt-3 px-1" style={{ fontFamily:"system-ui,sans-serif" }}>
            {users.length} HRIS user{users.length !== 1 ? "s" : ""}. To grant access to an employee, go to their profile in the People page.
          </p>
        </div>

        {/* Right — permissions panel */}
        <div className="flex-1 min-w-0">
          {!selectedUser ? (
            // Empty state
            <div className="h-full flex flex-col items-center justify-center text-center py-16 rounded-xl"
              style={{ border:"1px solid #1e1e1e", backgroundColor:"#0d0d0d" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor:"#111", border:"1px solid #2a2a2a" }}>
                <span className="text-xl">🔐</span>
              </div>
              <p className="text-sm text-gray-500 mb-1" style={{ fontFamily:"system-ui,sans-serif" }}>
                Select an HRIS user
              </p>
              <p className="text-xs text-gray-700" style={{ fontFamily:"system-ui,sans-serif" }}>
                Choose someone from the list to view and edit their permissions
              </p>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ border:`1px solid ${rm.color}22` }}>

              {/* Panel header */}
              <div className="px-5 py-4 flex items-center gap-4"
                style={{ backgroundColor:rm.bg, borderBottom:`1px solid ${rm.color}22` }}>
                <Avatar name={selectedUser.name} id={selectedUser.id} size={38}/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm text-white" style={{ fontFamily:"system-ui,sans-serif" }}>
                      {selectedUser.name}
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ fontFamily:"system-ui,sans-serif", backgroundColor:rm.bg, color:rm.color, border:`1px solid ${rm.color}44` }}>
                      {rm.label}
                    </span>
                    {overrideCount > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded"
                        style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#1f1a0a", color:"#f0c85a", fontSize:10 }}>
                        {overrideCount} override{overrideCount > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>
                    {selectedUser.email}
                    {selectedUser.grantedBy && ` · Granted by ${selectedUser.grantedBy} on ${selectedUser.grantedAt}`}
                    {!selectedUser.grantedBy && ` · Created via setup wizard on ${selectedUser.grantedAt}`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {overrideCount > 0 && (
                    <button onClick={resetOverrides}
                      className="text-xs px-3 py-1.5 rounded-lg hover:opacity-80 transition-all"
                      style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", color:"#666", border:"1px solid #2a2a2a" }}>
                      Reset
                    </button>
                  )}
                  {selectedUser.role !== "super_admin" && (
                    <button onClick={() => setRevokeTarget(selectedUser)}
                      className="text-xs px-3 py-1.5 rounded-lg hover:opacity-80 transition-all"
                      style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#1f0a0a", color:"#f05a5a", border:"1px solid #3a1010" }}>
                      Revoke HRIS Access
                    </button>
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="px-5 py-3 flex items-center gap-5"
                style={{ backgroundColor:"#080808", borderBottom:"1px solid #111" }}>
                <p className="text-xs text-gray-700 mr-2" style={{ fontFamily:"system-ui,sans-serif" }}>Legend:</p>
                {[
                  { color:"#5af07a", bg:"#0a1a0a", label:"Role default" },
                  { color:"#f0c85a", bg:"#1f1a0a", label:"Override on"  },
                  { color:"#f05a5a", bg:"#1f0a0a", label:"Override off" },
                  { color:"#333",    bg:"#111",    label:"No access"    },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor:l.bg, border:`1px solid ${l.color}55` }}/>
                    <span className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>{l.label}</span>
                  </div>
                ))}
                <p className="ml-auto text-xs text-gray-700" style={{ fontFamily:"system-ui,sans-serif" }}>
                  Click any permission to toggle
                </p>
              </div>

              {/* Permissions grid */}
              <div className="p-5 space-y-4" style={{ backgroundColor:"#0b0b0b" }}>
                {Object.entries(ALL_PERMISSIONS).map(([module, perms]) => {
                  const mc = MODULE_COLORS[module];
                  const grantedCount = perms.filter(p => effective.has(p.key)).length;
                  const isSuperAdmin = selectedUser.role === "super_admin";

                  return (
                    <div key={module} className="rounded-xl overflow-hidden"
                      style={{ border:`1px solid ${mc.color}22` }}>
                      {/* Module header */}
                      <div className="px-4 py-2.5 flex items-center gap-2"
                        style={{ backgroundColor:mc.bg, borderBottom:`1px solid ${mc.color}22` }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor:mc.color }}/>
                        <p className="text-xs font-medium uppercase tracking-wider"
                          style={{ fontFamily:"system-ui,sans-serif", color:mc.color }}>{module}</p>
                        <span className="ml-auto text-xs" style={{ fontFamily:"monospace", color:mc.color+"66" }}>
                          {grantedCount}/{perms.length}
                        </span>
                      </div>

                      {/* Permission rows */}
                      <div style={{ backgroundColor:"#0d0d0d" }}>
                        {perms.map((perm, idx) => {
                          const state     = getPermState(perm.key);
                          const isOn      = state === "default-on" || state === "override-on";
                          const isOverride= state === "override-on" || state === "override-off";
                          const isLast    = idx === perms.length - 1;

                          let trackBg    = "#111";
                          let thumbColor = "#333";
                          if (state === "default-on")   { trackBg = "#0a1a0a"; thumbColor = "#5af07a"; }
                          if (state === "override-on")  { trackBg = "#1f1a0a"; thumbColor = "#f0c85a"; }
                          if (state === "override-off") { trackBg = "#1f0a0a"; thumbColor = "#f05a5a"; }

                          return (
                            <button key={perm.key}
                              onClick={() => !isSuperAdmin && togglePermission(perm.key)}
                              className="w-full flex items-center gap-4 px-4 py-3 text-left transition-all"
                              style={{ borderBottom:isLast?"none":"1px solid #111",
                                       cursor: isSuperAdmin ? "not-allowed" : "pointer",
                                       outline:"none", opacity: isSuperAdmin ? 0.5 : 1 }}
                              onMouseEnter={e=>{ if(!isSuperAdmin) e.currentTarget.style.backgroundColor="#111"; }}
                              onMouseLeave={e=>{ if(!isSuperAdmin) e.currentTarget.style.backgroundColor="transparent"; }}>

                              {/* Toggle */}
                              <div className="w-9 rounded-full flex items-center px-0.5 flex-shrink-0 transition-all"
                                style={{ height:20, backgroundColor:trackBg, border:`1px solid ${thumbColor}44` }}>
                                <div className="rounded-full transition-all flex-shrink-0"
                                  style={{ width:16, height:16, backgroundColor:thumbColor,
                                           marginLeft: isOn ? "auto" : 0 }}/>
                              </div>

                              {/* Text */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-gray-300" style={{ fontFamily:"system-ui,sans-serif" }}>
                                    {perm.label}
                                  </p>
                                  {isOverride && !isSuperAdmin && (
                                    <span className="text-xs px-1.5 py-px rounded flex-shrink-0"
                                      style={{ fontFamily:"system-ui,sans-serif", fontSize:9,
                                        backgroundColor: state==="override-on" ? "#1f1a0a" : "#1f0a0a",
                                        color:           state==="override-on" ? "#f0c85a" : "#f05a5a" }}>
                                      {state==="override-on" ? "GRANTED" : "REVOKED"}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-700 mt-px" style={{ fontFamily:"system-ui,sans-serif" }}>
                                  {perm.desc}
                                </p>
                              </div>

                              <span className="text-xs flex-shrink-0"
                                style={{ fontFamily:"monospace", color:"#2a2a2a", fontSize:10 }}>
                                {perm.key}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Revoke confirm */}
      {revokeTarget && (
        <>
          <div className="fixed inset-0 z-20" style={{ backgroundColor:"rgba(0,0,0,0.8)" }}
            onClick={()=>setRevokeTarget(null)}/>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 rounded-2xl p-6 w-80"
            style={{ backgroundColor:"#0d0d0d", border:"1px solid #2a1010", boxShadow:"0 24px 80px rgba(0,0,0,0.9)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor:"#1f0a0a", border:"1px solid #3a1010" }}>
              <span className="text-lg">⚠</span>
            </div>
            <h3 className="text-white text-center text-base mb-2" style={{ fontFamily:"system-ui,sans-serif" }}>
              Revoke HRIS Access?
            </h3>
            <p className="text-xs text-gray-500 text-center leading-relaxed mb-5"
              style={{ fontFamily:"system-ui,sans-serif" }}>
              <strong className="text-white">{revokeTarget.name}</strong> will immediately lose all HRIS access.
              Their Task Management access is completely unaffected.
            </p>
            <div className="flex gap-2">
              <button onClick={()=>setRevokeTarget(null)}
                className="flex-1 py-2.5 rounded-lg text-sm hover:opacity-80"
                style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", color:"#666", border:"1px solid #2a2a2a" }}>
                Cancel
              </button>
              <button onClick={()=>handleRevoke(revokeTarget.id)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium hover:opacity-80"
                style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#1f0a0a", color:"#f05a5a", border:"1px solid #3a1010" }}>
                Revoke
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── SETTINGS PAGE ROOT ────────────────────────────────────────────────────────
const TABS = [
  { key:"company",     label:"Company",     icon:"🏢", desc:"Organisation details"   },
  { key:"leave",       label:"Leave Types", icon:"📋", desc:"Allocations and rules"  },
  { key:"payroll",     label:"Payroll",     icon:"💰", desc:"Cutoff and pay schedule" },
  { key:"permissions", label:"Permissions", icon:"🔐", desc:"HRIS access and roles"  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("permissions");

  return (
    <div className="flex-1 overflow-hidden flex flex-col" style={{ backgroundColor:"#000", minHeight:"100vh" }}>
      {/* Page header */}
      <div className="px-8 pt-8 pb-0 flex-shrink-0">
        <p className="text-xs uppercase tracking-widest text-gray-600 mb-1"
          style={{ fontFamily:"system-ui,sans-serif" }}>System</p>
        <h1 className="text-3xl font-normal text-white mb-6" style={{ letterSpacing:"-0.02em" }}>
          Settings
        </h1>

        {/* Tabs */}
        <div className="flex gap-1" style={{ borderBottom:"1px solid #1e1e1e" }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={()=>setActiveTab(tab.key)}
              className="flex items-center gap-2 px-4 py-3 text-sm transition-all relative"
              style={{ fontFamily:"system-ui,sans-serif",
                color: activeTab===tab.key ? "#fff" : "#555",
                outline:"none" }}>
              <span className="text-sm">{tab.icon}</span>
              {tab.label}
              {activeTab===tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-px bg-white"/>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {activeTab === "company"     && <CompanyTab/>}
        {activeTab === "leave"       && <LeaveTypesTab/>}
        {activeTab === "payroll"     && <PayrollTab/>}
        {activeTab === "permissions" && <PermissionsTab/>}
      </div>
    </div>
  );
}
