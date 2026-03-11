import React from "react";
import { gross, fmt, Avatar } from "../../../data/compData";

export default function TaxDeductionsSection({ employees }) {

  const calcEmployee = (emp) => {
    const g = Number(gross(emp) || 0);

    const ss  = g * 0.062;
    const med = g * 0.0145;
    const fed = g * (emp.tax / 100) - ss - med;

    const ben =
      emp.benefits /
      (emp.payFreq === "Monthly"
        ? 12
        : emp.payFreq === "Semi-monthly"
        ? 24
        : 26);

    const net = g - fed - ss - med - ben;

    return { g, ss, med, fed, ben, net };
  };

  const totals = employees.reduce(
    (acc, emp) => {
      const { g, ss, med, fed, ben, net } = calcEmployee(emp);

      acc.gross += g;
      acc.ss += ss;
      acc.med += med;
      acc.fed += fed;
      acc.ben += ben;
      acc.net += net;

      return acc;
    },
    { gross: 0, ss: 0, med: 0, fed: 0, ben: 0, net: 0 }
  );

  return (
    <div className="grid grid-cols-3 gap-6">

      {/* LEFT TABLE */}
      <div className="col-span-2 space-y-5">
        <div
          className="rounded-lg p-5"
          style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}
        >
          <h3 className="text-sm font-normal text-white mb-5">
            Tax & Deductions by Employee
          </h3>

          <div
            className="rounded-lg overflow-hidden"
            style={{ border: "1px solid #1e1e1e" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    backgroundColor: "#0a0a0a",
                    borderBottom: "1px solid #1e1e1e",
                  }}
                >
                  {[
                    "Employee",
                    "Gross/Period",
                    "Fed. Tax",
                    "Soc. Sec.",
                    "Medicare",
                    "Benefits",
                    "Net/Period",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left font-normal text-gray-600"
                      style={{
                        fontFamily: "system-ui,sans-serif",
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {employees.map((emp, i) => {
                  const { g, ss, med, fed, ben, net } = calcEmployee(emp);

                  return (
                    <tr
                      key={emp.id}
                      style={{
                        borderBottom:
                          i < employees.length - 1
                            ? "1px solid #141414"
                            : "none",
                        backgroundColor: "#0d0d0d",
                      }}
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <Avatar emp={emp} size={24} />
                          <span
                            className="text-gray-200 text-xs"
                            style={{ fontFamily: "system-ui,sans-serif" }}
                          >
                            {emp.name}
                          </span>
                        </div>
                      </td>

                      <td
                        className="px-4 py-2.5 text-gray-300 text-xs"
                        style={{ fontFamily: "monospace" }}
                      >
                        {fmt(g)}
                      </td>

                      <td
                        className="px-4 py-2.5 text-xs"
                        style={{ fontFamily: "monospace", color: "#f0c85a" }}
                      >
                        {fmt(fed)}
                      </td>

                      <td
                        className="px-4 py-2.5 text-xs"
                        style={{ fontFamily: "monospace", color: "#f0c85a" }}
                      >
                        {fmt(ss)}
                      </td>

                      <td
                        className="px-4 py-2.5 text-xs"
                        style={{ fontFamily: "monospace", color: "#f0c85a" }}
                      >
                        {fmt(med)}
                      </td>

                      <td
                        className="px-4 py-2.5 text-xs"
                        style={{ fontFamily: "monospace", color: "#888" }}
                      >
                        {fmt(ben)}
                      </td>

                      <td
                        className="px-4 py-2.5 text-xs font-medium"
                        style={{ fontFamily: "monospace", color: "#5af07a" }}
                      >
                        {fmt(net)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT SUMMARY */}
      <div className="space-y-5">
        <div
          className="rounded-lg p-5"
          style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}
        >
          <h3 className="text-sm font-normal text-white mb-4">
            Company Tax Summary · Per Period
          </h3>

          {[
            { label: "Total Gross", value: fmt(totals.gross), color: "#fff" },
            { label: "Federal Tax", value: fmt(totals.fed), color: "#f0c85a" },
            { label: "Social Security", value: fmt(totals.ss), color: "#f0c85a" },
            { label: "Medicare", value: fmt(totals.med), color: "#f0c85a" },
            { label: "Benefits", value: fmt(totals.ben), color: "#888" },
            { label: "Total Net", value: fmt(totals.net), color: "#5af07a" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="flex justify-between py-2.5"
              style={{ borderBottom: "1px solid #1a1a1a" }}
            >
              <span
                className="text-gray-500 text-sm"
                style={{ fontFamily: "system-ui,sans-serif" }}
              >
                {label}
              </span>
              <span
                className="text-sm"
                style={{ fontFamily: "monospace", color }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: "#0a0a0a", border: "1px solid #1e1e1e" }}
        >
          <p
            className="text-xs text-gray-600"
            style={{ fontFamily: "system-ui,sans-serif" }}
          >
            📋 Tax rates are estimates based on employee-set withholding.
            Actual amounts may vary by jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
}