import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Redux Actions
import { refreshSession } from "./store/authSlice";

// Components
import PageLoader from "./components/ui/PageLoader";
import AppLayout from "./layouts/AppLayout";
import { checkSuperAdmin } from "./services/setupService";

// HRIS Pages
import Dashboard from "./pages/dashboard/Dashboard";
import People from "./pages/people/People";
import EmployeeProfile from "./pages/people/EmployeeProfile";
import Payroll from "./pages/payroll/Payroll";
import TimeAndLeave from "./pages/time-leave/TimeInLeave";
import RecruitmentPage from "./pages/recruitment/Recruitment";
import InitialSetup from "./pages/initial-setup/InitialSetup";
import Login from "./pages/login/Login";
import UserManagement from "./templates/UserManagement_II";

// Data
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

// ─────────────────────────────────────────
// ROUTE GUARDS (Redux Powered)
// ─────────────────────────────────────────

function InitialSetupRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    checkSuperAdmin()
      .then((res) => setSetupComplete(res.exists))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader message="Checking setup..." />;

  // If super admin already exists, redirect to login
  if (setupComplete) return <Navigate to="/login" replace />;

  return children;
}

function SetupRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    checkSuperAdmin()
      .then((res) => setSetupComplete(res.exists))
      .catch(() => setSetupComplete(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader message="Checking system setup..." />;
  if (!setupComplete) return <Navigate to="/initial-setup" replace />;
  return children;
}

function ProtectedLayout({ children }) {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return <PageLoader message="Verifying session..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <SetupRoute>
      <AppLayout>{children}</AppLayout>
    </SetupRoute>
  );
}

function RootRedirect() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [setupLoading, setSetupLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    checkSuperAdmin()
      .then((res) => setSetupComplete(res.exists))
      .finally(() => setSetupLoading(false));
  }, []);

  if (loading || setupLoading) return <PageLoader message="Loading..." />;
  if (!setupComplete) return <Navigate to="/initial-setup" replace />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to="/dashboard" replace />;
}

// ─────────────────────────────────────────
// APP COMPONENT
// ─────────────────────────────────────────

export default function App() {
  const dispatch = useDispatch();

  // Initial session check on mount
  useEffect(() => {
    dispatch(refreshSession());
  }, [dispatch]);

  // --- Shared State (Employees/Comp) ---
  const [employees, setEmployees] = useState(EMPLOYEES);
  const [empComps, setEmpComps] = useState(() => {
    const map = {};
    EMPLOYEES.forEach((e) => {
      map[e.id] = seedEmpComp(e);
    });
    return map;
  });

  const updateEmployee = (updated) =>
    setEmployees((p) => p.map((e) => (e.id === updated.id ? updated : e)));
  const addEmployee = (newEmp) => {
    setEmployees((p) => [...p, newEmp]);
    setEmpComps((m) => ({ ...m, [newEmp.id]: seedEmpComp(newEmp) }));
  };
  const getEmpComp = (id) =>
    empComps[id] || seedEmpComp(employees.find((e) => e.id === id) || {});
  const updateEmpComp = (id, comp) =>
    setEmpComps((m) => ({ ...m, [id]: comp }));

  const [basicPaySets, setBasicPaySets] = useState(DEFAULT_BASIC_PAY_SETS);
  const [contributionSets, setContributionSets] = useState(
    DEFAULT_CONTRIBUTION_SETS,
  );
  const [benefitsSets, setBenefitsSets] = useState(DEFAULT_BENEFITS_SETS);
  const [cutoffAdjs, setCutoffAdjs] = useState({});

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
    getCutoffAdj: (id) =>
      cutoffAdjs[id] || { proratedSalary: null, adjustments: [] },
    onUpdateCutoffAdj: (id, adj) => setCutoffAdjs((m) => ({ ...m, [id]: adj })),
    ...compPackageProps,
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />

        <Route path="/set-password-reset" element={<Login />} />
        <Route
          path="/initial-setup"
          element={
            <InitialSetupRoute>
              <InitialSetup />
            </InitialSetupRoute>
          }
        />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />

        {/* Protected People */}
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
            <ProtectedLayout>
              <EmployeeProfile {...employeeProps} {...compPackageProps} />
            </ProtectedLayout>
          }
        />

        {/* Protected Payroll */}
        <Route
          path="/payroll"
          element={
            <ProtectedLayout>
              <Payroll {...payrollProps} />
            </ProtectedLayout>
          }
        />

        {/* Protected Time/Leave */}
        <Route
          path="/time-leave"
          element={
            <ProtectedLayout>
              <TimeAndLeave employees={employees} />
            </ProtectedLayout>
          }
        />

        {/* Protected Recruitment */}
        <Route
          path="/recruitment"
          element={
            <ProtectedLayout>
              <RecruitmentPage />
            </ProtectedLayout>
          }
        />

        {/* Protected User Mgmt */}
        <Route
          path="/users"
          element={
            <ProtectedLayout>
              <UserManagement />
            </ProtectedLayout>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
