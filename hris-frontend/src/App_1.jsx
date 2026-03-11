import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

// ── Page imports ──────────────────────────────────────────────────────────────
// Each of these is the default export from its respective file.
// Replace these with your actual file paths once you split them out.
// import DashboardPage   from "./pages/DashboardPage";
// import PeoplePage      from "./pages/PeoplePage";        // directory + comp config
// import EmployeeProfile from "./pages/EmployeeProfile";   // /people/:id
// import PayrollPage     from "./pages/PayrollPage";
// import TimeAndLeave    from "./pages/TimeAndLeave";
// import RecruitmentPage from "./pages/RecruitmentPage";
// import ReportsPage     from "./pages/ReportsPage";


import Dashboard from "./components/dashboard/Dashboard";
import People from "./components/people/People";

// ── Shared state that needs to live above routing ─────────────────────────────
// Compensation packages are defined in People but read in Payroll,
// so they need to live at the App level and be passed down.

import {
  DEFAULT_BASIC_PAY_SETS,
  DEFAULT_CONTRIBUTION_SETS,
  DEFAULT_BENEFITS_SETS,
  EMPLOYEES as SEED_EMPLOYEES,
  seedEmpComp,
} from "./data/compData"; // extract your seed data into a shared file

export default function App() {
  // ── Global employee records ──────────────────────────────────────────────
  const [employees, setEmployees] = useState(SEED_EMPLOYEES);
  function updateEmployee(updated) {
    setEmployees(p => p.map(e => e.id === updated.id ? updated : e));
  }
  function addEmployee(newEmp) {
    setEmployees(p => [...p, newEmp]);
    setEmpComps(m => ({ ...m, [newEmp.id]: seedEmpComp(newEmp) }));
  }

  // ── Per-employee compensation assignment (which sets they're on) ──────────
  const [empComps, setEmpComps] = useState(() => {
    const map = {};
    SEED_EMPLOYEES.forEach(e => { map[e.id] = seedEmpComp(e); });
    return map;
  });
  function getEmpComp(id) {
    return empComps[id] || seedEmpComp(employees.find(e => e.id === id) || {});
  }
  function updateEmpComp(id, comp) {
    setEmpComps(m => ({ ...m, [id]: comp }));
  }

  // ── Compensation package sets (defined in People, used in Payroll) ────────
  const [basicPaySets,      setBasicPaySets]      = useState(DEFAULT_BASIC_PAY_SETS);
  const [contributionSets,  setContributionSets]  = useState(DEFAULT_CONTRIBUTION_SETS);
  const [benefitsSets,      setBenefitsSets]      = useState(DEFAULT_BENEFITS_SETS);

  // ── Per-employee payroll cutoff adjustments (Payroll page only) ───────────
  const [cutoffAdjs, setCutoffAdjs] = useState({});
  function getCutoffAdj(id) {
    return cutoffAdjs[id] || { proratedSalary: null, adjustments: [] };
  }
  function updateCutoffAdj(id, adj) {
    setCutoffAdjs(m => ({ ...m, [id]: adj }));
  }

  // ── Shared props bundles (passed to pages that need them) ─────────────────
  const compPackageProps = {
    basicPaySets,      onUpdateBasicPay:     setBasicPaySets,
    contributionSets,  onUpdateContributions: setContributionSets,
    benefitsSets,      onUpdateBenefits:      setBenefitsSets,
  };

  const employeeProps = {
    employees,
    onUpdateEmployee: updateEmployee,
    onAddEmployee:    addEmployee,
    getEmpComp,
    onUpdateEmpComp:  updateEmpComp,
  };

  const payrollProps = {
    employees,
    getCutoffAdj,
    onUpdateCutoffAdj: updateCutoffAdj,
    ...compPackageProps,
  };

  return (
    <div className="min-h-screen text-white" style={{ fontFamily: "'Georgia', serif", backgroundColor: "#000000" }}>
        <BrowserRouter>
            <Routes>

                {/* ── Default redirect ── */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* ── Dashboard ── */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* ── People ── */}
                {/*
                /people               → Employee directory (default)
                /people?view=config   → Compensation Config tab
                /people/:id           → Individual employee profile
                /people/:id/compensation → Profile with Compensation tab open
                */}
                <Route path="/people">
                <Route index element={
                    <People
                    {...employeeProps}
                    {...compPackageProps}
                    />
                } />
                {/* <Route path=":id" element={
                    <EmployeeProfile
                    {...employeeProps}
                    {...compPackageProps}
                    />
                } />
                <Route path=":id/:tab" element={
                    <EmployeeProfile
                    {...employeeProps}
                    {...compPackageProps}
                    />
                } /> */}
                </Route>

                {/* ── Payroll ── */}
                {/* <Route path="/payroll" element={<PayrollPage {...payrollProps} />} /> */}

                {/* ── Time & Leave ── */}
                {/* <Route path="/time-leave" element={<TimeAndLeave employees={employees} />} /> */}

                {/* ── Recruitment ── */}
                {/* <Route path="/recruitment" element={<RecruitmentPage />} /> */}

                {/* ── Reports ── */}
                {/* <Route path="/reports" element={
                <ReportsPage
                    employees={employees}
                    {...compPackageProps}
                />
                } /> */}

                {/* ── 404 fallback ── */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />

            </Routes>
            </BrowserRouter>
    </div>
  );
}
