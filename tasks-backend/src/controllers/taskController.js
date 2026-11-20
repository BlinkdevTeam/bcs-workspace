"use strict";

const { sequelize, Task, Project, Employee, TaskAssignee } = require("../models");

const include = [
  { model: Project, as: "project", attributes: ["id", "name"] },
  {
    model: Employee,
    as: "assignees",
    attributes: ["id", "first_name", "last_name", "avatar_initials"],
    through: { attributes: [] },
  },
];

// Shape the API response like the frontend's task objects
function serialize(task) {
  const t = task.toJSON();
  return {
    id:          t.id,
    name:        t.title,
    description: t.description || "",
    priority:    t.priority,
    status:      t.status,
    done:        t.status === "done",
    project_id:  t.project_id,
    project:     t.project?.name ?? null,
    due:         t.due_date,
    start_date:  t.start_date,
    parent_id:   t.parent_task_id,
    people: (t.assignees || []).map((a) => ({
      id:       a.id,
      name:     `${a.first_name} ${a.last_name}`,
      initials: a.avatar_initials,
    })),
    created_at: t.created_at,
    updated_at: t.updated_at,
  };
}

const loadTask = (id) => Task.findByPk(id, { include });

// GET /api/tasks?mine=true&project_id=...
async function listTasks(req, res, next) {
  try {
    const where = {};

    if (req.query.mine === "true") {
      const rows = await TaskAssignee.findAll({
        where: { employee_id: req.user.sub },
        attributes: ["task_id"],
        raw: true,
      });
      where.id = rows.map((r) => r.task_id);
    }
    if (req.query.project_id) where.project_id = req.query.project_id;

    const tasks = await Task.findAll({
      where,
      include,
      order: [["created_at", "ASC"]],
    });

    return res.status(200).json({ tasks: tasks.map(serialize) });
  } catch (err) {
    next(err);
  }
}

// GET /api/tasks/:id
async function getTask(req, res, next) {
  try {
    const task = await loadTask(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });
    return res.status(200).json({ task: serialize(task) });
  } catch (err) {
    next(err);
  }
}

// POST /api/tasks
async function createTask(req, res, next) {
  try {
    const {
      name, title, description, priority, status,
      due, due_date, start_date, project_id, parent_id, assignee_ids,
    } = req.body;

    const taskTitle = String(name ?? title ?? "").trim();
    if (!taskTitle) {
      return res.status(400).json({ message: "Task name is required." });
    }

    let projectId = project_id;

    if (parent_id) {
      const parent = await Task.findByPk(parent_id);
      if (!parent) return res.status(404).json({ message: "Parent task not found." });

      // Keep the hierarchy at Projects > Main tasks > Subtasks
      if (parent.parent_task_id) {
        return res.status(400).json({ message: "Subtasks cannot have their own subtasks." });
      }

      // A subtask always belongs to its parent's project
      projectId = parent.project_id;
    }

    if (!projectId) {
      return res.status(400).json({ message: "project_id is required." });
    }

    const project = await Project.findByPk(projectId);
    if (!project) return res.status(404).json({ message: "Project not found." });

    const created = await sequelize.transaction(async (t) => {
      const task = await Task.create(
        {
          project_id:     projectId,
          parent_task_id: parent_id || null,
          title:          taskTitle,
          description:    description || null,
          priority:       priority || "medium",
          status:         status || "todo",
          start_date:     start_date || null,
          due_date:       due ?? due_date ?? null,
          completed_at:   status === "done" ? new Date() : null,
          created_by:     req.user.sub,
        },
        { transaction: t }
      );

      if (Array.isArray(assignee_ids) && assignee_ids.length) {
        await TaskAssignee.bulkCreate(
          [...new Set(assignee_ids)].map((employee_id) => ({
            task_id: task.id,
            employee_id,
          })),
          { transaction: t }
        );
      }
      return task;
    });

    return res.status(201).json({ task: serialize(await loadTask(created.id)) });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/tasks/:id
async function updateTask(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });

    const b = req.body;
    const patch = {};

    if (b.name !== undefined || b.title !== undefined) {
      const newTitle = String(b.name ?? b.title).trim();
      if (!newTitle) return res.status(400).json({ message: "Task name cannot be empty." });
      patch.title = newTitle;
    }
    if (b.description !== undefined) patch.description = b.description;
    if (b.priority    !== undefined) patch.priority    = b.priority;
    if (b.start_date  !== undefined) patch.start_date  = b.start_date || null;
    if (b.due !== undefined || b.due_date !== undefined) {
      patch.due_date = (b.due ?? b.due_date) || null;
    }

    // status can be set directly, or derived from the "done" checkbox
    let status = b.status;
    if (status === undefined && b.done !== undefined) {
      status = b.done ? "done" : "todo";
    }
    if (status !== undefined) {
      patch.status = status;
      patch.completed_at = status === "done" ? new Date() : null;
    }

    await sequelize.transaction(async (t) => {
      if (Object.keys(patch).length) await task.update(patch, { transaction: t });

      if (Array.isArray(b.assignee_ids)) {
        await TaskAssignee.destroy({ where: { task_id: task.id }, transaction: t });
        if (b.assignee_ids.length) {
          await TaskAssignee.bulkCreate(
            [...new Set(b.assignee_ids)].map((employee_id) => ({
              task_id: task.id,
              employee_id,
            })),
            { transaction: t }
          );
        }
      }
    });

    return res.status(200).json({ task: serialize(await loadTask(task.id)) });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/tasks/:id  (soft delete, subtasks included)
async function deleteTask(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });

    await sequelize.transaction(async (t) => {
      await Task.destroy({ where: { parent_task_id: task.id }, transaction: t });
      await task.destroy({ transaction: t });
    });

    return res.status(200).json({ message: "Task deleted." });
  } catch (err) {
    next(err);
  }
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };