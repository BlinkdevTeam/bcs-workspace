import api from "./api";

/**
 * Get employees count
 */
export const getEmployeesCount = () => {
  return api.get("api/employees/count");
};

/**
 * Get job openings count
 */
export const getJobOpeningsCount = () => {
  return api.get("api/job_openings/count");
};

/**
 * Get today's attendance count
 */
export const getTodayAttendanceCount = () => {
  return api.get("api/attendance/today/count");
};

/**
 * Get all dashboard stats
 */
export const getDashboardStats = async () => {
  const [empRes, jobRes, attRes] = await Promise.all([
    getEmployeesCount(),
    getJobOpeningsCount(),
    getTodayAttendanceCount(),
  ]);

  return [
    {
      label: "Total Employees",
      value: empRes.data.count,
      icon: "👥",
      positive: true,
      change: "—",
    },
    {
      label: "Open Positions",
      value: jobRes.data.count,
      icon: "📋",
      positive: true,
      change: "—",
    },
    {
      label: "On Leave Today",
      value: attRes.data.count,
      icon: "🏖️",
      positive: false,
      change: "—",
    },
  ];
};
