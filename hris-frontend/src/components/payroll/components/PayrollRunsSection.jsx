// PayrollRunsSection.jsx
import React from "react";
import { fmt } from '../../../data/compData';

const BADGE = {
  Processed: {bg:"#0f1f0f",color:"#5af07a"},
  Scheduled: {bg:"#0a1a2a",color:"#5a9af0"},
  Draft:     {bg:"#1a1a0a",color:"#f0c85a"},
  On_Hold:   {bg:"#1f0f0f",color:"#f05a5a"},
};

export default function PayrollRunsSection({ runs, onNewRun }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-normal text-white">All Payroll Runs</h3>
        <button
          onClick={onNewRun}
          className="px-3 py-1.5 rounded text-xs bg-white text-black hover:opacity-80"
          style={{ fontFamily: "system-ui,sans-serif" }}
        >
          ▶ New Run
        </button>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #1e1e1e" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid #1e1e1e" }}>
              {["Run ID","Period","Pay Date","Type","Headcount","Total Payout","Status",""].map(h => (
                <th
                  key={h}
                  className="px-4 py-3 text-left font-normal text-gray-600"
                  style={{ fontFamily: "system-ui,sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {runs.map((r, i) => (
              <tr
                key={r.id}
                className="group transition-colors"
                style={{ borderBottom: "1px solid #141414", backgroundColor: "#0d0d0d" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#111"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#0d0d0d"}
              >
                <td className="px-4 py-3 text-gray-400 text-xs" style={{ fontFamily: "monospace" }}>{r.id}</td>
                <td className="px-4 py-3 text-gray-200 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>{r.period}</td>
                <td className="px-4 py-3 text-gray-400 text-xs" style={{ fontFamily: "monospace" }}>{r.payDate}</td>
                <td className="px-4 py-3 text-gray-500 text-xs" style={{ fontFamily: "system-ui,sans-serif" }}>{r.type}</td>
                <td className="px-4 py-3 text-gray-400 text-xs" style={{ fontFamily: "monospace" }}>{r.headcount}</td>
                <td className="px-4 py-3 text-gray-200 text-sm" style={{ fontFamily: "monospace" }}>{fmt(r.total)}</td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ fontFamily: "system-ui,sans-serif", ...BADGE[r.status] }}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs px-2 py-1 rounded hover:opacity-80" style={{ backgroundColor: "#111", color: "#aaa", border: "1px solid #2a2a2a", fontFamily:"system-ui,sans-serif" }}>View</button>
                    <button className="text-xs px-2 py-1 rounded hover:opacity-80" style={{ backgroundColor: "#111", color: "#aaa", border: "1px solid #2a2a2a", fontFamily:"system-ui,sans-serif" }}>↓</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}