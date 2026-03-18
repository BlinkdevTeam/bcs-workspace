import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Directory from "./components/Directory";
import EditDrawer from "./components/EditDrawer";
import AddEmployeeDrawer from "./components/AddEmployeeDrawer";
import DepartmentsTab from "./components/DepartmentsTab";
import CreateDepartmentDrawer from "./components/CreateDepartmentDrawer";
import { getEmployees } from "../../services/employeeService";

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
  const [editEmp, setEditEmp] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [peopleView, setPeopleView] = useState("directory");
  const [showCreateDept, setShowCreateDept] = useState(false);
  const [departments, setDepartments] = useState([]);

  // 🔹 Fetch employees
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEmployees();
        const data = res.data.map((emp) => ({
          ...emp,
          avatar:
            emp.avatar_initials ||
            emp.first_name?.[0] + emp.last_name?.[0] ||
            "??",
        }));
        setEmployees(data);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
        setEmployees([]);
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
  const handleAddEmployee = (newEmp) => setEmployees((prev) => [...prev, newEmp]);
  const handleUpdateEmployee = (updatedEmp) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === updatedEmp.id ? updatedEmp : e))
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
      <div className="px-8 pt-8 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p
              className="text-gray-600 text-xs uppercase tracking-widest mb-1"
              style={{ fontFamily: "system-ui,sans-serif" }}
            >
              People
            </p>
            <h1 className="text-3xl font-normal" style={{ letterSpacing: "-0.02em" }}>
              {peopleView === "department"
                ? "Departments"
                : peopleView === "config"
                ? "Compensation Config"
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
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-8 pt-6" style={{ borderBottom: "1px solid #1a1a1a" }}>
        {[
          ["directory", "Directory"],
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
    </>
  );
}