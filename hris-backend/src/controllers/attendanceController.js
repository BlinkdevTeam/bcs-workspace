"use strict";

const { QueryTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const W = require("../config/workHours");
const { ensureTimePunches } = require("../config/timePunches");

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (v) => typeof v === "string" && UUID_RE.test(v);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
const isRealDate = (s) => {
  if (typeof s !== "string" || !DATE_RE.test(s)) return false;
  const d = new Date(s + "T00:00:00Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
};
const q = (sql, replacements = {}) => sequelize.query(sql, { replacements, type: QueryTypes.SELECT });

const toMinutes = (t) => { const [h, m] = String(t).split(":"); return Number(h) * 60 + Number(m); };
const round2 = (n) => Math.round(n * 100) / 100;

// Paid hours between time-in and time-out (null when the day is not complete)
function workedHours(timeIn, timeOut) {
  if (!timeIn || !timeOut) return null;
  const span = (toMinutes(timeOut) - toMinutes(timeIn)) / 60;
  if (span <= 0) return null;
  return round2(span - (span > W.BREAK_AFTER_HOURS ? W.BREAK_HOURS : 0));
}
exports.workedHours = workedHours;

// Corrections are audited: who changed a record, when, and why.
const ensureCols = () => ensureTimePunches();

const SELECT = `
  SELECT a.id, a.employee_id, e.first_name, e.last_name, e.employee_code, d.name AS department,
         a.date::text AS date, to_char(a.time_in, 'HH24:MI') AS time_in, to_char(a.time_out, 'HH24:MI') AS time_out,
         a.status, a.remarks, a.corrected_by, a.corrected_at, a.correction_reason,
         (SELECT COUNT(*)::int FROM time_punches p WHERE p.employee_id = a.employee_id AND p.work_date = a.date) AS scans
    FROM attendance_records a
    JOIN employees e ON e.id = a.employee_id
    LEFT JOIN departments d ON d.id = e.department_id`;

const shape = (r) => ({
  id: r.id, employee_id: r.employee_id, name: `${r.first_name} ${r.last_name}`.trim(),
  employee_code: r.employee_code, department: r.department || "No department",
  date: r.date, time_in: r.time_in, time_out: r.time_out,
  worked_hours: workedHours(r.time_in, r.time_out), status: r.time_out ? "present" : "incomplete", remarks: r.remarks,
  scans: r.scans || 0, corrected_by: r.corrected_by, corrected_at: r.corrected_at, correction_reason: r.correction_reason,
});

// GET /api/attendance?from=YYYY-MM-DD&to=YYYY-MM-DD&employee_id=
exports.list = async (req, res) => {
  try {
    await ensureCols();
    const today = new Date().toLocaleDateString("en-CA");
    const monthAgo = new Date(Date.now() - 30 * 86400000).toLocaleDateString("en-CA");
    const from = isRealDate(req.query.from) ? req.query.from : monthAgo;
    const to   = isRealDate(req.query.to) ? req.query.to : today;
    const emp  = isUuid(req.query.employee_id) ? req.query.employee_id : null;

    const rows = await q(`${SELECT}
      WHERE a.date BETWEEN :from AND :to ${emp ? "AND a.employee_id = :emp" : ""}
      ORDER BY a.date DESC, e.first_name, e.last_name`, { from, to, emp });
    res.json({ from, to, shift_hours: W.SHIFT_HOURS, break_hours: W.BREAK_HOURS, records: rows.map(shape) });
  } catch (err) {
    console.error("attendance.list", err);
    res.status(500).json({ message: "Could not load time records." });
  }
};

function readBody(body, { partial }) {
  const out = {};
  if (!partial || body.employee_id !== undefined) {
    if (!isUuid(body.employee_id)) return { error: "Choose an employee." };
    out.employee_id = body.employee_id;
  }
  if (!partial || body.date !== undefined) {
    if (!isRealDate(body.date)) return { error: "Choose a valid date." };
    if (body.date > new Date().toLocaleDateString("en-CA")) return { error: "The date cannot be in the future." };
    out.date = body.date;
  }
  for (const key of ["time_in", "time_out"]) {
    if (body[key] === undefined && partial) continue;
    const v = body[key] === "" || body[key] === null || body[key] === undefined ? null : String(body[key]);
    if (v !== null && !TIME_RE.test(v)) return { error: `${key === "time_in" ? "Time in" : "Time out"} must look like 09:00.` };
    out[key] = v;
  }
  if (!partial && !out.time_in) return { error: "Time in is required." };
  if (body.remarks !== undefined) out.remarks = String(body.remarks || "").trim().slice(0, 255) || null;
  return { value: out };
}

// POST /api/attendance   { employee_id, date, time_in, time_out?, remarks? }
exports.create = async (req, res) => {
  try {
    await ensureCols();
    const { value, error } = readBody(req.body || {}, { partial: false });
    if (error) return res.status(400).json({ message: error });
    if (value.time_out && toMinutes(value.time_out) <= toMinutes(value.time_in))
      return res.status(400).json({ message: "Time out must be after time in." });

    const [emp] = await q(`SELECT id FROM employees WHERE id = :id AND deleted_at IS NULL`, { id: value.employee_id });
    if (!emp) return res.status(400).json({ message: "That employee does not exist." });
    const [dup] = await q(`SELECT id FROM attendance_records WHERE employee_id = :e AND date = :d LIMIT 1`, { e: value.employee_id, d: value.date });
    if (dup) return res.status(409).json({ message: "That employee already has a time record for that date. Edit it instead." });

    const [row] = await q(
      `INSERT INTO attendance_records (id, employee_id, date, time_in, time_out, status, remarks, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), :employee_id, :date, :time_in, :time_out, 'present', :remarks, NOW(), NOW())
       RETURNING id`,
      { remarks: null, time_out: null, ...value });
    const [full] = await q(`${SELECT} WHERE a.id = :id`, { id: row.id });
    res.status(201).json({ record: shape(full) });
  } catch (err) {
    console.error("attendance.create", err);
    res.status(500).json({ message: "Could not save the time record." });
  }
};

// PATCH /api/attendance/:id   { time_in?, time_out?, remarks? }  (employee and date are fixed)
exports.update = async (req, res) => {
  const { id } = req.params;
  if (!isUuid(id)) return res.status(404).json({ message: "Time record not found." });
  try {
    await ensureCols();
    const body = { ...(req.body || {}) };
    delete body.employee_id; delete body.date;
    const reason = String(req.body?.reason || "").trim().slice(0, 255);
    const { value, error } = readBody(body, { partial: true });
    if (error) return res.status(400).json({ message: error });
    const timesChanged = "time_in" in value || "time_out" in value;
    if (timesChanged && !reason) return res.status(400).json({ message: "Give a reason for the correction." });
    if (!Object.keys(value).length) return res.status(400).json({ message: "Nothing to update." });

    const [cur] = await q(`SELECT to_char(time_in,'HH24:MI') AS time_in, to_char(time_out,'HH24:MI') AS time_out FROM attendance_records WHERE id = :id`, { id });
    if (!cur) return res.status(404).json({ message: "Time record not found." });
    const tin = "time_in" in value ? value.time_in : cur.time_in;
    const tout = "time_out" in value ? value.time_out : cur.time_out;
    if (!tin) return res.status(400).json({ message: "Time in is required." });
    if (tout && toMinutes(tout) <= toMinutes(tin)) return res.status(400).json({ message: "Time out must be after time in." });

    const sets = Object.keys(value).map((k) => `${k} = :${k}`).join(", ");
    const who = String(req.user?.email || req.user?.username || req.user?.id || "admin").slice(0, 255);
    const audit = timesChanged ? `, corrected_by = :who, corrected_at = NOW(), correction_reason = :reason` : "";
    await q(`UPDATE attendance_records SET ${sets}${audit}, "updatedAt" = NOW() WHERE id = :id RETURNING id`, { ...value, id, who, reason });
    const [full] = await q(`${SELECT} WHERE a.id = :id`, { id });
    res.json({ record: shape(full) });
  } catch (err) {
    console.error("attendance.update", err);
    res.status(500).json({ message: "Could not update the time record." });
  }
};

// DELETE /api/attendance/:id
exports.remove = async (req, res) => {
  const { id } = req.params;
  if (!isUuid(id)) return res.status(404).json({ message: "Time record not found." });
  try {
    const rows = await q(`DELETE FROM attendance_records WHERE id = :id RETURNING id`, { id });
    if (!rows.length) return res.status(404).json({ message: "Time record not found." });
    res.json({ ok: true });
  } catch (err) {
    console.error("attendance.remove", err);
    res.status(500).json({ message: "Could not delete the time record." });
  }
};

// GET /api/attendance/punches?employee_id=&date=   every raw scan for one employee on one day
exports.punches = async (req, res) => {
  try {
    await ensureCols();
    const { employee_id: emp, date } = req.query;
    if (!isUuid(emp) || !isRealDate(date)) return res.status(400).json({ message: "Choose an employee and a date." });
    const rows = await q(
      `SELECT to_char(punched_at AT TIME ZONE :tz, 'HH24:MI:SS') AS time, source
         FROM time_punches WHERE employee_id = :e AND work_date = :d ORDER BY punched_at`,
      { tz: process.env.TIMECLOCK_TZ || "Asia/Manila", e: emp, d: date });
    res.json({ scans: rows });
  } catch (err) {
    console.error("attendance.punches", err);
    res.status(500).json({ message: "Could not load the scans." });
  }
};
