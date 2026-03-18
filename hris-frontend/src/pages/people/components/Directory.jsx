import { useState, useMemo, useEffect } from "react";
import CompensationConfigTab from "./CompensationConfigTab";
import { getDepartments } from "../../../services/departmentService";

// import { EMPLOYEES } from "../../../data/compData";

const STATUSES = ["All", "Active", "On Leave", "Inactive"];

function Avatar({ emp, size = 36 }) {
  const { bg, fg } = gc(emp.id);
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        color: fg,
        fontFamily: "system-ui,sans-serif",
        fontSize: size < 32 ? 11 : size < 56 ? 13 : 20,
      }}
    >
      {emp.avatar || emp.first_name?.[0] + emp.last_name?.[0]}
    </div>
  );
}

const SS = {
  Active: { bg: "#0f1f0f", color: "#5af07a" },
  "On Leave": { bg: "#1f1a0f", color: "#f0c85a" },
  Inactive: { bg: "#1f0f0f", color: "#f05a5a" },
};

const AV = [
  "#ffffff",
  "#cccccc",
  "#999999",
  "#777777",
  "#555555",
  "#444444",
  "#ffffff",
  "#bbbbbb",
  "#888888",
  "#666666",
  "#aaaaaa",
  "#333333",
];

function gc(id) {
  const safeId = id ?? 0; // fallback to 0 if undefined
  const bg = AV[safeId % AV.length] ?? "#333"; // fallback color
  const fg = ["#fff", "#ddd", "#eee", "#ccc", "#bbb"].some((x) =>
    bg.startsWith(x.slice(0, 4)),
  )
    ? "#000"
    : "#fff";
  return { bg, fg };
}

