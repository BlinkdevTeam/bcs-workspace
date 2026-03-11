"use strict";

const User = require("../models/core/user");
const { sequelize } = require("../config/database");
const bcrypt = require("bcrypt");
const CompanyProfile = require("../models/company/profile");

// ─────────────────────────────────────────────
// CHECK SETUP STATUS
// ─────────────────────────────────────────────
exports.getSetupStatus = async (req, res, next) => {
  try {
    const admin = await User.findOne({
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

    // 1️⃣ Check if setup already exists
    const existingAdmin = await User.findOne({
      where: { role: "super_admin" },
    });

    if (existingAdmin) {
      return res.status(403).json({
        success: false,
        message: "Setup already completed",
      });
    }

    // 2️⃣ Hash the password before saving
    const hashedPassword = await bcrypt.hash(admin.password, 10);

    // 3️⃣ Create the super admin with full required fields
    const newAdmin = await User.create(
      {
        first_name: admin.firstName,
        last_name: admin.lastName,
        work_email: admin.email, // updated column name
        password_hash: hashedPassword,
        role: "super_admin",
        is_active: true,
      },
      { transaction: t },
    );

    // 4️⃣ Create company profile
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
      message: "Setup complete",
      data: {
        admin: newAdmin,
        company: newCompany,
      },
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
