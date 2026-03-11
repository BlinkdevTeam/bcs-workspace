import React from "react";
import {
  EMPLOYEES,
  LEAVE_BALANCES,
  ATTENDANCE_STYLE,
  fmt,
  Avatar,
} from "../../../data/compData";

export default function OverviewTab({
  attendance,
  leaveRequests,
  otRecords,
  onApprove,
  onReject,
}) {
  const counts = {
    Present: attendance.filter((a) => a.status === "Present").length,
    Remote: attendance.filter((a) => a.status === "Remote").length,
    Late: attendance.filter((a) => a.status === "Late").length,
    Absent: attendance.filter((a) => a.status === "Absent").length,
    "On Leave": attendance.filter((a) => a.status === "On Leave").length,
  };

  const pending = leaveRequests.filter((r) => r.status === "Pending");
  const otPending = otRecords.filter((r) => r.status === "Pending");
  const otFlagged = otRecords.filter((r) => r.status === "Flagged");
  const totalOTHrs = otRecords
    .filter((r) => r.type === "OT" && r.status === "Approved")
    .reduce((s, r) => s + r.hours, 0);
  const totalUTHrs = otRecords
    .filter((r) => r.type === "UT")
    .reduce((s, r) => s + r.hours, 0);

  return (
    <div className="space-y-6">
      {/* Stat row */}
      <div className="grid grid-cols-5 gap-4">
        {Object.entries(counts).map(([status, count]) => (
          <div
            key={status}
            className="rounded-lg p-4 flex flex-col gap-2"
            style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: ATTENDANCE_STYLE[status].dot }}
              />
              <span
                className="text-xs text-gray-500 uppercase tracking-widest"
                style={{ fontFamily: "system-ui,sans-serif" }}
              >
                {status}
              </span>
            </div>
            <p
              className="text-3xl font-light"
              style={{
                fontFamily: "monospace",
                color: ATTENDANCE_STYLE[status].color,
              }}
            >
              {count}
            </p>
            <p
              className="text-xs text-gray-600"
              style={{ fontFamily: "system-ui,sans-serif" }}
            >
              of {EMPLOYEES.length} employees
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Pending leave requests */}
        <div
          className="col-span-2 rounded-lg p-5"
          style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-normal text-white">
              Pending Leave Requests
            </h3>
            {pending.length > 0 && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  fontFamily: "monospace",
                  backgroundColor: "#1f1a0f",
                  color: "#f0c85a",
                }}
              >
                {pending.length} pending
              </span>
            )}
          </div>
          {pending.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2">
              <span className="text-3xl">✅</span>
              <p
                className="text-gray-500 text-sm"
                style={{ fontFamily: "system-ui,sans-serif" }}
              >
                All caught up — no pending requests
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {pending.map((req) => {
                const emp = EMPLOYEES.find((e) => e.id === req.empId);
                return (
                  <div
                    key={req.id}
                    className="flex items-center justify-between px-4 py-3 rounded-lg"
                    style={{
                      backgroundColor: "#111",
                      border: "1px solid #1e3a1e",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {emp && <Avatar emp={emp} size={30} />}
                      <div>
                        <p
                          className="text-sm text-white"
                          style={{ fontFamily: "system-ui,sans-serif" }}
                        >
                          {emp?.name}
                        </p>
                        <p
                          className="text-xs text-gray-500"
                          style={{ fontFamily: "system-ui,sans-serif" }}
                        >
                          {req.type} · {req.from}
                          {req.days > 1 ? ` → ${req.to}` : ""} · {req.days}d
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs text-gray-600 mr-2"
                        style={{ fontFamily: "system-ui,sans-serif" }}
                      >
                        Applied {req.appliedOn}
                      </span>
                      <button
                        onClick={() => onApprove(req.id)}
                        className="px-3 py-1.5 rounded text-xs font-medium hover:opacity-80"
                        style={{
                          fontFamily: "system-ui,sans-serif",
                          backgroundColor: "#0f2a0f",
                          color: "#5af07a",
                          border: "1px solid #2a4a2a",
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onReject(req.id)}
                        className="px-3 py-1.5 rounded text-xs hover:opacity-80"
                        style={{
                          fontFamily: "system-ui,sans-serif",
                          backgroundColor: "#1a1a1a",
                          color: "#aaa",
                          border: "1px solid #2a2a2a",
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* OT/UT summary + flags */}
        <div className="space-y-4">
          <div
            className="rounded-lg p-5"
            style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}
          >
            <h3 className="text-sm font-normal text-white mb-4">
              OT / UT · This Month
            </h3>
            <div className="space-y-3">
              {[
                ["Total OT Hours", `${fmt(totalOTHrs)} hrs`, "#5af07a"],
                ["Total UT Hours", `${fmt(totalUTHrs)} hrs`, "#f05a5a"],
                ["OT Pending", `${otPending.length} requests`, "#f0c85a"],
                ["UT Flagged", `${otFlagged.length} employees`, "#f05a5a"],
              ].map(([l, v, c]) => (
                <div
                  key={l}
                  className="flex justify-between py-2"
                  style={{ borderBottom: "1px solid #1a1a1a" }}
                >
                  <span
                    className="text-gray-500 text-sm"
                    style={{ fontFamily: "system-ui,sans-serif" }}
                  >
                    {l}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: "monospace", color: c }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Low balance warnings */}
          <div
            className="rounded-lg p-5"
            style={{ backgroundColor: "#1f0a0a", border: "1px solid #3a1515" }}
          >
            <h3 className="text-sm font-normal text-white mb-3">
              ⚠ Low Leave Balance
            </h3>
            {LEAVE_BALANCES.filter(
              (b) => b.annual.total - b.annual.used <= 2,
            ).map((b) => {
              const emp = EMPLOYEES.find((e) => e.id === b.empId);
              return (
                <div
                  key={b.empId}
                  className="flex items-center justify-between py-2"
                  style={{ borderBottom: "1px solid #2a1515" }}
                >
                  <div className="flex items-center gap-2">
                    {emp && <Avatar emp={emp} size={24} />}
                    <span
                      className="text-xs text-gray-300"
                      style={{ fontFamily: "system-ui,sans-serif" }}
                    >
                      {emp?.name}
                    </span>
                  </div>
                  <span
                    className="text-xs"
                    style={{ fontFamily: "monospace", color: "#f05a5a" }}
                  >
                    {b.annual.total - b.annual.used}d left
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