export default function Directory({
  employees,
  onViewProfile,
  onEditEmployee,
  peopleView,
  onSwitchView,
  basicPaySets,
  contributionSets,
  benefitsSets,
  onUpdateBasicPay,
  onUpdateContributions,
  onUpdateBenefits,
}) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [departments, setDepartments] = useState([]);

  // Fetch departments from backend
  useEffect(() => {
    let mounted = true;
    getDepartments()
      .then((res) => {
        if (mounted) setDepartments(res.data || []);
      })
      .catch((err) => console.error(err));
    return () => (mounted = false);
  }, []);

  // Map department_id -> name
  const deptMap = useMemo(() => {
    const map = {};
    departments.forEach((d) => {
      map[d.id] = d.name;
    });
    return map;
  }, [departments]);

  // Filter employees based on search and filters
  const filtered = useMemo(
    () =>
      employees.filter((e) => {
        const q = search.toLowerCase();
        return (
          (!q ||
            e.name?.toLowerCase().includes(q) ||
            e.role_title?.toLowerCase().includes(q) ||
            e.department?.toLowerCase().includes(q)) &&
          (deptFilter === "All" || e.department === deptFilter) &&
          (statusFilter === "All" || e.status === statusFilter)
        );
      }),
    [employees, search, deptFilter, statusFilter],
  );

  if (peopleView === "config") {
    return (
      <CompensationConfigTab
        basicPaySets={basicPaySets}
        contributionSets={contributionSets}
        benefitsSets={benefitsSets}
        onUpdateBasicPay={onUpdateBasicPay}
        onUpdateContributions={onUpdateContributions}
        onUpdateBenefits={onUpdateBenefits}
        onSwitchView={onSwitchView}
      />
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-8 pt-8 pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                🔍
              </span>
              <input
                className="w-full pl-9 pr-4 py-2 rounded text-sm text-white placeholder-gray-600 outline-none"
                style={{
                  fontFamily: "system-ui,sans-serif",
                  backgroundColor: "#111",
                  border: "1px solid #2a2a2a",
                }}
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 rounded text-sm text-gray-300 outline-none cursor-pointer"
              style={{
                fontFamily: "system-ui,sans-serif",
                backgroundColor: "#111",
                border: "1px solid #2a2a2a",
              }}
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option>All Departments</option>
              {departments.map((d) => (
                <option key={d.id}>{d.name}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 rounded text-sm text-gray-300 outline-none cursor-pointer"
              style={{
                fontFamily: "system-ui,sans-serif",
                backgroundColor: "#111",
                border: "1px solid #2a2a2a",
              }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s}>{s === "All" ? "All Statuses" : s}</option>
              ))}
            </select>
            <div className="flex-1" />{" "}
            <span className="text-gray-600 text-sm">
              {filtered.length} of {employees.length}
            </span>
          </div>
        </div>
        {/* Employee table */}
        <div className="flex-1 overflow-auto px-8 pb-8">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid #222" }}>
                {[
                  "Employee",
                  "Department",
                  "Role",
                  "Location",
                  "Status",
                  "Joined",
                ].map((h) => (
                  <th
                    key={h}
                    className="pb-3 pr-6 text-left font-normal text-gray-600"
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {h}
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr
                  key={emp.id}
                  className="cursor-pointer group"
                  onClick={() =>
                    setSelectedEmp(selectedEmp?.id === emp.id ? null : emp)
                  }
                  style={{
                    borderBottom: "1px solid #181818",
                    backgroundColor:
                      selectedEmp?.id === emp.id ? "#111" : "transparent",
                  }}
                >
                  <td className="py-3 pr-6">
                    <div className="flex items-center gap-3">
                      <Avatar emp={emp} size={34} />
                      <div>
                        <p className="text-white font-medium">
                          {emp.first_name} {emp.last_name}
                        </p>
                        <p className="text-gray-500 text-xs">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-6 text-gray-400">
                    {deptMap[emp.department_id] || "—"}
                  </td>
                  <td className="py-3 pr-6 text-gray-300">{emp.role_title}</td>
                  <td className="py-3 pr-6 text-gray-400">{emp.location}</td>
                  <td className="py-3 pr-6">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ ...SS[emp.status] }}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3 pr-6 text-gray-500 text-xs">
                    {emp.hire_date}
                  </td>
                  <td className="py-3">
                    <span className="opacity-0 group-hover:opacity-100 text-gray-500 text-sm">
                      →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedEmp && (
        <div
          className="w-72 flex-shrink-0 border-l overflow-y-auto"
          style={{ backgroundColor: "#080808", borderColor: "#222" }}
        >
          <div className="p-6">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setSelectedEmp(null)}
                className="text-gray-600 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col items-center text-center mb-5">
              <Avatar emp={selectedEmp} size={56} />
              <h2 className="text-lg font-normal mt-3 mb-1">
                {selectedEmp.first_name} {selectedEmp.last_name}
              </h2>
              <p className="text-gray-400 text-sm">{selectedEmp.role_title}</p>
              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{ ...SS[selectedEmp.status] }}
              >
                {selectedEmp.status}
              </span>
            </div>
            <div className="border-b mb-4" style={{ borderColor: "#222" }} />
            <div className="space-y-3">
              {[
                ["Department", selectedEmp.department],
                ["Location", selectedEmp.location],
                ["Manager", selectedEmp.manager],
                ["Joined", selectedEmp.hire_date],
                ["Salary", selectedEmp.salary],
                ["Email", selectedEmp.email],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-gray-600 text-xs uppercase tracking-widest">
                    {l}
                  </p>
                  <p className="text-gray-200 text-sm">{v}</p>
                </div>
              ))}
            </div>
            <div className="border-b my-4" style={{ borderColor: "#222" }} />
            <div className="space-y-2">
              <button
                onClick={() => onViewProfile(selectedEmp)}
                className="w-full py-2.5 rounded text-sm bg-white text-black hover:opacity-80 font-medium"
              >
                View Full Profile
              </button>
              <button
                onClick={() => onEditEmployee(selectedEmp)}
                className="w-full py-2.5 rounded text-sm hover:opacity-80"
                style={{
                  backgroundColor: "#111",
                  color: "#aaa",
                  border: "1px solid #2a2a2a",
                }}
              >
                Edit Employee
              </button>
              <button
                className="w-full py-2.5 rounded text-sm hover:opacity-80"
                style={{
                  backgroundColor: "#1f0f0f",
                  color: "#f05a5a",
                  border: "1px solid #3a1515",
                }}
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
