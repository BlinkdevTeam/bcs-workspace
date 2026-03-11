"use strict";

const User = require("../models/core/user");

// GET ALL USERS
exports.getAll = async (_req, res, next) => {
  try {
    const users = await User.findAll();

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// GET USER BY ID
exports.getById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// CREATE USER
exports.create = async (req, res, next) => {
  try {
    const { employee_id, email, password_hash, role } = req.body;

    const user = await User.create({
      employee_id,
      email,
      password_hash,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// CHECK IF USER IS SUPER ADMIN
exports.checkSuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "User is not super admin",
      });
    }

    res.json({
      success: true,
      message: "User is super admin",
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};
