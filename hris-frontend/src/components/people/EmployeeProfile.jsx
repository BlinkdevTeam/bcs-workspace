import { useParams, useNavigate } from "react-router-dom";
import ProfilePage from "./components/ProfilePage";

export default function EmployeeProfile({
  employees,
  onUpdateEmployee,
  getEmpComp,
  onUpdateEmpComp,
  basicPaySets,
  contributionSets,
  benefitsSets,
  gc,
  SS, 
  BADGE
}) {
  const { id, tab } = useParams();   // reads :id and :tab from the URL
  const navigate    = useNavigate();

  // Find the employee by URL id
  const emp = employees.find(e => e.id === Number(id));

  // Guard — if id doesn't match anyone, go back to directory
  if (!emp) {
    navigate("/people");
    return null;
  }

  return (
    <ProfilePage
      emp={emp}
      onBack={() => navigate("/people")}
      onEdit={() => navigate(`/people/${emp.id}/edit`)}
      onUpdateEmp={onUpdateEmployee}
      empComp={getEmpComp(emp.id)}
      onUpdateComp={comp => onUpdateEmpComp(emp.id, comp)}
      basicPaySets={basicPaySets}
      contributionSets={contributionSets}
      benefitsSets={benefitsSets}
      defaultTab={tab}  // e.g. "compensation" from /people/1/compensation
      gc={gc}
      SS={SS}
      BADGE={BADGE}
    />
  );
}