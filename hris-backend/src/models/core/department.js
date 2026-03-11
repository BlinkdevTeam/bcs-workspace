"use strict";

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const Department = sequelize.define(
  "Department",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    head_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "departments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    paranoid: true,
    deletedAt: "deleted_at",
  },
);

module.exports = Department;
