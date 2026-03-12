"use strict";

const bcrypt = require("bcrypt");
const { Employee, HrisUser } = require("../models");

// Login controller
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    email = email.toLowerCase().trim();

    // Find employee
    const employee = await Employee.findOne({
      where: { email, is_active: true },
    });

    if (!employee) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Validate password
    const validPassword = await bcrypt.compare(
      password,
      employee.password_hash,
    );
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check HRIS access
    const hrisUser = await HrisUser.findOne({
      where: { employee_id: employee.id, is_active: true },
    });

    if (!hrisUser) {
      return res
        .status(403)
        .json({ message: "User does not have HRIS access" });
    }

    // Update last login
    await employee.update({ last_login_at: new Date() });

    // Generate dummy accessToken (replace with JWT in production)
    const accessToken = "dummy-access-token";

    res.json({
      success: true,
      accessToken,
      user: {
        id: employee.id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        role: hrisUser.role,
        dept: employee.department_id,
        unreadNotifications: 0,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Refresh token controller
exports.refresh = async (req, res) => {
  try {
    // Dummy refresh logic: in production, validate httpOnly cookie and issue new token
    const dummyUser = {
      id: "user-id",
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      role: "admin",
      dept: "Engineering",
      unreadNotifications: 0,
    };

    res.json({ accessToken: "dummy-access-token", user: dummyUser });
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};
