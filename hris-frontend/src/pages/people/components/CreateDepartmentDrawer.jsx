import { useState } from "react";
import { createDepartment } from "../../../services/departmentService";
import { IC, IS } from "../../../data/compData";

const DEPT_COLORS = [
  "#5a9af0", "#5af07a", "#c07af0", "#f0905a",
  "#50c8c8", "#f0c85a", "#f05a5a", "#d090f0",
  "#80c8f0", "#a0f0a0"
];

// ── SIMPLE AVATAR ─────────────────────────────────────────────────────────────
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

// ── CREATE DEPARTMENT DRAWER ──────────────────────────────────────────────────
export default function CreateDepartmentDrawer({
  onClose,
  onSave,
  employees = [], // pass all employees here
}) {
  const [form, setForm] = useState({
    name: "",
    head: "", // head_id
    description: "",
    color: DEPT_COLORS[0],
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const canSave = form.name.trim().length >= 2;

  // find selected head employee
  const selectedHead = employees.find(e => String(e.id) === String(form.head));

  // ── SAVE TO BACKEND ─────────────────────────────────────────────────────────
  async function handleSave() {
    if (!canSave) return;

    try {
      setLoading(true);
      setError("");

      const payload = {
        name: form.name,
        head_id: form.head || null,
        description: form.description,
        color: form.color,
      };

      const res = await createDepartment(payload);

      onSave(res.data);
      setSaved(true);
    } catch (err) {
      console.error(err);
      setError("Failed to create department");
    } finally {
      setLoading(false);
    }
  }

  // ── SUCCESS SCREEN ──────────────────────────────────────────────────────────
  if (saved) {
    return (
      <>
        <div
          className="fixed inset-0 z-[1000]"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={onClose}
        />
        <div
          className="fixed top-0 right-0 h-full z-[1001] flex flex-col items-center justify-center px-10"
          style={{
            width: 480,
            backgroundColor: "#080808",
            borderLeft: "1px solid #222",
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
            style={{
              backgroundColor: form.color + "22",
              border: `1px solid ${form.color}44`,
            }}
          >
            <span className="text-2xl">🏢</span>
          </div>

          <h3 className="text-lg text-white mb-2 text-center">
            Department created
          </h3>

          <p className="text-sm text-gray-500 text-center mb-4">
            <strong style={{ color: form.color }}>{form.name}</strong> has been added
            {selectedHead && (
              <>
                {" "}with{" "}
                <strong className="text-white">
                  {selectedHead.first_name} {selectedHead.last_name}
                </strong>
              </>
            )}
          </p>

          <button
            onClick={onClose}
            className="mt-4 px-5 py-2 rounded text-sm bg-white text-black"
          >
            Done
          </button>
        </div>
      </>
    );
  }

  // ── MAIN DRAWER ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[1000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full z-[1001] flex flex-col"
        style={{
          width: 480,
          backgroundColor: "#080808",
          borderLeft: "1px solid #222",
        }}
      >
        {/* Header */}
        <div className="flex justify-between px-7 py-5 border-b border-[#1a1a1a]">
          <div>
            <p className="text-xs text-gray-500">People · Departments</p>
            <h2 className="text-lg text-white">Create Department</h2>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          {/* Name */}
          <div>
            <label className="text-xs text-gray-500">Department Name</label>
            <input
              className={IC}
              style={IS}
              value={form.name}
              onChange={e => set("name", e.target.value)}
            />
          </div>

          {/* Head */}
          <div>
            <label className="text-xs text-gray-500">
              Department Head (optional)
            </label>

            <select
              className={IC}
              style={IS}
              value={form.head}
              onChange={e => set("head", e.target.value)}
            >
              <option value="">— Select —</option>
              {employees
                .sort((a, b) =>
                  `${a.first_name} ${a.last_name}`.localeCompare(
                    `${b.first_name} ${b.last_name}`
                  )
                )
                .map(e => (
                  <option key={e.id} value={e.id}>
                    {e.first_name} {e.last_name} · {e.role_title || "No Role"}
                  </option>
                ))
              }
            </select>

            {selectedHead && (
              <div className="mt-2 flex items-center gap-3 p-2 border border-[#222] rounded">
                <Avatar emp={selectedHead} />
                <div>
                  <p className="text-white text-sm">
                    {selectedHead.first_name} {selectedHead.last_name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {selectedHead.role_title || "No Role"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Color */}
          <div>
            <label className="text-xs text-gray-500">Color</label>
            <div className="flex gap-2 mt-2">
              {DEPT_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => set("color", c)}
                  className="w-8 h-8 rounded-full"
                  style={{
                    backgroundColor: c,
                    border: form.color === c ? "2px solid #fff" : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-7 py-5 flex justify-between border-t border-[#1a1a1a]">
          <button onClick={onClose} className="text-gray-400">
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={!canSave || loading}
            className="px-5 py-2 bg-white text-black rounded"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </>
  );
}