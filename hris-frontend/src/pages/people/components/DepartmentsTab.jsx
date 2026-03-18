import { useState, useEffect } from "react";
import { getDepartments, updateDepartment } from "../../../services/departmentService";
import CreateDepartmentDrawer from "./CreateDepartmentDrawer";
import ChangeHeadModal from "./ChangeHeadModal";

// Status styles
const SS = {
  Active: { bg: "#0f1f0f", color: "#5af07a" },
  "On Leave": { bg: "#1f1a0f", color: "#f0c85a" },
  Inactive: { bg: "#1f0f0f", color: "#f05a5a" },
};

// Simple Avatar
function Avatar({ emp, size = 32 }) {
  const initials = emp
    ? `${emp.first_name?.[0] || ""}${emp.last_name?.[0] || ""}`.toUpperCase()
    : "??";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#222",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        color: "#aaa",
      }}
    >
      {initials}
    </div>
  );
}

// Departments Tab
export default function DepartmentsTab({ employees }) {
  const [depts, setDepts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const [changingHeadFor, setChangingHeadFor] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await getDepartments();
        setDepts(res.data);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      }
    };
    fetchDepartments();
  }, []);

  const deptStats = depts.map((dept) => {
    const members = employees.filter((e) => e.department_id === dept.id);
    const head = employees.find((e) => e.id === dept.head_id) || null;
    const active = members.filter(
  (e) => e.status?.toLowerCase() === "active"
).length;
    const onLeave = members.filter((e) => e.status === "On Leave").length;

    return { ...dept, members, head, active, onLeave };
  });

  const handleHeadChange = async (deptId, newHeadId) => {
  try {
    // ✅ CALL BACKEND FIRST
    await updateDepartment(deptId, {
      head_id: newHeadId, // can be null
    });

    // ✅ THEN UPDATE UI
    setDepts((prev) =>
      prev.map((d) =>
        d.id === deptId ? { ...d, head_id: newHeadId } : d
      )
    );

    setChangingHeadFor(null);
  } catch (err) {
    console.error("Failed to update department head:", err);
  }
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-normal text-white">
            {deptStats.length} departments
          </p>
          <p
            className="text-xs text-gray-600 mt-0.5"
            style={{ fontFamily: "system-ui,sans-serif" }}
          >
            Click a department to see its members
          </p>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-2 gap-4">
        {deptStats.map((dept) => {
          const isSelected = selected === dept.id;
          return (
            <div key={dept.id}>
              <div
                onClick={() => setSelected(isSelected ? null : dept.id)}
                className="rounded-lg p-5 cursor-pointer transition-all"
                style={{
                  backgroundColor: isSelected ? dept.color + "0a" : "#0d0d0d",
                  border: `1px solid ${isSelected ? dept.color + "55" : "#1e1e1e"}`,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: dept.color + "18",
                        border: `1px solid ${dept.color}33`,
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-white text-sm font-medium"
                        style={{ fontFamily: "system-ui,sans-serif" }}
                      >
                        {dept.name}
                      </p>
                      {dept.description && (
                        <p
                          className="text-gray-600 text-xs mt-0.5"
                          style={{ fontFamily: "system-ui,sans-serif" }}
                        >
                          {dept.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className="text-xs"
                    style={{ color: dept.color, fontFamily: "monospace" }}
                  >
                    {dept.members.length}{" "}
                    {dept.members.length === 1 ? "member" : "members"}
                  </span>
                  {/* Change/Assign Head button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setChangingHeadFor(dept);
                    }}
                    className="text-xs px-2.5 py-1 rounded hover:opacity-80 transition-all"
                    style={{
                      fontFamily: "system-ui,sans-serif",
                      backgroundColor: dept.color + "12",
                      color: dept.color,
                      border: `1px solid ${dept.color}33`,
                    }}
                  >
                    {dept.head ? "Change Head" : "Assign Head"}
                  </button>
                </div>

                {/* Head */}
                <div className="flex items-center justify-between">
                  {dept.head ? (
                    <div className="flex items-center gap-2">
                      <Avatar emp={dept.head} size={24} />
                      <div>
                        <p
                          className="text-gray-300 text-xs"
                          style={{ fontFamily: "system-ui,sans-serif" }}
                        >
                          {dept.head.first_name} {dept.head.last_name}
                        </p>
                        <p
                          className="text-gray-600 text-xs"
                          style={{ fontFamily: "system-ui,sans-serif" }}
                        >
                          Department Head
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span
                      className="text-xs text-gray-600"
                      style={{ fontFamily: "system-ui,sans-serif" }}
                    >
                      No head assigned
                    </span>
                  )}
                </div>

                <p
                  className="text-xs text-gray-700 mt-2 pt-2"
                  style={{
                    fontFamily: "monospace",
                    borderTop: "1px solid #1a1a1a",
                  }}
                >
                  Created {new Date(dept.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Expandable Members */}
              {isSelected && dept.members.length > 0 && (
                <div
                  className="rounded-b-lg overflow-hidden -mt-1"
                  style={{
                    border: `1px solid ${dept.color}33`,
                    borderTop: "none",
                    backgroundColor: "#080808",
                  }}
                >
                  {dept.members.map((emp, i) => (
                    <div
                      key={emp.id}
                      className="flex items-center gap-3 px-5 py-2.5"
                      style={{
                        borderTop: i > 0 ? "1px solid #141414" : "none",
                      }}
                    >
                      <Avatar emp={emp} size={28} />
                      <div className="flex-1">
                        <p
                          className="text-gray-200 text-sm"
                          style={{ fontFamily: "system-ui,sans-serif" }}
                        >
                          {emp.first_name} {emp.last_name}
                        </p>
                        <p
                          className="text-gray-600 text-xs"
                          style={{ fontFamily: "system-ui,sans-serif" }}
                        >
                          {emp.role_title || emp.role}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {emp.id === dept.head?.id && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{
                              fontFamily: "system-ui,sans-serif",
                              backgroundColor: dept.color + "18",
                              color: dept.color,
                            }}
                          >
                            Head
                          </span>
                        )}
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            fontFamily: "system-ui,sans-serif",
                            ...SS[emp.status],
                          }}
                        >
                          {emp.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {isSelected && dept.members.length === 0 && (
                <div
                  className="rounded-b-lg flex items-center justify-center py-5 -mt-1"
                  style={{
                    border: `1px solid ${dept.color}22`,
                    borderTop: "none",
                    backgroundColor: "#080808",
                  }}
                >
                  <p
                    className="text-gray-600 text-xs"
                    style={{ fontFamily: "system-ui,sans-serif" }}
                  >
                    No employees assigned to this department yet.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Department Drawer */}
      {showDrawer && (
        <CreateDepartmentDrawer
          onClose={() => setShowDrawer(false)}
          onSave={(newDept) => {
            setDepts((prev) => [...prev, newDept]); // automatically adds the new department
            setShowDrawer(false);
          }}
          employees={employees}
        />
      )}

      {/* Change Head Modal */}
      {changingHeadFor && (
        <ChangeHeadModal
          department={changingHeadFor} // use department prop
          employees={employees}
          onClose={() => setChangingHeadFor(null)}
          onSave={(newHead) => handleHeadChange(changingHeadFor.id, newHead)}
        />
      )}
    </div>
  );
}
