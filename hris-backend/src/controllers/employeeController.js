// src/controllers/employeeController.js
const { QueryTypes } = require("sequelize");
const Employee = require("../models/core/employee");
const { sequelize } = require("../config/database");

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (v) => typeof v === "string" && UUID_RE.test(v);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const isRealDate = (s) => {
  if (typeof s !== "string" || !DATE_RE.test(s)) return false;
  const d = new Date(s + "T00:00:00Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
};

// Columns the edit route may change. Anything else in the request body is ignored
// (password hashes, login flags, ids and so on can never be set from here).
const EDITABLE = {
  first_name:      { type: "str", max: 100, required: true,  label: "First name" },
  middle_name:     { type: "str", max: 100, label: "Middle name" },
  last_name:       { type: "str", max: 100, required: true,  label: "Last name" },
  email:           { type: "email", max: 255, required: true, label: "Work email" },
  personal_email:  { type: "str", max: 255, label: "Personal email" },
  phone:           { type: "str", max: 30,  label: "Phone" },
  role_title:      { type: "str", max: 150, required: true,  label: "Job title" },
  employment_type: { type: "str", max: 30,  label: "Employment type" },
  status:          { type: "str", max: 30,  required: true,  label: "Status" },
  hire_date:       { type: "date", required: true, label: "Hire date" },
  end_date:        { type: "date", label: "End date" },
  department_id:   { type: "uuid", label: "Department" },
  manager_id:      { type: "uuid", label: "Reports to" },
};

const SAFE_COLUMNS = `id, employee_code, first_name, middle_name, last_name, email, personal_email, phone,
  avatar_initials, department_id, role_title, employment_type, status, hire_date::text AS hire_date,
  end_date::text AS end_date, manager_id, is_active, created_at, updated_at`;

// Create employee
exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    const { password_hash, ...safe } = employee.toJSON();
    res.status(201).json(safe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create employee" });
  }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({ attributes: { exclude: ["password_hash"] } });
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, { attributes: { exclude: ["password_hash"] } });
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employee" });
  }
};

// Update employee (only the columns listed in EDITABLE)
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  if (!isUuid(id)) return res.status(404).json({ error: "Employee not found" });
  try {
    const body = req.body || {};
    const values = {};

    for (const [key, rule] of Object.entries(EDITABLE)) {
      if (!(key in body)) continue;
      let v = body[key];
      const empty = v === null || v === undefined || (typeof v === "string" && v.trim() === "");

      if (empty) {
        if (rule.required) return res.status(400).json({ error: `${rule.label} is required.` });
        values[key] = null;
        continue;
      }
      if (rule.type === "str" || rule.type === "email") {
        v = String(v).trim();
        if (v.length > rule.max) return res.status(400).json({ error: `${rule.label} is too long (max ${rule.max}).` });
        if (rule.type === "email") {
          v = v.toLowerCase();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return res.status(400).json({ error: "Enter a valid work email." });
        }
      } else if (rule.type === "date") {
        v = String(v).slice(0, 10);
        if (!isRealDate(v)) return res.status(400).json({ error: `${rule.label} must be a valid date.` });
      } else if (rule.type === "uuid") {
        if (!isUuid(v)) return res.status(400).json({ error: `${rule.label} is not valid.` });
      }
      values[key] = v;
    }

    if (!Object.keys(values).length) return res.status(400).json({ error: "Nothing to update." });

    const [current] = await sequelize.query(`SELECT id FROM employees WHERE id = :id AND deleted_at IS NULL`,
      { replacements: { id }, type: QueryTypes.SELECT });
    if (!current) return res.status(404).json({ error: "Employee not found" });

    // Reports to: must exist, can't be yourself, and can't create a loop (A reports to B who reports to A)
    if (values.manager_id) {
      if (values.manager_id === id) return res.status(400).json({ error: "An employee cannot report to themselves." });
      const [mgr] = await sequelize.query(`SELECT id FROM employees WHERE id = :m AND deleted_at IS NULL`,
        { replacements: { m: values.manager_id }, type: QueryTypes.SELECT });
      if (!mgr) return res.status(400).json({ error: "The chosen manager does not exist." });

      let cursor = values.manager_id;
      for (let hops = 0; cursor && hops < 100; hops += 1) {
        const [row] = await sequelize.query(`SELECT manager_id FROM employees WHERE id = :c`,
          { replacements: { c: cursor }, type: QueryTypes.SELECT });
        cursor = row ? row.manager_id : null;
        if (cursor === id) return res.status(400).json({ error: "That would make a reporting loop: the chosen manager already reports to this employee." });
      }
    }
    if (values.department_id) {
      const [dept] = await sequelize.query(`SELECT id FROM departments WHERE id = :d`,
        { replacements: { d: values.department_id }, type: QueryTypes.SELECT });
      if (!dept) return res.status(400).json({ error: "The chosen department does not exist." });
    }

    const sets = Object.keys(values).map((k) => `${k} = :${k}`).join(", ");
    const [row] = await sequelize.query(
      `UPDATE employees SET ${sets}, updated_at = NOW() WHERE id = :id RETURNING ${SAFE_COLUMNS}`,
      { replacements: { ...values, id }, type: QueryTypes.SELECT }
    );
    res.json(row);
  } catch (err) {
    if (err?.original?.code === "23505" || err?.parent?.code === "23505") {
      return res.status(409).json({ error: "Another employee already uses that email." });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to update employee" });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    await employee.destroy();
    res.json({ message: "Employee deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete employee" });
  }
};
