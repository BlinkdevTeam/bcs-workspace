"use strict";

const { sequelize, Project, ProjectMember, Employee } = require("../models");

// GET /api/projects
async function listProjects(_req, res, next) {
  try {
    const projects = await Project.findAll({
      include: [{
        model: Employee,
        as: "members",
        attributes: ["id", "first_name", "last_name", "avatar_initials"],
        through: { attributes: ["role"] },
      }],
      order: [["name", "ASC"]],
    });
    return res.status(200).json({ projects });
  } catch (err) {
    next(err);
  }
}

// POST /api/projects
async function createProject(req, res, next) {
  try {
    const { name, description, start_date, end_date, status } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Project name is required." });
    }

    const project = await sequelize.transaction(async (t) => {
      const p = await Project.create(
        {
          name:        String(name).trim(),
          description: description || null,
          start_date:  start_date || null,
          end_date:    end_date || null,
          status:      status || "active",
          created_by:  req.user.sub,
        },
        { transaction: t }
      );
      // the creator becomes the first member
      await ProjectMember.create(
        { project_id: p.id, employee_id: req.user.sub, role: "owner" },
        { transaction: t }
      );
      return p;
    });

    return res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
}

module.exports = { listProjects, createProject };