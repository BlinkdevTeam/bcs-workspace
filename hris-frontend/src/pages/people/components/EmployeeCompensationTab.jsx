import {useState} from "react"
import { IC } from "../../../data/compData";
import { IS } from "../../../data/compData";
import { Field } from "../../../data/compData";

export default function EmployeeCompensationTab({ emp, onUpdateEmp, empComp, onUpdateComp, basicPaySets, contributionSets, benefitsSets }) {
  const [showAdjForm, setShowAdjForm] = useState(false);
  const [adjForm, setAdjForm] = useState({ type: "bonus", amount: "", reason: "", date: "", addedBy: "Admin" });

  // Salary inline edit state
  const [editingSalary, setEditingSalary] = useState(false);
  const [salaryDraft, setSalaryDraft] = useState("");
  const [salaryFreqDraft, setSalaryFreqDraft] = useState("");
  const [salaryReason, setSalaryReason] = useState("");

  const bp  = basicPaySets.find(s => s.id === empComp.basicPaySetId)      || basicPaySets[0];
  const cs  = contributionSets.find(s => s.id === empComp.contributionSetId) || contributionSets[0];
  const bfs = benefitsSets.find(s => s.id === empComp.benefitsSetId)        || benefitsSets[0];

  const salary = parseFloat((emp.salary||"").toString().replace(/[$,]/g,"")) || 0;
  const payFreq = emp.payFreq || bp.payFreq || "Bi-weekly";
  const periods = payFreq === "Monthly" ? 12 : payFreq === "Semi-monthly" ? 24 : 26;
  const grossPerPeriod = salary / periods;

  function openSalaryEdit() {
    setSalaryDraft(salary.toString());
    setSalaryFreqDraft(payFreq);
    setSalaryReason("");
    setEditingSalary(true);
  }
  function saveSalary() {
    const newSalary = parseFloat(salaryDraft) || salary;
    onUpdateEmp({ ...emp, salary: "$" + newSalary.toLocaleString(), payFreq: salaryFreqDraft });
    setEditingSalary(false);
  }

  // Compute contributions
  const sssAmt    = cs.sss        ? grossPerPeriod * (cs.sssRate/100)        : 0;
  const phAmt     = cs.philhealth ? grossPerPeriod * (cs.philhealthRate/100)  : 0;
  const pgAmt     = cs.pagibig    ? grossPerPeriod * (cs.pagibigRate/100)     : 0;
  const taxAmt    = cs.withholdingTax ? grossPerPeriod * (cs.taxRate/100)     : 0;
  const totalDed  = sssAmt + phAmt + pgAmt + taxAmt;

  // Ad-hoc adjustments for this period
  const adjBonus  = (empComp.adjustments||[]).filter(a => a.type==="bonus").reduce((s,a) => s + Number(a.amount), 0);
  const adjDeduct = (empComp.adjustments||[]).filter(a => a.type==="deduction").reduce((s,a) => s + Number(a.amount), 0);
  const netPay    = grossPerPeriod - totalDed + adjBonus - adjDeduct;

  function fmt(n) { return "$" + n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}); }

  function addAdj() {
    if (!adjForm.amount || !adjForm.reason) return;
    const today = new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
    const newAdj = { ...adjForm, id: Date.now(), amount: parseFloat(adjForm.amount), date: adjForm.date || today };
    onUpdateComp({ ...empComp, adjustments: [...(empComp.adjustments||[]), newAdj] });
    setAdjForm({ type: "bonus", amount: "", reason: "", date: "", addedBy: "Admin" });
    setShowAdjForm(false);
  }

  function removeAdj(id) {
    onUpdateComp({ ...empComp, adjustments: (empComp.adjustments||[]).filter(a => a.id !== id) });
  }

  const REASONS_BONUS = ["Performance bonus","Sales incentive","Project completion","Overtime pay","Referral bonus","Anniversary bonus","Other"];
  const REASONS_DED   = ["Salary advance repayment","Late/absence deduction","Equipment damage","Loan repayment","Uniform/ID fee","Other"];

  return (
    <div className="space-y-6">
      {/* Package assignment row */}
      <div className="rounded-lg p-5" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-normal text-white">Assigned Packages</h3>
          <span className="text-xs text-gray-600 px-2 py-0.5 rounded" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111" }}>Changes must be made through the set</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Basic Pay Set", set: bp, key: "basicPaySetId", options: basicPaySets, updKey: "basicPaySetId" },
            { label: "Contribution Set", set: cs, key: "contributionSetId", options: contributionSets, updKey: "contributionSetId" },
            { label: "Benefits Set", set: bfs, key: "benefitsSetId", options: benefitsSets, updKey: "benefitsSetId" },
          ].map(({ label, set, options, updKey }) => (
            <div key={label} className="rounded p-3" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-2" style={{ fontFamily: "system-ui,sans-serif" }}>{label}</p>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: set.color }} />
                <span className="text-white text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{set.name}</span>
              </div>
              <select
                className="w-full px-2 py-1.5 rounded text-xs outline-none text-gray-400"
                style={{ backgroundColor: "#0d0d0d", border: "1px solid #2a2a2a", fontFamily: "system-ui,sans-serif" }}
                value={empComp[updKey]}
                onChange={e => onUpdateComp({ ...empComp, [updKey]: e.target.value })}
              >
                {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Pay breakdown */}
      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-lg p-5" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-normal text-white">Pay Breakdown · Per Period</h3>
            {!editingSalary
              ? <button onClick={openSalaryEdit} className="text-xs px-2.5 py-1 rounded hover:opacity-80 transition-all" style={{ fontFamily: "system-ui,sans-serif", backgroundColor: "#111", color: "#aaa", border: "1px solid #2a2a2a" }}>✏ Edit Salary</button>
              : <button onClick={() => setEditingSalary(false)} className="text-xs text-gray-600 hover:text-white transition-colors" style={{ fontFamily: "system-ui,sans-serif" }}>✕ Cancel</button>
            }
          </div>

          {/* Salary edit form */}
          {editingSalary && (
            <div className="mb-4 p-4 rounded-lg space-y-3" style={{ backgroundColor: "#111", border: "1px solid #2a2a2a" }}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1.5" style={{ fontFamily: "system-ui,sans-serif" }}>Annual Salary ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input type="number" className={IC} style={{ ...IS, paddingLeft: "1.75rem" }}
                      value={salaryDraft} onChange={e => setSalaryDraft(e.target.value)} autoFocus />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1.5" style={{ fontFamily: "system-ui,sans-serif" }}>Pay Frequency</label>
                  <select className={IC} style={IS} value={salaryFreqDraft} onChange={e => setSalaryFreqDraft(e.target.value)}>
                    <option>Weekly</option><option>Bi-weekly</option><option>Semi-monthly</option><option>Monthly</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1.5" style={{ fontFamily: "system-ui,sans-serif" }}>Reason for Change</label>
                <input className={IC} style={IS} placeholder="e.g. Annual review, promotion, market adjustment…"
                  value={salaryReason} onChange={e => setSalaryReason(e.target.value)} />
              </div>
              {salaryDraft && (
                <div className="flex items-center justify-between px-3 py-2 rounded" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
                  <span className="text-xs text-gray-600" style={{ fontFamily: "system-ui,sans-serif" }}>New gross / period</span>
                  <span className="text-sm font-medium" style={{ fontFamily: "monospace", color: "#5af07a" }}>
                    {fmt((parseFloat(salaryDraft)||0) / (salaryFreqDraft === "Monthly" ? 12 : salaryFreqDraft === "Semi-monthly" ? 24 : 26))}
                  </span>
                </div>
              )}
              <div className="flex justify-end">
                <button onClick={saveSalary}
                  className="px-4 py-2 rounded text-sm font-medium bg-white text-black hover:opacity-80"
                  style={{ fontFamily: "system-ui,sans-serif" }}>
                  Save Salary ✓
                </button>
              </div>
            </div>
          )}

          {/* Salary summary row */}
          {!editingSalary && (
            <div className="flex justify-between py-1.5 mb-1" style={{ borderBottom: "1px solid #2a2a2a" }}>
              <span className="text-gray-400 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>Annual Salary</span>
              <span className="text-sm font-medium text-white" style={{ fontFamily: "monospace" }}>
                ${salary.toLocaleString()} <span className="text-gray-600 text-xs font-normal">/ {payFreq}</span>
              </span>
            </div>
          )}

          <div className="space-y-2">
            {[
              ["Gross Pay",        fmt(grossPerPeriod), "#fff"],
              ["Withholding Tax",  cs.withholdingTax ? `-${fmt(taxAmt)}` : "Exempt", cs.withholdingTax ? "#f0c85a" : "#555"],
              ["SSS",              cs.sss ? `-${fmt(sssAmt)}` : "Off", cs.sss ? "#f0c85a" : "#555"],
              ["PhilHealth",       cs.philhealth ? `-${fmt(phAmt)}` : "Off", cs.philhealth ? "#f0c85a" : "#555"],
              ["Pag-IBIG",        cs.pagibig ? `-${fmt(pgAmt)}` : "Off", cs.pagibig ? "#f0c85a" : "#555"],
            ].map(([l,v,c]) => (
              <div key={l} className="flex justify-between py-1.5" style={{ borderBottom: "1px solid #1a1a1a" }}>
                <span className="text-gray-500 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{l}</span>
                <span className="text-sm" style={{ fontFamily: "monospace", color: c }}>{v}</span>
              </div>
            ))}
            {adjBonus > 0 && (
              <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid #1a1a1a" }}>
                <span className="text-gray-500 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>Ad-hoc Bonuses</span>
                <span className="text-sm" style={{ fontFamily: "monospace", color: "#5af07a" }}>+{fmt(adjBonus)}</span>
              </div>
            )}
            {adjDeduct > 0 && (
              <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid #1a1a1a" }}>
                <span className="text-gray-500 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>Ad-hoc Deductions</span>
                <span className="text-sm" style={{ fontFamily: "monospace", color: "#f05a5a" }}>-{fmt(adjDeduct)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2">
              <span className="text-white text-sm font-medium" style={{ fontFamily: "system-ui,sans-serif" }}>Net Pay</span>
              <span className="text-sm font-medium" style={{ fontFamily: "monospace", color: "#5af07a" }}>{fmt(netPay)}</span>
            </div>
          </div>
        </div>

        {/* Benefits summary */}
        <div className="rounded-lg p-5" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
          <h3 className="text-sm font-normal text-white mb-4">Benefits Summary · {bfs.name}</h3>
          <div className="space-y-2">
            {[
              ["HMO",               bfs.hmo ? "Covered" : "—"],
              ["Life Insurance",    bfs.lifeInsurance ? "Covered" : "—"],
              ["Annual Leave",      bfs.annualLeave > 0 ? `${bfs.annualLeave} days/yr` : "—"],
              ["Sick Leave",        bfs.sickLeave > 0 ? `${bfs.sickLeave} days/yr` : "—"],
              ["Meal Allowance",    bfs.mealAllowance > 0 ? `₱${bfs.mealAllowance.toLocaleString()}/mo` : "—"],
              ["Transport Allow.",  bfs.transportAllowance > 0 ? `₱${bfs.transportAllowance.toLocaleString()}/mo` : "—"],
              ["13th Month Pay",    bfs.thirteenthMonth ? "Included" : "—"],
            ].map(([l,v]) => (
              <div key={l} className="flex justify-between py-1.5" style={{ borderBottom: "1px solid #1a1a1a" }}>
                <span className="text-gray-500 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{l}</span>
                <span className="text-sm" style={{ fontFamily: "monospace", color: v === "—" ? "#333" : "#fff" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ad-hoc adjustments */}
      <div className="rounded-lg p-5" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-normal text-white">Ad-hoc Deductions & Bonuses</h3>
            <p className="text-xs text-gray-600 mt-0.5" style={{ fontFamily: "system-ui,sans-serif" }}>One-off adjustments for this employee — no need to edit the package set.</p>
          </div>
          <button onClick={() => setShowAdjForm(v => !v)}
            className="px-3 py-1.5 rounded text-xs font-medium hover:opacity-80"
            style={{ fontFamily: "system-ui,sans-serif", backgroundColor: showAdjForm ? "#1a1a1a" : "#fff", color: showAdjForm ? "#aaa" : "#000", border: showAdjForm ? "1px solid #2a2a2a" : "none" }}>
            {showAdjForm ? "✕ Cancel" : "+ Add Adjustment"}
          </button>
        </div>

        {/* Add form */}
        {showAdjForm && (
          <div className="rounded-lg p-4 mb-4 space-y-3" style={{ backgroundColor: "#111", border: "1px solid #2a2a2a" }}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Type">
                <div className="flex gap-2">
                  {[["bonus","Bonus","#5af07a"],["deduction","Deduction","#f05a5a"]].map(([val,label,col]) => (
                    <button key={val} onClick={() => setAdjForm(f => ({ ...f, type: val, reason: "" }))}
                      className="flex-1 py-2 rounded text-xs font-medium transition-all"
                      style={{ fontFamily: "system-ui,sans-serif", backgroundColor: adjForm.type === val ? col+"22" : "#0d0d0d", color: adjForm.type === val ? col : "#555", border: `1px solid ${adjForm.type === val ? col : "#2a2a2a"}` }}>
                      {adjForm.type === val ? "✓ " : ""}{label}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Amount ($)">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input type="number" className={IC} style={{ ...IS, paddingLeft: "1.75rem" }} placeholder="0.00" value={adjForm.amount} onChange={e => setAdjForm(f => ({ ...f, amount: e.target.value }))} />
                </div>
              </Field>
            </div>
            <Field label="Reason">
              <select className={IC} style={IS} value={adjForm.reason} onChange={e => setAdjForm(f => ({ ...f, reason: e.target.value }))}>
                <option value="">Select a reason…</option>
                {(adjForm.type === "bonus" ? REASONS_BONUS : REASONS_DED).map(r => <option key={r}>{r}</option>)}
              </select>
            </Field>
            {adjForm.reason === "Other" && (
              <Field label="Specify Reason">
                <input className={IC} style={IS} placeholder="Describe the reason…" value={adjForm.customReason||""} onChange={e => setAdjForm(f => ({ ...f, customReason: e.target.value }))} />
              </Field>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Effective Date"><input className={IC} style={IS} placeholder="Today" value={adjForm.date} onChange={e => setAdjForm(f => ({ ...f, date: e.target.value }))} /></Field>
              <Field label="Added By"><input className={IC} style={IS} value={adjForm.addedBy} onChange={e => setAdjForm(f => ({ ...f, addedBy: e.target.value }))} /></Field>
            </div>
            <div className="flex justify-end pt-1">
              <button onClick={addAdj}
                disabled={!adjForm.amount || !adjForm.reason}
                className="px-4 py-2 rounded text-sm font-medium hover:opacity-80 transition-all"
                style={{ fontFamily: "system-ui,sans-serif", backgroundColor: (!adjForm.amount||!adjForm.reason) ? "#1a1a1a" : "#fff", color: (!adjForm.amount||!adjForm.reason) ? "#444" : "#000", cursor: (!adjForm.amount||!adjForm.reason) ? "not-allowed" : "pointer" }}>
                Confirm Adjustment ✓
              </button>
            </div>
          </div>
        )}

        {/* Adjustments list */}
        {(empComp.adjustments||[]).length === 0 && !showAdjForm ? (
          <div className="flex items-center justify-center py-8 rounded" style={{ border: "1px dashed #2a2a2a" }}>
            <p className="text-gray-600 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>No ad-hoc adjustments recorded for this employee.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {(empComp.adjustments||[]).map(adj => (
              <div key={adj.id} className="flex items-center justify-between px-4 py-3 rounded group" style={{ backgroundColor: "#111", border: `1px solid ${adj.type==="bonus" ? "#1a3a1a" : "#3a1a1a"}` }}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{adj.type === "bonus" ? "⬆" : "⬇"}</span>
                  <div>
                    <p className="text-sm text-gray-200" style={{ fontFamily: "system-ui,sans-serif" }}>{adj.reason === "Other" ? (adj.customReason || "Other") : adj.reason}</p>
                    <p className="text-xs text-gray-600" style={{ fontFamily: "system-ui,sans-serif" }}>{adj.date} · Added by {adj.addedBy}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium" style={{ fontFamily: "monospace", color: adj.type === "bonus" ? "#5af07a" : "#f05a5a" }}>
                    {adj.type === "bonus" ? "+" : "-"}${Number(adj.amount).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
                  </span>
                  <button onClick={() => removeAdj(adj.id)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 text-sm transition-all">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}