import { useState } from "react";

import OverviewTab from "./OverviewTab";
import EmployeeCompensationTab from "./EmployeeCompensationTab";
import LeaveTab from "./LeaveTab";
import OTUTTab from "./OtUtTab";
import DocumentsTab from "./DocumentsTab";
import ActivityTab from "./ActivityTab";

// ── PROFILE PAGE ──────────────────────────────────────────────────────────────
export default function ProfilePage({
  emp,
  onBack,
  onEdit,
  onUpdateEmp,
  empComp,
  onUpdateComp,
  basicPaySets,
  contributionSets,
  benefitsSets,
  gc,
  SS,
  BADGE,
}) {
  const { bg, fg } = emp && emp.role && emp.department_id ? gc(emp.id) : { bg: "#111", fg: "#fff" };
  const [showEmpty, setShowEmpty] = useState(false);
  const TABS = [
    "Overview",
    "Compensation",
    "Leave",
    "OT / UT",
    "Documents",
    "Activity",
  ];
  const [tab, setTab] = useState("Overview");

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#000" }}>
      <div className="px-8 pt-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-white text-sm"
            style={{ fontFamily: "system-ui,sans-serif" }}
          >
            ← Back to Directory
          </button>
          <button
            onClick={() => setShowEmpty((e) => !e)}
            className="text-xs px-3 py-1.5 rounded transition-all"
            style={{
              fontFamily: "system-ui,sans-serif",
              backgroundColor: showEmpty ? "#fff" : "#111",
              color: showEmpty ? "#000" : "#666",
              border: showEmpty ? "none" : "1px solid #2a2a2a",
            }}
          >
            {showEmpty ? "Preview: Empty state ON" : "Preview: Empty state OFF"}
          </button>
        </div>

        <div
          className="flex items-end justify-between pb-6"
          style={{ borderBottom: "1px solid #222" }}
        >
          <div className="flex items-center gap-5">
            <div
              className="rounded-full flex items-center justify-center font-bold"
              style={{
                width: 72,
                height: 72,
                backgroundColor: bg,
                color: fg,
                fontFamily: "system-ui,sans-serif",
                fontSize: 22,
              }}
            >
              {emp.avatar}
            </div>
            <div>
              <h1
                className="text-3xl font-normal text-white mb-1"
                style={{ letterSpacing: "-0.02em" }}
              >
                {emp.name}
              </h1>
              <div className="flex items-center gap-3">
                <span
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: "system-ui,sans-serif" }}
                >
                  {emp.role} · {emp.dept}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    fontFamily: "system-ui,sans-serif",
                    ...SS[emp.status],
                  }}
                >
                  {emp.status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className="px-4 py-2 rounded text-sm hover:opacity-80 flex items-center gap-2"
              style={{
                fontFamily: "system-ui,sans-serif",
                backgroundColor: "#111",
                color: "#aaa",
                border: "1px solid #2a2a2a",
              }}
            >
              ✏️ Edit Profile
            </button>
            <button
              className="px-4 py-2 rounded text-sm bg-white text-black hover:opacity-80"
              style={{ fontFamily: "system-ui,sans-serif" }}
            >
              📧 Send Message
            </button>
          </div>
        </div>

        <div className="flex gap-1 mt-4">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 text-sm transition-all"
              style={{
                fontFamily: "system-ui,sans-serif",
                color: tab === t ? "#fff" : "#555",
                borderBottom:
                  tab === t ? "2px solid #fff" : "2px solid transparent",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-6">
       {tab === "Overview" && <OverviewTab emp={emp} />}
        {tab === "Compensation" && (
          <EmployeeCompensationTab
            emp={emp}
            onUpdateEmp={onUpdateEmp}
            empComp={empComp}
            onUpdateComp={onUpdateComp}
            basicPaySets={basicPaySets}
            contributionSets={contributionSets}
            benefitsSets={benefitsSets}
          />
        )}
        {tab === "Leave" && <LeaveTab emptyState={showEmpty} BADGE={BADGE} />}
        {tab === "OT / UT" && <OTUTTab emptyState={showEmpty} BADGE={BADGE} />}
        {tab === "Documents" && <DocumentsTab />}
        {tab === "Activity" && <ActivityTab />}
      </div>
    </div>
  );
}
