import { useState, useMemo } from "react";

const CURRENT_USER_ROLE = "super_admin";

const ROLES = ["super_admin","hr_admin","manager","employee"];
const ROLE_LABELS = {
  super_admin: "Super Admin",
  hr_admin:    "HR Admin",
  manager:     "Manager",
  employee:    "Employee",
};
const ROLE_COLORS = {
  super_admin: { bg:"#1f0a0a", color:"#f05a5a" },
  hr_admin:    { bg:"#0a1f0a", color:"#5af07a" },
  manager:     { bg:"#0a1020", color:"#5a9af0" },
  employee:    { bg:"#1f1a0a", color:"#f0c85a" },
};
const DEPTS = ["Engineering","Sales","Product","Design","Operations","Marketing","HR & Admin"];

const AV = ["#5a9af0","#5af07a","#f0c85a","#c07af0","#f05a5a","#f0905a","#50c8c8","#d090f0"];
function avatarColor(id) { return AV[id % AV.length]; }
function initials(name) { return name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(); }

function Avatar({ user, size=32 }) {
  const bg = avatarColor(user.id);
  return (
    <div className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
      style={{ width:size, height:size, backgroundColor:bg+"33", color:bg, fontFamily:"system-ui,sans-serif", fontSize:size<30?10:12, border:`1.5px solid ${bg}44` }}>
      {initials(user.name)}
    </div>
  );
}

const USERS_SEED = [
  { id:1,  name:"System Admin",       email:"admin@company.com",   role:"super_admin", dept:"HR & Admin",  status:"active",   lastLogin:"Mar 2, 2026 · 8:45 AM",  mustChangePassword:false, createdOn:"Jan 1, 2026"  },
  { id:2,  name:"Chris Mendez",       email:"hr@company.com",      role:"hr_admin",    dept:"HR & Admin",  status:"active",   lastLogin:"Mar 2, 2026 · 9:01 AM",  mustChangePassword:false, createdOn:"Jan 1, 2026"  },
  { id:3,  name:"Devon Park",         email:"manager@company.com", role:"manager",     dept:"Engineering", status:"active",   lastLogin:"Mar 1, 2026 · 5:30 PM",  mustChangePassword:false, createdOn:"Jan 5, 2026"  },
  { id:4,  name:"Sara Okafor",        email:"sara@company.com",    role:"employee",    dept:"Engineering", status:"active",   lastLogin:"Mar 2, 2026 · 8:52 AM",  mustChangePassword:false, createdOn:"Jan 5, 2026"  },
  { id:5,  name:"Marcus Chen",        email:"marcus@company.com",  role:"employee",    dept:"Sales",       status:"active",   lastLogin:"Mar 1, 2026 · 2:10 PM",  mustChangePassword:false, createdOn:"Jan 5, 2026"  },
  { id:6,  name:"Priya Nair",         email:"priya@company.com",   role:"manager",     dept:"Product",     status:"active",   lastLogin:"Feb 28, 2026 · 4:00 PM", mustChangePassword:false, createdOn:"Jan 5, 2026"  },
  { id:7,  name:"Rita Vance",         email:"rita@company.com",    role:"manager",     dept:"Sales",       status:"active",   lastLogin:"Mar 2, 2026 · 10:15 AM", mustChangePassword:false, createdOn:"Jan 5, 2026"  },
  { id:8,  name:"Leila Farouk",       email:"leila@company.com",   role:"employee",    dept:"Product",     status:"active",   lastLogin:"Mar 1, 2026 · 11:00 AM", mustChangePassword:false, createdOn:"Jan 10, 2026" },
  { id:9,  name:"Tomás Rivera",       email:"tomas@company.com",   role:"employee",    dept:"Design",      status:"active",   lastLogin:"Mar 2, 2026 · 9:30 AM",  mustChangePassword:false, createdOn:"Jan 10, 2026" },
  { id:10, name:"Ananya Bose",        email:"ananya@company.com",  role:"employee",    dept:"Operations",  status:"inactive", lastLogin:"Feb 10, 2026 · 8:00 AM", mustChangePassword:false, createdOn:"Jan 10, 2026" },
  { id:11, name:"Noah Kim",           email:"noah@company.com",    role:"employee",    dept:"Marketing",   status:"active",   lastLogin:"Never",                  mustChangePassword:true,  createdOn:"Mar 1, 2026"  },
  { id:12, name:"Fatima Al-Hassan",   email:"fatima@company.com",  role:"employee",    dept:"Engineering", status:"active",   lastLogin:"Mar 2, 2026 · 9:15 AM",  mustChangePassword:false, createdOn:"Jan 5, 2026"  },
];

const ALL_PERMISSIONS = {
  Employees:   ["employees.view_all","employees.view_dept","employees.view_own","employees.create","employees.edit_all","employees.edit_own","employees.deactivate"],
  Payroll:     ["payroll.view_all","payroll.view_own","payroll.run","payroll.adjust","payroll.configure"],
  Attendance:  ["attendance.view_all","attendance.view_dept","attendance.view_own","attendance.correct","attendance.correct_dept"],
  Leave:       ["leave.view_all","leave.view_dept","leave.view_own","leave.file","leave.approve_all","leave.approve_dept","leave.configure"],
  Offset:      ["offset.view_all","offset.view_own","offset.create","offset.approve","offset.void"],
  Recruitment: ["recruitment.view","recruitment.manage_jobs","recruitment.manage_applicants","recruitment.schedule_interviews","recruitment.manage_offers","recruitment.manage_onboarding"],
  Tasks:       ["tasks.view_all","tasks.view_dept","tasks.view_own","tasks.create","tasks.assign_any","tasks.assign_dept","tasks.manage_projects"],
  System:      ["users.manage","roles.assign","permissions.override","system.audit_logs"],
};

