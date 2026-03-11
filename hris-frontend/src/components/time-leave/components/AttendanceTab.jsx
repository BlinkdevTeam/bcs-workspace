import { useState, useMemo } from "react";
import TimeCorrectionModal from "./TimeCorrectionModal";

import {
  EMPLOYEES,
  DEPTS,
  ATTENDANCE_STYLE,
  breakFlags,
  breakMinutes,
  breakDurLabel,
  Avatar,
  BREAK_WINDOW_START,
} from "../../../data/compData";

export default function AttendanceTab({ attendance, onCorrect }) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [breakFilter, setBreakFilter] = useState("All"); // "All" | "Flagged"
  const [correcting, setCorrecting] = useState(null);

  const filtered = useMemo(() => {
    return EMPLOYEES.filter((emp) => {
      const q = search.toLowerCase();
      const a = attendance.find((a) => a.empId === emp.id);
      const flags = breakFlags(a?.breakOut, a?.breakIn);
      return (
        (!q ||
          emp.name.toLowerCase().includes(q) ||
          emp.role.toLowerCase().includes(q)) &&
        (deptFilter === "All" || emp.dept === deptFilter) &&
        (statusFilter === "All" || a?.status === statusFilter) &&
        (breakFilter === "All" || flags.length > 0)
      );
    });
  }, [search, deptFilter, statusFilter, breakFilter, attendance]);

  const flaggedCount = attendance.filter(
    (a) => breakFlags(a.breakOut, a.breakIn).length > 0,
  ).length;

  return (
    <>
      <div className="space-y-5">
        {/* Break flags banner */}
        {flaggedCount > 0 && (
          <div
            className="rounded-lg px-5 py-3 flex items-center justify-between"
            style={{ backgroundColor: "#1a0f0a", border: "1px solid #3a2010" }}
          >
            <div className="flex items-center gap-3">
              <span style={{ color: "#f0c85a" }}>⚠</span>
              <p
                className="text-sm"
                style={{ fontFamily: "system-ui,sans-serif", color: "#f0c85a" }}
              >
                {flaggedCount} employee{flaggedCount > 1 ? "s" : ""} with break
                violations pending review
              </p>
            </div>
            <button
              onClick={() =>
                setBreakFilter((f) => (f === "Flagged" ? "All" : "Flagged"))
              }
              className="text-xs px-3 py-1.5 rounded hover:opacity-80 transition-all"
              style={{
                fontFamily: "system-ui,sans-serif",
                backgroundColor: breakFilter === "Flagged" ? "#f0c85a" : "#111",
                color: breakFilter === "Flagged" ? "#000" : "#f0c85a",
                border: "1px solid #3a2010",
              }}
            >
              {breakFilter === "Flagged" ? "Show All" : "Show Flagged"}
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              🔍
            </span>
            <input
              className="w-full pl-9 pr-4 py-2 rounded text-sm text-white placeholder-gray-600 outline-none"
              style={{
                fontFamily: "system-ui,sans-serif",
                backgroundColor: "#111",
                border: "1px solid #2a2a2a",
              }}
              placeholder="Search employee…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 rounded text-sm text-gray-300 outline-none"
            style={{
              fontFamily: "system-ui,sans-serif",
              backgroundColor: "#111",
              border: "1px solid #2a2a2a",
            }}
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            {DEPTS.map((d) => (
              <option key={d}>{d === "All" ? "All Departments" : d}</option>
            ))}
          </select>
          <select
            className="px-3 py-2 rounded text-sm text-gray-300 outline-none"
            style={{
              fontFamily: "system-ui,sans-serif",
              backgroundColor: "#111",
              border: "1px solid #2a2a2a",
            }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {["All", "Present", "Remote", "Late", "Absent", "On Leave"].map(
              (s) => (
                <option key={s}>{s === "All" ? "All Statuses" : s}</option>
              ),
            )}
          </select>
          <div className="flex-1" />
          <span
            className="text-gray-600 text-sm"
            style={{ fontFamily: "monospace" }}
          >
            {filtered.length} of {EMPLOYEES.length}
          </span>
        </div>

        {/* Table */}
        <div
          className="rounded-lg overflow-x-auto"
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
                  "Dept",
                  "Status",
                  "Time In",
                  "Break Out",
                  "Break In",
                  "Break Dur.",
                  "Time Out",
                  "Net Hours",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-3 text-left font-normal text-gray-600 whitespace-nowrap"
                    style={{
                      fontFamily: "system-ui,sans-serif",
                      fontSize: 10,
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
              {filtered.map((emp, i) => {
                const a = attendance.find((a) => a.empId === emp.id);
                const st =
                  ATTENDANCE_STYLE[a?.status] || ATTENDANCE_STYLE.Absent;
                const flags = breakFlags(a?.breakOut, a?.breakIn);
                const dur = breakMinutes(a?.breakOut, a?.breakIn);
                const hasFlag = flags.length > 0;

                return (
                  <tr
                    key={emp.id}
                    className="group"
                    style={{
                      borderBottom:
                        i < filtered.length - 1 ? "1px solid #141414" : "none",
                      backgroundColor: hasFlag ? "#120d08" : "#0d0d0d",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = hasFlag
                        ? "#1a1208"
                        : "#111")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = hasFlag
                        ? "#120d08"
                        : "#0d0d0d")
                    }
                  >
                    {/* Employee */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar emp={emp} size={28} />
                        <div>
                          <p
                            className="text-white text-sm"
                            style={{ fontFamily: "system-ui,sans-serif" }}
                          >
                            {emp.name}
                          </p>
                          <p
                            className="text-gray-600 text-xs"
                            style={{ fontFamily: "system-ui,sans-serif" }}
                          >
                            {emp.role}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Dept */}
                    <td
                      className="px-3 py-3 text-gray-500 text-xs"
                      style={{ fontFamily: "system-ui,sans-serif" }}
                    >
                      {emp.dept}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: st.dot }}
                        />
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap"
                          style={{
                            fontFamily: "system-ui,sans-serif",
                            backgroundColor: st.bg,
                            color: st.color,
                          }}
                        >
                          {a?.status || "—"}
                        </span>
                        {a?.correctedAt && (
                          <span
                            className="text-gray-600 text-xs"
                            title="Corrected"
                          >
                            ✎
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Time In */}
                    <td
                      className="px-3 py-3 text-gray-300 text-xs whitespace-nowrap"
                      style={{ fontFamily: "monospace" }}
                    >
                      {a?.timeIn || "—"}
                    </td>

                    {/* Break Out */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span
                          className="text-xs"
                          style={{
                            fontFamily: "monospace",
                            color: flags.includes("early") ? "#f0c85a" : "#888",
                          }}
                        >
                          {a?.breakOut || "—"}
                        </span>
                        {flags.includes("early") && (
                          <span
                            title="Before 12PM"
                            style={{ fontSize: 10, color: "#f0c85a" }}
                          >
                            ⚠
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Break In */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span
                          className="text-xs"
                          style={{
                            fontFamily: "monospace",
                            color: flags.includes("exceeded")
                              ? "#f05a5a"
                              : "#888",
                          }}
                        >
                          {a?.breakIn || "—"}
                        </span>
                        {flags.includes("exceeded") && (
                          <span
                            title="Exceeded 1hr"
                            style={{ fontSize: 10, color: "#f05a5a" }}
                          >
                            ⚠
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Break Duration */}
                    <td className="px-3 py-3">
                      {dur !== null ? (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded whitespace-nowrap"
                          style={{
                            fontFamily: "monospace",
                            backgroundColor:
                              dur > 60
                                ? "#1f0f0f"
                                : dur === 60
                                  ? "#0f1f0f"
                                  : "#111",
                            color:
                              dur > 60
                                ? "#f05a5a"
                                : dur === 60
                                  ? "#5af07a"
                                  : "#aaa",
                          }}
                        >
                          {breakDurLabel(a?.breakOut, a?.breakIn)}
                        </span>
                      ) : (
                        <span className="text-gray-700 text-xs">—</span>
                      )}
                    </td>

                    {/* Time Out */}
                    <td
                      className="px-3 py-3 text-gray-500 text-xs whitespace-nowrap"
                      style={{ fontFamily: "monospace" }}
                    >
                      {a?.timeOut || "—"}
                    </td>

                    {/* Net Hours */}
                    <td
                      className="px-3 py-3 text-gray-500 text-xs whitespace-nowrap"
                      style={{ fontFamily: "monospace" }}
                    >
                      {a?.hours ? `${a.hours}h` : "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3">
                      <button
                        onClick={() => setCorrecting({ emp, record: a })}
                        className="text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                        style={{
                          fontFamily: "system-ui,sans-serif",
                          backgroundColor: "#111",
                          color: "#aaa",
                          border: "1px solid #2a2a2a",
                        }}
                      >
                        ✎ Correct
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {correcting && (
        <TimeCorrectionModal
          emp={correcting.emp}
          record={correcting.record}
          onClose={() => setCorrecting(false)}
          onSave={(corrected) => {
            onCorrect(correcting.emp.id, corrected);
            setCorrecting(null);
          }}
        />
      )}
    </>
  );
}
