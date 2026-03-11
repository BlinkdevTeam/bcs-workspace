import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, } from "react-router-dom";
import { Provider } from "react-redux";
// import { store } from "./store/store";

import {
  EMPLOYEES,
  DEFAULT_BASIC_PAY_SETS,
  DEFAULT_CONTRIBUTION_SETS,
  DEFAULT_BENEFITS_SETS,
  seedEmpComp,
  gc,
  SS,
  BADGE
} from "./data/compData";

import Header from "./Header";
import Dashboard from "./components/dashboard/Dashboard";
import People from "./components/people/People";
import EmployeeProfile from "./components/people/EmployeeProfile";
import Payroll from "./components/payroll/Payroll";
import TimeAndLeave from "./components/time-leave/TimeInLeave";
import RecruitmentPage from "./components/recruitment/Recruitment";
import TimeAndLeaveii from "./templates/TimeInLeaveii";

// ── Layout ────────────────────────────────────────────────────────────────────
// Single wrapper rendered once. Every page gets TopNav automatically.
// Pages no longer need to render their own nav.
function Layout({ children }) {
  return (
    <div
      className="min-h-screen text-white flex flex-col"
      style={{ fontFamily: "'Georgia', serif", backgroundColor: "#000" }}
    >
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {

  // Employees
  const [employees, setEmployees] = useState(EMPLOYEES);

  function updateEmployee(updated) {
    setEmployees(p => p.map(e => e.id === updated.id ? updated : e));
  }

  function addEmployee(newEmp) {
    setEmployees(p => [...p, newEmp]);
    setEmpComps(m => ({ ...m, [newEmp.id]: seedEmpComp(newEmp) }));
  }

  // Per-employee compensation assignments
  const [empComps, setEmpComps] = useState(() => {
    const map = {};
    EMPLOYEES.forEach(e => { map[e.id] = seedEmpComp(e); });
    return map;
  });

  function getEmpComp(id) {
    return empComps[id] || seedEmpComp(employees.find(e => e.id === id) || {});
  }

  function updateEmpComp(id, comp) {
    setEmpComps(m => ({ ...m, [id]: comp }));
  }

  // Compensation package sets
  const [basicPaySets,     setBasicPaySets]     = useState(DEFAULT_BASIC_PAY_SETS);
  const [contributionSets, setContributionSets] = useState(DEFAULT_CONTRIBUTION_SETS);
  const [benefitsSets,     setBenefitsSets]     = useState(DEFAULT_BENEFITS_SETS);

  // Payroll cutoff adjustments
  const [cutoffAdjs, setCutoffAdjs] = useState({});

  function getCutoffAdj(id) {
    return cutoffAdjs[id] || { proratedSalary: null, adjustments: [] };
  }

  function updateCutoffAdj(id, adj) {
    setCutoffAdjs(m => ({ ...m, [id]: adj }));
  }

  // Prop bundles — keeps the JSX below clean
  const employeeProps = {
    employees,
    onUpdateEmployee: updateEmployee,
    onAddEmployee:    addEmployee,
    getEmpComp,
    onUpdateEmpComp:  updateEmpComp,
    seedEmpComp
  };

  const compPackageProps = {
    basicPaySets,      onUpdateBasicPay:      setBasicPaySets,
    contributionSets,  onUpdateContributions: setContributionSets,
    benefitsSets,      onUpdateBenefits:      setBenefitsSets,
    gc, SS, BADGE
  };

  const payrollProps = {
    employees,
    getCutoffAdj,
    onUpdateCutoffAdj: updateCutoffAdj,
    ...compPackageProps,
  };

  return (
    //  <Provider store={store}>         
    <BrowserRouter>
      <Layout>
        <Routes>

          <Route path="/"                element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"       element={<Dashboard />} />

          <Route path="/people"          element={<People {...employeeProps} {...compPackageProps} />} />
          <Route path="/people/:id"      element={<EmployeeProfile {...employeeProps} {...compPackageProps} />} />
          <Route path="/people/:id/:tab" element={<EmployeeProfile {...employeeProps} {...compPackageProps} />} />

          <Route path="/payroll" element={<Payroll {...payrollProps} />} />
          <Route path="/time-leave" element={<TimeAndLeave employees={employees} />} />
          <Route path="/recruitment"     element={<RecruitmentPage />} />

          {/* <Route path="/time-leave"      element={<TimeAndLeave employees={employees} />} /> */}
          {/* <Route path="/time-leave"      element={<TimeAndLeaveii />} /> */}
          
          {/* <Route path="/time-leave"      element={<TimeAndLeave employees={employees} />} />
          <Route path="/recruitment"     element={<RecruitmentPage />} />
          <Route path="/reports"         element={<ReportsPage employees={employees} {...compPackageProps} />} /> */}

          <Route path="*"                element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </Layout>
    </BrowserRouter>
    // </Provider>
  );
}

