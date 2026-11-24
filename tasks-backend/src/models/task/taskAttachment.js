"use strict";

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

// A file attached to a task. The file itself lives on disk (uploads/tasks/<stored_name>);
// this row remembers who added it and what it was originally called.
const TaskAttachment = sequelize.define(
  "TaskAttachment",
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
    uploaded_by: {
      type:      DataTypes.UUID,
      allowNull: true,
      references: { model: "employees", key: "id" },
    },
    original_name: { type: DataTypes.STRING(255), allowNull: false },
    stored_name:   { type: DataTypes.STRING(100), allowNull: false },
    mime_type:     { type: DataTypes.STRING(150) },
    size:          { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    tableName:  "task_attachments",
    timestamps: true,
    createdAt:  "created_at",
    updatedAt:  "updated_at",
  }
);

module.exports = TaskAttachment;
