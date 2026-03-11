import { useState } from "react";
import {
  IC, IS, Field 
} from "../../../data/compData";

// ── ADD EMPLOYEE DRAWER ───────────────────────────────────────────────────────
export default function AddEmployeeDrawer({ onClose, onSave }) {
  const [form, setForm] = useState({
    name:"", email:"", phone:"", role:"", dept:"Engineering", location:"New York",
    status:"Active", joined:"", salary:"", payFreq:"Bi-weekly", empType:"Full-time",
    manager:"", schedule:"Mon–Fri, 9am–5pm", benefits:"Standard", gender:"", dob:"",
  });
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function handleSave() {
    const today = new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
    onSave({
      ...form,
      id: Date.now(),
      avatar: form.name.trim().split(" ").map(w=>w[0]||"").join("").slice(0,2).toUpperCase() || "??",
      salary: form.salary,
      joined: form.joined || today,
      tax: 20,
      empType: form.empType,
      deductOverrides: {sss:true,philhealth:true,pagibig:true},
      taxExempt: false,
    });
    onClose();
  }

  return (
    <>
      <div className="fixed inset-0 z-20" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onClose} />
      <div className="fixed top-0 right-0 h-full z-30 flex flex-col"
        style={{ width: 480, backgroundColor: "#080808", borderLeft: "1px solid #222", boxShadow: "-8px 0 40px rgba(0,0,0,0.8)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 flex-shrink-0" style={{ borderBottom: "1px solid #1a1a1a" }}>
          <div>
            <h2 className="text-base font-normal text-white">Add New Employee</h2>
            <p className="text-gray-500 text-sm mt-0.5" style={{ fontFamily: "system-ui, sans-serif" }}>Fill in the details below</p>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors text-xl">✕</button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          <p className="text-xs uppercase tracking-widest text-gray-600 pb-1" style={{ fontFamily: "system-ui, sans-serif", borderBottom: "1px solid #1a1a1a" }}>Basic Info</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name"><input className={IC} style={IS} placeholder="Sara" value={form.name.split(" ")[0]} onChange={e => set("name", e.target.value + " " + form.name.split(" ").slice(1).join(" "))} /></Field>
            <Field label="Last Name"><input className={IC} style={IS} placeholder="Okafor" value={form.name.split(" ").slice(1).join(" ")} onChange={e => set("name", (form.name.split(" ")[0]||"") + " " + e.target.value)} /></Field>
          </div>
          <Field label="Work Email"><input className={IC} style={IS} placeholder="name@company.com" value={form.email} onChange={e => set("email", e.target.value)} /></Field>
          <Field label="Phone"><input className={IC} style={IS} placeholder="+1 212 555 0000" value={form.phone} onChange={e => set("phone", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date of Birth"><input className={IC} style={IS} placeholder="Jan 1, 1990" value={form.dob} onChange={e => set("dob", e.target.value)} /></Field>
            <Field label="Gender">
              <select className={IC} style={IS} value={form.gender} onChange={e => set("gender", e.target.value)}>
                <option value="">Select…</option><option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option>
              </select>
            </Field>
          </div>

          <p className="text-xs uppercase tracking-widest text-gray-600 pt-2 pb-1" style={{ fontFamily: "system-ui, sans-serif", borderBottom: "1px solid #1a1a1a" }}>Job Details</p>
          <Field label="Job Title"><input className={IC} style={IS} placeholder="Senior Engineer" value={form.role} onChange={e => set("role", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Department">
              <select className={IC} style={IS} value={form.dept} onChange={e => set("dept", e.target.value)}>
                {["Engineering","Sales","Product","Design","Operations","Marketing","HR & Admin"].map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className={IC} style={IS} value={form.status} onChange={e => set("status", e.target.value)}>
                <option>Active</option><option>On Leave</option><option>Inactive</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Location">
              <select className={IC} style={IS} value={form.location} onChange={e => set("location", e.target.value)}>
                {["New York","Chicago","Austin","Remote"].map(l => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Manager">
              <select className={IC} style={IS} value={form.manager} onChange={e => set("manager", e.target.value)}>
                {["","CEO","Devon Park","Sara Okafor","Rita Vance","Leila Farouk","Noah Kim"].map(m => <option key={m} value={m}>{m||"Select…"}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Date"><input className={IC} style={IS} placeholder="Mar 1, 2026" value={form.joined} onChange={e => set("joined", e.target.value)} /></Field>
            <Field label="Work Schedule">
              <select className={IC} style={IS} value={form.schedule} onChange={e => set("schedule", e.target.value)}>
                {["Mon–Fri, 9am–5pm","Mon–Fri, Flexible","4-day week","Remote / Async"].map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Employment Type">
            <select className={IC} style={IS} value={form.empType} onChange={e => set("empType", e.target.value)}>
              <option>Full-time</option><option>Part-time</option><option>Contractor</option><option>Intern</option>
            </select>
          </Field>

          <p className="text-xs uppercase tracking-widest text-gray-600 pt-2 pb-1" style={{ fontFamily: "system-ui, sans-serif", borderBottom: "1px solid #1a1a1a" }}>Compensation</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Annual Salary">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input className={IC} style={{ ...IS, paddingLeft: "1.75rem" }} placeholder="0" value={form.salary} onChange={e => set("salary", e.target.value)} />
              </div>
            </Field>
            <Field label="Pay Frequency">
              <select className={IC} style={IS} value={form.payFreq} onChange={e => set("payFreq", e.target.value)}>
                <option>Weekly</option><option>Bi-weekly</option><option>Semi-monthly</option><option>Monthly</option>
              </select>
            </Field>
          </div>
          <Field label="Benefits Package">
            <select className={IC} style={IS} value={form.benefits} onChange={e => set("benefits", e.target.value)}>
              <option>Standard</option><option>Premium</option><option>Contractor (None)</option>
            </select>
          </Field>
        </div>

        {/* Footer */}
        <div className="px-7 py-5 flex items-center justify-between flex-shrink-0" style={{ borderTop: "1px solid #1a1a1a" }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded text-sm hover:opacity-80"
            style={{ fontFamily: "system-ui, sans-serif", backgroundColor: "#111", color: "#aaa", border: "1px solid #2a2a2a" }}>
            Cancel
          </button>
          <button onClick={handleSave}
            className="px-5 py-2.5 rounded text-sm font-medium bg-white text-black hover:opacity-80"
            style={{ fontFamily: "system-ui, sans-serif" }}>
            Add Employee ✓
          </button>
        </div>
      </div>
    </>
  );
}