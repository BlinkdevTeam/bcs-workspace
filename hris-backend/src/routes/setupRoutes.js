"use strict";

const express = require("express");
const router = express.Router();
const setupController = require("../controllers/setupController");
const { HrisUser } = require("../models");

// Health check
router.get("/", (_req, res) => {
  res.json({ message: "Setup endpoint is alive" });
});

// Existing: check if setup completed
router.get("/status", setupController.getSetupStatus);

// Initial setup
router.post("/", setupController.createSetup);

// NEW: Check if a super_admin already exists
router.get("/check-super-admin", async (_req, res) => {
  try {
    const superAdmin = await HrisUser.findOne({
      where: { role: "super_admin", is_active: true },
    });

    res.json({ exists: !!superAdmin });
  } catch (err) {
    console.error("Error checking super_admin:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
