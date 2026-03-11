// OverviewSection.jsx
import React, { useMemo } from "react";
import { Avatar, fmt, periodsPerYear } from '../../../data/compData';

export default function OverviewSection({ employees, runs, totalPayroll }) {
  const nextRun = runs.find(r => r.status === "Scheduled");
  const lastRun = runs.find(r => r.status === "Processed");

  // Department breakdown
  const deptData = useMemo(() => {
    return Object.entries(
      employees.reduce((acc, e) => {
        if (!acc[e.dept]) acc[e.dept] = { total: 0, count: 0 };
        const annualSalary = e.salaryNumeric * periodsPerYear(e.payFreq);
        acc[e.dept].total += annualSalary;
        acc[e.dept].count += 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1].total - a[1].total);
  }, [employees]);

  // Pay frequency counts
  const payFreqs = ["Bi-weekly", "Monthly", "Semi-monthly"].map(freq => ({
    freq,
    count: employees.filter(e => e.payFreq === freq).length
  }));

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left: Dept Breakdown */}
      <div className="col-span-2 rounded-lg p-5" style={{backgroundColor:"#0d0d0d", border:"1px solid #1e1e1e"}}>
        <h3 className="text-sm font-normal text-white mb-5">Payroll by Department</h3>
        <div className="space-y-4">
          {deptData.map(([dept, { total, count }]) => (
            <div key={dept}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-gray-200 text-sm">{dept}</span>
                  <span className="text-gray-600 text-xs">{count} employee{count > 1 ? "s" : ""}</span>
                </div>
                <span className="text-gray-300 text-sm">{fmt(total)}</span>
              </div>
              <div className="h-2 rounded-full" style={{ backgroundColor: "#1e1e1e" }}>
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${(total / totalPayroll) * 100}%`, opacity: 0.7 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Recent runs & Pay frequency */}
      <div className="space-y-5">
        <div className="rounded-lg p-5" style={{backgroundColor:"#0d0d0d", border:"1px solid #1e1e1e"}}>
          <h3 className="text-sm font-normal text-white mb-4">Recent Runs</h3>
          <div className="space-y-3">
            {runs.slice(0,4).map(r => (
              <div key={r.id} className="flex items-center justify-between py-2" style={{borderBottom:"1px solid #1a1a1a"}}>
                <div>
                  <p className="text-gray-200 text-xs">{r.period}</p>
                  <p className="text-gray-600 text-xs">{r.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-300 text-xs">{fmt(r.total)}</p>
                  <span className="text-xs px-1.5 py-0.5 rounded-full" style={{backgroundColor:"#0f1f0f",color:"#5af07a"}}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg p-5" style={{backgroundColor:"#0d0d0d", border:"1px solid #1e1e1e"}}>
          <h3 className="text-sm font-normal text-white mb-4">Pay Frequency</h3>
          {payFreqs.map(p => (
            <div key={p.freq} className="flex justify-between py-2" style={{borderBottom:"1px solid #1a1a1a"}}>
              <span className="text-gray-400 text-sm">{p.freq}</span>
              <span className="text-gray-300 text-sm">{p.count} emp.</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}