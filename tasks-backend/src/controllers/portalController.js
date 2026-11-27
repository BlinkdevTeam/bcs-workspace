"use strict";

// Employee self-service: file leave and overtime/undertime requests.
//
// These use the HRIS tables (leave_types, leave_balances, leave_requests, ot_ut_records)
// through plain SQL on purpose: tasks-backend runs sequelize.sync({ alter: true }), and
// defining models for HRIS tables here would let it reshape them on startup.
// HRIS timestamp columns are camelCase ("createdAt"), so they are quoted below.

const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");

// ── Settings ──────────────────────────────────────────────────────────────────
// Created once, only if the leave_types table is completely empty.
// Edit this list to change the starting leave types.
const DEFAULT_LEAVE_TYPES = [
  { name: "Vacation Leave",  description: "Planned time off",        days: 15, paid: true, accrual: "monthly" },
  { name: "Sick Leave",      description: "Illness or medical care", days: 10, paid: true,  accrual: "upfront" },
  { name: "Emergency Leave", description: "Urgent personal matters", days: 3,  paid: true,  accrual: "upfront" },
  { name: "Unpaid Leave",    description: "Leave without pay",       days: 0,  paid: false, accrual: "upfront" },
];

const isUuid = (s) => typeof s === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

const OT_TYPES = ["OT", "UT"];                 // overtime / undertime, as HRIS screens use them
const DATE_RE  = /^\d{4}-\d{2}-\d{2}$/;

const q = (sql, replacements, type = QueryTypes.SELECT) => sequelize.query(sql, { replacements, type });

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseDay(s) {
  if (typeof s !== "string" || !DATE_RE.test(s)) return null;
  const d = new Date(s + "T00:00:00Z");
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s ? null : d;
}

// Monday–Friday days between two dates, inclusive
function countWorkingDays(start, end) {
  let n = 0;
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const dow = d.getUTCDay();
    if (dow !== 0 && dow !== 6) n += 1;
  }
  return n;
}

// leave_types.accrual_type: 'upfront' = the whole yearly allowance is available from January,
// 'monthly' = earned evenly (days_per_year / 12 each month, credited on the 1st of the month).
// Added on demand and safe to run repeatedly.
let accrualColumnReady = null;
function ensureAccrualColumn() {
  if (!accrualColumnReady) {
    accrualColumnReady = sequelize
      .query(`ALTER TABLE leave_types ADD COLUMN IF NOT EXISTS accrual_type VARCHAR(10) NOT NULL DEFAULT 'upfront';
              ALTER TABLE leave_types ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
              ALTER TABLE leave_types ADD COLUMN IF NOT EXISTS earn_after_months INTEGER NOT NULL DEFAULT 0`)
      .catch((err) => { accrualColumnReady = null; throw err; });
  }
  return accrualColumnReady;
}

// Which month (1-12) of balance year :year the employee starts earning a monthly leave type.
// = hire month + earn_after_months, never earlier than January. Above 12 means "not yet this year".
const startMonthSql = (yearExpr) =>
  `GREATEST((EXTRACT(YEAR FROM e.hire_date)::int * 12 + EXTRACT(MONTH FROM e.hire_date)::int + t.earn_after_months) - ${yearExpr} * 12, 1)`;

// Days earned by month number (1-12): days_per_year / 12 for every month from the start month
// up to and including that month (credited on the 1st). Needs aliases t (leave_types),
// b (leave_balances) and e (employees) in the query.
const earnedSql = (monthExpr, yearExpr) =>
  `CASE WHEN t.accrual_type = 'monthly'
        THEN ROUND(b.allocated_days::numeric / 12 * GREATEST(0, ${monthExpr} - ${startMonthSql(yearExpr)} + 1), 2)
        ELSE b.allocated_days::numeric END`;

