import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { EmptyState, Card, Badge } from "../../components/ui";
import { getDashboardStats } from "../../services/statsService";

const upcomingEvents = [
  { label: "Q4 Performance Reviews", date: "Feb 25", tag: "Reviews", color: "yellow" },
  { label: "Payroll cutoff", date: "Mar 1", tag: "Payroll", color: "green" },
  { label: "Benefits enrollment ends", date: "Mar 5", tag: "Benefits", color: "blue" },
];

const recentActivity = [];

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

  /* ---------------- Redux User ---------------- */

  const user = useSelector((state) => state.auth.user);

  const currentUser = user
    ? {
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      }
    : { name: "User" };

  /* ---------------- State ---------------- */

  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState("");

  /* ---------------- Date / Time ---------------- */

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const options = {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Manila",
      };

      setCurrentDateTime(new Intl.DateTimeFormat("en-PH", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- Fetch Dashboard Stats ---------------- */

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);

        await new Promise((res) => setTimeout(res, 1500)); // simulate network delay

        const data = await getDashboardStats();

        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div
      className="min-h-screen text-white"
      style={{ fontFamily: "'Georgia', serif", backgroundColor: "#000000" }}
    >
      <div className="px-8 py-8 max-w-7xl mx-auto">

        {/* Header */}

        <div className="flex items-start justify-between mb-10">
          <div>
            <p
              className="text-gray-500 text-sm uppercase tracking-widest mb-1"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {currentDateTime}
            </p>

            <h1 className="text-4xl font-normal text-white">
              Good morning,{" "}
              <span className="text-gray-400">
                {currentUser?.name?.split(" ")[0]}
              </span>
              .
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

        {/* Stats Cards */}

        <div className="grid grid-cols-3 gap-4 mb-8">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card
                  key={i}
                  className="p-5 animate-pulse bg-gray-800 border border-gray-700 h-36"
                />
              ))
            : stats.map((s) => (
                <Card key={s.label} className="p-5">
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

                  <p className="text-3xl font-light text-white mb-1">
                    {s.value}
                  </p>

                  <p
                    className="text-gray-500 text-sm"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    {s.label}
                  </p>
                </Card>
              ))}
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* Activity Feed */}

          <div
            className="col-span-2 rounded-lg p-6"
            style={{ backgroundColor: "#0d0d0d", border: "1px solid #222222" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-normal text-white">
                Recent Activity
              </h2>

              <button
                className="text-sm text-gray-400 hover:text-white transition-colors"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                View all →
              </button>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Card
                    key={i}
                    className="h-12 w-full rounded-md animate-pulse bg-gray-800 border border-gray-700"
                  />
                ))
              ) : recentActivity.length === 0 ? (
                <EmptyState
                  title="No Recent Activity"
                  description="There have been no actions recently."
                  icon="📝"
                />
              ) : (
                recentActivity.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 py-3 border-b last:border-0"
                    style={{ borderColor: "#1e1e1e" }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                      style={{ backgroundColor: item.bg, color: item.fg }}
                    >
                      {item.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-gray-500 text-sm">{item.action}</p>
                    </div>

                    <span className="text-gray-600 text-xs whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column */}

          <div className="space-y-6">

            {/* Departments */}

            <div
              className="rounded-lg p-6"
              style={{
                backgroundColor: "#0d0d0d",
                border: "1px solid #222222",
              }}
            >
              <h2 className="text-lg font-normal text-white mb-5">
                Headcount by Dept.
              </h2>

              <div className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                      <div className="h-3 w-3/4 rounded bg-gray-700 animate-pulse" />
                      <div className="h-1.5 rounded-full bg-gray-800 animate-pulse" />
                    </div>
                  ))
                ) : departments.length === 0 ? (
                  <EmptyState
                    title="No Departments"
                    description="There are no departments to display."
                    icon="🏢"
                  />
                ) : (
                  departments.map((d) => (
                    <div key={d.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-300">{d.name}</span>
                        <span className="text-sm text-gray-500">{d.count}</span>
                      </div>

                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ backgroundColor: "#2a2a2a" }}
                      >
                        <div
                          className="h-full rounded-full bg-white"
                          style={{
                            width: `${d.pct}%`,
                            transition: "width 1s ease",
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming */}

            <div
              className="rounded-lg p-6"
              style={{
                backgroundColor: "#0d0d0d",
                border: "1px solid #222222",
              }}
            >
              <h2 className="text-lg font-normal text-white mb-4">Upcoming</h2>

              <div className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-3 w-10 rounded bg-gray-700 animate-pulse mt-1" />
                      <div className="flex-1 space-y-1">
                        <div className="h-4 w-3/4 rounded bg-gray-700 animate-pulse" />
                        <div className="h-3 w-20 rounded bg-gray-800 animate-pulse" />
                      </div>
                    </div>
                  ))
                ) : upcomingEvents.length > 0 ? (
                  upcomingEvents.map((ev, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span
                        className="text-gray-400 text-xs mt-0.5 whitespace-nowrap max-w-[42px] w-full"
                        style={{ fontFamily: "monospace" }}
                      >
                        {ev.date}
                      </span>

                      <div>
                        <p className="text-gray-200 text-sm">{ev.label}</p>
                        <Badge color={ev.color || "gray"}>{ev.tag}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    title="No Upcoming Events"
                    description="You have no scheduled events at the moment."
                    icon="📅"
                  />
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}