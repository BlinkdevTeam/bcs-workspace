import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import AppLayout      from "./layouts/AppLayout";
import Dashboard      from "./pages/dashboard/Dashboard";
import MyTasks        from "./pages/my-tasks/MyTasks";
import Portal         from "./pages/portal/Portal";
import Login          from "./pages/auth/Login";
import AcceptInvite   from "./pages/auth/AcceptInvite";
import ForgotPassword from "./pages/auth/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login"           element={<Login />} />
        <Route path="/accept-invite"   element={<AcceptInvite />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard"             element={<Dashboard />} />
            <Route path="/my-tasks"              element={<MyTasks />} />
            <Route path="/projects/:projectId"   element={<MyTasks />} />
            <Route path="/portal"                element={<Portal />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
