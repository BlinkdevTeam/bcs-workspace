"use strict";

const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { Employee, RefreshToken } = require("../models");
const { hashRefreshToken } = require("../utils/token");

const MIN_PASSWORD_LENGTH = 8;

// GET /api/employees
async function listEmployees(_req, res, next) {
  try {
    const employees = await Employee.findAll({
      where: { is_active: true },
      attributes: ["id", "first_name", "last_name", "email", "avatar_initials", "role_title"],
      order: [["first_name", "ASC"], ["last_name", "ASC"]],
    });

    return res.status(200).json({
      employees: employees.map((e) => ({
        id:       e.id,
        name:     `${e.first_name} ${e.last_name}`,
        initials: e.avatar_initials,
        email:    e.email,
        role:     e.role_title,
      })),
    });
  } catch (err) {
    next(err);
  }
}

function serializeMe(e) {
  return {
    id:              e.id,
    employee_code:   e.employee_code,
    first_name:      e.first_name,
    middle_name:     e.middle_name,
    last_name:       e.last_name,
    email:           e.email,
    personal_email:  e.personal_email,
    phone:           e.phone,
    avatar_initials: e.avatar_initials,
    role_title:      e.role_title,
    status:          e.status,
  };
}

// GET /api/employees/me
async function getMe(req, res, next) {
  try {
    const employee = await Employee.findByPk(req.user.sub);
    if (!employee) return res.status(404).json({ message: "Employee not found." });
    return res.status(200).json({ employee: serializeMe(employee) });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/employees/me   (only contact details can be changed here)
async function updateMe(req, res, next) {
  try {
    const employee = await Employee.findByPk(req.user.sub);
    if (!employee) return res.status(404).json({ message: "Employee not found." });

    const updates = {};
    if (req.body.phone !== undefined) {
      const phone = String(req.body.phone).trim();
      if (phone.length > 30) return res.status(400).json({ message: "Phone number is too long." });
      updates.phone = phone || null;
    }
    if (req.body.personal_email !== undefined) {
      const pe = String(req.body.personal_email).trim().toLowerCase();
      if (pe && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pe)) {
        return res.status(400).json({ message: "Personal email is not a valid email address." });
      }
      updates.personal_email = pe || null;
    }

    await employee.update(updates);
    return res.status(200).json({ employee: serializeMe(employee) });
  } catch (err) {
    next(err);
  }
}

// POST /api/employees/me/password
async function changePassword(req, res, next) {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ message: "Current and new password are required." });
    }
    if (String(new_password).length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
    }
    if (new_password === current_password) {
      return res.status(400).json({ message: "New password must be different from the current one." });
    }

    const employee = await Employee.findByPk(req.user.sub);
    if (!employee) return res.status(404).json({ message: "Employee not found." });

    const ok = await bcrypt.compare(current_password, employee.password_hash || "");
    if (!ok) return res.status(400).json({ message: "Current password is incorrect." });

    await employee.update({
      password_hash:        await bcrypt.hash(new_password, 10),
      must_change_password: false,
    });

    // Sign out every OTHER session of the tasks app; keep this browser logged in
    const where = { employee_id: employee.id, app: "tasks" };
    const rawCurrent = req.cookies?.tasks_refresh_token;
    if (rawCurrent) where.token_hash = { [Op.ne]: hashRefreshToken(rawCurrent) };
    await RefreshToken.destroy({ where });

    return res.status(200).json({ message: "Password changed." });
  } catch (err) {
    next(err);
  }
}

module.exports = { listEmployees, getMe, updateMe, changePassword };
