import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Directory from "./components/Directory";
import UsersTab from "./components/UsersTab";
import EditDrawer from "./components/EditDrawer";
import AddEmployeeDrawer from "./components/AddEmployeeDrawer";
import DepartmentsTab from "./components/DepartmentsTab";
import CreateDepartmentDrawer from "./components/CreateDepartmentDrawer";
import CreateUserDrawer from "./components/usersComponents/CreateUserDrawer";
import { getEmployees } from "../../services/employeeService";
import { getDepartments } from "../../services/departmentService";

export default function People({
  onUpdateEmployee,
  basicPaySets,
  onUpdateBasicPay,
  contributionSets,
  onUpdateContributions,
  benefitsSets,
  onUpdateBenefits,
}) {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editEmp, setEditEmp] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [peopleView, setPeopleView] = useState("directory");
  const [showCreateDept, setShowCreateDept] = useState(false);

  const [showCreateUser, setShowCreateUser] = useState(false);

  const mappedUsers = employees.map((emp) => ({
    id: emp.id,
    name: `${emp.first_name} ${emp.last_name}`,
    email: emp.email,
    role: emp.role,
    dept: emp.department?.name,
    status: emp.status,
  }));

  // 🔹 Fetch employees
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, deptRes] = await Promise.all([
          getEmployees(),
          getDepartments(),
        ]);

        const empData = empRes.data.map((emp) => ({
          ...emp,
          avatar:
            emp.avatar_initials ||
            emp.first_name?.[0] + emp.last_name?.[0] ||
            "??",
        }));

        setEmployees(empData);
        setDepartments(deptRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setEmployees([]);
        setDepartments([]);
      }
    };

    fetchData();
  }, []);

  // 🔹 Navigate to profile
  const handleViewProfile = (emp) => {
    if (!emp?.id) {
      console.warn("Employee has no ID:", emp);
      return;
    }
    navigate(`/people/${emp.id}`);
  };

  // 🔹 Add/update employee locally
  const handleAddEmployee = (newEmp) =>
    setEmployees((prev) => [...prev, newEmp]);
  const handleUpdateEmployee = (updatedEmp) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === updatedEmp.id ? updatedEmp : e)),
    );
    if (onUpdateEmployee) onUpdateEmployee(updatedEmp);
  };

  // 🔹 Add department locally
  const handleAddDepartment = (dept) => {
    setDepartments((prev) => [...prev, dept]);
  };

  return (
    <>
      {/* Header */}
      <div className="px-8 pt-8 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p
              className="text-gray-600 text-xs uppercase tracking-widest mb-1"
              style={{ fontFamily: "system-ui,sans-serif" }}
            >
              People
            </p>
            <h1
              className="text-3xl font-normal"
              style={{ letterSpacing: "-0.02em" }}
            >
              {peopleView === "department"
                ? "Departments"
                : peopleView === "config"
                  ? "Compensation Config"
                  : peopleView === "user"
                    ? "User Management"
                    : "Employee Directory"}
            </h1>
          </div>

          {/* Dynamic Actions */}
          <div className="flex gap-3">
            {peopleView === "directory" && (
              <>
                <button
                  className="px-4 py-2 rounded text-sm flex items-center gap-2 hover:opacity-70"
                  style={{
                    fontFamily: "system-ui,sans-serif",
                    backgroundColor: "#111",
                    color: "#aaa",
                    border: "1px solid #2a2a2a",
                  }}
                >
                  ⬇ Export CSV
                </button>
                <button
                  onClick={() => setShowAdd(true)}
                  className="px-4 py-2 rounded text-sm font-medium bg-white text-black flex items-center gap-2 hover:opacity-80"
                  style={{ fontFamily: "system-ui,sans-serif" }}
                >
                  ＋ Add Employee
                </button>
              </>
            )}

            {peopleView === "department" && (
              <button
                onClick={() => setShowCreateDept(true)}
                className="px-4 py-2 rounded text-sm font-medium bg-white text-black flex items-center gap-2 hover:opacity-80"
                style={{ fontFamily: "system-ui,sans-serif" }}
              >
                ＋ New Department
              </button>
            )}
            {peopleView === "user" && (
              <>
                <button
                  className="px-4 py-2 rounded text-sm flex items-center gap-2 hover:opacity-70"
                  style={{
                    fontFamily: "system-ui,sans-serif",
                    backgroundColor: "#111",
                    color: "#aaa",
                    border: "1px solid #2a2a2a",
                  }}
                >
                  🛡 Create Role
                </button>
                <button
                  onClick={() => setShowCreateUser(true)}
                  className="px-4 py-2 rounded text-sm font-medium bg-white text-black flex items-center gap-2 hover:opacity-80"
                  style={{ fontFamily: "system-ui,sans-serif" }}
                >
                  ＋ Invite User
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 px-8"
        style={{ borderBottom: "1px solid #1a1a1a" }}
      >
        {[
          ["directory", "Directory"],
          ["user", "Users"],
          ["department", "Department"],
          ["config", "Compensation Config"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setPeopleView(key)}
            className="px-4 py-2 text-sm transition-all"
            style={{
              fontFamily: "system-ui,sans-serif",
              color: peopleView === key ? "#fff" : "#555",
              borderBottom:
                peopleView === key ? "2px solid #fff" : "2px solid transparent",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {peopleView === "directory" && (
        <Directory
          employees={employees}
          onViewProfile={handleViewProfile}
          onEditEmployee={(emp) => setEditEmp(emp)}
          onAddEmployee={() => setShowAdd(true)}
          basicPaySets={basicPaySets}
          contributionSets={contributionSets}
          benefitsSets={benefitsSets}
          onUpdateBasicPay={onUpdateBasicPay}
          onUpdateContributions={onUpdateContributions}
          onUpdateBenefits={onUpdateBenefits}
        />
      )}

      {peopleView === "user" && (
        <UsersTab
  users={mappedUsers}
  onInviteUser={() => setShowCreateUser(true)}
  onAddUser={(newUser) => {
    setEmployees((prev) => [...prev, newUser]);
  }}
/>
      )}

      {peopleView === "department" && (
        <div className="p-8">
          <DepartmentsTab
            employees={employees.map((e) => ({
              ...e,
              name: `${e.first_name || ""} ${e.last_name || ""}`.trim(),
              dept: e.department,
            }))}
            allDepts={departments}
            onCreateDept={() => setShowCreateDept(true)}
          />
        </div>
      )}

      {peopleView === "config" && (
        <Directory
          employees={employees}
          peopleView="config"
          onSwitchView={setPeopleView}
          basicPaySets={basicPaySets}
          contributionSets={contributionSets}
          benefitsSets={benefitsSets}
          onUpdateBasicPay={onUpdateBasicPay}
          onUpdateContributions={onUpdateContributions}
          onUpdateBenefits={onUpdateBenefits}
        />
      )}

      {/* Drawers */}
      {editEmp && (
        <EditDrawer
          emp={employees.find((e) => e.id === editEmp.id) || editEmp}
          onClose={() => setEditEmp(null)}
          onSave={(updated) => {
            handleUpdateEmployee(updated);
            setEditEmp(null);
          }}
        />
      )}

      {showAdd && (
        <AddEmployeeDrawer
          onClose={() => setShowAdd(false)}
          onSave={(newEmp) => {
            handleAddEmployee(newEmp);
            setShowAdd(false);
          }}
          departments={departments}
          employees={employees}
        />
      )}

      {showCreateDept && (
        <CreateDepartmentDrawer
          employees={employees}
          onClose={() => setShowCreateDept(false)}
          onSave={(newDept) => {
            handleAddDepartment(newDept);
            setShowCreateDept(false);
          }}
        />
      )}

      {showCreateUser && (
        <CreateUserDrawer
          onClose={() => setShowCreateUser(false)}
          onSave={(newUser) => {
            setEmployees((prev) => [...prev, newUser]);
            setShowCreateUser(false);
          }}
          customRoles={[]}
        />
      )}
    </>
  );
}
