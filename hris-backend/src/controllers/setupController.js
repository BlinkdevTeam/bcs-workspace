"use strict";

const { Employee, HrisUser } = require("../models");
const { sequelize } = require("../config/database");
const bcrypt = require("bcrypt");
const CompanyProfile = require("../models/company/profile");

// ─────────────────────────────────────────────
// CHECK SETUP STATUS
// ─────────────────────────────────────────────
exports.getSetupStatus = async (req, res, next) => {
  try {
    const admin = await HrisUser.findOne({
      where: { role: "super_admin" },
    });

    res.json({
      setupComplete: !!admin,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// CREATE INITIAL SETUP
// ─────────────────────────────────────────────
exports.createSetup = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { company, admin } = req.body;

    // 1️⃣ Check if setup already done
    const existingAdmin = await HrisUser.findOne({
      where: { role: "super_admin" },
    });

    if (existingAdmin) {
      return res.status(403).json({
        success: false,
        message: "Setup already completed",
      });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(admin.password, 10);

    // 3️⃣ Create employee
    const employee = await Employee.create(
      {
        employee_code: "EMP-0001",
        first_name: admin.firstName,
        last_name: admin.lastName,
        email: admin.email,
        role_title: "Super Admin",
        employment_type: "full_time",
        hire_date: new Date(),
        password_hash: hashedPassword,
        is_active: true,
        must_change_password: false,
      },
      { transaction: t },
    );

    // 4️⃣ Give HRIS access
    const hrisUser = await HrisUser.create(
      {
        employee_id: employee.id,
        role: "super_admin",
        is_active: true,
        granted_at: new Date(),
      },
      { transaction: t },
    );

    // 5️⃣ Create company profile
    const newCompany = await CompanyProfile.create(
      {
        company_name: company.companyName,
        industry: company.industry,
        company_size: company.size,
      },
      { transaction: t },
    );

    await t.commit();

    res.json({
      success: true,
      message: "Initial setup completed successfully",
      data: {
        employee,
        role: hrisUser,
        company: newCompany,
      },
    });
  } catch (err) {
    await t.rollback();
    console.error("Setup error:", err);
    next(err);
  }
};
