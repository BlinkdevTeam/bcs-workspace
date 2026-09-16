"use strict";

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const Project = sequelize.define(
  "Project",
  {
    id: {
      type:         DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey:   true,
    },
    name: {
      type:      DataTypes.STRING(255),
      allowNull: false,
    },
    description: DataTypes.TEXT,
    start_date:  DataTypes.DATEONLY,
    end_date:    DataTypes.DATEONLY,
    status: {
      type:         DataTypes.STRING(20),
      allowNull:    false,
      defaultValue: "active",
    },
    created_by: {
      type:      DataTypes.UUID,
      allowNull: true,
      references: { model: "employees", key: "id" },
    },
  },
  {
    tableName:  "projects",
    timestamps: true,
    createdAt:  "created_at",
    updatedAt:  "updated_at",
    paranoid:   true,
    deletedAt:  "deleted_at",
  }
);

module.exports = Project;