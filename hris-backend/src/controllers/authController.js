"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { Employee, HrisUser, RefreshToken } = require("../models");

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access-secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh-secret";

/* ---------------- LOGIN ---------------- */

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    email = email.toLowerCase().trim();

    const employee = await Employee.findOne({
      where: { email, is_active: true },
    });

    if (!employee) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      employee.password_hash
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const hrisUser = await HrisUser.findOne({
      where: { employee_id: employee.id, is_active: true },
    });

    if (!hrisUser) {
      return res.status(403).json({
        message: "User does not have HRIS access",
      });
    }

    await employee.update({
      last_login_at: new Date(),
    });

    /* -------- CREATE ACCESS TOKEN -------- */

    const accessToken = jwt.sign(
      {
        id: employee.id,
        role: hrisUser.role,
      },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    /* -------- CREATE REFRESH TOKEN -------- */

    const refreshToken = jwt.sign(
      { id: employee.id },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const token_hash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 7);

    await RefreshToken.create({
      employee_id: employee.id,
      app: "hris",
      token_hash,
      expires_at,
    });

    /* -------- STORE COOKIE -------- */

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
    res.status(500).json({
      message: "Server error during login",
    });
  }
};

/* ---------------- REFRESH ---------------- */

exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "No refresh token",
      });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    const token_hash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const storedToken = await RefreshToken.findOne({
      where: {
        token_hash,
        revoked_at: null,
      },
    });

    if (!storedToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const employee = await Employee.findByPk(decoded.id);

    const hrisUser = await HrisUser.findOne({
      where: {
        employee_id: employee.id,
        is_active: true,
      },
    });

    const accessToken = jwt.sign(
      {
        id: employee.id,
        role: hrisUser.role,
      },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
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
    console.error("Refresh error:", err);

    res.status(401).json({
      message: "Invalid refresh token",
    });
  }
};


/* ---------------- LOGOUT ---------------- */
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const token_hash = require("crypto")
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      // Set revoked_at to now
      await require("../models").RefreshToken.update(
        { revoked_at: new Date() },
        { where: { token_hash, revoked_at: null } }
      );
    }

    // Clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
    });

    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error during logout" });
  }
};