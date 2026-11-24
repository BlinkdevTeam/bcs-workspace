"use strict";

const { Project, ProjectMember } = require("../models");

const MAX_NAME = 100;
const MAX_DESC = 2000;

// Only the person who created the project, or a project owner, may change it.
async function canEdit(project, employeeId) {
  if (!project.created_by) return true;                 // old project with no recorded creator
  if (project.created_by === employeeId) return true;
  const owner = await ProjectMember.findOne({
    where: { project_id: project.id, employee_id: employeeId, role: "owner" },
  });
  return !!owner;
}

// PATCH /api/projects/:id   { name?, description?, start_date?, end_date? }
async function updateProject(req, res, next) {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found." });

    if (!(await canEdit(project, req.user.sub))) {
      return res.status(403).json({ message: "Only the project owner can change this project." });
    }

    const b = req.body;
    const patch = {};

    if (b.name !== undefined) {
      const name = String(b.name).trim().replace(/\s+/g, " ");
      if (!name) return res.status(400).json({ message: "Project name cannot be empty." });
      if (name.length > MAX_NAME) return res.status(400).json({ message: `Project name must be ${MAX_NAME} characters or less.` });
      patch.name = name;
    }
    if (b.description !== undefined) {
      const d = String(b.description ?? "").trim();
      if (d.length > MAX_DESC) return res.status(400).json({ message: `Description must be ${MAX_DESC} characters or less.` });
      patch.description = d || null;
    }
    if (b.start_date !== undefined) patch.start_date = b.start_date || null;
    if (b.end_date   !== undefined) patch.end_date   = b.end_date   || null;

    const start = patch.start_date !== undefined ? patch.start_date : project.start_date;
    const end   = patch.end_date   !== undefined ? patch.end_date   : project.end_date;
    if (start && end && String(end) < String(start)) {
      return res.status(400).json({ message: "End date cannot be before the start date." });
    }

    await project.update(patch);
    return res.status(200).json({ project });
  } catch (err) {
    next(err);
  }
}

module.exports = { updateProject };
