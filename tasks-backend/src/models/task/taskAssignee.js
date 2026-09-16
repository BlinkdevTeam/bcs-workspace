"use strict";

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const TaskAssignee = sequelize.define(
  "TaskAssignee",
  {
    id: {
      type:         DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey:   true,
    },
    task_id: {
      type:      DataTypes.UUID,
      allowNull: false,
      references: { model: "tasks", key: "id" },
    },
    employee_id: {
      type:      DataTypes.UUID,
      allowNull: false,
      references: { model: "employees", key: "id" },
    },
  },
  {
    tableName:  "task_assignees",
    timestamps: true,
    createdAt:  "created_at",
    updatedAt:  false, // table has no updated_at column
  }
);

module.exports = TaskAssignee;