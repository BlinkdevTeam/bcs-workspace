"use strict";

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const ProjectMember = sequelize.define(
  "ProjectMember",
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
    employee_id: {
      type:      DataTypes.UUID,
      allowNull: false,
      references: { model: "employees", key: "id" },
    },
    role: DataTypes.STRING(50),
  },
  {
    tableName:  "project_members",
    timestamps: true,
    createdAt:  "created_at",
    updatedAt:  "updated_at",
  }
);

module.exports = ProjectMember;