const ROLE_PERMISSIONS = {
  super_admin: Object.values(ALL_PERMISSIONS).flat(),
  hr_admin:    ["employees.view_all","employees.view_dept","employees.view_own","employees.create","employees.edit_all","employees.edit_own","employees.deactivate","payroll.view_all","payroll.view_own","payroll.run","payroll.adjust","payroll.configure","attendance.view_all","attendance.view_dept","attendance.view_own","attendance.correct","attendance.correct_dept","leave.view_all","leave.view_dept","leave.view_own","leave.file","leave.approve_all","leave.approve_dept","leave.configure","offset.view_all","offset.view_own","offset.create","offset.approve","offset.void","recruitment.view","recruitment.manage_jobs","recruitment.manage_applicants","recruitment.schedule_interviews","recruitment.manage_offers","recruitment.manage_onboarding","tasks.view_all","tasks.view_dept","tasks.view_own","tasks.create","tasks.assign_any","tasks.assign_dept","tasks.manage_projects","users.manage"],
  manager:     ["employees.view_dept","employees.view_own","employees.edit_own","payroll.view_own","attendance.view_dept","attendance.view_own","attendance.correct_dept","leave.view_dept","leave.view_own","leave.file","leave.approve_dept","offset.view_own","tasks.view_dept","tasks.view_own","tasks.create","tasks.assign_dept","tasks.manage_projects"],
  employee:    ["employees.view_own","employees.edit_own","payroll.view_own","attendance.view_own","leave.view_own","leave.file","offset.view_own","tasks.view_own","tasks.create"],
};

const IC = "w-full px-3 py-2.5 rounded text-sm text-white placeholder-gray-600 outline-none";
const IS = { backgroundColor:"#111", border:"1px solid #2a2a2a", fontFamily:"system-ui,sans-serif" };

// Custom role color palette options
const CUSTOM_ROLE_COLORS = [
  { bg:"#1a0a2a", color:"#c07af0", label:"Purple" },
  { bg:"#0a1a2a", color:"#5a9af0", label:"Blue" },
  { bg:"#0a1f0a", color:"#5af07a", label:"Green" },
  { bg:"#1f1a0a", color:"#f0c85a", label:"Amber" },
  { bg:"#1f0a0a", color:"#f05a5a", label:"Red" },
  { bg:"#0a1a1a", color:"#50c8c8", label:"Teal" },
  { bg:"#1a100a", color:"#f0905a", label:"Orange" },
  { bg:"#151515", color:"#aaaaaa", label:"Gray" },
];

