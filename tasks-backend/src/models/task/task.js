"use strict";

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const Task = sequelize.define(
  "Task",
  {
    id: {
      type:         DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey:   true,
    },
    project_id: {
      type:      DataTypes.UUID,
      allowNull: false,
      references: { model: "projects", key: "id" },
    },
    title: {
      type:      DataTypes.STRING(255),
      allowNull: false,
    },
    description: DataTypes.TEXT,
    assigned_to: {
      // Legacy single-assignee column, kept for backward compatibility.
      // Real assignment now goes through task_assignees (multi-assignee).
      type:      DataTypes.UUID,
      allowNull: true,
      references: { model: "employees", key: "id" },
    },
    priority: {
      type:         DataTypes.STRING(10),
      allowNull:    true,
      defaultValue: "medium",
    },
    status: {
      type:         DataTypes.STRING(20),
      allowNull:    false,
      defaultValue: "todo",
    },
    start_date:   DataTypes.DATEONLY,
    due_date:     DataTypes.DATEONLY,
    completed_at: DataTypes.DATE,
    created_by: {
      type:      DataTypes.UUID,
      allowNull: true,
      references: { model: "employees", key: "id" },
    },
    parent_task_id: {
      type:      DataTypes.UUID,
      allowNull: true,
      references: { model: "tasks", key: "id" },
    },
  },
  {
    tableName:  "tasks",
    timestamps: true,
    createdAt:  "created_at",
    updatedAt:  "updated_at",
    paranoid:   true,
    deletedAt:  "deleted_at",
  }
);

module.exports = Task;