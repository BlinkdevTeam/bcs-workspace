"use strict";

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const HrisUser = sequelize.define(
  "HrisUser",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    employee_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "employees",
        key: "id",
      },
    },

    role: {
      type: DataTypes.ENUM("super_admin", "hr_admin", "manager"),
      allowNull: false,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    granted_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    granted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    revoked_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    revoked_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "hris_users",
    timestamps: false,
  },
);

module.exports = HrisUser;
