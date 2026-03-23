import { useState } from "react";
import { IC, IS } from "../../../../data/compData";

const CURRENT_USER_ROLE = "super_admin";

const DEPTS = ["Engineering","Sales","Product","Design","Operations","Marketing","HR & Admin"];

const ROLES = ["super_admin", "hr_admin", "manager", "employee"];

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
      <div className="fixed inset-0 z-[200]" style={{backgroundColor:"rgba(0,0,0,0.6)"}} onClick={onClose}/>
      <div className="fixed top-0 right-0 h-full z-[201] flex flex-col"
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

export default CreateUserDrawer;