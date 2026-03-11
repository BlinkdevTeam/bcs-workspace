import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Directory from "./components/Directory";
import EditDrawer from "./components/EditDrawer";
import AddEmployeeDrawer from "./components/AddEmployeeDrawer";

export default function People({
  employees,
  onUpdateEmployee,
  onAddEmployee,
  getEmpComp,
  onUpdateEmpComp,
  basicPaySets,
  onUpdateBasicPay,
  contributionSets,
  onUpdateContributions,
  benefitsSets,
  onUpdateBenefits,
}) {
  const navigate = useNavigate();

  const [editEmp,  setEditEmp]  = useState(null);
  const [showAdd,  setShowAdd]  = useState(false);
  const [peopleView, setPeopleView] = useState("directory"); // "directory" | "config"

  return (
    <>
      <Directory
        employees={employees}
        onViewProfile={emp => navigate(`/people/${emp.id}`)}  // ← router handles this now
        onEditEmployee={emp => setEditEmp(emp)}
        onAddEmployee={() => setShowAdd(true)}
        peopleView={peopleView}
        onSwitchView={v => setPeopleView(v)}
        basicPaySets={basicPaySets}
        contributionSets={contributionSets}
        benefitsSets={benefitsSets}
        onUpdateBasicPay={onUpdateBasicPay}
        onUpdateContributions={onUpdateContributions}
        onUpdateBenefits={onUpdateBenefits}
      />

      {editEmp && (
        <EditDrawer
          emp={employees.find(e => e.id === editEmp.id) || editEmp}
          onClose={() => setEditEmp(null)}
          onSave={updated => { onUpdateEmployee(updated); setEditEmp(null); }}
        />
      )}

      {showAdd && (
        <AddEmployeeDrawer
          onClose={() => setShowAdd(false)}
          onSave={newEmp => { onAddEmployee(newEmp); setShowAdd(false); }}
        />
      )}
    </>
  );
}