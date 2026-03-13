"use strict";

const express = require("express");
const router = express.Router();
const { login, refresh, logout } = require("../controllers/authController");

// Login
router.post("/login", login);

// Refresh token
router.post("/refresh", refresh);

// logout route
router.post("/logout", logout);

module.exports = router;
