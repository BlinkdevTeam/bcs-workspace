import { useState } from "react";

// ── OVERVIEW TAB ──────────────────────────────────────────────────────────────
export default function OverviewTab({ emp }) {
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