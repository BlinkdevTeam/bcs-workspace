"use strict";

const { QueryTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const W = require("../config/workHours");
const { workedHours } = require("./attendanceController");

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (v) => typeof v === "string" && UUID_RE.test(v);
const q = (sql, replacements = {}) => sequelize.query(sql, { replacements, type: QueryTypes.SELECT });
const round2 = (n) => Math.round(n * 100) / 100;

// Compare what was filed against what the time-in / time-out supports.
//   match        filed hours agree with the punches (within the tolerance)
//   over         more hours filed than the punches support
//   under        fewer hours filed than the punches show
//   incomplete   there is a time-in but no time-out yet
//   no_record    no time record for that date at all
function compare(type, filed, timeIn, timeOut) {
  if (!timeIn && !timeOut) return { match: "no_record", worked: null, supported: null, diff: null };
  const worked = workedHours(timeIn, timeOut);
  if (worked === null) return { match: "incomplete", worked: null, supported: null, diff: null };
  const supported = round2(type === "OT" ? Math.max(0, worked - W.SHIFT_HOURS) : Math.max(0, W.SHIFT_HOURS - worked));
  const diff = round2(filed - supported);
  let match = "match";
  if (diff > W.TOLERANCE_HOURS) match = "over";
  else if (diff < -W.TOLERANCE_HOURS) match = "under";
  return { match, worked, supported, diff };
}

const SELECT = `
  SELECT o.id, o.employee_id, e.first_name, e.last_name, e.employee_code, d.name AS department,
         o.date::text AS date, o.type, o.hours, to_char(o.time_from,'HH24:MI') AS time_from, to_char(o.time_to,'HH24:MI') AS time_to, o.reason, o.status, o."createdAt" AS created_at,
         to_char(a.time_in, 'HH24:MI') AS time_in, to_char(a.time_out, 'HH24:MI') AS time_out
    FROM ot_ut_records o
    JOIN employees e ON e.id = o.employee_id
    LEFT JOIN departments d ON d.id = e.department_id
    LEFT JOIN LATERAL (
         SELECT time_in, time_out FROM attendance_records
          WHERE employee_id = o.employee_id AND date = o.date
          ORDER BY "createdAt" LIMIT 1) a ON true`;

const shape = (r) => ({
  id: r.id, employee_id: r.employee_id, name: `${r.first_name} ${r.last_name}`.trim(),
  employee_code: r.employee_code, department: r.department || "No department",
  date: r.date, type: r.type, hours: Number(r.hours), time_from: r.time_from, time_to: r.time_to, reason: r.reason, status: r.status, created_at: r.created_at,
  time_in: r.time_in, time_out: r.time_out,
  ...compare(r.type, Number(r.hours), r.time_in, r.time_out),
});

// The portal records exact from / to times on each request; make sure the columns exist.
let colsReady = null;
const ensureCols = () => (colsReady ||= sequelize
  .query(`ALTER TABLE ot_ut_records ADD COLUMN IF NOT EXISTS time_from TIME; ALTER TABLE ot_ut_records ADD COLUMN IF NOT EXISTS time_to TIME`)
  .catch((e) => { colsReady = null; throw e; }));

// GET /api/overtime
exports.list = async (_req, res) => {
  try {
    await ensureCols();
    const rows = await q(`${SELECT} ORDER BY o.date DESC, o."createdAt" DESC`);
    res.json({ shift_hours: W.SHIFT_HOURS, break_hours: W.BREAK_HOURS, tolerance_hours: W.TOLERANCE_HOURS, records: rows.map(shape) });
  } catch (err) {
    console.error("overtime.list", err);
    res.status(500).json({ message: "Could not load overtime records." });
  }
};

// PATCH /api/overtime/:id/status   { status: "approved" | "rejected" }   (pending requests only)
exports.setStatus = async (req, res) => {
  const { id } = req.params;
  if (!isUuid(id)) return res.status(404).json({ message: "Record not found." });
  const status = req.body?.status;
  if (!["approved", "rejected"].includes(status)) return res.status(400).json({ message: "Status must be approved or rejected." });
  try {
    await ensureCols();
    const done = await q(`UPDATE ot_ut_records SET status = :status, "updatedAt" = NOW() WHERE id = :id AND status = 'pending' RETURNING id`, { id, status });
    if (!done.length) return res.status(409).json({ message: "Only pending requests can be approved or rejected." });
    const [row] = await q(`${SELECT} WHERE o.id = :id`, { id });
    res.json({ record: shape(row) });
  } catch (err) {
    console.error("overtime.setStatus", err);
    res.status(500).json({ message: "Could not update the request." });
  }
};
