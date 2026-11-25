"use strict";

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const LeaveType = sequelize.define(
  "LeaveType",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    description: {
      type: DataTypes.TEXT,
    },

    days_per_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    is_paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    // 'upfront' = whole yearly allowance from January
    // 'monthly' = earned days_per_year / 12 on the 1st of each month
    accrual_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "upfront",
    },

    // Monthly types only: start earning this many months after the hire month (0 = hire month)
    earn_after_months: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    // Only active types are offered to employees; HR switches types on and off.
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "leave_types",
    timestamps: true,
  },
);

module.exports = LeaveType;
