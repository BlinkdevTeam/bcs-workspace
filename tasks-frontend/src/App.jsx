import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import api from "./services/api";

import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import MyTasks from "./pages/my-tasks/MyTasks";

import Login from "./pages/auth/login";

function App() {
  api.get("/health").then((res) => console.log(res.data));
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes — redirects to /login if not authenticated */}
        <Route element={<ProtectedRoute />}>
           <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          {/* <Route path="/my-tasks" element={<MyTasks />} /> */}
          {/* <Route path="/projects" element={<div>Projects Page</div>} /> */}
          <Route path="/tasks" element={<div>Tasks Page</div>} />
        </Route>

        {/* Fallback */}
        {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
        <Route element={<AppLayout />}>
          <Route path="*" element={<Dashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;