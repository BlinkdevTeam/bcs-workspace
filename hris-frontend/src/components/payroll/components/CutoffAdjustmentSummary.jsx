import React from "react";
import { Avatar, fmt } from "../../../data/compData";

export default function CutoffAdjustmentSummary({
  employees,
  cutoffAdjs,
  onEdit,
  onClear
}) {

  const adjustedEmployees = employees.filter(e => {
    const ca = cutoffAdjs[e.id];
    return (
      ca &&
      (
        (ca.adjustments && ca.adjustments.length > 0) ||
        (ca.proratedSalary !== null && ca.proratedSalary !== undefined)
      )
    );
  });

  if (!adjustedEmployees.length) return null;

  return (
    <div
      className="mt-5 rounded-lg p-5"
      style={{ backgroundColor: "#0a1a0a", border: "1px solid #1e3a1e" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-normal text-white">
            Pending Cutoff Adjustments
          </h3>
          <p
            className="text-xs text-gray-600 mt-0.5"
            style={{ fontFamily: "system-ui,sans-serif" }}
          >
            These one-time items will be included in the next payroll run.
          </p>
        </div>

        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            fontFamily: "monospace",
            backgroundColor: "#0f2a0f",
            color: "#5af07a",
          }}
        >
          {adjustedEmployees.length} employee
          {adjustedEmployees.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-2">
        {adjustedEmployees.map(emp => {
          const ca = cutoffAdjs[emp.id] || {
            proratedSalary: null,
            adjustments: []
          };

          const bonuses = ca.adjustments.filter(a => a.type === "bonus");
          const deducts = ca.adjustments.filter(a => a.type === "deduction");

          const totalBonus = bonuses.reduce(
            (s, a) => s + Number(a.amount || 0),
            0
          );

          const totalDeduct = deducts.reduce(
            (s, a) => s + Number(a.amount || 0),
            0
          );

          return (
            <div
              key={emp.id}
              className="flex items-center justify-between px-4 py-3 rounded"
              style={{
                backgroundColor: "#111",
                border: "1px solid #1e3a1e",
              }}
            >
              <div className="flex items-center gap-3">
                <Avatar emp={emp} size={28} />
                <div>
                  <p
                    className="text-sm text-gray-200"
                    style={{ fontFamily: "system-ui,sans-serif" }}
                  >
                    {emp.name}
                  </p>

                  <p
                    className="text-xs text-gray-600"
                    style={{ fontFamily: "system-ui,sans-serif" }}
                  >
                    {ca.proratedSalary != null ? "Prorated · " : ""}
                    {bonuses.length
                      ? `${bonuses.length} bonus${bonuses.length > 1 ? "es" : ""}`
                      : ""}
                    {bonuses.length && deducts.length ? ", " : ""}
                    {deducts.length
                      ? `${deducts.length} deduction${deducts.length > 1 ? "s" : ""}`
                      : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {totalBonus > 0 && (
                  <span
                    className="text-xs"
                    style={{ fontFamily: "monospace", color: "#5af07a" }}
                  >
                    +{fmt(totalBonus)}
                  </span>
                )}

                {totalDeduct > 0 && (
                  <span
                    className="text-xs"
                    style={{ fontFamily: "monospace", color: "#f05a5a" }}
                  >
                    -{fmt(totalDeduct)}
                  </span>
                )}

                <button
                  onClick={() => onEdit(emp)}
                  className="text-xs px-2 py-1 rounded hover:opacity-80"
                  style={{
                    fontFamily: "system-ui,sans-serif",
                    backgroundColor: "#1a3a1a",
                    color: "#5af07a",
                    border: "1px solid #2a4a2a",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => onClear(emp)}
                  className="text-xs px-2 py-1 rounded hover:opacity-80 text-gray-600 hover:text-red-400"
                  style={{
                    fontFamily: "system-ui,sans-serif",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}