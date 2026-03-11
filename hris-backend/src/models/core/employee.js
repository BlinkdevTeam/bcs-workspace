"use strict";

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    employee_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    middle_name: {
      type: DataTypes.STRING(100),
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    personal_email: DataTypes.STRING,

    phone: DataTypes.STRING(30),

    avatar_initials: DataTypes.STRING(4),

    department_id: {
      type: DataTypes.UUID,
      allowNull: true, // now optional
    },

    role_title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    employment_type: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING(30),
      defaultValue: "active",
    },

    hire_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    end_date: DataTypes.DATEONLY,

    manager_id: {
      type: DataTypes.UUID,
      allowNull: true, // now optional
    },
  },
  {
    tableName: "employees",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,
    deletedAt: "deleted_at",
  },
);

module.exports = Employee;
