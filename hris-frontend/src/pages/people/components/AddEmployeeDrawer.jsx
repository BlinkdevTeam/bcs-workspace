"use client";
import { useState } from "react";
import { createEmployee } from "../../../services/employeeService";
import { TextInput, Select, DatePicker } from "../../../components/form";
import { IC, IS } from "../../../data/compData";

// ── ADD EMPLOYEE DRAWER ───────────────────────────────────────────────────────
export default function AddEmployeeDrawer({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    dept: "",
    location: "New York",
    status: "Active",
    joined: "",
    salary: "",
    payFreq: "Bi-weekly",
    empType: "Full-time",
    manager: "",
    schedule: "Mon–Fri, 9am–5pm",
    benefits: "Standard",
    gender: "",
    dob: "",
    personal_email: "",
  });

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleSave() {
    const names = form.name.trim().split(" ");
    const first_name = names[0] || "";
    const last_name = names.slice(1).join(" ") || "";

    const hire_date = form.joined
      ? new Date(form.joined).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    // Map department/manager names to UUIDs
    const departmentMap = {
      Engineering: "UUID-OF-ENGINEERING",
      Sales: "UUID-OF-SALES",
      "HR & Admin": "UUID-OF-HR",
      Product: "UUID-OF-PRODUCT",
      Design: "UUID-OF-DESIGN",
      Operations: "UUID-OF-OPERATIONS",
      Marketing: "UUID-OF-MARKETING",
    };

    const managerMap = {
      "Sara Okafor": "UUID-OF-SARA",
      "Noah Kim": "UUID-OF-NOAH",
      "Devon Park": "UUID-OF-DEVON",
      CEO: "UUID-OF-CEO",
      "Rita Vance": "UUID-OF-RITA",
      "Leila Farouk": "UUID-OF-LEILA",
    };

    const payload = {
      employee_code: `EMP${Date.now()}`,
      first_name,
      last_name,
      middle_name: "",
      email: form.email,
      personal_email: form.personal_email || null,
      phone: form.phone || null,
      avatar_initials:
        form.name
          .split(" ")
          .map((w) => w[0] || "")
          .join("")
          .slice(0, 2)
          .toUpperCase() || "??",
      department_id: form.dept ? departmentMap[form.dept] || null : null,
      role_title: form.role,
      employment_type: form.empType,
      status: form.status.toLowerCase(),
      hire_date,
      end_date: null,
      manager_id: form.manager ? managerMap[form.manager] || null : null,
      gender: form.gender || null,
      dob: form.dob ? new Date(form.dob).toISOString().split("T")[0] : null,
      location: form.location || null,
      schedule: form.schedule || null,
      salary: form.salary || null,
      pay_frequency: form.payFreq || null,
      benefits: form.benefits || null,
    };

    createEmployee(payload)
      .then((res) => {
        console.log("Employee created:", res.data);
        onClose();
        if (onSave) onSave(res.data);
      })
      .catch((err) => {
        console.error("Error creating employee:", err);
        alert("Failed to create employee. Check console for details.");
      });
  }

  return (
    <>
      <div
        className="fixed inset-0 z-20"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
      />
      <div
        className="fixed top-0 right-0 h-full z-30 flex flex-col"
        style={{
          width: 480,
          backgroundColor: "#080808",
          borderLeft: "1px solid #222",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.8)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-7 py-5 flex-shrink-0"
          style={{ borderBottom: "1px solid #1a1a1a" }}
        >
          <div>
            <h2 className="text-base font-normal text-white">
              Add New Employee
            </h2>
            <p
              className="text-gray-500 text-sm mt-0.5"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Fill in the details below
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          <p
            className="text-xs uppercase tracking-widest text-gray-600 pb-1"
            style={{
              fontFamily: "system-ui, sans-serif",
              borderBottom: "1px solid #1a1a1a",
            }}
          >
            Basic Info
          </p>
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="First Name"
              placeholder="Sara"
              className={IC}
              style={IS}
              value={form.name.split(" ")[0]}
              onChange={(e) =>
                set(
                  "name",
                  e.target.value +
                    " " +
                    form.name.split(" ").slice(1).join(" "),
                )
              }
            />
            <TextInput
              label="Last Name"
              placeholder="Okafor"
              className={IC}
              style={IS}
              value={form.name.split(" ").slice(1).join(" ")}
              onChange={(e) =>
                set(
                  "name",
                  (form.name.split(" ")[0] || "") + " " + e.target.value,
                )
              }
            />
          </div>
          <TextInput
            label="Work Email"
            placeholder="name@company.com"
            className={IC}
            style={IS}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
          <TextInput
            label="Phone"
            placeholder="+1 212 555 0000"
            className={IC}
            style={IS}
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <DatePicker
              label="Date of Birth"
              value={form.dob}
              onChange={(e) => set("dob", e.target.value)}
              maxDate={new Date()} // prevents future birthdates
              className={IC}
              style={IS}
            />
            <Select
              label="Gender"
              value={form.gender}
              onChange={(e) => set("gender", e.target.value)}
              options={["Male", "Female", "Non-binary", "Prefer not to say"]}
              className={IC}
              style={IS}
            />
          </div>

          <p
            className="text-xs uppercase tracking-widest text-gray-600 pt-2 pb-1"
            style={{
              fontFamily: "system-ui, sans-serif",
              borderBottom: "1px solid #1a1a1a",
            }}
          >
            Job Details
          </p>
          <TextInput
            label="Job Title"
            placeholder="Senior Engineer"
            className={IC}
            style={IS}
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Department"
              value={form.dept}
              onChange={(e) => set("dept", e.target.value)}
              options={[
                "Engineering",
                "Sales",
                "Product",
                "Design",
                "Operations",
                "Marketing",
                "HR & Admin",
              ]}
              className={IC}
              style={IS}
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              options={["Active", "On Leave", "Inactive"]}
              className={IC}
              style={IS}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Location"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              options={["New York", "Chicago", "Austin", "Remote"]}
              className={IC}
              style={IS}
            />
            <Select
              label="Manager"
              value={form.manager}
              onChange={(e) => set("manager", e.target.value)}
              options={[
                "CEO",
                "Devon Park",
                "Sara Okafor",
                "Rita Vance",
                "Leila Farouk",
                "Noah Kim",
              ]}
              className={IC}
              style={IS}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DatePicker
              label="Start Date"
              value={form.joined}
              onChange={(e) => set("joined", e.target.value)}
              className={IC}
              style={IS}
            />
            <Select
              label="Work Schedule"
              value={form.schedule}
              onChange={(e) => set("schedule", e.target.value)}
              options={[
                "Mon–Fri, 9am–5pm",
                "Mon–Fri, Flexible",
                "4-day week",
                "Remote / Async",
              ]}
              className={IC}
              style={IS}
            />
          </div>
          <Select
            label="Employment Type"
            value={form.empType}
            onChange={(e) => set("empType", e.target.value)}
            options={["Full-time", "Part-time", "Contractor", "Intern"]}
            className={IC}
            style={IS}
          />
        </div>

        {/* Footer */}
        <div
          className="px-7 py-5 flex items-center justify-between flex-shrink-0"
          style={{ borderTop: "1px solid #1a1a1a" }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded text-sm hover:opacity-80"
            style={{
              fontFamily: "system-ui, sans-serif",
              backgroundColor: "#111",
              color: "#aaa",
              border: "1px solid #2a2a2a",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded text-sm font-medium bg-white text-black hover:opacity-80"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            Add Employee ✓
          </button>
        </div>
      </div>
    </>
  );
}
