import React, { useState, useMemo } from "react";
import BalanceBar from "./BalanceBar";
import {
  EMPLOYEES, Avatar, DEPTS, LEAVE_BALANCES
} from "../../../data/compData";

export default function LeaveBalancesTab() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  const filtered = useMemo(() => EMPLOYEES.filter(emp => {
    const q = search.toLowerCase();
    return (!q || emp.name.toLowerCase().includes(q))
      && (deptFilter === "All" || emp.dept === deptFilter);
  }), [search, deptFilter]);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input className="w-full pl-9 pr-4 py-2 rounded text-sm text-white placeholder-gray-600 outline-none"
            style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", border:"1px solid #2a2a2a" }}
            placeholder="Search employee…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="px-3 py-2 rounded text-sm text-gray-300 outline-none" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#111", border:"1px solid #2a2a2a" }}
          value={deptFilter} onChange={e=>setDeptFilter(e.target.value)}>
          {DEPTS.map(d=><option key={d}>{d==="All"?"All Departments":d}</option>)}
        </select>
        <div className="flex-1" />
        <span className="text-gray-600 text-sm" style={{ fontFamily:"monospace" }}>{filtered.length} employees</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map(emp => {
          const b = LEAVE_BALANCES.find(b=>b.empId===emp.id);
          if (!b) return null;
          const annualPct = (b.annual.used/b.annual.total)*100;
          const isLow = (b.annual.total - b.annual.used) <= 2;
          return (
            <div key={emp.id} className="rounded-lg p-5" style={{ backgroundColor:"#0d0d0d", border:`1px solid ${isLow?"#3a1515":"#1e1e1e"}` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar emp={emp} size={34} />
                  <div>
                    <p className="text-white text-sm" style={{ fontFamily:"system-ui,sans-serif" }}>{emp.name}</p>
                    <p className="text-gray-500 text-xs" style={{ fontFamily:"system-ui,sans-serif" }}>{emp.dept}</p>
                  </div>
                </div>
                {isLow && <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily:"system-ui,sans-serif", backgroundColor:"#1f0f0f", color:"#f05a5a" }}>Low</span>}
              </div>
              <div className="space-y-3">
                <BalanceBar label="Annual Leave"    used={b.annual.used}    total={b.annual.total} />
                <BalanceBar label="Sick Leave"      used={b.sick.used}      total={b.sick.total} />
                <BalanceBar label="Emergency Leave" used={b.emergency.used} total={b.emergency.total} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}