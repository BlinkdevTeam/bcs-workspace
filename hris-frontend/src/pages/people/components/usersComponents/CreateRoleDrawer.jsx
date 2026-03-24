import { useState } from "react";
import { IC, IS } from "../../../../data/compData";

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

export default CreateRoleDrawer;