async function seedLeaveTypesIfEmpty() {
  const [{ count }] = await q(`SELECT count(*)::int AS count FROM leave_types`);
  if (count > 0) return;
  for (const t of DEFAULT_LEAVE_TYPES) {
    await q(
      `INSERT INTO leave_types (id, name, description, days_per_year, is_paid, accrual_type, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), :name, :description, :days, :paid, :accrual, NOW(), NOW())
       ON CONFLICT DO NOTHING`,
      { name: t.name, description: t.description, days: t.days, paid: t.paid, accrual: t.accrual },
      QueryTypes.INSERT
    );
  }
}

// Give the employee this year's balance for every leave type that has none yet
async function ensureBalances(employeeId, year) {
  await q(
    `INSERT INTO leave_balances (id, employee_id, leave_type_id, year, allocated_days, used_days, remaining_days, "createdAt", "updatedAt")
     SELECT gen_random_uuid(), :employeeId, t.id, :year, t.days_per_year, 0, t.days_per_year, NOW(), NOW()
     FROM leave_types t
     WHERE NOT EXISTS (
       SELECT 1 FROM leave_balances b
       WHERE b.employee_id = :employeeId AND b.leave_type_id = t.id AND b.year = :year
     )`,
    { employeeId, year },
    QueryTypes.INSERT
  );
}

const serializeLeave = (r) => ({
  id: r.id, leave_type_id: r.leave_type_id, leave_type: r.leave_type,
  start_date: r.start_date, end_date: r.end_date, total_days: Number(r.total_days),
  reason: r.reason, status: r.status, created_at: r.created_at,
});

const serializeOt = (r) => ({
  id: r.id, date: r.date, type: r.type, hours: Number(r.hours),
  time_from: r.time_from || null, time_to: r.time_to || null,
  reason: r.reason, status: r.status, created_at: r.created_at,
});

// OT / UT now record the exact clock times (from / to). Added on demand, safe to repeat.
let otColumnsReady = null;
function ensureOtColumns() {
  if (!otColumnsReady) {
    otColumnsReady = sequelize
      .query(`ALTER TABLE ot_ut_records ADD COLUMN IF NOT EXISTS time_from TIME;
              ALTER TABLE ot_ut_records ADD COLUMN IF NOT EXISTS time_to TIME`)
      .catch((err) => { otColumnsReady = null; throw err; });
  }
  return otColumnsReady;
}
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
const toMin = (t) => { const [h, m] = String(t).split(":"); return Number(h) * 60 + Number(m); };

