import { useState } from "react";

const stats = [
  { label: "Total Employees", value: "1,284", change: "+12", positive: true, icon: "👥" },
  { label: "Open Positions", value: "34", change: "+5", positive: true, icon: "📋" },
  { label: "On Leave Today", value: "18", change: "-3", positive: false, icon: "🏖️" },
  { label: "Avg. Tenure", value: "3.2y", change: "+0.4", positive: true, icon: "⏳" },
];

const recentActivity = [
  { name: "Sara Okafor", action: "Joined Engineering", time: "2h ago", avatar: "SO", bg: "#ffffff", fg: "#000000" },
  { name: "Marcus Chen", action: "Requested PTO · Dec 24–27", time: "4h ago", avatar: "MC", bg: "#555555", fg: "#ffffff" },
  { name: "Priya Nair", action: "Completed onboarding", time: "6h ago", avatar: "PN", bg: "#222222", fg: "#ffffff" },
  { name: "James Kowalski", action: "Performance review due", time: "1d ago", avatar: "JK", bg: "#888888", fg: "#000000" },
  { name: "Leila Farouk", action: "Promoted to Senior PM", time: "2d ago", avatar: "LF", bg: "#ffffff", fg: "#000000" },
];

const departments = [
  { name: "Engineering", count: 312, pct: 78 },
  { name: "Sales", count: 204, pct: 51 },
  { name: "Marketing", count: 98, pct: 24 },
  { name: "Operations", count: 187, pct: 47 },
  { name: "HR & Admin", count: 64, pct: 16 },
];

const quickActions = [
  { label: "Add Employee", icon: "＋", primary: true },
  { label: "Run Payroll", icon: "💳", primary: false },
  { label: "Post Job", icon: "📌", primary: false },
  { label: "Reports", icon: "📊", primary: false },
];

export default function Dashboard() {

  return (
    <div className="min-h-screen text-white" style={{ fontFamily: "'Georgia', serif", backgroundColor: "#000000" }}>
      <div className="px-8 py-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-gray-500 text-sm uppercase tracking-widest mb-1" style={{ fontFamily: "system-ui, sans-serif" }}>
              Friday, Feb 20 · Q1 2026
            </p>
            <h1 className="text-4xl font-normal text-white" style={{ letterSpacing: "-0.02em" }}>
              Good morning, <span className="text-gray-400">Alex.</span>
            </h1>
          </div>
          <div className="flex gap-3">
            {quickActions.map((a) => (
              <button
                key={a.label}
                className="px-4 py-2 rounded text-sm font-medium transition-all flex items-center gap-2 hover:opacity-80"
                style={{
                  fontFamily: "system-ui, sans-serif",
                  backgroundColor: a.primary ? "#ffffff" : "#111111",
                  color: a.primary ? "#000000" : "#aaaaaa",
                  border: a.primary ? "none" : "1px solid #2a2a2a",
                }}
              >
                <span>{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg p-5"
              style={{ backgroundColor: "#0d0d0d", border: "1px solid #222222" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{s.icon}</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: s.positive ? "#0f1f0f" : "#1f0f0f",
                    color: s.positive ? "#5af07a" : "#f05a5a",
                  }}
                >
                  {s.positive ? "▲" : "▼"} {s.change}
                </span>
              </div>
              <p className="text-3xl font-light text-white mb-1" style={{ letterSpacing: "-0.02em" }}>
                {s.value}
              </p>
              <p className="text-gray-500 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="col-span-2 rounded-lg p-6" style={{ backgroundColor: "#0d0d0d", border: "1px solid #222222" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-normal text-white">Recent Activity</h2>
              <button className="text-sm text-gray-400 hover:text-white transition-colors" style={{ fontFamily: "system-ui, sans-serif" }}>
                View all →
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0" style={{ borderColor: "#1e1e1e" }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                    style={{ backgroundColor: item.bg, color: item.fg, fontFamily: "system-ui, sans-serif" }}
                  >
                    {item.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.name}</p>
                    <p className="text-gray-500 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>{item.action}</p>
                  </div>
                  <span className="text-gray-600 text-xs whitespace-nowrap" style={{ fontFamily: "monospace" }}>
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Departments */}
            <div className="rounded-lg p-6" style={{ backgroundColor: "#0d0d0d", border: "1px solid #222222" }}>
              <h2 className="text-lg font-normal text-white mb-5">Headcount by Dept.</h2>
              <div className="space-y-4">
                {departments.map((d) => (
                  <div key={d.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300" style={{ fontFamily: "system-ui, sans-serif" }}>{d.name}</span>
                      <span className="text-sm text-gray-500" style={{ fontFamily: "monospace" }}>{d.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#2a2a2a" }}>
                      <div
                        className="h-full rounded-full bg-white"
                        style={{ width: `${d.pct}%`, transition: "width 1s ease" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming */}
            <div className="rounded-lg p-6" style={{ backgroundColor: "#0d0d0d", border: "1px solid #222222" }}>
              <h2 className="text-lg font-normal text-white mb-4">Upcoming</h2>
              <div className="space-y-3">
                {[
                  { label: "Q4 Performance Reviews", date: "Feb 25", tag: "Reviews" },
                  { label: "Payroll cutoff", date: "Mar 1", tag: "Payroll" },
                  { label: "Benefits enrollment ends", date: "Mar 5", tag: "Benefits" },
                ].map((ev, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-gray-400 text-xs mt-0.5 whitespace-nowrap" style={{ fontFamily: "monospace" }}>{ev.date}</span>
                    <div>
                      <p className="text-gray-200 text-sm">{ev.label}</p>
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ fontFamily: "system-ui, sans-serif", backgroundColor: "#1e1e1e", color: "#888888" }}
                      >
                        {ev.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