// ── CREATE ROLE DRAWER ────────────────────────────────────────────────────────
function CreateRoleDrawer({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: CUSTOM_ROLE_COLORS[0],
  });
  const [selectedPerms, setSelectedPerms] = useState(new Set());
  const [section, setSection] = useState("details"); // "details" | "permissions"
  const [saved, setSaved] = useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function togglePerm(perm) {
    setSelectedPerms(prev => {
      const next = new Set(prev);
      next.has(perm) ? next.delete(perm) : next.add(perm);
      return next;
    });
  }

  function toggleModule(perms) {
    const allSelected = perms.every(p => selectedPerms.has(p));
    setSelectedPerms(prev => {
      const next = new Set(prev);
      if (allSelected) { perms.forEach(p => next.delete(p)); }
      else { perms.forEach(p => next.add(p)); }
      return next;
    });
  }

  const canSave = form.name.trim().length >= 2;

  function handleSave() {
    if (!canSave) return;
    onSave({ ...form, permissions: [...selectedPerms], id: Date.now() });
    setSaved(true);
  }

  if (saved) return (
    <>
      <div className="fixed inset-0 z-20" style={{ backgroundColor:"rgba(0,0,0,0.6)" }} onClick={onClose}/>
      <div className="fixed top-0 right-0 h-full z-30 flex flex-col items-center justify-center px-10"
        style={{ width:500, backgroundColor:"#080808", borderLeft:"1px solid #222" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
          style={{ backgroundColor:form.color.bg, border:`1px solid ${form.color.color}44` }}>
          <span className="text-2xl">🛡</span>
        </div>
        <h3 className="text-lg font-normal text-white mb-2 text-center">Role created</h3>
        <p className="text-sm text-gray-500 text-center leading-relaxed mb-1" style={{ fontFamily:"system-ui,sans-serif" }}>
          <strong style={{ color: form.color.color }}>{form.name}</strong> has been added with{" "}
          <strong className="text-white">{selectedPerms.size} permissions</strong>.
        </p>
        <p className="text-xs text-gray-600 text-center mb-6" style={{ fontFamily:"system-ui,sans-serif" }}>
          You can assign this role to users from the User Management page.
        </p>
        <button onClick={onClose} className="px-5 py-2 rounded text-sm bg-white text-black hover:opacity-80"
          style={{ fontFamily:"system-ui,sans-serif" }}>Done</button>
      </div>
    </>
  );

  return (
    <>
      <div className="fixed inset-0 z-20" style={{ backgroundColor:"rgba(0,0,0,0.6)" }} onClick={onClose}/>
      <div className="fixed top-0 right-0 h-full z-30 flex flex-col"
        style={{ width:500, backgroundColor:"#080808", borderLeft:"1px solid #222", boxShadow:"-8px 0 40px rgba(0,0,0,0.8)" }}>

        {/* Header */}
        <div className="px-7 py-5 flex-shrink-0" style={{ borderBottom:"1px solid #1a1a1a" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-0.5" style={{ fontFamily:"system-ui,sans-serif" }}>User Management</p>
              <h2 className="text-lg font-normal text-white">Create New Role</h2>
            </div>
            <button onClick={onClose} className="text-gray-600 hover:text-white text-xl">✕</button>
          </div>
          <div className="flex gap-1">
            {["details","permissions"].map(s => (
              <button key={s} onClick={() => setSection(s)}
                className="px-4 py-1.5 rounded text-xs capitalize"
                style={{ fontFamily:"system-ui,sans-serif", backgroundColor:section===s?"#fff":"#111", color:section===s?"#000":"#555", border:"1px solid #2a2a2a" }}>
                {s}
                {s === "permissions" && selectedPerms.size > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs"
                    style={{ fontFamily:"monospace", backgroundColor:form.color.bg, color:form.color.color }}>
                    {selectedPerms.size}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6">

          {/* DETAILS */}
          {section === "details" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{ fontFamily:"system-ui,sans-serif" }}>Role Name</label>
                <input className={IC} style={IS} placeholder="e.g. Finance Manager" value={form.name} onChange={e => set("name", e.target.value)}/>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{ fontFamily:"system-ui,sans-serif" }}>Description <span className="text-gray-700 normal-case">(optional)</span></label>
                <textarea className={IC} style={{ ...IS, resize:"none", height:80 }}
                  placeholder="Brief description of this role's responsibilities…"
                  value={form.description} onChange={e => set("description", e.target.value)}/>
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2" style={{ fontFamily:"system-ui,sans-serif" }}>Badge Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {CUSTOM_ROLE_COLORS.map(c => (
                    <button key={c.label} onClick={() => set("color", c)}
                      className="py-2 rounded text-xs transition-all"
                      style={{ fontFamily:"system-ui,sans-serif", backgroundColor:c.bg, color:c.color,
                        border:`1px solid ${form.color.label===c.label ? c.color+"88" : c.color+"22"}`,
                        outline: form.color.label===c.label ? `2px solid ${c.color}55` : "none",
                        outlineOffset: 2 }}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview badge */}
              {form.name.trim() && (
                <div className="rounded-lg p-4" style={{ backgroundColor:"#0d0d0d", border:"1px solid #1e1e1e" }}>
                  <p className="text-xs uppercase tracking-widest text-gray-600 mb-3" style={{ fontFamily:"system-ui,sans-serif" }}>Preview</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2.5 py-1 rounded-full"
                      style={{ fontFamily:"system-ui,sans-serif", backgroundColor:form.color.bg, color:form.color.color, border:`1px solid ${form.color.color}33` }}>
                      {form.name}
                    </span>
                    <span className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>
                      {selectedPerms.size} permission{selectedPerms.size !== 1 ? "s" : ""} assigned
                    </span>
                  </div>
                  {form.description && (
                    <p className="text-xs text-gray-500 mt-2" style={{ fontFamily:"system-ui,sans-serif" }}>{form.description}</p>
                  )}
                </div>
              )}

              <div className="rounded-lg px-4 py-3 flex items-start gap-2" style={{ backgroundColor:"#0a1a2a", border:"1px solid #1e3a5a" }}>
                <span className="text-blue-400 text-xs flex-shrink-0 mt-0.5">ℹ</span>
                <p className="text-xs text-gray-400" style={{ fontFamily:"system-ui,sans-serif" }}>
                  Custom roles are additive. Switch to the <strong className="text-white">Permissions</strong> tab to select what this role can access. Permissions can be further overridden per user by a Super Admin.
                </p>
              </div>
            </div>
          )}

          {/* PERMISSIONS */}
          {section === "permissions" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500" style={{ fontFamily:"system-ui,sans-serif" }}>
                  {selectedPerms.size} of {Object.values(ALL_PERMISSIONS).flat().length} selected
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedPerms(new Set(Object.values(ALL_PERMISSIONS).flat()))}
                    className="text-xs px-3 py-1 rounded hover:opacity-80"
                    style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#1a1a1a", color:"#aaa", border:"1px solid #2a2a2a" }}>
                    Select all
                  </button>
                  <button onClick={() => setSelectedPerms(new Set())}
                    className="text-xs px-3 py-1 rounded hover:opacity-80"
                    style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#1a1a1a", color:"#aaa", border:"1px solid #2a2a2a" }}>
                    Clear
                  </button>
                </div>
              </div>

              {Object.entries(ALL_PERMISSIONS).map(([module, perms]) => {
                const allSelected = perms.every(p => selectedPerms.has(p));
                const someSelected = perms.some(p => selectedPerms.has(p)) && !allSelected;
                return (
                  <div key={module} className="rounded-lg overflow-hidden" style={{ border:"1px solid #1e1e1e" }}>
                    <button onClick={() => toggleModule(perms)}
                      className="w-full flex items-center justify-between px-4 py-2.5 transition-colors hover:opacity-80"
                      style={{ backgroundColor:"#111", fontFamily:"system-ui,sans-serif" }}>
                      <p className="text-xs uppercase tracking-widest text-gray-400">{module}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600" style={{ fontFamily:"monospace" }}>
                          {perms.filter(p => selectedPerms.has(p)).length}/{perms.length}
                        </span>
                        <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: allSelected ? form.color.bg : someSelected ? "#1a1a0a" : "transparent",
                            border:`1.5px solid ${allSelected ? form.color.color : someSelected ? "#f0c85a" : "#2a2a2a"}` }}>
                          {allSelected && <span style={{ fontSize:8, color:form.color.color, lineHeight:1 }}>✓</span>}
                          {someSelected && <span style={{ fontSize:8, color:"#f0c85a", lineHeight:1 }}>−</span>}
                        </div>
                      </div>
                    </button>
                    <div className="px-4 pb-3 pt-1 space-y-1" style={{ backgroundColor:"#0d0d0d" }}>
                      {perms.map(perm => {
                        const has = selectedPerms.has(perm);
                        return (
                          <div key={perm} onClick={() => togglePerm(perm)}
                            className="flex items-center gap-3 px-3 py-1.5 rounded cursor-pointer transition-all"
                            style={{ backgroundColor: has ? form.color.bg : "transparent",
                              border:`1px solid ${has ? form.color.color+"33" : "transparent"}` }}>
                            <div className="w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: has ? form.color.bg : "transparent",
                                border:`1.5px solid ${has ? form.color.color : "#2a2a2a"}` }}>
                              {has && <span style={{ fontSize:7, color:form.color.color, lineHeight:1 }}>✓</span>}
                            </div>
                            <span className="text-xs" style={{ fontFamily:"monospace", color: has ? "#ccc" : "#3a3a3a" }}>{perm}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
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
            Create Role 🛡
          </button>
        </div>
      </div>
    </>
  );
}

// ── INVITE / CREATE USER DRAWER ───────────────────────────────────────────────
function CreateUserDrawer({ onClose, onSave, customRoles }) {
  const allRoles = [...ROLES, ...customRoles.map(r => r.id)];
  const allRoleLabels = { ...ROLE_LABELS, ...Object.fromEntries(customRoles.map(r => [r.id, r.name])) };
  const allRoleColors = { ...ROLE_COLORS, ...Object.fromEntries(customRoles.map(r => [r.id, r.color])) };
  const allRolePerms  = { ...ROLE_PERMISSIONS, ...Object.fromEntries(customRoles.map(r => [r.id, r.permissions])) };

  const [form, setForm] = useState({ name:"", email:"", role:"employee", dept:DEPTS[0] });
  const [sent, setSent] = useState(false);
  function set(k,v){ setForm(f=>({...f,[k]:v})); }
  const canSave = form.name.trim() && form.email.includes("@");

  function handleSave() {
    if (!canSave) return;
    onSave(form);
    setSent(true);
  }

  if (sent) return (
    <>
      <div className="fixed inset-0 z-20" style={{backgroundColor:"rgba(0,0,0,0.6)"}} onClick={onClose}/>
      <div className="fixed top-0 right-0 h-full z-30 flex flex-col items-center justify-center px-10"
        style={{width:460,backgroundColor:"#080808",borderLeft:"1px solid #222"}}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
          style={{backgroundColor:"#0a1a0a",border:"1px solid #1e3a1e"}}>
          <span className="text-2xl">✉️</span>
        </div>
        <h3 className="text-lg font-normal text-white mb-2 text-center">Invite sent</h3>
        <p className="text-sm text-gray-500 text-center leading-relaxed mb-6" style={{fontFamily:"system-ui,sans-serif"}}>
          An invite email was sent to <strong className="text-white">{form.email}</strong>. The link expires in <strong className="text-white">72 hours</strong>.
        </p>
        <button onClick={onClose} className="px-5 py-2 rounded text-sm bg-white text-black hover:opacity-80"
          style={{fontFamily:"system-ui,sans-serif"}}>Done</button>
      </div>
    </>
  );

  return (
    <>
      <div className="fixed inset-0 z-20" style={{backgroundColor:"rgba(0,0,0,0.6)"}} onClick={onClose}/>
      <div className="fixed top-0 right-0 h-full z-30 flex flex-col"
        style={{width:460,backgroundColor:"#080808",borderLeft:"1px solid #222",boxShadow:"-8px 0 40px rgba(0,0,0,0.8)"}}>
        <div className="flex items-center justify-between px-7 py-5 flex-shrink-0" style={{borderBottom:"1px solid #1a1a1a"}}>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-0.5" style={{fontFamily:"system-ui,sans-serif"}}>User Management</p>
            <h2 className="text-lg font-normal text-white">Invite New User</h2>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          <div className="rounded-lg px-4 py-3 flex items-start gap-2" style={{backgroundColor:"#0a1a2a",border:"1px solid #1e3a5a"}}>
            <span className="text-blue-400 text-xs flex-shrink-0 mt-0.5">ℹ</span>
            <p className="text-xs text-gray-400" style={{fontFamily:"system-ui,sans-serif"}}>
              An invite email will be sent. The employee sets their own password via a secure link valid for <strong className="text-white">72 hours</strong>.
            </p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Full Name</label>
            <input className={IC} style={IS} placeholder="e.g. Sara Okafor" value={form.name} onChange={e=>set("name",e.target.value)}/>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Work Email</label>
            <input className={IC} style={IS} type="email" placeholder="sara@company.com" value={form.email} onChange={e=>set("email",e.target.value)}/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Department</label>
              <select className={IC} style={IS} value={form.dept} onChange={e=>set("dept",e.target.value)}>
                {DEPTS.map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={{fontFamily:"system-ui,sans-serif"}}>Role</label>
              <select className={IC} style={IS} value={form.role} onChange={e=>set("role",e.target.value)}
                disabled={CURRENT_USER_ROLE !== "super_admin"}>
                {allRoles.filter(r => CURRENT_USER_ROLE==="super_admin" || r !== "super_admin").map(r=>(
                  <option key={r} value={r}>{allRoleLabels[r]}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="rounded-lg p-4" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-3" style={{fontFamily:"system-ui,sans-serif"}}>
              Permissions for <span style={{color:allRoleColors[form.role]?.color}}>{allRoleLabels[form.role]}</span>
            </p>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {(allRolePerms[form.role]||[]).slice(0,12).map(p=>(
                <div key={p} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{backgroundColor:allRoleColors[form.role]?.color}}/>
                  <span className="text-xs text-gray-500" style={{fontFamily:"monospace"}}>{p}</span>
                </div>
              ))}
              {(allRolePerms[form.role]||[]).length > 12 && (
                <p className="text-xs text-gray-700" style={{fontFamily:"system-ui,sans-serif"}}>
                  +{(allRolePerms[form.role]||[]).length - 12} more permissions
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="px-7 py-5 flex items-center justify-between flex-shrink-0" style={{borderTop:"1px solid #1a1a1a"}}>
          <button onClick={onClose} className="px-4 py-2 rounded text-sm"
            style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a"}}>Cancel</button>
          <button onClick={handleSave} disabled={!canSave}
            className="px-5 py-2 rounded text-sm font-medium hover:opacity-80"
            style={{fontFamily:"system-ui,sans-serif",backgroundColor:canSave?"#fff":"#1a1a1a",color:canSave?"#000":"#444",cursor:canSave?"pointer":"not-allowed"}}>
            Send Invite ✉
          </button>
        </div>
      </div>
    </>
  );
}

// ── EDIT USER DRAWER ──────────────────────────────────────────────────────────
function EditUserDrawer({ user, onClose, onSave }) {
  const [role,     setRole]    = useState(user.role);
  const [status,   setStatus]  = useState(user.status);
  const [overrides,setOverrides] = useState({});
  const [section,  setSection] = useState("details");

  const basePerms = ROLE_PERMISSIONS[role] || [];
  const rc = ROLE_COLORS[role] || { bg:"#1a1a1a", color:"#aaa" };
  const canEditRole = CURRENT_USER_ROLE === "super_admin";
  const canOverride = CURRENT_USER_ROLE === "super_admin";

  function toggleOverride(perm, baseHas) {
    if (!canOverride) return;
    setOverrides(prev => {
      const current = prev[perm];
      if (!current) return { ...prev, [perm]: baseHas ? "revoke" : "grant" };
      return { ...prev, [perm]: undefined };
    });
  }

  function effectivePerm(perm) {
    const over = overrides[perm];
    if (over === "grant")  return true;
    if (over === "revoke") return false;
    return basePerms.includes(perm);
  }

  const overrideCount = Object.values(overrides).filter(Boolean).length;

  return (
    <>
      <div className="fixed inset-0 z-20" style={{backgroundColor:"rgba(0,0,0,0.6)"}} onClick={onClose}/>
      <div className="fixed top-0 right-0 h-full z-30 flex flex-col"
        style={{width:500,backgroundColor:"#080808",borderLeft:"1px solid #222",boxShadow:"-8px 0 40px rgba(0,0,0,0.8)"}}>
        <div className="px-7 py-5 flex-shrink-0" style={{borderBottom:"1px solid #1a1a1a"}}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar user={user} size={40}/>
              <div>
                <h2 className="text-base font-normal text-white">{user.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5" style={{fontFamily:"system-ui,sans-serif"}}>{user.email}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-600 hover:text-white text-xl">✕</button>
          </div>
          <div className="flex gap-1">
            {["details","permissions"].map(s=>(
              <button key={s} onClick={()=>setSection(s)}
                className="px-4 py-1.5 rounded text-xs capitalize"
                style={{fontFamily:"system-ui,sans-serif",backgroundColor:section===s?"#fff":"#111",color:section===s?"#000":"#555",border:"1px solid #2a2a2a"}}>
                {s}
                {s==="permissions" && overrideCount>0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs"
                    style={{fontFamily:"monospace",backgroundColor:"#f0c85a22",color:"#f0c85a"}}>{overrideCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-5">
          {section==="details" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2" style={{fontFamily:"system-ui,sans-serif"}}>
                  Role {!canEditRole && <span className="text-gray-700 normal-case ml-1">(Super Admin only)</span>}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map(r => {
                    const c = ROLE_COLORS[r];
                    return (
                      <button key={r} onClick={()=>canEditRole&&setRole(r)} disabled={!canEditRole}
                        className="px-3 py-2.5 rounded-lg text-left"
                        style={{fontFamily:"system-ui,sans-serif",
                          backgroundColor: role===r ? c.bg : "#111",
                          border:`1px solid ${role===r ? c.color+"44" : "#2a2a2a"}`,
                          opacity: !canEditRole ? 0.5 : 1,
                          cursor: !canEditRole ? "not-allowed" : "pointer"}}>
                        <p className="text-sm" style={{color: role===r ? c.color : "#555"}}>{ROLE_LABELS[r]}</p>
                        <p className="text-xs text-gray-700 mt-0.5">{ROLE_PERMISSIONS[r].length} permissions</p>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2" style={{fontFamily:"system-ui,sans-serif"}}>Account Status</label>
                <div className="flex gap-2">
                  {[["active","Active","#5af07a"],["inactive","Inactive","#f05a5a"]].map(([v,l,c])=>(
                    <button key={v} onClick={()=>setStatus(v)}
                      className="flex-1 py-2.5 rounded text-sm"
                      style={{fontFamily:"system-ui,sans-serif",
                        backgroundColor: status===v ? c+"18" : "#111",
                        color: status===v ? c : "#555",
                        border:`1px solid ${status===v ? c+"44" : "#2a2a2a"}`}}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2 pt-2" style={{borderTop:"1px solid #1a1a1a"}}>
                <button className="w-full py-2.5 rounded text-sm text-left px-4 hover:opacity-80"
                  style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a"}}>
                  📧 Resend invite / reset email
                </button>
                {CURRENT_USER_ROLE==="super_admin" && (
                  <button className="w-full py-2.5 rounded text-sm text-left px-4 hover:opacity-80"
                    style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#1f0f0f",color:"#f05a5a",border:"1px solid #3a1515"}}>
                    🔒 Force password reset on next login
                  </button>
                )}
              </div>
              <div className="rounded px-4 py-3 flex justify-between" style={{backgroundColor:"#0a0a0a",border:"1px solid #1a1a1a"}}>
                <span className="text-xs text-gray-600" style={{fontFamily:"system-ui,sans-serif"}}>Last login</span>
                <span className="text-xs text-gray-400" style={{fontFamily:"monospace"}}>{user.lastLogin}</span>
              </div>
            </div>
          )}
          {section==="permissions" && (
            <div className="space-y-4">
              {canOverride ? (
                <div className="rounded-lg px-4 py-3 flex items-start gap-2" style={{backgroundColor:"#1a1a0a",border:"1px solid #3a3010"}}>
                  <span className="text-yellow-400 text-xs flex-shrink-0 mt-0.5">⚠</span>
                  <p className="text-xs text-gray-400" style={{fontFamily:"system-ui,sans-serif"}}>
                    Overrides are <strong className="text-white">per-user exceptions</strong>. Click any permission to toggle.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg px-4 py-3 flex items-start gap-2" style={{backgroundColor:"#0a1a2a",border:"1px solid #1e3a5a"}}>
                  <span className="text-blue-400 text-xs flex-shrink-0 mt-0.5">ℹ</span>
                  <p className="text-xs text-gray-400" style={{fontFamily:"system-ui,sans-serif"}}>
                    Only <strong className="text-white">Super Admin</strong> can create per-user overrides.
                  </p>
                </div>
              )}
              {Object.entries(ALL_PERMISSIONS).map(([module, perms]) => (
                <div key={module}>
                  <p className="text-xs uppercase tracking-widest text-gray-600 mb-2" style={{fontFamily:"system-ui,sans-serif"}}>{module}</p>
                  <div className="space-y-1">
                    {perms.map(perm => {
                      const effective = effectivePerm(perm);
                      const override  = overrides[perm];
                      const isGranted  = override === "grant";
                      const isRevoked  = override === "revoke";
                      return (
                        <div key={perm}
                          onClick={() => canOverride && toggleOverride(perm, basePerms.includes(perm))}
                          className="flex items-center gap-3 px-3 py-2 rounded"
                          style={{fontFamily:"system-ui,sans-serif",
                            backgroundColor: effective ? (isGranted?"#0a1a0a":isRevoked?"#1a0a0a":"#0d0d0d") : "#0a0a0a",
                            border:`1px solid ${isGranted?"#1e3a1e":isRevoked?"#3a1515":"#141414"}`,
                            cursor: canOverride ? "pointer" : "default"}}>
                          <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                            style={{backgroundColor: effective?"#5af07a22":"transparent",border:`1.5px solid ${effective?"#5af07a":"#2a2a2a"}`}}>
                            {effective && <span style={{fontSize:8,color:"#5af07a",lineHeight:1}}>✓</span>}
                          </div>
                          <span className="text-xs flex-1" style={{fontFamily:"monospace",color:effective?"#aaa":"#3a3a3a"}}>{perm}</span>
                          {isGranted  && <span className="text-xs px-1.5 py-0.5 rounded" style={{backgroundColor:"#0a1a0a",color:"#5af07a",border:"1px solid #1e3a1e"}}>+granted</span>}
                          {isRevoked  && <span className="text-xs px-1.5 py-0.5 rounded" style={{backgroundColor:"#1a0a0a",color:"#f05a5a",border:"1px solid #3a1515"}}>−revoked</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-7 py-5 flex items-center justify-between flex-shrink-0" style={{borderTop:"1px solid #1a1a1a"}}>
          <button onClick={onClose} className="px-4 py-2 rounded text-sm"
            style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a"}}>Cancel</button>
          <button onClick={()=>onSave({...user,role,status,overrides})}
            className="px-5 py-2 rounded text-sm font-medium bg-white text-black hover:opacity-80"
            style={{fontFamily:"system-ui,sans-serif"}}>
            Save Changes ✓
          </button>
        </div>
      </div>
    </>
  );
}

// ── USER MANAGEMENT PAGE ──────────────────────────────────────────────────────
export default function UserManagementPage() {
  const [users,        setUsers]      = useState(USERS_SEED);
  const [customRoles,  setCustomRoles]= useState([]);
  const [search,       setSearch]     = useState("");
  const [roleFilter,   setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter]=useState("All");
  const [showCreate,   setShowCreate] = useState(false);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [editing,      setEditing]    = useState(null);

  const allRoles = [...ROLES, ...customRoles.map(r => r.id)];
  const allRoleLabels = { ...ROLE_LABELS, ...Object.fromEntries(customRoles.map(r => [r.id, r.name])) };
  const allRoleColors = { ...ROLE_COLORS, ...Object.fromEntries(customRoles.map(r => [r.id, r.color])) };

  const filtered = useMemo(()=>users.filter(u=>{
    const q = search.toLowerCase();
    return (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      && (roleFilter==="All"   || u.role===roleFilter)
      && (statusFilter==="All" || u.status===statusFilter);
  }),[users,search,roleFilter,statusFilter]);

  function handleCreate(form) {
    setUsers(p=>[...p,{
      id: Date.now(), name:form.name, email:form.email,
      role:form.role, dept:form.dept, status:"active",
      lastLogin:"Never", mustChangePassword:true, createdOn:"Mar 18, 2026",
    }]);
    setShowCreate(false);
  }

  function handleSave(updated) {
    setUsers(p=>p.map(u=>u.id===updated.id?{...u,...updated}:u));
    setEditing(null);
  }

  function handleSaveRole(role) {
    setCustomRoles(p => [...p, role]);
    setShowCreateRole(false);
  }

  const stats = allRoles.map(r=>({ role:r, count:users.filter(u=>u.role===r).length }));
  const inactive = users.filter(u=>u.status==="inactive").length;
  const pendingInvite = users.filter(u=>u.mustChangePassword).length;

  return (
    <div className="flex-1 overflow-hidden flex flex-col" style={{backgroundColor:"#000"}}>
      {/* Header */}
      <div className="px-8 pt-8 pb-0 flex-shrink-0">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-1" style={{fontFamily:"system-ui,sans-serif"}}>System</p>
            <h1 className="text-3xl font-normal text-white" style={{letterSpacing:"-0.02em"}}>User Management</h1>
          </div>
          <div className="flex items-center gap-3">
            {pendingInvite>0&&(
              <div className="rounded-lg px-4 py-2 flex items-center gap-2" style={{backgroundColor:"#1f1a0f",border:"1px solid #3a3010"}}>
                <span style={{color:"#f0c85a",fontSize:12}}>⏳</span>
                <span className="text-xs" style={{fontFamily:"system-ui,sans-serif",color:"#f0c85a"}}>{pendingInvite} pending invite{pendingInvite>1?"s":""}</span>
              </div>
            )}
            {/* Create Role button — Super Admin only */}
            {CURRENT_USER_ROLE === "super_admin" && (
              <button onClick={() => setShowCreateRole(true)}
                className="px-4 py-2 rounded text-sm font-medium hover:opacity-80 flex items-center gap-2"
                style={{fontFamily:"system-ui,sans-serif", backgroundColor:"#111", color:"#aaa", border:"1px solid #2a2a2a"}}>
                🛡 Create Role
              </button>
            )}
            <button onClick={()=>setShowCreate(true)}
              className="px-4 py-2 rounded text-sm font-medium bg-white text-black hover:opacity-80"
              style={{fontFamily:"system-ui,sans-serif"}}>
              + Invite User
            </button>
          </div>
        </div>

        {/* Role summary cards — including custom roles */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
          {[...stats.map(s=>({
            label: allRoleLabels[s.role] || s.role,
            value: s.count,
            color: allRoleColors[s.role]?.color || "#aaa",
            isCustom: !ROLES.includes(s.role),
          })),{
            label:"Inactive",
            value:inactive,
            color:"#555",
            isCustom: false,
          }].filter(s => s.value > 0 || !s.isCustom).map(s=>(
            <div key={s.label} className="rounded-lg px-4 py-3 flex-shrink-0 min-w-[100px]" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <p className="text-xs uppercase tracking-widest" style={{fontFamily:"system-ui,sans-serif",color:"#444"}}>{s.label}</p>
                {s.isCustom && <span className="text-xs px-1 rounded" style={{backgroundColor:"#1a1a0a",color:"#f0c85a",fontFamily:"system-ui,sans-serif"}}>custom</span>}
              </div>
              <p className="text-2xl font-light" style={{fontFamily:"monospace",color:s.color}}>{s.value}</p>
            </div>
          ))}
          {/* Custom roles with 0 users */}
          {customRoles.filter(r => !users.some(u => u.role === r.id)).map(r => (
            <div key={r.id} className="rounded-lg px-4 py-3 flex-shrink-0 min-w-[100px]" style={{backgroundColor:"#0d0d0d",border:"1px solid #1e1e1e"}}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <p className="text-xs uppercase tracking-widest" style={{fontFamily:"system-ui,sans-serif",color:"#444"}}>{r.name}</p>
                <span className="text-xs px-1 rounded" style={{backgroundColor:"#1a1a0a",color:"#f0c85a",fontFamily:"system-ui,sans-serif"}}>custom</span>
              </div>
              <p className="text-2xl font-light" style={{fontFamily:"monospace",color:r.color.color}}>0</p>
            </div>
          ))}
        </div>

        {/* Current user role notice */}
        <div className="mb-5 rounded-lg px-4 py-2.5 flex items-center gap-3" style={{backgroundColor:"#0a0a0a",border:"1px solid #1a1a1a"}}>
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:ROLE_COLORS[CURRENT_USER_ROLE]?.color}}/>
          <p className="text-xs text-gray-500" style={{fontFamily:"system-ui,sans-serif"}}>
            Logged in as <strong className="text-white">{ROLE_LABELS[CURRENT_USER_ROLE]}</strong>
            {CURRENT_USER_ROLE==="super_admin" && " — full access including role creation, assignment and permission overrides"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            <input className="w-full pl-9 pr-4 py-2 rounded text-sm text-white placeholder-gray-600 outline-none"
              style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",border:"1px solid #2a2a2a"}}
              placeholder="Search users…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div className="flex gap-1 rounded-lg p-0.5 flex-wrap" style={{backgroundColor:"#111",border:"1px solid #2a2a2a"}}>
            {["All",...allRoles].map(r=>(
              <button key={r} onClick={()=>setRoleFilter(r)}
                className="px-3 py-1.5 rounded text-xs"
                style={{fontFamily:"system-ui,sans-serif",backgroundColor:roleFilter===r?"#fff":"transparent",color:roleFilter===r?"#000":"#555"}}>
                {r==="All"?"All Roles":allRoleLabels[r]||r}
              </button>
            ))}
          </div>
          <div className="flex gap-1 rounded-lg p-0.5" style={{backgroundColor:"#111",border:"1px solid #2a2a2a"}}>
            {["All","active","inactive"].map(s=>(
              <button key={s} onClick={()=>setStatusFilter(s)}
                className="px-3 py-1.5 rounded text-xs capitalize"
                style={{fontFamily:"system-ui,sans-serif",backgroundColor:statusFilter===s?"#fff":"transparent",color:statusFilter===s?"#000":"#555"}}>
                {s==="All"?"All":s}
              </button>
            ))}
          </div>
          <div className="flex-1"/>
          <span className="text-gray-600 text-sm" style={{fontFamily:"monospace"}}>{filtered.length} users</span>
        </div>

        {/* Users table */}
        <div className="rounded-lg overflow-hidden" style={{border:"1px solid #1e1e1e"}}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{backgroundColor:"#0a0a0a",borderBottom:"1px solid #1e1e1e"}}>
                {["User","Department","Role","Status","Last Login","Invite",""].map(h=>(
                  <th key={h} className="px-4 py-3 text-left font-normal text-gray-600 whitespace-nowrap"
                    style={{fontFamily:"system-ui,sans-serif",fontSize:10,textTransform:"uppercase",letterSpacing:"0.07em"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user,i)=>{
                const rc = allRoleColors[user.role] || { bg:"#1a1a1a", color:"#aaa" };
                return (
                  <tr key={user.id} className="group"
                    style={{borderBottom:i<filtered.length-1?"1px solid #141414":"none",backgroundColor:user.status==="inactive"?"#080808":"#0d0d0d"}}
                    onMouseEnter={e=>e.currentTarget.style.backgroundColor="#111"}
                    onMouseLeave={e=>e.currentTarget.style.backgroundColor=user.status==="inactive"?"#080808":"#0d0d0d"}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar user={user} size={32}/>
                          {user.status==="inactive"&&(
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black"
                              style={{backgroundColor:"#f05a5a"}}/>
                          )}
                        </div>
                        <div>
                          <p className="text-white text-sm" style={{fontFamily:"system-ui,sans-serif",opacity:user.status==="inactive"?0.5:1}}>{user.name}</p>
                          <p className="text-gray-600 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs" style={{fontFamily:"system-ui,sans-serif"}}>{user.dept}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{fontFamily:"system-ui,sans-serif",...rc}}>
                          {allRoleLabels[user.role]||user.role}
                        </span>
                        {!ROLES.includes(user.role) && (
                          <span className="text-xs px-1 rounded" style={{backgroundColor:"#1a1a0a",color:"#f0c85a88",fontFamily:"system-ui,sans-serif"}}>custom</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:user.status==="active"?"#5af07a":"#333"}}/>
                        <span className="text-xs capitalize" style={{fontFamily:"system-ui,sans-serif",color:user.status==="active"?"#5af07a":"#555"}}>{user.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap" style={{fontFamily:"monospace"}}>{user.lastLogin}</td>
                    <td className="px-4 py-3">
                      {user.mustChangePassword && (
                        <span className="text-xs px-2 py-0.5 rounded"
                          style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#1f1a0f",color:"#f0c85a",border:"1px solid #3a3010"}}>
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={()=>setEditing(user)}
                        className="text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 hover:opacity-80"
                        style={{fontFamily:"system-ui,sans-serif",backgroundColor:"#111",color:"#aaa",border:"1px solid #2a2a2a"}}>
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Custom roles legend (if any) */}
        {customRoles.length > 0 && (
          <div className="mt-5 rounded-lg p-4" style={{ backgroundColor:"#0a0a0a", border:"1px solid #1a1a1a" }}>
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-3" style={{ fontFamily:"system-ui,sans-serif" }}>Custom Roles</p>
            <div className="flex flex-wrap gap-2">
              {customRoles.map(r => (
                <div key={r.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor:r.color.bg, border:`1px solid ${r.color.color}33` }}>
                  <span className="text-xs" style={{ fontFamily:"system-ui,sans-serif", color:r.color.color }}>{r.name}</span>
                  <span className="text-xs" style={{ fontFamily:"monospace", color:r.color.color+"88" }}>{r.permissions.length} perms</span>
                  {r.description && <span className="text-xs text-gray-600" style={{ fontFamily:"system-ui,sans-serif" }}>· {r.description}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateUserDrawer
          onClose={() => setShowCreate(false)}
          onSave={handleCreate}
          customRoles={customRoles}
        />
      )}
      {showCreateRole && (
        <CreateRoleDrawer
          onClose={() => setShowCreateRole(false)}
          onSave={handleSaveRole}
        />
      )}
      {editing && (
        <EditUserDrawer
          user={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
