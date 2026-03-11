import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Directory from "./components/Directory";
import EditDrawer from "./components/EditDrawer";
import AddEmployeeDrawer from "./components/AddEmployeeDrawer";
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

  // 🔹 Fetch employees
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEmployees();

        const data = res.data.map((emp) => ({
          ...emp,
          avatar:
            emp.avatar_initials ||
            (emp.first_name?.[0] + emp.last_name?.[0] || "??"),
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

  // 🔹 Add employee locally
  const handleAddEmployee = (newEmp) => {
    setEmployees((prev) => [...prev, newEmp]);
  };

  // 🔹 Update employee locally
  const handleUpdateEmployee = (updatedEmp) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === updatedEmp.id ? updatedEmp : e))
    );

    if (onUpdateEmployee) onUpdateEmployee(updatedEmp);
  };

  return (
    <>
      <Directory
        employees={employees}
        onViewProfile={handleViewProfile}
        onEditEmployee={(emp) => setEditEmp(emp)}
        onAddEmployee={() => setShowAdd(true)}
        peopleView={peopleView}
        onSwitchView={setPeopleView}
        basicPaySets={basicPaySets}
        contributionSets={contributionSets}
        benefitsSets={benefitsSets}
        onUpdateBasicPay={onUpdateBasicPay}
        onUpdateContributions={onUpdateContributions}
        onUpdateBenefits={onUpdateBenefits}
      />

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
    </>
  );
}