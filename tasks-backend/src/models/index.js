"use strict";

const { sequelize } = require("../config/database");

const Employee          = require("./core/employee");
const RefreshToken      = require("./core/refreshTokens");
const Project           = require("./task/project");
const Task              = require("./task/task");
const TaskAssignee      = require("./task/taskAssignee");
const ProjectMember     = require("./task/projectMember");
const TaskTag           = require("./task/taskTag");
const TaskTagAssignment = require("./task/taskTagAssignment");
const TaskTimeLog       = require("./task/taskTimeLog");

// ── Associations ──────────────────────────────────────────────────────────────

// Project ↔ Task
Project.hasMany(Task, { foreignKey: "project_id", as: "tasks" });
Task.belongsTo(Project, { foreignKey: "project_id", as: "project" });

// Task ↔ Task (subtasks, self-reference)
Task.hasMany(Task, { foreignKey: "parent_task_id", as: "subtasks" });
Task.belongsTo(Task, { foreignKey: "parent_task_id", as: "parent" });

// Task ↔ Employee (multi-assignee, through task_assignees)
Task.belongsToMany(Employee, {
  through:    TaskAssignee,
  foreignKey: "task_id",
  otherKey:   "employee_id",
  as:         "assignees",
});
Employee.belongsToMany(Task, {
  through:    TaskAssignee,
  foreignKey: "employee_id",
  otherKey:   "task_id",
  as:         "assignedTasks",
});

// Project ↔ Employee (project members)
Project.belongsToMany(Employee, {
  through:    ProjectMember,
  foreignKey: "project_id",
  otherKey:   "employee_id",
  as:         "members",
});
Employee.belongsToMany(Project, {
  through:    ProjectMember,
  foreignKey: "employee_id",
  otherKey:   "project_id",
  as:         "projects",
});

// Task ↔ TaskTag (through task_tag_assignments)
Task.belongsToMany(TaskTag, {
  through:    TaskTagAssignment,
  foreignKey: "task_id",
  otherKey:   "tag_id",
  as:         "tags",
});
TaskTag.belongsToMany(Task, {
  through:    TaskTagAssignment,
  foreignKey: "tag_id",
  otherKey:   "task_id",
  as:         "tasks",
});

// Task ↔ TaskTimeLog
Task.hasMany(TaskTimeLog, { foreignKey: "task_id", as: "timeLogs" });
TaskTimeLog.belongsTo(Task, { foreignKey: "task_id", as: "task" });
TaskTimeLog.belongsTo(Employee, { foreignKey: "employee_id", as: "employee" });

module.exports = {
  sequelize,
  Employee,
  RefreshToken,
  Project,
  Task,
  TaskAssignee,
  ProjectMember,
  TaskTag,
  TaskTagAssignment,
  TaskTimeLog,
};