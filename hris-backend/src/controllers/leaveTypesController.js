"use strict";

const { sequelize } = require("../config/database");

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (v) => typeof v === "string" && UUID_RE.test(v);
const q = (sql, replacements = {}, t) => sequelize.query(sql, { replacements, transaction: t });

// 'upfront' = whole yearly allowance from January; 'monthly' = earned days_per_year / 12 each month.
const ACCRUALS = ["upfront", "monthly"];
let accrualReady = null;
function ensureAccrualColumn() {
  if (!accrualReady) {
    accrualReady = sequelize
      .query(`ALTER TABLE leave_types ADD COLUMN IF NOT EXISTS accrual_type VARCHAR(10) NOT NULL DEFAULT 'upfront';
              ALTER TABLE leave_types ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
              ALTER TABLE leave_types ADD COLUMN IF NOT EXISTS earn_after_months INTEGER NOT NULL DEFAULT 0`)
      .catch((err) => { accrualReady = null; throw err; });
  }
  return accrualReady;
}
const COLS = "id, name, description, days_per_year, is_paid, accrual_type, is_active, earn_after_months";

function clean(body, { partial = false } = {}) {
  const out = {};
  if (!partial || body.name !== undefined) {
    const name = String(body.name ?? "").trim();
    if (!name || name.length > 100) return { error: "Leave type name is required (max 100 characters)." };
    out.name = name;
  }
  if (!partial || body.days_per_year !== undefined) {
    const d = Number(body.days_per_year);
    if (!Number.isInteger(d) || d < 0 || d > 365) return { error: "Days per year must be a whole number from 0 to 365." };
    out.days_per_year = d;
  }
  if (!partial || body.is_paid !== undefined) out.is_paid = body.is_paid === undefined ? true : !!body.is_paid;
  if (!partial || body.accrual_type !== undefined) {
    const a = body.accrual_type === undefined ? "upfront" : String(body.accrual_type);
    if (!ACCRUALS.includes(a)) return { error: "Choose how this leave is earned: upfront or monthly." };
    out.accrual_type = a;
  }
  // Monthly types: start earning this many months after the hire month (0 = from the hire month itself)
  if (!partial || body.earn_after_months !== undefined) {
    const m = body.earn_after_months === undefined || body.earn_after_months === "" ? 0 : Number(body.earn_after_months);
    if (!Number.isInteger(m) || m < 0 || m > 60) return { error: "Start earning after must be a whole number of months, from 0 to 60." };
    out.earn_after_months = m;
  }
  // New types start inactive: HR switches them on when they are ready for employees to use.
  if (!partial || body.is_active !== undefined) out.is_active = body.is_active === undefined ? false : !!body.is_active;
  if (body.description !== undefined) out.description = String(body.description || "").trim().slice(0, 500) || null;
  return { value: out };
}

// GET /api/leave-types
exports.list = async (_req, res) => {
  try {
    await ensureAccrualColumn();
    const [rows] = await q(
      `SELECT t.id, t.name, t.description, t.days_per_year, t.is_paid, t.accrual_type, t.is_active, t.earn_after_months,
              (SELECT COUNT(*) FROM leave_requests r WHERE r.leave_type_id = t.id)::int AS request_count
         FROM leave_types t ORDER BY t.name`
    );
    res.json({ leaveTypes: rows });
  } catch (err) {
    console.error("leaveTypes.list", err);
    res.status(500).json({ message: "Could not load leave types." });
  }
};

// POST /api/leave-types   { name, days_per_year, is_paid?, accrual_type?, is_active? (default false), description? }
exports.create = async (req, res) => {
  try {
    await ensureAccrualColumn();
    const { value, error } = clean(req.body || {});
    if (error) return res.status(400).json({ message: error });

    const [dup] = await q(`SELECT 1 FROM leave_types WHERE lower(name) = lower(:name) LIMIT 1`, { name: value.name });
    if (dup.length) return res.status(409).json({ message: `A leave type named "${value.name}" already exists.` });

    const [rows] = await q(
      `INSERT INTO leave_types (id, name, description, days_per_year, is_paid, accrual_type, is_active, earn_after_months, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), :name, :description, :days_per_year, :is_paid, :accrual_type, :is_active, :earn_after_months, NOW(), NOW())
       RETURNING ${COLS}`,
      { description: null, ...value }
    );
    res.status(201).json({ leaveType: { ...rows[0], request_count: 0 } });
  } catch (err) {
    console.error("leaveTypes.create", err);
    res.status(500).json({ message: "Could not create the leave type." });
  }
};

// PATCH /api/leave-types/:id   { name?, days_per_year?, is_paid?, description?, apply_to_current_year? }
// apply_to_current_year (default true): also re-sets this year's balances to the new allowance.
exports.update = async (req, res) => {
  const { id } = req.params;
  if (!isUuid(id)) return res.status(404).json({ message: "Leave type not found." });
  try {
    await ensureAccrualColumn();
    const { value, error } = clean(req.body || {}, { partial: true });
    if (error) return res.status(400).json({ message: error });
    if (!Object.keys(value).length) return res.status(400).json({ message: "Nothing to update." });

    if (value.name) {
      const [dup] = await q(`SELECT 1 FROM leave_types WHERE lower(name) = lower(:name) AND id <> :id LIMIT 1`, { name: value.name, id });
      if (dup.length) return res.status(409).json({ message: `A leave type named "${value.name}" already exists.` });
    }

    const apply = req.body.apply_to_current_year !== false;
    const result = await sequelize.transaction(async (t) => {
      const sets = Object.keys(value).map((k) => `${k} = :${k}`).join(", ");
      const [rows] = await q(
        `UPDATE leave_types SET ${sets}, "updatedAt" = NOW() WHERE id = :id
         RETURNING ${COLS}`,
        { ...value, id }, t
      );
      if (!rows.length) return null;

      let balancesUpdated = 0;
      if (apply && value.days_per_year !== undefined) {
        const [, meta] = await q(
          `UPDATE leave_balances
              SET allocated_days = :d, remaining_days = GREATEST(:d - used_days, 0), "updatedAt" = NOW()
            WHERE leave_type_id = :id AND year = EXTRACT(YEAR FROM CURRENT_DATE)::int`,
          { d: value.days_per_year, id }, t
        );
        balancesUpdated = meta?.rowCount ?? 0;
      }
      return { leaveType: rows[0], balancesUpdated };
    });

    if (!result) return res.status(404).json({ message: "Leave type not found." });
    res.json(result);
  } catch (err) {
    console.error("leaveTypes.update", err);
    res.status(500).json({ message: "Could not update the leave type." });
  }
};

// DELETE /api/leave-types/:id   (refused once anyone has filed it, to keep history intact)
exports.remove = async (req, res) => {
  const { id } = req.params;
  if (!isUuid(id)) return res.status(404).json({ message: "Leave type not found." });
  try {
    const [used] = await q(`SELECT 1 FROM leave_requests WHERE leave_type_id = :id LIMIT 1`, { id });
    if (used.length) {
      return res.status(409).json({ message: "This leave type already has requests filed against it, so it can't be deleted. Set its days to 0 instead." });
    }
    await sequelize.transaction(async (t) => {
      await q(`DELETE FROM leave_balances WHERE leave_type_id = :id`, { id }, t);
      await q(`DELETE FROM leave_types WHERE id = :id`, { id }, t);
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("leaveTypes.remove", err);
    res.status(500).json({ message: "Could not delete the leave type." });
  }
};
