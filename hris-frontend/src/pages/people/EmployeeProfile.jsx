import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProfilePage from "./components/ProfilePage";
import { getEmployeeById } from "../../services/employeeService";

export default function EmployeeProfile({ gc, SS, BADGE }) {
  const { id } = useParams();   // :id from URL
  const navigate = useNavigate();
  const [emp, setEmp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      console.log("Fetching employee ID:", id);
      try {
        const res = await getEmployeeById(id);
        console.log("API response:", res);

        const data = res.data;

        setEmp({
          ...data,
          name: `${data.first_name} ${data.last_name}`,
          avatar:
            data.avatar_initials ||
            (data.first_name?.[0] + data.last_name?.[0]) ||
            "??",
          status:
            data.status?.charAt(0).toUpperCase() + data.status?.slice(1),
          payFreq: data.pay_frequency,
          benefits: data.benefits,
          schedule: data.schedule,
        });

        setLoading(false); // ✅ stop loading after data is set
      } catch (err) {
        console.error("Failed to fetch employee:", err);
        setLoading(false); // ✅ stop loading even if error occurs
        navigate("/people");
      }
    };

    if (id) fetchEmployee();
  }, [id, navigate]);

  if (loading) return <p className="text-white p-8">Loading employee…</p>;
  if (!emp) return null;

  return (
    <ProfilePage
      emp={emp} // pass full emp object
      onBack={() => navigate("/people")}
      onEdit={() => navigate(`/people/${emp.id}/edit`)}
      onUpdateEmp={() => {}} // optional if you implement update
      empComp={{}} // optional compensation object
      onUpdateComp={() => {}}
      gc={gc}
      SS={SS}
      BADGE={BADGE}
    />
  );
}