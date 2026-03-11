import { useState } from "react"
import PackageSection from "./PackageSection";
import { Field } from "../../../data/compData";
import { IC } from "../../../data/compData";
import { IS } from "../../../data/compData";

export default function CompensationConfigTab({ basicPaySets, contributionSets, benefitsSets, onUpdateBasicPay, onUpdateContributions, onUpdateBenefits, onSwitchView }) {
  const [editTarget, setEditTarget] = useState(null); // { type, set }
  const [editForm, setEditForm] = useState(null);
  const [activeSection, setActiveSection] = useState("basicPay");

  function openEdit(type, set) {
    setEditTarget({ type, set });
    setEditForm({ ...set });
  }
  function saveEdit() {
    if (!editTarget) return;
    if (editTarget.type === "basicPay")      onUpdateBasicPay(basicPaySets.map(s => s.id === editForm.id ? editForm : s));
    if (editTarget.type === "contributions") onUpdateContributions(contributionSets.map(s => s.id === editForm.id ? editForm : s));
    if (editTarget.type === "benefits")      onUpdateBenefits(benefitsSets.map(s => s.id === editForm.id ? editForm : s));
    setEditTarget(null); setEditForm(null);
  }
  function fe(k, v) { setEditForm(f => ({ ...f, [k]: v })); }

  const sectionTabs = [
    { key: "basicPay",      label: "Basic Pay Sets",      count: basicPaySets.length },
    { key: "contributions", label: "Contribution Sets",   count: contributionSets.length },
    { key: "benefits",      label: "Benefits Sets",       count: benefitsSets.length },
  ];

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600 text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "system-ui,sans-serif" }}>People · Configuration</p>
          <h1 className="text-3xl font-normal mb-1" style={{ letterSpacing: "-0.02em" }}>Compensation Packages</h1>
          <p className="text-gray-500 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>Define Basic Pay Sets, Contribution Sets, and Benefits Sets. Assign these to employees via their Compensation tab.</p>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 mb-6" style={{ borderBottom: "1px solid #1a1a1a" }}>
          {sectionTabs.map(st => (
            <button key={st.key} onClick={() => setActiveSection(st.key)}
              className="px-4 py-2.5 text-sm flex items-center gap-2 transition-all"
              style={{ fontFamily: "system-ui,sans-serif", color: activeSection === st.key ? "#fff" : "#555", borderBottom: activeSection === st.key ? "2px solid #fff" : "2px solid transparent" }}>
              {st.label}
              <span className="text-xs px-1.5 py-0.5 rounded" style={{ fontFamily: "monospace", backgroundColor: "#1a1a1a", color: "#888" }}>{st.count}</span>
            </button>
          ))}
        </div>

        {activeSection === "basicPay" && (
          <PackageSection title="Basic Pay Sets" type="basicPay" sets={basicPaySets}
            description="Define pay frequency, overtime multipliers, night differential, and holiday rates."
            onEdit={s => openEdit("basicPay", s)}
            onAdd={() => openEdit("basicPay", { id: "bp_"+Date.now(), name:"", desc:"", payFreq:"Bi-weekly", overtimeRate:1.5, nightDiffRate:0.1, holidayRate:2.0, color:"#5af07a" })} />
        )}
        {activeSection === "contributions" && (
          <PackageSection title="Contribution Sets" type="contributions" sets={contributionSets}
            description="Define which statutory contributions apply and at what rates."
            onEdit={s => openEdit("contributions", s)}
            onAdd={() => openEdit("contributions", { id: "cs_"+Date.now(), name:"", desc:"", sss:true, sssRate:4.5, philhealth:true, philhealthRate:2.0, pagibig:true, pagibigRate:2.0, withholdingTax:true, taxRate:20, color:"#5af07a" })} />
        )}
        {activeSection === "benefits" && (
          <PackageSection title="Benefits Sets" type="benefits" sets={benefitsSets}
            description="Define HMO, leave entitlements, allowances, and other non-cash benefits."
            onEdit={s => openEdit("benefits", s)}
            onAdd={() => openEdit("benefits", { id: "bf_"+Date.now(), name:"", desc:"", hmo:true, lifeInsurance:true, annualLeave:15, sickLeave:15, mealAllowance:0, transportAllowance:0, thirteenthMonth:true, color:"#5af07a" })} />
        )}
      </div>

      {/* Edit panel */}
      {editTarget && editForm && (
        <>
          <div className="fixed inset-0 z-20" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => { setEditTarget(null); setEditForm(null); }} />
          <div className="fixed top-0 right-0 h-full z-30 flex flex-col" style={{ width: 460, backgroundColor: "#080808", borderLeft: "1px solid #222", boxShadow: "-8px 0 40px rgba(0,0,0,0.8)" }}>
            <div className="flex items-center justify-between px-7 py-5 flex-shrink-0" style={{ borderBottom: "1px solid #1a1a1a" }}>
              <div>
                <h2 className="text-base font-normal text-white">{editTarget.type === "basicPay" ? "Basic Pay Set" : editTarget.type === "contributions" ? "Contribution Set" : "Benefits Set"}</h2>
                <p className="text-gray-500 text-xs mt-0.5" style={{ fontFamily: "system-ui,sans-serif" }}>Edit set details and rates</p>
              </div>
              <button onClick={() => { setEditTarget(null); setEditForm(null); }} className="text-gray-600 hover:text-white text-xl">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-7 py-6 space-y-4">
              <Field label="Set Name"><input className={IC} style={IS} value={editForm.name} onChange={e => fe("name", e.target.value)} placeholder="e.g. Standard" /></Field>
              <Field label="Description"><textarea className={IC} style={{ ...IS, resize: "none" }} rows={2} value={editForm.desc} onChange={e => fe("desc", e.target.value)} /></Field>

              {/* Color picker */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2" style={{ fontFamily: "system-ui,sans-serif" }}>Color Tag</label>
                <div className="flex gap-2">
                  {["#5af07a","#f0c85a","#5a9af0","#f05a5a","#9b8aff","#5af0d9","#aaaaaa"].map(c => (
                    <button key={c} onClick={() => fe("color", c)}
                      className="w-7 h-7 rounded-full transition-all"
                      style={{ backgroundColor: c, outline: editForm.color === c ? `2px solid ${c}` : "none", outlineOffset: 3 }} />
                  ))}
                </div>
              </div>

              {/* Basic Pay fields */}
              {editTarget.type === "basicPay" && (<>
                <p className="text-xs uppercase tracking-widest text-gray-600 pt-1 pb-1" style={{ fontFamily: "system-ui,sans-serif", borderBottom: "1px solid #1a1a1a" }}>Pay Structure</p>
                <Field label="Pay Frequency">
                  <select className={IC} style={IS} value={editForm.payFreq} onChange={e => fe("payFreq", e.target.value)}>
                    <option>Weekly</option><option>Bi-weekly</option><option>Semi-monthly</option><option>Monthly</option>
                  </select>
                </Field>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="OT Rate (×)"><input type="number" step="0.05" className={IC} style={IS} value={editForm.overtimeRate} onChange={e => fe("overtimeRate", parseFloat(e.target.value)||1)} /></Field>
                  <Field label="Night Diff (%)"><input type="number" step="1" className={IC} style={IS} value={(editForm.nightDiffRate*100).toFixed(0)} onChange={e => fe("nightDiffRate", (parseFloat(e.target.value)||0)/100)} /></Field>
                  <Field label="Holiday (×)"><input type="number" step="0.25" className={IC} style={IS} value={editForm.holidayRate} onChange={e => fe("holidayRate", parseFloat(e.target.value)||1)} /></Field>
                </div>
              </>)}

              {/* Contribution fields */}
              {editTarget.type === "contributions" && (<>
                <p className="text-xs uppercase tracking-widest text-gray-600 pt-1 pb-1" style={{ fontFamily: "system-ui,sans-serif", borderBottom: "1px solid #1a1a1a" }}>Statutory Contributions</p>
                {[["SSS","sss","sssRate"],["PhilHealth","philhealth","philhealthRate"],["Pag-IBIG","pagibig","pagibigRate"]].map(([label,onKey,rateKey]) => (
                  <div key={label} className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
                    <div className="flex items-center gap-3">
                      <button onClick={() => fe(onKey, !editForm[onKey])} className="w-10 h-5 rounded-full relative flex-shrink-0 transition-all" style={{ backgroundColor: editForm[onKey] ? "#fff" : "#333" }}>
                        <div className="w-4 h-4 rounded-full absolute top-0.5 transition-all" style={{ backgroundColor: editForm[onKey] ? "#000" : "#666", left: editForm[onKey] ? "calc(100% - 1.1rem)" : "0.15rem" }} />
                      </button>
                      <span className="text-sm text-gray-300" style={{ fontFamily: "system-ui,sans-serif" }}>{label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input type="number" step="0.5" className="w-16 px-2 py-1 rounded text-sm text-right outline-none" style={{ backgroundColor: "#0d0d0d", border: "1px solid #2a2a2a", fontFamily: "monospace", color: editForm[onKey] ? "#fff" : "#444" }} value={editForm[rateKey]} onChange={e => fe(rateKey, parseFloat(e.target.value)||0)} disabled={!editForm[onKey]} />
                      <span className="text-gray-500 text-xs">%</span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
                  <div className="flex items-center gap-3">
                    <button onClick={() => fe("withholdingTax", !editForm.withholdingTax)} className="w-10 h-5 rounded-full relative flex-shrink-0 transition-all" style={{ backgroundColor: editForm.withholdingTax ? "#fff" : "#333" }}>
                      <div className="w-4 h-4 rounded-full absolute top-0.5 transition-all" style={{ backgroundColor: editForm.withholdingTax ? "#000" : "#666", left: editForm.withholdingTax ? "calc(100% - 1.1rem)" : "0.15rem" }} />
                    </button>
                    <span className="text-sm text-gray-300" style={{ fontFamily: "system-ui,sans-serif" }}>Withholding Tax</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input type="number" step="1" className="w-16 px-2 py-1 rounded text-sm text-right outline-none" style={{ backgroundColor: "#0d0d0d", border: "1px solid #2a2a2a", fontFamily: "monospace", color: editForm.withholdingTax ? "#fff" : "#444" }} value={editForm.taxRate} onChange={e => fe("taxRate", parseFloat(e.target.value)||0)} disabled={!editForm.withholdingTax} />
                    <span className="text-gray-500 text-xs">%</span>
                  </div>
                </div>
              </>)}

              {/* Benefits fields */}
              {editTarget.type === "benefits" && (<>
                <p className="text-xs uppercase tracking-widest text-gray-600 pt-1 pb-1" style={{ fontFamily: "system-ui,sans-serif", borderBottom: "1px solid #1a1a1a" }}>Insurance & Leave</p>
                <div className="grid grid-cols-2 gap-3">
                  {[["HMO Coverage","hmo"],["Life Insurance","lifeInsurance"],["13th Month Pay","thirteenthMonth"]].map(([label,key]) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded col-span-1" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
                      <span className="text-sm text-gray-300" style={{ fontFamily: "system-ui,sans-serif" }}>{label}</span>
                      <button onClick={() => fe(key, !editForm[key])} className="w-10 h-5 rounded-full relative flex-shrink-0 transition-all" style={{ backgroundColor: editForm[key] ? "#fff" : "#333" }}>
                        <div className="w-4 h-4 rounded-full absolute top-0.5 transition-all" style={{ backgroundColor: editForm[key] ? "#000" : "#666", left: editForm[key] ? "calc(100% - 1.1rem)" : "0.15rem" }} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Annual Leave (days)"><input type="number" className={IC} style={IS} value={editForm.annualLeave} onChange={e => fe("annualLeave", parseInt(e.target.value)||0)} /></Field>
                  <Field label="Sick Leave (days)"><input type="number" className={IC} style={IS} value={editForm.sickLeave} onChange={e => fe("sickLeave", parseInt(e.target.value)||0)} /></Field>
                  <Field label="Meal Allowance (₱)"><input type="number" className={IC} style={IS} value={editForm.mealAllowance} onChange={e => fe("mealAllowance", parseInt(e.target.value)||0)} /></Field>
                  <Field label="Transport Allowance (₱)"><input type="number" className={IC} style={IS} value={editForm.transportAllowance} onChange={e => fe("transportAllowance", parseInt(e.target.value)||0)} /></Field>
                </div>
              </>)}
            </div>
            <div className="px-7 py-5 flex items-center justify-between flex-shrink-0" style={{ borderTop: "1px solid #1a1a1a" }}>
              <button onClick={() => { setEditTarget(null); setEditForm(null); }} className="px-5 py-2.5 rounded text-sm hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", color: "#aaa", border: "1px solid #2a2a2a" }}>Cancel</button>
              <button onClick={saveEdit} className="px-5 py-2.5 rounded text-sm font-medium bg-white text-black hover:opacity-80" style={{ fontFamily: "system-ui,sans-serif" }}>Save Set ✓</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}