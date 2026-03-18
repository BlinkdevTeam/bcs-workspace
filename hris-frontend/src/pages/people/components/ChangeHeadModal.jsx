import { useState } from "react";
import { Avatar } from "../../../data/compData";

// ── CHANGE HEAD MODAL ─────────────────────────────────────────────────────────
function ChangeHeadModal({ department, employees, onClose, onSave }) {
  const currentHead = employees.find((e) => e.id === department.head_id);
  const [selected, setSelected] = useState(department.head_id || null);
  const isUnchanged = selected === department.head_id;
  const [search, setSearch] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const candidates = employees
    .filter((e) => e.status?.toLowerCase() === "active")
    .filter((e) => {
      const fullName = `${e.first_name} ${e.last_name}`.toLowerCase();
      const role = e.role_title?.toLowerCase() || "";

      return (
        !search.trim() ||
        fullName.includes(search.toLowerCase()) ||
        role.includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      // department members first
      const aInDept = a.department_id === department.id;
      const bInDept = b.department_id === department.id;
      if (aInDept && !bInDept) return -1;
      if (!aInDept && bInDept) return 1;
      return a.name.localeCompare(b.name);
    });

  const selectedEmp = employees.find((e) => e.id === selected);

  function handleConfirm() {
    onSave(selected);
    setConfirmed(true);
  }

  if (confirmed) {
    const newHead = employees.find((e) => e.id === selected);
    return (
      <>
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
          onClick={onClose}
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="w-full max-w-sm rounded-xl flex flex-col items-center py-10 px-8 text-center"
            style={{ backgroundColor: "#0d0d0d", border: "1px solid #2a2a2a" }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{
                backgroundColor: department.color + "18",
                border: `1px solid ${department.color}44`,
              }}
            >
              <span className="text-2xl">👑</span>
            </div>
            <h3 className="text-lg font-normal text-white mb-2">
              Head updated
            </h3>
            {newHead ? (
              <>
                <div className="flex items-center gap-3 justify-center mb-1">
                  <Avatar emp={newHead} size={32} />
                  <p
                    className="text-white text-sm"
                    style={{ fontFamily: "system-ui,sans-serif" }}
                  >
                    {newHead.name}
                  </p>
                </div>
                <p
                  className="text-gray-500 text-sm mt-1"
                  style={{ fontFamily: "system-ui,sans-serif" }}
                >
                  is now the head of{" "}
                  <span style={{ color: department.color }}>
                    {department.name}
                  </span>
                  .
                </p>
              </>
            ) : (
              <p
                className="text-gray-500 text-sm"
                style={{ fontFamily: "system-ui,sans-serif" }}
              >
                Department head has been cleared for{" "}
                <span style={{ color: department.color }}>
                  {department.name}
                </span>
                .
              </p>
            )}
            <button
              onClick={onClose}
              className="mt-6 px-5 py-2 rounded text-sm bg-white text-black hover:opacity-80"
              style={{ fontFamily: "system-ui,sans-serif" }}
            >
              Done
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div
          className="w-full max-w-md rounded-xl flex flex-col"
          style={{
            backgroundColor: "#0d0d0d",
            border: "1px solid #2a2a2a",
            maxHeight: "85vh",
          }}
        >
          {/* Header */}
          <div
            className="flex items-start justify-between px-6 py-5 flex-shrink-0"
            style={{ borderBottom: "1px solid #1e1e1e" }}
          >
            <div>
              <p
                className="text-xs uppercase tracking-widest text-gray-500 mb-0.5"
                style={{ fontFamily: "system-ui,sans-serif" }}
              >
                {department.name} · Department Head
              </p>
              <h2 className="text-lg font-normal text-white">
                Change Department Head
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white text-xl mt-0.5"
            >
              ✕
            </button>
          </div>

          {/* Current head */}
          <div className="px-6 pt-4 pb-3 flex-shrink-0">
            <p
              className="text-xs uppercase tracking-widest text-gray-600 mb-2"
              style={{ fontFamily: "system-ui,sans-serif" }}
            >
              Current Head
            </p>
            {currentHead ? (
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                style={{
                  backgroundColor: "#111",
                  border: `1px solid ${department.color}33`,
                }}
              >
                <Avatar emp={currentHead} size={32} />
                <div className="flex-1">
                  <p
                    className="text-gray-200 text-sm"
                    style={{ fontFamily: "system-ui,sans-serif" }}
                  >
                    {currentHead.name}
                  </p>
                  <p
                    className="text-gray-500 text-xs"
                    style={{ fontFamily: "system-ui,sans-serif" }}
                  >
                    {currentHead.role} · {currentHead.department}
                  </p>
                </div>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    fontFamily: "system-ui,sans-serif",
                    backgroundColor: department.color + "18",
                    color: department.color,
                  }}
                >
                  Current
                </span>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                style={{ backgroundColor: "#111", border: "1px solid #2a2a2a" }}
              >
                <span
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: "system-ui,sans-serif" }}
                >
                  No head assigned
                </span>
              </div>
            )}
          </div>

          {/* Arrow */}
          <div className="flex justify-center flex-shrink-0 py-1">
            <span className="text-gray-700 text-sm">↓</span>
          </div>

          {/* Search */}
          <div className="px-6 pb-3 flex-shrink-0">
            <p
              className="text-xs uppercase tracking-widest text-gray-600 mb-2"
              style={{ fontFamily: "system-ui,sans-serif" }}
            >
              Select New Head
            </p>
            <div className="relative">
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
                placeholder="Search by name or role…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Employee list */}
          <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-1">
            {/* Clear option */}
            <button
              onClick={() => setSelected(null)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
              style={{
                backgroundColor: selected === null ? "#1a1a0a" : "#111",
                border: `1px solid ${selected === null ? "#3a3010" : "#2a2a2a"}`,
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                }}
              >
                <span className="text-xs text-gray-500">—</span>
              </div>
              <div className="flex-1 text-left">
                <p
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: "system-ui,sans-serif" }}
                >
                  No head assigned
                </p>
                <p
                  className="text-gray-600 text-xs"
                  style={{ fontFamily: "system-ui,sans-serif" }}
                >
                  Clear current assignment
                </p>
              </div>
              {selected === null && (
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: "#f0c85a22",
                    border: "1.5px solid #f0c85a",
                  }}
                >
                  <span
                    style={{ fontSize: 8, color: "#f0c85a", lineHeight: 1 }}
                  >
                    ✓
                  </span>
                </div>
              )}
            </button>

            {/* Dept members group header */}
            {candidates.some((e) => e.department === department.name) && (
              <p
                className="text-xs uppercase tracking-widest text-gray-700 pt-2 pb-1 px-1"
                style={{ fontFamily: "system-ui,sans-serif" }}
              >
                {department.name} members
              </p>
            )}

            {candidates.map((emp, i) => {
              const isSelected = selected === emp.id;
              const isCurrent = emp.id === department.head_id;
              const inDept = emp.department === department.name;
              // group separator between department members and others
              const prevEmp = candidates[i - 1];
              const showOtherHeader =
                !inDept && prevEmp?.department === department.name;

              return (
                <div key={emp.id}>
                  {showOtherHeader && (
                    <p
                      className="text-xs uppercase tracking-widest text-gray-700 pt-2 pb-1 px-1"
                      style={{ fontFamily: "system-ui,sans-serif" }}
                    >
                      Other employees
                    </p>
                  )}
                  <button
                    onClick={() => setSelected(emp.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
                    style={{
                      backgroundColor: isSelected
                        ? department.color + "10"
                        : "#111",
                      border: `1px solid ${isSelected ? department.color + "44" : "#2a2a2a"}`,
                    }}
                  >
                    <Avatar emp={emp} size={32} />
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p
                          className="text-gray-200 text-sm"
                          style={{ fontFamily: "system-ui,sans-serif" }}
                        >
                          {emp.first_name}
                        </p>
                        {isCurrent && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{
                              fontFamily: "system-ui,sans-serif",
                              backgroundColor: department.color + "18",
                              color: department.color,
                            }}
                          >
                            Current
                          </span>
                        )}
                      </div>
                      <p
                        className="text-gray-500 text-xs"
                        style={{ fontFamily: "system-ui,sans-serif" }}
                      >
                        {emp.role}
                        {!inDept && (
                          <span className="text-gray-700">
                            {" "}
                            · {emp.department}
                          </span>
                        )}
                      </p>
                    </div>
                    {isSelected && (
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: department.color + "22",
                          border: `1.5px solid ${department.color}`,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 8,
                            color: department.color,
                            lineHeight: 1,
                          }}
                        >
                          ✓
                        </span>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}

            {candidates.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <p
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: "system-ui,sans-serif" }}
                >
                  No employees match "{search}"
                </p>
              </div>
            )}
          </div>

          {/* Selected preview + confirm */}
          <div
            className="px-6 py-4 flex-shrink-0"
            style={{ borderTop: "1px solid #1e1e1e" }}
          >
            {!isUnchanged && selectedEmp && (
              <div
                className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #1e1e1e",
                }}
              >
                <span
                  className="text-xs text-gray-600"
                  style={{ fontFamily: "system-ui,sans-serif" }}
                >
                  New head:
                </span>
                <Avatar emp={selectedEmp} size={20} />
                <span
                  className="text-gray-200 text-sm"
                  style={{ fontFamily: "system-ui,sans-serif" }}
                >
                  {selectedEmp.name}
                </span>
                <span
                  className="text-gray-600 text-xs"
                  style={{ fontFamily: "system-ui,sans-serif" }}
                >
                  · {selectedEmp.role}
                </span>
              </div>
            )}
            {!isUnchanged && selected === null && (
              <div
                className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: "#1a1a0a",
                  border: "1px solid #3a3010",
                }}
              >
                <span
                  className="text-xs"
                  style={{
                    fontFamily: "system-ui,sans-serif",
                    color: "#f0c85a",
                  }}
                >
                  ⚠ This will remove the current department head assignment.
                </span>
              </div>
            )}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded text-sm hover:opacity-80"
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
                onClick={handleConfirm}
                disabled={isUnchanged}
                className="flex-1 py-2 rounded text-sm font-medium transition-all"
                style={{
                  fontFamily: "system-ui,sans-serif",
                  backgroundColor: isUnchanged ? "#1a1a1a" : "#fff",
                  color: isUnchanged ? "#444" : "#000",
                  cursor: isUnchanged ? "not-allowed" : "pointer",
                }}
              >
                {isUnchanged
                  ? "No changes made"
                  : selected === null
                    ? "Remove Head"
                    : "Confirm Change"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangeHeadModal;
