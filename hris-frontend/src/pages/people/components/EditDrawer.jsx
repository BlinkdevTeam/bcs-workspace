import { useState, useEffect } from "react";
import { Avatar, Field, IC, IS } from "../../../data/compData";
import { getDepartments } from "../../../services/departmentService";
import { updateEmployee } from "../../../services/employeeService";

// ── EDIT DRAWER ───────────────────────────────────────────────────────────────
export default function EditDrawer({ emp, onClose, onSave }) {
  const [form, setForm] = useState({ ...emp });
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [errorDepts, setErrorDepts] = useState("");

  const [saving, setSaving] = useState(false);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  // ── FETCH DEPARTMENTS ──────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    async function fetchDepts() {
      try {
        const res = await getDepartments();
        const deptArray = Array.isArray(res.data) ? res.data : [];
        if (mounted) setDepartments(deptArray);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
        if (mounted) setErrorDepts("Failed to load departments");
      } finally {
        if (mounted) setLoadingDepts(false);
      }
    }
    fetchDepts();
    return () => { mounted = false; };
  }, []);

  // ── SAVE CHANGES ─────────────────────────────────────────────────
  async function handleSave() {
    setSaving(true);
    try {
      // Prepare payload for backend
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        role_title: form.role_title,
        department_id: form.department_id || null,
        status: form.status,
      };

      await updateEmployee(emp.id, payload);

      // Update parent state (frontend)
      onSave({ ...form });

      onClose();
    } catch (err) {
      console.error("Failed to save employee:", err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-20"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
      />

      {/* Drawer */}
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
        <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: "1px solid #1a1a1a" }}>
          <div className="flex items-center gap-3">
            <Avatar emp={emp} size={38} />
            <div>
              <h2 className="text-base font-normal text-white">Edit Employee</h2>
              <p className="text-gray-500 text-sm" style={{ fontFamily: "system-ui,sans-serif" }}>
                {emp.first_name} {emp.last_name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white text-xl">✕</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name">
              <input
                className={IC}
                style={IS}
                value={form.first_name || ""}
                onChange={(e) => set("first_name", e.target.value)}
              />
            </Field>
            <Field label="Last Name">
              <input
                className={IC}
                style={IS}
                value={form.last_name || ""}
                onChange={(e) => set("last_name", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Work Email">
            <input
              className={IC}
              style={IS}
              value={form.email || ""}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>

          <Field label="Job Title">
            <input
              className={IC}
              style={IS}
              value={form.role_title || ""}
              onChange={(e) => set("role_title", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Department">
              {loadingDepts ? (
                <select className={IC} style={IS} disabled>
                  <option>Loading...</option>
                </select>
              ) : errorDepts ? (
                <select className={IC} style={IS} disabled>
                  <option>{errorDepts}</option>
                </select>
              ) : (
                <select
                  className={IC}
                  style={IS}
                  value={form.department_id || ""}
                  onChange={(e) => set("department_id", e.target.value)}
                >
                  <option value="">— Select Department —</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              )}
            </Field>

            <Field label="Status">
              <select
                className={IC}
                style={IS}
                value={form.status || "Active"}
                onChange={(e) => set("status", e.target.value)}
              >
                <option>Active</option>
                <option>On Leave</option>
                <option>Inactive</option>
              </select>
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-5 flex items-center justify-between" style={{ borderTop: "1px solid #1a1a1a" }}>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded text-sm hover:opacity-80"
            style={{
              fontFamily: "system-ui,sans-serif",
              backgroundColor: "#111",
              color: "#aaa",
              border: "1px solid #2a2a2a",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded text-sm font-medium bg-white text-black hover:opacity-80"
            style={{ fontFamily: "system-ui,sans-serif" }}
          >
            {saving ? "Saving..." : "Save Changes ✓"}
          </button>
        </div>
      </div>
    </>
  );
}