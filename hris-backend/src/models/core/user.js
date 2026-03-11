"use strict";

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    work_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    role: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "employee",
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,

    paranoid: true,
    deletedAt: "deleted_at",
  },
);

module.exports = User;
