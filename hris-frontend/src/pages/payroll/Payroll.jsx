import { React, useState, useMemo } from "react";
import RunPayrollModal from "./components/PayrollModal";
import PayrollSettingsDrawer from "./components/PayrollSettings";
import PayslipModal from "./components/PayslipModal";
import CutoffEditModal from "./components/CutoffAdjustmentModal";
import OverviewSection from "./components/OverviewSection";
import PayrollRunsSection from "./components/PayrollRunsSection";
import CompensationSection from "./components/CompensationSection";
import CutoffAdjustmentSummary from "./components/CutoffAdjustmentSummary";
import TaxDeductionsSection from "./components/TaxDeductionsSection";
import {
  DEFAULT_SETTINGS,
  EMPLOYEES,
  fmt,
  periodsPerYear,
  PAYROLL_RUNS
} from "../../data/compData";

// ── SHARED DATA ───────────────────────────────────────────────────────────────
// empType: "Regular" | "Contractual" | "Part-time" | "Custom"
// taxExempt: false | "Minimum Wage" | "DOLE Exemption" | "Treaty Exempt" | "Other"
// deductOverrides: per-deduction on/off flags for Custom type

// ── PAYROLL PAGE ──────────────────────────────────────────────────────────────
export default function Payroll() {
  const [activeNav, setActiveNav] = useState("Payroll");
  const [activeTab, setActiveTab] = useState("overview");
  const [showRunModal, setShowRunModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [editEmp, setEditEmp] = useState(null);
  const [payslipData, setPayslipData] = useState(null); // {emp, run}
  const [employees, setEmployees] = useState(EMPLOYEES);
  const [cutoffAdjs, setCutoffAdjs] = useState({}); // per-emp cutoff overrides keyed by emp.id
  const [runs, setRuns] = useState(PAYROLL_RUNS);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  // Total Annual Payroll
  const totalPayroll = EMPLOYEES.reduce((sum, emp) => {
    const annual = emp.salaryNumeric * periodsPerYear(emp.payFreq);
    return sum + annual;
  }, 0);

  // Average Salary (annualized)
  const avgSalary = EMPLOYEES.length ? totalPayroll / EMPLOYEES.length : 0;

  const nextRun = runs.find((r) => r.status === "Scheduled");
  const lastRun = runs.find((r) => r.status === "Processed");

  const DEPTS = [
    "All",
    "Engineering",
    "Sales",
    "Product",
    "Design",
    "Operations",
    "Marketing",
    "HR & Admin",
  ];

  const filtered = useMemo(
    () =>
      employees.filter((e) => {
        const q = search.toLowerCase();
        return (
          (!q ||
            e.name.toLowerCase().includes(q) ||
            e.role.toLowerCase().includes(q)) &&
          (deptFilter === "All" || e.dept === deptFilter)
        );
      }),
    [employees, search, deptFilter],
  );

  function handleSave(updated) {
    setEmployees((p) => p.map((e) => (e.id === updated.id ? updated : e)));
  }
  function getCutoffAdj(id) {
    return cutoffAdjs[id] || { proratedSalary: null, adjustments: [] };
  }

  const TABS = [
    { key: "overview", label: "Overview" },
    { key: "runs", label: "Payroll Runs" },
    { key: "employee", label: "Compensation" },
    { key: "tax", label: "Tax & Deductions" },
  ];

  return (
    <div
      className="min-h-screen text-white flex flex-col"
      style={{ fontFamily: "'Georgia',serif", backgroundColor: "#000" }}
    >
      {/* <TopNav active={activeNav} setActive={setActiveNav}/> */}

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Page header */}
        <div className="px-8 pt-8 pb-0 flex-shrink-0">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p
                className="text-gray-600 text-xs uppercase tracking-widest mb-1"
                style={{ fontFamily: "system-ui,sans-serif" }}
              >
                Payroll
              </p>
              <h1
                className="text-3xl font-normal"
                style={{ letterSpacing: "-0.02em" }}
              >
                Payroll Management
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(true)}
                className="w-10 h-10 rounded flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "#111", border: "1px solid #2a2a2a" }}
                title="Payroll Settings"
              >
                ⚙️
              </button>
              <button
                onClick={() => setShowRunModal(true)}
                className="px-5 py-2.5 rounded text-sm font-medium bg-white text-black hover:opacity-80 flex items-center gap-2"
                style={{ fontFamily: "system-ui,sans-serif" }}
              >
                ▶ Run Payroll
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total Annual Payroll",
                value: fmt(totalPayroll),
                sub: "All active employees",
                color: "#fff",
              },
              {
                label: "Avg. Salary",
                value: fmt(avgSalary),
                sub: "Across all departments",
                color: "#fff",
              },
              {
                label: "Next Pay Date",
                value: nextRun?.payDate || "—",
                sub: nextRun?.period || "",
                color: "#5a9af0",
              },
              {
                label: "Last Run",
                value: fmt(lastRun?.total || 0),
                sub: lastRun?.period || "",
                color: "#5af07a",
              },
            ].map(({ label, value, sub, color }) => (
              <div
                key={label}
                className="rounded-lg p-5"
                style={{
                  backgroundColor: "#0d0d0d",
                  border: "1px solid #1e1e1e",
                }}
              >
                <p
                  className="text-xs uppercase tracking-widest text-gray-600 mb-2"
                  style={{ fontFamily: "system-ui,sans-serif" }}
                >
                  {label}
                </p>
                <p
                  className="text-xl font-light mb-0.5"
                  style={{ fontFamily: "monospace", color }}
                >
                  {value}
                </p>
                <p
                  className="text-xs text-gray-600"
                  style={{ fontFamily: "system-ui,sans-serif" }}
                >
                  {sub}
                </p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className="px-4 py-2 text-sm transition-all"
                style={{
                  fontFamily: "system-ui,sans-serif",
                  color: activeTab === t.key ? "#fff" : "#555",
                  borderBottom:
                    activeTab === t.key
                      ? "2px solid #fff"
                      : "2px solid transparent",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <OverviewSection
              employees={employees}
              runs={runs}
              totalPayroll={totalPayroll}
            />
          )}

          {/* ── PAYROLL RUNS ── */}
          {activeTab === "runs" && (
            <PayrollRunsSection
              runs={runs}
              onNewRun={() => setShowRunModal(true)}
            />
          )}

          {/* ── COMPENSATION ── */}
          {activeTab === "employee" && (
            <CompensationSection
              employees={employees}
              runs={runs}
              getCutoffAdj={getCutoffAdj}
              onEdit={(emp) => setEditEmp(emp)}
              onPayslip={(emp, run) => setPayslipData({ emp, run })}
            />
          )}

          {/* ── CUTOFF ADJUSTMENTS SUMMARY ── */}
          {activeTab === "compensation" && (
            <>
              <CompensationSection
                employees={employees}
                runs={runs}
                getCutoffAdj={getCutoffAdj}
                onEdit={(emp) => setEditEmp(emp)}
                onPayslip={(emp, run) => setPayslipData({ emp, run })}
              />

              <CutoffAdjustmentSummary
                employees={employees}
                cutoffAdjs={cutoffAdjs}
                onEdit={(emp) => setEditEmp(emp)}
                onClear={(emp) =>
                  setCutoffAdjs((m) => ({
                    ...m,
                    [emp.id]: { proratedSalary: null, adjustments: [] },
                  }))
                }
              />
            </>
          )}

          {/* ── TAX & DEDUCTIONS ── */}
          {activeTab === "tax" && (
            <TaxDeductionsSection employees={employees} />
          )}
        </div>
      </div>

      {showRunModal && (
        <RunPayrollModal
          onClose={() => setShowRunModal(false)}
          onConfirm={() => setShowRunModal(false)}
        />
      )}
      {showSettings && (
        <PayrollSettingsDrawer
          settings={settings}
          onSave={(s) => {
            setSettings(s);
            setShowSettings(false);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
      {editEmp && (
        <CutoffEditModal
          emp={editEmp}
          cutoffAdj={cutoffAdjs[editEmp.id]}
          onClose={() => setEditEmp(null)}
          onSave={(adj) => {
            setCutoffAdjs((m) => ({ ...m, [editEmp.id]: adj }));
            setEditEmp(null);
          }}
        />
      )}
      {payslipData && (
        <PayslipModal
          emp={payslipData.emp}
          run={payslipData.run}
          onClose={() => setPayslipData(null)}
        />
      )}
    </div>
  );
}