// ── Leave ─────────────────────────────────────────────────────────────────────
// GET /api/portal/leave   → balances for this year + my requests
async function getLeave(req, res, next) {
  try {
    const me   = req.user.sub;
    const year = new Date().getFullYear();

    await ensureAccrualColumn();
    await seedLeaveTypesIfEmpty();
    await ensureBalances(me, year);
    const month = new Date().getMonth() + 1;

    const types = await q(
      `SELECT t.id, t.name, t.description, t.is_paid, t.accrual_type,
              b.allocated_days AS allocated, b.used_days AS used,
              ${earnedSql(":month", ":year")} AS earned,
              ${startMonthSql(":year")} AS earn_start_month,
              COALESCE((SELECT SUM(r.total_days) FROM leave_requests r
                        WHERE r.employee_id = :me AND r.leave_type_id = t.id
                          AND r.status = 'pending' AND EXTRACT(YEAR FROM r.start_date) = :year), 0) AS pending
       FROM leave_types t
       JOIN leave_balances b ON b.leave_type_id = t.id AND b.employee_id = :me AND b.year = :year
       JOIN employees e ON e.id = :me
       WHERE t.is_active = true
       ORDER BY t.is_paid DESC, t.name`,
      { me, year, month }
    );

    const requests = await q(
      `SELECT r.id, r.leave_type_id, t.name AS leave_type, r.start_date::text AS start_date, r.end_date::text AS end_date,
              r.total_days, r.reason, r.status, r."createdAt" AS created_at
       FROM leave_requests r JOIN leave_types t ON t.id = r.leave_type_id
       WHERE r.employee_id = :me
       ORDER BY r."createdAt" DESC`,
      { me }
    );

    return res.status(200).json({
      year,
      types: types.map((t) => {
        const annual = Number(t.allocated), earned = Number(t.earned);
        const used = Number(t.used), pending = Number(t.pending);
        return {
          id: t.id, name: t.name, description: t.description, is_paid: t.is_paid,
          accrual: t.accrual_type,                       // 'upfront' | 'monthly'
          per_month: t.accrual_type === "monthly" ? Math.round((annual / 12) * 100) / 100 : null,
          allocated: annual,                             // the yearly total
          earned,                                        // available to date (= allocated when upfront)
          earn_start_month: t.accrual_type === "monthly" ? Number(t.earn_start_month) : 1,  // month (1-12) earning starts this year
          used, pending,
          remaining: Math.round((earned - used - pending) * 100) / 100,
        };
      }),
      requests: requests.map(serializeLeave),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/portal/leave-requests   { leave_type_id, start_date, end_date, half_day?, reason? }
async function createLeave(req, res, next) {
  try {
    const me = req.user.sub;
    const { leave_type_id, start_date, end_date, half_day, reason } = req.body;

    const start = parseDay(start_date);
    const end   = parseDay(end_date);
    if (!isUuid(leave_type_id)) return res.status(400).json({ message: "Choose a leave type." });
    if (!start || !end)  return res.status(400).json({ message: "Start and end dates are required." });
    if (end < start)     return res.status(400).json({ message: "The end date cannot be before the start date." });
    if (start.getUTCFullYear() !== end.getUTCFullYear()) {
      return res.status(400).json({ message: "A request cannot span two calendar years. File one request for each year." });
    }
    const cleanReason = reason ? String(reason).trim() : "";
    if (cleanReason.length > 1000) return res.status(400).json({ message: "The reason is too long (1000 characters max)." });

    await ensureAccrualColumn();
    const [type] = await q(`SELECT id, name, is_paid, is_active FROM leave_types WHERE id = :id`, { id: leave_type_id });
    if (!type) return res.status(404).json({ message: "That leave type does not exist." });
    if (!type.is_active) return res.status(400).json({ message: `${type.name} is not available right now.` });

    let days = countWorkingDays(start, end);
    if (days === 0) return res.status(400).json({ message: "That range has no working days (weekends only)." });
    if (half_day) {
      if (start.getTime() !== end.getTime()) return res.status(400).json({ message: "A half day must be a single day." });
      days = 0.5;
    }

    // No overlapping with my other pending/approved leave
    const [overlap] = await q(
      `SELECT start_date::text AS s, end_date::text AS e FROM leave_requests
       WHERE employee_id = :me AND status IN ('pending','approved')
         AND start_date <= :end AND end_date >= :start LIMIT 1`,
      { me, start: start_date, end: end_date }
    );
    if (overlap) return res.status(409).json({ message: `You already have leave filed for ${overlap.s} to ${overlap.e}.` });

    // Paid leave cannot go over what has been earned by the start of the leave
    // (monthly types earn days_per_year / 12 on the 1st of each month); pending requests count too.
    const year = start.getUTCFullYear();
    if (type.is_paid) {
      await ensureAccrualColumn();
      await ensureBalances(me, year);
      const [bal] = await q(
        `SELECT ${earnedSql(":month", ":year")} - b.used_days - COALESCE((
            SELECT SUM(r.total_days) FROM leave_requests r
            WHERE r.employee_id = :me AND r.leave_type_id = :typeId AND r.status = 'pending'
              AND EXTRACT(YEAR FROM r.start_date) = :year), 0) AS remaining,
            t.accrual_type
         FROM leave_balances b JOIN leave_types t ON t.id = b.leave_type_id
         JOIN employees e ON e.id = b.employee_id
         WHERE b.employee_id = :me AND b.leave_type_id = :typeId AND b.year = :year`,
        { me, typeId: type.id, year, month: start.getUTCMonth() + 1 }
      );
      const remaining = bal ? Math.max(0, Math.round(Number(bal.remaining) * 100) / 100) : 0;
      if (days > remaining) {
        const when = bal?.accrual_type === "monthly" ? " earned by then" : " left";
        return res.status(400).json({ message: `Not enough ${type.name}${when}. You have ${remaining} day(s) and asked for ${days}.` });
      }
    }

    const [row] = await q(
      `INSERT INTO leave_requests (id, employee_id, leave_type_id, start_date, end_date, total_days, reason, status, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), :me, :typeId, :start, :end, :days, :reason, 'pending', NOW(), NOW())
       RETURNING id, leave_type_id, start_date::text AS start_date, end_date::text AS end_date, total_days, reason, status, "createdAt" AS created_at`,
      { me, typeId: type.id, start: start_date, end: end_date, days, reason: cleanReason || null },
      QueryTypes.SELECT
    );

    return res.status(201).json({ request: serializeLeave({ ...row, leave_type: type.name }) });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/portal/leave-requests/:id   (cancel my own pending request)
async function cancelLeave(req, res, next) {
  try {
    if (!isUuid(req.params.id)) return res.status(404).json({ message: "No pending request found to cancel." });
    const rows = await q(
      `UPDATE leave_requests SET status = 'cancelled', "updatedAt" = NOW()
       WHERE id = :id AND employee_id = :me AND status = 'pending' RETURNING id`,
      { id: req.params.id, me: req.user.sub }, QueryTypes.SELECT
    );
    if (!rows.length) return res.status(404).json({ message: "No pending request found to cancel." });
    return res.status(200).json({ message: "Request cancelled." });
  } catch (err) {
    next(err);
  }
}

// ── Overtime / undertime ─────────────────────────────────────────────────────
// GET /api/portal/overtime
async function getOvertime(req, res, next) {
  try {
    await ensureOtColumns();
    const rows = await q(
      `SELECT id, date::text AS date, type, hours, to_char(time_from,'HH24:MI') AS time_from, to_char(time_to,'HH24:MI') AS time_to,
              reason, status, "createdAt" AS created_at
       FROM ot_ut_records WHERE employee_id = :me ORDER BY date DESC, "createdAt" DESC`,
      { me: req.user.sub }
    );
    return res.status(200).json({ records: rows.map(serializeOt) });
  } catch (err) {
    next(err);
  }
}

// POST /api/portal/overtime   { date, type: "OT" | "UT", hours, reason }
async function createOvertime(req, res, next) {
  try {
    const me = req.user.sub;
    const { date, type, time_from, time_to, reason } = req.body;

    if (!parseDay(date))          return res.status(400).json({ message: "Choose a valid date." });
    if (!OT_TYPES.includes(type)) return res.status(400).json({ message: "Type must be OT (overtime) or UT (undertime)." });
    if (!TIME_RE.test(String(time_from ?? ""))) return res.status(400).json({ message: "Enter the time from, like 18:00." });
    if (!TIME_RE.test(String(time_to ?? "")))   return res.status(400).json({ message: "Enter the time to, like 20:30." });

    // If "to" is not later than "from", the period runs past midnight into the next day.
    let minutes = toMin(time_to) - toMin(time_from);
    if (minutes <= 0) minutes += 24 * 60;
    const h = Math.round((minutes / 60) * 100) / 100;
    if (h <= 0 || h > 16) return res.status(400).json({ message: "A request can cover at most 16 hours." });

    const cleanReason = String(reason ?? "").trim();
    if (!cleanReason)             return res.status(400).json({ message: "Please give a reason." });
    if (cleanReason.length > 255) return res.status(400).json({ message: "The reason is too long (255 characters max)." });

    await ensureOtColumns();
    const [dup] = await q(
      `SELECT 1 AS x FROM ot_ut_records WHERE employee_id = :me AND date = :date AND type = :type AND status IN ('pending','approved') LIMIT 1`,
      { me, date, type }
    );
    if (dup) return res.status(409).json({ message: `You already filed ${type} for ${date}.` });

    const [row] = await q(
      `INSERT INTO ot_ut_records (id, employee_id, date, type, hours, time_from, time_to, reason, status, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), :me, :date, :type, :hours, :time_from, :time_to, :reason, 'pending', NOW(), NOW())
       RETURNING id, date::text AS date, type, hours, to_char(time_from,'HH24:MI') AS time_from, to_char(time_to,'HH24:MI') AS time_to, reason, status, "createdAt" AS created_at`,
      { me, date, type, hours: h, time_from, time_to, reason: cleanReason }, QueryTypes.SELECT
    );
    return res.status(201).json({ record: serializeOt(row) });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/portal/overtime/:id   (cancel my own pending request)
async function cancelOvertime(req, res, next) {
  try {
    if (!isUuid(req.params.id)) return res.status(404).json({ message: "No pending request found to cancel." });
    const rows = await q(
      `UPDATE ot_ut_records SET status = 'cancelled', "updatedAt" = NOW()
       WHERE id = :id AND employee_id = :me AND status = 'pending' RETURNING id`,
      { id: req.params.id, me: req.user.sub }, QueryTypes.SELECT
    );
    if (!rows.length) return res.status(404).json({ message: "No pending request found to cancel." });
    return res.status(200).json({ message: "Request cancelled." });
  } catch (err) {
    next(err);
  }
}

// ── Attendance (my own time-in / time-out) ───────────────────────────────────
// Same working-time rule HRIS uses: one unpaid hour is taken off days longer than 5 hours.
const BREAK_HOURS = 1, BREAK_AFTER_HOURS = 5;
const hm = (t) => { const [h, m] = String(t).split(":"); return Number(h) * 60 + Number(m); };
function workedHours(tin, tout) {
  if (!tin || !tout) return null;
  const span = (hm(tout) - hm(tin)) / 60;
  if (span <= 0) return null;
  return Math.round((span - (span > BREAK_AFTER_HOURS ? BREAK_HOURS : 0)) * 100) / 100;
}

// GET /api/portal/attendance?from=YYYY-MM-DD&to=YYYY-MM-DD   (defaults to the last 31 days)
async function getAttendance(req, res, next) {
  try {
    const today = new Date().toLocaleDateString("en-CA");
    const monthAgo = new Date(Date.now() - 30 * 86400000).toLocaleDateString("en-CA");
    const okDay = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
    const from = okDay(req.query.from) ? req.query.from : monthAgo;
    const to   = okDay(req.query.to) ? req.query.to : today;
    const rows = await q(
      `SELECT id, date::text AS date, to_char(time_in,'HH24:MI') AS time_in, to_char(time_out,'HH24:MI') AS time_out, remarks
         FROM attendance_records WHERE employee_id = :me AND date BETWEEN :from AND :to ORDER BY date DESC`,
      { me: req.user.sub, from, to }
    );
    // every scan of those days, kept by the time clock (the table may not exist before the first scan)
    const scanRows = await q(
      `SELECT work_date::text AS date, to_char(punched_at AT TIME ZONE :tz, 'HH24:MI') AS time
         FROM time_punches WHERE employee_id = :me AND work_date BETWEEN :from AND :to ORDER BY punched_at`,
      { me: req.user.sub, from, to, tz: process.env.TIMECLOCK_TZ || "Asia/Manila" }
    ).catch(() => []);
    const scansByDay = {};
    for (const s of scanRows) (scansByDay[s.date] ||= []).push(s.time);

    const records = rows.map((r) => ({
      id: r.id, date: r.date, time_in: r.time_in, time_out: r.time_out, remarks: r.remarks, scans: scansByDay[r.date] || [],
      worked_hours: workedHours(r.time_in, r.time_out), status: r.time_out ? "present" : "incomplete",
    }));
    return res.status(200).json({ from, to, today, records });
  } catch (err) {
    next(err);
  }
}

module.exports = { getLeave, createLeave, cancelLeave, getOvertime, createOvertime, cancelOvertime, getAttendance };
