"use strict";

const { sequelize } = require("../config/database");

// GET /api/leave-balances
// Every ACTIVE employee x every ACTIVE leave type, for the current year.
// Nothing is written: an employee with no balance row yet is shown at the type's full yearly allowance.
// 'monthly' types are earned days_per_year / 12 on the 1st of each month.
exports.list = async (_req, res) => {
  try {
    const year  = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    // keep older databases working: these columns are added on demand elsewhere too
    await sequelize.query(`ALTER TABLE leave_types ADD COLUMN IF NOT EXISTS accrual_type VARCHAR(10) NOT NULL DEFAULT 'upfront';
                           ALTER TABLE leave_types ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
                           ALTER TABLE leave_types ADD COLUMN IF NOT EXISTS earn_after_months INTEGER NOT NULL DEFAULT 0`);

    const [types] = await sequelize.query(
      `SELECT id, name, is_paid, accrual_type, days_per_year
         FROM leave_types WHERE is_active = true ORDER BY is_paid DESC, name`
    );

    const [rows] = await sequelize.query(
      `SELECT e.id AS employee_id, e.employee_code, e.first_name, e.last_name, e.avatar_initials, e.role_title,
              d.name AS department, d.color AS department_color,
              t.id AS leave_type_id,
              COALESCE(b.allocated_days, t.days_per_year)::numeric AS annual,
              COALESCE(b.used_days, 0)::numeric AS used,
              COALESCE(p.pending, 0)::numeric AS pending,
              CASE WHEN t.accrual_type = 'monthly'
                   THEN ROUND(COALESCE(b.allocated_days, t.days_per_year)::numeric / 12 * GREATEST(0, :month -
                        GREATEST((EXTRACT(YEAR FROM e.hire_date)::int * 12 + EXTRACT(MONTH FROM e.hire_date)::int + t.earn_after_months) - :year * 12, 1) + 1), 2)
                   ELSE COALESCE(b.allocated_days, t.days_per_year)::numeric END AS earned
         FROM employees e
         LEFT JOIN departments d ON d.id = e.department_id
         CROSS JOIN leave_types t
         LEFT JOIN leave_balances b ON b.employee_id = e.id AND b.leave_type_id = t.id AND b.year = :year
         LEFT JOIN (
              SELECT employee_id, leave_type_id, SUM(total_days) AS pending
                FROM leave_requests
               WHERE status = 'pending' AND EXTRACT(YEAR FROM start_date) = :year
               GROUP BY employee_id, leave_type_id
         ) p ON p.employee_id = e.id AND p.leave_type_id = t.id
        WHERE e.is_active = true AND lower(e.status) IN ('active', 'on leave') AND e.deleted_at IS NULL
          AND t.is_active = true
        ORDER BY e.first_name, e.last_name, t.is_paid DESC, t.name`,
      { replacements: { year, month } }
    );

    const typeById = new Map(types.map((t) => [t.id, t]));
    const people = new Map();
    for (const r of rows) {
      if (!people.has(r.employee_id)) {
        people.set(r.employee_id, {
          id: r.employee_id,
          employee_code: r.employee_code,
          name: `${r.first_name} ${r.last_name}`.trim(),
          initials: (r.avatar_initials || `${r.first_name[0] || ""}${r.last_name[0] || ""}`).toUpperCase(),
          role_title: r.role_title,
          department: r.department || "No department",
          department_color: r.department_color || null,
          balances: [],
        });
      }
      const t = typeById.get(r.leave_type_id);
      const annual = Number(r.annual), earned = Number(r.earned), used = Number(r.used), pending = Number(r.pending);
      people.get(r.employee_id).balances.push({
        leave_type_id: t.id, name: t.name, is_paid: t.is_paid, accrual: t.accrual_type,
        annual, earned, used, pending,
        remaining: Math.round((earned - used - pending) * 100) / 100,
      });
    }

    res.json({
      year,
      types: types.map((t) => ({ id: t.id, name: t.name, is_paid: t.is_paid, accrual: t.accrual_type })),
      employees: [...people.values()],
    });
  } catch (err) {
    console.error("leaveBalances.list", err);
    res.status(500).json({ message: "Could not load leave balances." });
  }
};
