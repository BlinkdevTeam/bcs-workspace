import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import PageLoader from "./components/ui/PageLoader";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

import {
  EMPLOYEES,
  DEFAULT_BASIC_PAY_SETS,
  DEFAULT_CONTRIBUTION_SETS,
  DEFAULT_BENEFITS_SETS,
  seedEmpComp,
  gc,
  SS,
  BADGE,
} from "./data/compData";

import Header from "./Header/Header";

// HRIS Pages
import Dashboard from "./pages/dashboard/Dashboard";
import People from "./pages/people/People";
import EmployeeProfile from "./pages/people/EmployeeProfile";
import Payroll from "./pages/payroll/Payroll";
import TimeAndLeave from "./pages/time-leave/TimeInLeave";
import RecruitmentPage from "./pages/recruitment/Recruitment";

// Auth / Setup Pages
import InitialSetup from "./pages/initial-setup/InitialSetup";
import Login from "./pages/login/Login";
import UserManagement from "./templates/UserManagement";

// ─────────────────────────────────────────
// Layout (Used ONLY for the HRIS system)
// ─────────────────────────────────────────
// function AppLayout({ children }) {
//   return (
//     <div
//       className="min-h-screen text-white flex flex-col"
//       style={{ fontFamily: "'Georgia', serif", backgroundColor: "#000" }}
//     >
//       <Header />
//       <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
//     </div>
//   );
// }

function SetupRoute({ children }) {
  const setupComplete = localStorage.getItem("setupComplete") === "true";
  if (!setupComplete) return <Navigate to="/initial-setup" replace />;
  return children;
}

function ProtectedLayout({ children }) {
  return (
    <SetupRoute>
      <ProtectedRoute>
        <AppLayout>{children}</AppLayout>
      </ProtectedRoute>
    </SetupRoute>
  );
}

// ─────────────────────────────────────────
// Wrappers for navigation
// ─────────────────────────────────────────
function InitialSetupWrapper() {
  const navigate = useNavigate();
  return (
    <InitialSetup
      onFinishSetup={() => {
        localStorage.setItem("setupComplete", "true");
        navigate("/login", { replace: true });
      }}
    />
  );
}

function LoginWrapper({ onLogin }) {
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);

  return (
    <Login
      onLogin={(user) => {
        setShowLoader(true); // show loader after login
        setTimeout(() => {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("user", JSON.stringify(user));
          navigate("/dashboard", { replace: true });
        }, 1000); // short delay for UX
        if (onLogin) onLogin(user);
      }}
    >
      {showLoader && <PageLoader message="Loading dashboard..." />}
    </Login>
  );
}

// ─────────────────────────────────────────
// APP
// ─────────────────────────────────────────
export default function App() {
  // ── Employees ──────────────────────────
  const [employees, setEmployees] = useState(EMPLOYEES);

  function updateEmployee(updated) {
    setEmployees((p) => p.map((e) => (e.id === updated.id ? updated : e)));
  }

  function addEmployee(newEmp) {
    setEmployees((p) => [...p, newEmp]);
    setEmpComps((m) => ({ ...m, [newEmp.id]: seedEmpComp(newEmp) }));
  }

  // ── Employee Compensation ──────────────
  const [empComps, setEmpComps] = useState(() => {
    const map = {};
    EMPLOYEES.forEach((e) => {
      map[e.id] = seedEmpComp(e);
    });
    return map;
  });

  function getEmpComp(id) {
    return (
      empComps[id] || seedEmpComp(employees.find((e) => e.id === id) || {})
    );
  }

  function updateEmpComp(id, comp) {
    setEmpComps((m) => ({ ...m, [id]: comp }));
  }

  // ── Compensation Packages ──────────────
  const [basicPaySets, setBasicPaySets] = useState(DEFAULT_BASIC_PAY_SETS);
  const [contributionSets, setContributionSets] = useState(
    DEFAULT_CONTRIBUTION_SETS,
  );
  const [benefitsSets, setBenefitsSets] = useState(DEFAULT_BENEFITS_SETS);

  // ── Payroll Cutoff Adjustments ─────────
  const [cutoffAdjs, setCutoffAdjs] = useState({});

  function getCutoffAdj(id) {
    return cutoffAdjs[id] || { proratedSalary: null, adjustments: [] };
  }

  function updateCutoffAdj(id, adj) {
    setCutoffAdjs((m) => ({ ...m, [id]: adj }));
  }

  // ── Prop Bundles ───────────────────────
  const employeeProps = {
    employees,
    onUpdateEmployee: updateEmployee,
    onAddEmployee: addEmployee,
    getEmpComp,
    onUpdateEmpComp: updateEmpComp,
    seedEmpComp,
  };

  const compPackageProps = {
    basicPaySets,
    onUpdateBasicPay: setBasicPaySets,
    contributionSets,
    onUpdateContributions: setContributionSets,
    benefitsSets,
    onUpdateBenefits: setBenefitsSets,
    gc,
    SS,
    BADGE,
  };

  const payrollProps = {
    employees,
    getCutoffAdj,
    onUpdateCutoffAdj: updateCutoffAdj,
    ...compPackageProps,
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* ROOT REDIRECT */}
        <Route
          path="/"
          element={
            localStorage.getItem("setupComplete") !== "true" ? (
              <Navigate to="/initial-setup" replace />
            ) : localStorage.getItem("isAuthenticated") !== "true" ? (
              <Navigate to="/login" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* INITIAL SETUP */}
        <Route path="/initial-setup" element={<InitialSetupWrapper />} />

        {/* LOGIN */}
        <Route path="/login" element={<LoginWrapper />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />

        {/* PEOPLE */}
        <Route
          path="/people"
          element={
            <ProtectedLayout>
              <People {...employeeProps} {...compPackageProps} />
            </ProtectedLayout>
          }
        />

        <Route
          path="/people/:id"
          element={
            <ProtectedLayout>
              <EmployeeProfile {...employeeProps} {...compPackageProps} />
            </ProtectedLayout>
          }
        />

        <Route
          path="/people/:id/:tab"
          element={
            <SetupRoute>
              <ProtectedRoute>
                <AppLayout>
                  <EmployeeProfile {...employeeProps} {...compPackageProps} />
                </AppLayout>
              </ProtectedRoute>
            </SetupRoute>
          }
        />

        {/* PAYROLL */}
        <Route
          path="/payroll"
          element={
            <ProtectedLayout>
              <Payroll {...payrollProps} />
            </ProtectedLayout>
          }
        />

        {/* TIME & LEAVE */}
        <Route
          path="/time-leave"
          element={
            <ProtectedLayout>
              <TimeAndLeave employees={employees} />
            </ProtectedLayout>
          }
        />

        {/* RECRUITMENT */}
        <Route
          path="/recruitment"
          element={
            <ProtectedLayout>
              <RecruitmentPage />
            </ProtectedLayout>
          }
        />

        {/* USERS */}
        <Route
          path="/users"
          element={
            <ProtectedLayout>
              <UserManagement />
            </ProtectedLayout>
          }
        />

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
