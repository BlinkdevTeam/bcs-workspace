"use strict";

const { Employee } = require("../models");

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

module.exports = { listEmployees };