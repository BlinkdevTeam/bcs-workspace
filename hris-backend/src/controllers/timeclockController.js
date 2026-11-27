"use strict";

// Public "time clock" used by the test kiosk page. One input, one action: record a scan.
// Every scan is stored. The day's attendance record is the FIRST scan (time in) and the
// LAST scan (time out), as long as the last scan is at least TIMECLOCK_MIN_MINUTES after the first.
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const { ensureTimePunches } = require("../config/timePunches");

const TZ = process.env.TIMECLOCK_TZ || "Asia/Manila";
const MIN_MINUTES = Number(process.env.TIMECLOCK_MIN_MINUTES || 5);
const q = (sql, replacements = {}) => sequelize.query(sql, { replacements, type: QueryTypes.SELECT });

function nowParts() {
  const d = new Date();
  return {
    date: d.toLocaleDateString("en-CA", { timeZone: TZ }),
    time: d.toLocaleTimeString("en-GB", { timeZone: TZ, hour12: false }), // HH:MM:SS
  };
}

// 30 attempts / minute / IP
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60000);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 30;
}

// Work out one day's attendance record from that day's scans.
async function rebuildDay(empId, date) {
  const [s] = await q(
    `SELECT COUNT(*)::int AS n,
            to_char(MIN(punched_at AT TIME ZONE :tz), 'HH24:MI:SS') AS first,
            to_char(MAX(punched_at AT TIME ZONE :tz), 'HH24:MI:SS') AS last,
            EXTRACT(EPOCH FROM (MAX(punched_at) - MIN(punched_at))) AS span
       FROM time_punches WHERE employee_id = :e AND work_date = :d`, { tz: TZ, e: empId, d: date });
  if (!s || !s.n) return;
  const timeOut = s.n >= 2 && Number(s.span) >= MIN_MINUTES * 60 ? s.last : null;

  const [rec] = await q(`SELECT id, corrected_at FROM attendance_records WHERE employee_id = :e AND date = :d ORDER BY "createdAt" LIMIT 1`, { e: empId, d: date });
  if (!rec) {
    await q(`INSERT INTO attendance_records (id, employee_id, date, time_in, time_out, status, source, "createdAt", "updatedAt")
             VALUES (gen_random_uuid(), :e, :d, :tin, :tout, 'present', 'timeclock', NOW(), NOW()) RETURNING id`,
      { e: empId, d: date, tin: s.first, tout: timeOut });
  } else if (!rec.corrected_at) {
    // a day HR has corrected by hand is left alone
    await q(`UPDATE attendance_records SET time_in = :tin, time_out = :tout, "updatedAt" = NOW() WHERE id = :id RETURNING id`,
      { tin: s.first, tout: timeOut, id: rec.id });
  }
  return s.n;
}
exports.rebuildDay = rebuildDay;

// GET /api/timeclock/now
exports.now = (_req, res) => { const n = nowParts(); res.json({ date: n.date, time: n.time, timezone: TZ }); };

// POST /api/timeclock   { identifier }
exports.punch = async (req, res) => {
  try {
    const key = process.env.TIMECLOCK_KEY;
    if (key && req.get("x-kiosk-key") !== key) return res.status(401).json({ message: "This time clock is not authorised." });
    if (limited(req.ip)) return res.status(429).json({ message: "Too many attempts. Wait a minute and try again." });

    const identifier = String(req.body?.identifier || "").trim().slice(0, 255);
    if (!identifier) return res.status(400).json({ message: "Enter your employee number or email." });

    await ensureTimePunches();
    const [emp] = await q(
      `SELECT id, first_name FROM employees
        WHERE (lower(employee_code) = lower(:id) OR lower(email) = lower(:id))
          AND is_active = true AND lower(status) IN ('active','on leave') AND deleted_at IS NULL
        LIMIT 1`, { id: identifier });
    if (!emp) return res.status(404).json({ message: "We couldn't find an active employee with that number or email." });

    const n = nowParts();

    // the same finger twice within 10 seconds is one scan
    const [recent] = await q(
      `SELECT 1 AS x FROM time_punches WHERE employee_id = :e AND punched_at > NOW() - INTERVAL '10 seconds' LIMIT 1`, { e: emp.id });
    if (!recent) {
      await q(`INSERT INTO time_punches (id, employee_id, punched_at, work_date, source)
               VALUES (gen_random_uuid(), :e, NOW(), :d, 'timeclock') RETURNING id`, { e: emp.id, d: n.date });
      await rebuildDay(emp.id, n.date);
    }
    const [{ count }] = await q(`SELECT COUNT(*)::int AS count FROM time_punches WHERE employee_id = :e AND work_date = :d`, { e: emp.id, d: n.date });

    // an earlier day (last 7) that never got a second scan, so the employee can tell HR
    const [missing] = await q(
      `SELECT date::text AS date FROM attendance_records
        WHERE employee_id = :e AND date < :d AND date >= (:d::date - 7) AND time_out IS NULL
        ORDER BY date DESC LIMIT 1`, { e: emp.id, d: n.date });

    return res.status(201).json({
      name: emp.first_name, date: n.date, time: n.time, scans_today: count,
      duplicate: !!recent, missing_timeout_on: missing?.date || null,
    });
  } catch (err) {
    console.error("timeclock.punch", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};
