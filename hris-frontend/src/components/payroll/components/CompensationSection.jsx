import React from "react";
import { Avatar, fmt } from "../../../data/compData";

export default function CompensationSection({
  employees,
  onEdit,
  onPayslip,
  getCutoffAdj,
  runs
}) {

  const lastRun = runs.find(r => r.status === "Processed");

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #1e1e1e" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid #1e1e1e" }}>
            {[
              "Employee",
              "Department",
              "Pay Frequency",
              "Annual Salary",
              "Status",
              ""
            ].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left font-normal text-gray-600"
                style={{
                  fontFamily: "system-ui,sans-serif",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {employees.map((emp, i) => {
            const cutoff = getCutoffAdj(emp.id);
            const hasAdjustments =
              cutoff?.adjustments?.length > 0 ||
              cutoff?.proratedSalary !== null;

            return (
              <tr
                key={emp.id}
                style={{
                  borderBottom:
                    i < employees.length - 1 ? "1px solid #141414" : "none",
                  backgroundColor: "#0d0d0d",
                }}
              >
                {/* Employee */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar emp={emp} size={28} />
                    <div>
                      <p className="text-gray-200 text-sm">{emp.name}</p>
                      <p className="text-gray-600 text-xs">{emp.role}</p>
                    </div>
                  </div>
                </td>

                {/* Dept */}
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {emp.dept}
                </td>

                {/* Pay Frequency */}
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {emp.payFreq}
                </td>

                {/* Salary */}
                <td
                  className="px-4 py-3 text-gray-200 text-sm"
                  style={{ fontFamily: "monospace" }}
                >
                  {fmt(emp.salaryNumeric)}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        emp.status === "Active" ? "#0f1f0f" : "#1f0f0f",
                      color:
                        emp.status === "Active" ? "#5af07a" : "#f05a5a",
                    }}
                  >
                    {emp.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex gap-2">

                    <button
                      onClick={() => onPayslip(emp, lastRun)}
                      className="text-xs px-2 py-1 rounded hover:opacity-80"
                      style={{
                        backgroundColor: "#111",
                        border: "1px solid #2a2a2a",
                        color: "#aaa",
                        fontFamily: "system-ui,sans-serif"
                      }}
                    >
                      Payslip
                    </button>

                    <button
                      onClick={() => onEdit(emp)}
                      className="text-xs px-2 py-1 rounded hover:opacity-80"
                      style={{
                        backgroundColor: hasAdjustments ? "#1a3a1a" : "#111",
                        border: "1px solid #2a2a2a",
                        color: hasAdjustments ? "#5af07a" : "#aaa",
                        fontFamily: "system-ui,sans-serif"
                      }}
                    >
                      Adjust
                    </button>

                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}