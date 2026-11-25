import React, { useState, useEffect, useMemo } from "react";
import api from "../leaveApi";

const FONT = { fontFamily: "system-ui,sans-serif" };
const MONO = { fontFamily: "monospace" };
const inputStyle = { ...FONT, backgroundColor: "#111", border: "1px solid #2a2a2a" };
const n = (v) => (Math.round(v * 100) / 100).toString();

function Bar({ b }) {
  // Bar = the whole year's allowance. Solid = used, lighter = pending, tick = earned so far.
  const total = b.annual || 0;
  const pct = (v) => (total > 0 ? Math.min(100, (v / total) * 100) : 0);
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs text-gray-400" style={FONT}>{b.name}</span>
        {b.is_paid ? (
          <span className="text-xs" style={{ ...MONO, color: b.remaining <= 0 ? "#f05a5a" : "#e5e5e5" }}>
            {n(b.remaining)} <span className="text-gray-600">available</span>
          </span>
        ) : (
          <span className="text-xs text-gray-500" style={{ ...MONO }}>{n(b.used)} used</span>
        )}
      </div>
      {b.is_paid && total > 0 && (
        <>
          <div className="relative rounded-full overflow-hidden" style={{ height: 6, backgroundColor: "#1a1a1a" }}>
            <div className="absolute inset-y-0 left-0" style={{ width: `${pct(b.used)}%`, backgroundColor: "#fff" }} />
            <div className="absolute inset-y-0" style={{ left: `${pct(b.used)}%`, width: `${pct(b.pending)}%`, backgroundColor: "#f0c85a" }} />
            {b.accrual === "monthly" && (
              <div className="absolute inset-y-0" style={{ left: `${pct(b.earned)}%`, width: 2, backgroundColor: "#5af07a" }} />
            )}
          </div>
          <p className="text-gray-600 mt-1" style={{ ...FONT, fontSize: 10 }}>
            {b.accrual === "monthly" ? `${n(b.earned)} earned of ${n(b.annual)} · ` : `${n(b.annual)} total · `}
            {n(b.used)} used{b.pending > 0 ? ` · ${n(b.pending)} pending` : ""}
          </p>
        </>
      )}
    </div>
  );
}

export default function LeaveBalancesTab() {
  const [data, setData]   = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  useEffect(() => {
    api.get("/api/leave-balances")
      .then((r) => { setData(r.data); setError(""); })
      .catch((e) => setError(e.response?.data?.message
        || (e.response?.status === 403 ? "You do not have permission to view leave balances." : "Could not load leave balances.")));
  }, []);

  const departments = useMemo(
    () => ["All", ...Array.from(new Set((data?.employees || []).map((e) => e.department))).sort()],
    [data]
  );

  const filtered = useMemo(() => (data?.employees || []).filter((emp) => {
    const q = search.trim().toLowerCase();
    return (!q || emp.name.toLowerCase().includes(q) || (emp.employee_code || "").toLowerCase().includes(q))
      && (deptFilter === "All" || emp.department === deptFilter);
  }), [data, search, deptFilter]);

  if (error) return <p className="text-sm px-3 py-2 rounded" style={{ ...FONT, color: "#f05a5a", backgroundColor: "#1f0f0f", border: "1px solid #3a1515" }}>{error}</p>;
  if (!data) return <p className="text-gray-500 text-sm" style={FONT}>Loading leave balances…</p>;

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input className="w-full pl-9 pr-4 py-2 rounded text-sm text-white placeholder-gray-600 outline-none" style={inputStyle}
            placeholder="Search employee…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="px-3 py-2 rounded text-sm text-gray-300 outline-none" style={inputStyle}
          value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
          {departments.map((d) => <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>)}
        </select>
        <div className="flex-1" />
        <span className="text-gray-600 text-sm" style={MONO}>{filtered.length} active employee{filtered.length === 1 ? "" : "s"} · {data.year}</span>
      </div>

      {data.types.length === 0 && (
        <p className="text-sm px-3 py-2 rounded" style={{ ...FONT, color: "#f0c85a", backgroundColor: "#1f1a0f", border: "1px solid #3a3010" }}>
          No leave types are active. Switch some on in the Leave Types tab to see balances here.
        </p>
      )}

      {/* Legend */}
      {data.types.length > 0 && (
        <div className="flex items-center gap-4 text-xs text-gray-600" style={FONT}>
          <span className="flex items-center gap-1.5"><i style={{ width: 10, height: 6, backgroundColor: "#fff", display: "inline-block", borderRadius: 3 }} />Used</span>
          <span className="flex items-center gap-1.5"><i style={{ width: 10, height: 6, backgroundColor: "#f0c85a", display: "inline-block", borderRadius: 3 }} />Pending</span>
          <span className="flex items-center gap-1.5"><i style={{ width: 2, height: 10, backgroundColor: "#5af07a", display: "inline-block" }} />Earned so far (monthly types)</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((emp) => (
          <div key={emp.id} className="rounded-lg p-5" style={{ backgroundColor: "#0d0d0d", border: "1px solid #1e1e1e" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full flex items-center justify-center flex-shrink-0"
                style={{ width: 34, height: 34, backgroundColor: emp.department_color || "#fff", color: "#000", fontSize: 12, fontWeight: 700, ...FONT }}>
                {emp.initials}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm truncate" style={FONT}>{emp.name}</p>
                <p className="text-gray-500 text-xs truncate" style={FONT}>{[emp.role_title, emp.department].filter(Boolean).join(" · ")}</p>
              </div>
            </div>
            <div>{emp.balances.map((b) => <Bar key={b.leave_type_id} b={b} />)}</div>
          </div>
        ))}
        {filtered.length === 0 && data.types.length > 0 && (
          <p className="col-span-2 text-center text-gray-600 text-sm py-10" style={FONT}>No active employees match.</p>
        )}
      </div>
    </div>
  );
}
