"use strict";

const crypto        = require("crypto");
const { Project, Task, sequelize } = require("../models");
const ProjectStatus = require("../models/task/projectStatus");

// Make sure the table exists, even if the server was started before this file existed
ProjectStatus.sync().catch((err) => console.error("project_statuses sync failed:", err.message));

const BUILT_IN_LABELS = ["to do", "in progress", "in review", "done"];
const DEFAULT_COLOR   = "#14b8a6";

const serialize = (s) => ({
  id:         s.id,
  project_id: s.project_id,
  key:        s.key,
  label:      s.label,
  color:      s.color,
  position:   s.position,
});

// GET /api/project-statuses   (custom labels of every project, in one call)
async function listAll(_req, res, next) {
  try {
    const rows = await ProjectStatus.findAll({ order: [["position", "ASC"], ["created_at", "ASC"]] });
    return res.status(200).json({ statuses: rows.map(serialize) });
  } catch (err) {
    next(err);
  }
}

// POST /api/projects/:projectId/statuses   { label, color }
async function create(req, res, next) {
  try {
    const { projectId } = req.params;
    const label = String(req.body.label ?? "").trim().replace(/\s+/g, " ");
    const color = /^#[0-9a-fA-F]{6}$/.test(req.body.color || "") ? req.body.color : DEFAULT_COLOR;

    if (!label)            return res.status(400).json({ message: "Label name is required." });
    if (label.length > 30) return res.status(400).json({ message: "Label name must be 30 characters or less." });

    const project = await Project.findByPk(projectId);
    if (!project) return res.status(404).json({ message: "Project not found." });

    const existing = await ProjectStatus.findAll({ where: { project_id: projectId } });
    const taken = [...BUILT_IN_LABELS, ...existing.map((s) => s.label.toLowerCase())];
    if (taken.includes(label.toLowerCase())) {
      return res.status(409).json({ message: "This project already has a status with that name." });
    }

    const status = await ProjectStatus.create({
      project_id: projectId,
      key:        "c_" + crypto.randomBytes(4).toString("hex"),
      label,
      color,
      position:   existing.length,
    });

    return res.status(201).json({ status: serialize(status) });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/project-statuses/:id   (tasks using it go back to "todo")
async function remove(req, res, next) {
  try {
    const status = await ProjectStatus.findByPk(req.params.id);
    if (!status) return res.status(404).json({ message: "Status not found." });

    await sequelize.transaction(async (t) => {
      await Task.update(
        { status: "todo", completed_at: null },
        { where: { project_id: status.project_id, status: status.key }, transaction: t }
      );
      await status.destroy({ transaction: t });
    });

    return res.status(200).json({ message: "Status deleted.", key: status.key });
  } catch (err) {
    next(err);
  }
}

module.exports = { listAll, create, remove };
