"use strict";

const { QueryTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (v) => typeof v === "string" && UUID_RE.test(v);
const q = (sql, replacements = {}, t) => sequelize.query(sql, { replacements, type: QueryTypes.SELECT, transaction: t });

// Half-day leave needs fractional days; the balance columns started life as integers.
let numericReady = null;
const ensureNumeric = () => (numericReady ||= sequelize.query(
  `ALTER TABLE leave_balances ALTER COLUMN allocated_days TYPE NUMERIC(6,2);
   ALTER TABLE leave_balances ALTER COLUMN used_days TYPE NUMERIC(6,2);
   ALTER TABLE leave_balances ALTER COLUMN remaining_days TYPE NUMERIC(6,2)`
).catch((e) => { numericReady = null; throw e; }));

const shape = (r) => ({
  id: r.id, employee_id: r.employee_id, name: `${r.first_name} ${r.last_name}`.trim(),
  employee_code: r.employee_code, department: r.department || "No department",
  leave_type_id: r.leave_type_id, leave_type: r.leave_type, is_paid: r.is_paid,
  start_date: r.start_date, end_date: r.end_date, total_days: Number(r.total_days),
  reason: r.reason, status: r.status, created_at: r.created_at,
});

const SELECT = `
  SELECT r.id, r.employee_id, e.first_name, e.last_name, e.employee_code, d.name AS department,
         r.leave_type_id, t.name AS leave_type, t.is_paid,
         r.start_date::text AS start_date, r.end_date::text AS end_date, r.total_days,
         r.reason, r.status, r."createdAt" AS created_at
    FROM leave_requests r
    JOIN employees e ON e.id = r.employee_id
    LEFT JOIN departments d ON d.id = e.department_id
    LEFT JOIN leave_types t ON t.id = r.leave_type_id`;

// GET /api/leave-requests
exports.list = async (_req, res) => {
  try {
    const rows = await q(`${SELECT} ORDER BY (r.status = 'pending') DESC, r."createdAt" DESC`);
    res.json({ records: rows.map(shape) });
  } catch (err) {
    console.error("leaveRequests.list", err);
    res.status(500).json({ message: "Could not load leave requests." });
  }
};

// PATCH /api/leave-requests/:id/status   { status: "approved" | "rejected" }   (pending only)
// Approving moves the days from "pending" to "used" on that year's balance.
exports.setStatus = async (req, res) => {
  const { id } = req.params;
  if (!isUuid(id)) return res.status(404).json({ message: "Request not found." });
  const status = req.body?.status;
  if (!["approved", "rejected"].includes(status)) return res.status(400).json({ message: "Status must be approved or rejected." });
  try {
    await ensureNumeric();
    await sequelize.transaction(async (t) => {
      const [r] = await q(
        `UPDATE leave_requests SET status = :status, "updatedAt" = NOW()
          WHERE id = :id AND status = 'pending'
          RETURNING employee_id, leave_type_id, total_days, EXTRACT(YEAR FROM start_date)::int AS year`,
        { id, status }, t);
      if (!r) { const e = new Error("conflict"); e.conflict = true; throw e; }
      if (status === "approved") {
        await q(
          `UPDATE leave_balances
              SET used_days = used_days + :days, remaining_days = GREATEST(remaining_days - :days, 0), "updatedAt" = NOW()
            WHERE employee_id = :emp AND leave_type_id = :type AND year = :year RETURNING id`,
          { days: r.total_days, emp: r.employee_id, type: r.leave_type_id, year: r.year }, t);
      }
    });
    const [row] = await q(`${SELECT} WHERE r.id = :id`, { id });
    res.json({ record: shape(row) });
  } catch (err) {
    if (err.conflict) return res.status(409).json({ message: "Only pending requests can be approved or rejected." });
    console.error("leaveRequests.setStatus", err);
    res.status(500).json({ message: "Could not update the request." });
  }
};
