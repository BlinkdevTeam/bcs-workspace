import React, { useState } from "react";
import { Avatar, calcDeductions } from '../../../data/compData';

// ── IMPORT DATA & HELPERS ──────────────────────────────────────────────────────
import { EMPLOYEES, DEFAULT_SETTINGS, gross, calcNet, fmt } from "../../../data/compData"; 

// Fallback input class & style for the modal
const IC = "w-full px-3 py-2 rounded text-sm bg-[#111] text-white border border-[#2a2a2a]";
const IS = { fontFamily: "system-ui,sans-serif" };

// ── RUN PAYROLL MODAL ─────────────────────────────────────────────────────────
function RunPayrollModal({ onClose, onConfirm }) {
  const [step, setStep] = useState(1); // 1=config 2=review 3=success
  const [period, setPeriod] = useState("Feb 16 – Feb 28, 2026");
  const [payDate, setPayDate] = useState("Mar 14, 2026");
  const [type, setType] = useState("Bi-weekly");
  const [holds, setHolds] = useState([]);

  // All active employees
  const activeEmployees = EMPLOYEES.filter(e => e.status === "Active");

  // Employees to actually run payroll on
  const eligibleEmployees = activeEmployees.filter(e => !holds.includes(e.id));

  // Totals
  const totalGross = eligibleEmployees.reduce((sum, e) => sum + gross(e), 0);
  const totalNet   = eligibleEmployees.reduce((sum, e) => sum + calcNet(e, DEFAULT_SETTINGS), 0);
  const totalTax   = eligibleEmployees.reduce((sum, e) => sum + calcDeductions(e, DEFAULT_SETTINGS).taxAmt, 0);

  // Helper to get per-employee breakdown
  function getEmployeePayroll(emp) {
    const deductions = calcDeductions(emp, DEFAULT_SETTINGS);
    return {
      grossPay: gross(emp),
      netPay: deductions.net,
      taxAmt: deductions.taxAmt,
      benefits: deductions.benAmt,
    };
  }

  // Toggle hold on/off
  function toggleHold(id) {
    setHolds(h => h.includes(id) ? h.filter(x => x !== id) : [...h, id]);
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        onClick={step !== 3 ? onClose : undefined}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl rounded-xl flex flex-col" style={{ backgroundColor: "#0d0d0d", border: "1px solid #2a2a2a", maxHeight: "92vh" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 flex-shrink-0" style={{ borderBottom: "1px solid #1e1e1e" }}>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-0.5" style={IS}>
                {step === 1 ? "Configure" : step === 2 ? "Review & Confirm" : "Complete"} · Step {step} of 3
              </p>
              <h2 className="text-lg font-normal text-white">Run Payroll</h2>
            </div>
            {step !== 3 && <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>}
          </div>

          {/* Progress bar */}
          <div className="h-0.5 w-full" style={{ backgroundColor: "#1a1a1a" }}>
            <div className="h-full bg-white transition-all" style={{ width: `${(step / 3) * 100}%` }} />
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">

            {/* Step 1: Configure */}
            {step === 1 && (
              <div className="px-6 py-5 space-y-5">
                {/* Period & Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={IS}>Pay Period</label>
                    <input className={IC} style={IS} value={period} onChange={e => setPeriod(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={IS}>Pay Date</label>
                    <input className={IC} style={IS} value={payDate} onChange={e => setPayDate(e.target.value)} />
                  </div>
                </div>

                {/* Payroll Type */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5" style={IS}>Payroll Type</label>
                  <div className="flex gap-2">
                    {["Bi-weekly", "Semi-monthly", "Monthly", "All"].map(t => (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        className="px-3 py-2 rounded text-sm transition-all"
                        style={{
                          fontFamily: "system-ui,sans-serif",
                          backgroundColor: type === t ? "#fff" : "#111",
                          color: type === t ? "#000" : "#666",
                          border: type === t ? "none" : "1px solid #2a2a2a"
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hold Employees */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs uppercase tracking-widest text-gray-500" style={IS}>Hold Employees</label>
                    <span className="text-xs text-gray-600" style={IS}>Toggle to exclude from this run</span>
                  </div>
                  <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #1e1e1e" }}>
                    {activeEmployees.map((emp, i) => (
                      <div
                        key={emp.id}
                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white hover:bg-opacity-5"
                        style={{ borderBottom: i < activeEmployees.length - 1 ? "1px solid #141414" : "none" }}
                        onClick={() => toggleHold(emp.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar emp={emp} size={30} />
                          <div>
                            <p className="text-gray-200 text-sm" style={IS}>{emp.name}</p>
                            <p className="text-gray-600 text-xs" style={IS}>{emp.role} · {fmt(gross(emp))}/period</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {holds.includes(emp.id) && (
                            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "#1f0f0f", color: "#f05a5a", fontFamily: "system-ui,sans-serif" }}>
                              On Hold
                            </span>
                          )}
                          <div className="w-10 h-5 rounded-full transition-all relative" style={{ backgroundColor: holds.includes(emp.id) ? "#f05a5a22" : "#2a2a2a" }}>
                            <div
                              className="w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all"
                              style={{ left: holds.includes(emp.id) ? "calc(100% - 18px)" : "2px", backgroundColor: holds.includes(emp.id) ? "#f05a5a" : "#666" }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Review & Confirm */}
            {step === 2 && (
              <div className="px-6 py-5 space-y-5">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Employees", value: eligibleEmployees.length, color: "#fff", mono: false },
                    { label: "Total Gross", value: fmt(totalGross), color: "#fff", mono: true },
                    { label: "Total Net", value: fmt(totalNet), color: "#5af07a", mono: true },
                    { label: "Tax Withheld", value: fmt(totalTax), color: "#f0c85a", mono: true },
                    { label: "Pay Date", value: payDate, color: "#aaa", mono: false },
                    { label: "Period", value: period, color: "#aaa", mono: false },
                  ].map(({ label, value, color, mono }) => (
                    <div key={label} className="rounded-lg p-3" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
                      <p className="text-xs uppercase tracking-widest text-gray-600 mb-1" style={IS}>{label}</p>
                      <p className="text-sm font-medium" style={{ fontFamily: mono ? "monospace" : "system-ui,sans-serif", color }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Held employees warning */}
                {holds.length > 0 && (
                  <div className="rounded-lg p-4" style={{ backgroundColor: "#1f0f0f", border: "1px solid #3a1515" }}>
                    <p className="text-xs text-red-400 mb-1" style={IS}>⚠ {holds.length} employee{holds.length > 1 ? "s" : ""} on hold</p>
                    <p className="text-xs text-gray-500" style={IS}>
                      {EMPLOYEES.filter(e => holds.includes(e.id)).map(e => e.name).join(", ")} will not receive payment in this run.
                    </p>
                  </div>
                )}

                {/* Per-employee breakdown */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-3" style={IS}>Breakdown by Employee</p>
                  <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #1e1e1e" }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid #1e1e1e" }}>
                          {["Employee", "Gross", "Tax", "Benefits", "Net", ""].map(h => (
                            <th key={h} className="px-4 py-2.5 text-left font-normal text-gray-600" style={{ fontFamily: "system-ui,sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {activeEmployees.map((emp, i) => {
                          const { grossPay, netPay, taxAmt, benefits } = getEmployeePayroll(emp);
                          const isHeld = holds.includes(emp.id);
                          return (
                            <tr key={emp.id} style={{ borderBottom: i < activeEmployees.length - 1 ? "1px solid #141414" : "none", backgroundColor: "#0d0d0d", opacity: isHeld ? 0.4 : 1 }}>
                              <td className="px-4 py-2.5">
                                <div className="flex items-center gap-2">
                                  <Avatar emp={emp} size={24} />
                                  <span className="text-gray-200 text-xs" style={IS}>{emp.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-2.5 text-gray-300 text-xs" style={{ fontFamily: "monospace" }}>{fmt(grossPay)}</td>
                              <td className="px-4 py-2.5 text-yellow-400 text-xs" style={{ fontFamily: "monospace" }}>-{fmt(taxAmt)}</td>
                              <td className="px-4 py-2.5 text-xs" style={{ fontFamily: "monospace", color: "#888" }}>-{fmt(benefits)}</td>
                              <td className="px-4 py-2.5 text-xs font-medium" style={{ fontFamily: "monospace", color: "#5af07a" }}>{fmt(netPay)}</td>
                              <td className="px-4 py-2.5">
                                {isHeld && <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#1f0f0f", color: "#f05a5a", fontFamily: "system-ui,sans-serif" }}>Hold</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="px-6 py-10 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: "#0f1f0f", border: "1px solid #2a4a2a" }}>✅</div>
                <div>
                  <h3 className="text-xl font-normal text-white mb-1">Payroll Scheduled</h3>
                  <p className="text-gray-400 text-sm" style={IS}>
                    Payroll run <strong className="text-white">PR-2026-05</strong> has been created for <strong className="text-white">{period}</strong>.
                  </p>
                  <p className="text-gray-500 text-sm mt-1" style={IS}>
                    {eligibleEmployees.length} employees · Pay date {payDate}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-2">
                  {[
                    ["Total Gross", fmt(totalGross), "#fff"],
                    ["Net Payout", fmt(totalNet), "#5af07a"]
                  ].map(([l, v, c]) => (
                    <div key={l} className="rounded-lg p-3 text-center" style={{ backgroundColor: "#111", border: "1px solid #1e1e1e" }}>
                      <p className="text-xs text-gray-600 mb-1" style={IS}>{l}</p>
                      <p className="text-sm font-medium" style={{ fontFamily: "monospace", color: c }}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ borderTop: "1px solid #1e1e1e" }}>
            {step === 3 ? (
              <button onClick={onConfirm} className="w-full py-2.5 rounded text-sm font-medium bg-white text-black hover:opacity-80" style={IS}>
                Done
              </button>
            ) : (
              <>
                <button onClick={step === 1 ? onClose : () => setStep(s => s - 1)} className="px-4 py-2 rounded text-sm hover:opacity-80" style={{ ...IS, backgroundColor: "#111", color: "#aaa", border: "1px solid #2a2a2a" }}>
                  {step === 1 ? "Cancel" : "← Back"}
                </button>
                <button onClick={() => setStep(s => s + 1)} className="px-5 py-2 rounded text-sm font-medium bg-white text-black hover:opacity-80" style={IS}>
                  {step === 1 ? "Review →" : "Confirm & Schedule"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default RunPayrollModal;