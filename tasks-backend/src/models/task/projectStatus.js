"use strict";

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

// Custom status labels that belong to ONE project.
// (To Do / In Progress / In Review / Done are built in and not stored here.)
const ProjectStatus = sequelize.define(
  "ProjectStatus",
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
    key: {
      // What gets stored in tasks.status for this label (fits tasks.status VARCHAR(20))
      type:      DataTypes.STRING(20),
      allowNull: false,
    },
    label: {
      type:      DataTypes.STRING(30),
      allowNull: false,
    },
    color: {
      type:         DataTypes.STRING(9),
      allowNull:    false,
      defaultValue: "#14b8a6",
    },
    position: {
      type:         DataTypes.INTEGER,
      allowNull:    false,
      defaultValue: 0,
    },
  },
  {
    tableName:  "project_statuses",
    timestamps: true,
    createdAt:  "created_at",
    updatedAt:  "updated_at",
  }
);

module.exports = ProjectStatus;
