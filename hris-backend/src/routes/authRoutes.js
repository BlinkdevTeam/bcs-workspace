"use strict";

const express = require("express");
const router = express.Router();
const { login, refresh } = require("../controllers/authController");

// Login
router.post("/login", login);

// Refresh token
router.post("/refresh", refresh);

module.exports = router;
