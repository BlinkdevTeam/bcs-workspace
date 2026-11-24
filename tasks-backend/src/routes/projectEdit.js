"use strict";

const { Router } = require("express");
const _auth = require("../middleware/requireAuth");
const requireAuth = _auth.requireAuth || _auth;
const c = require("../controllers/projectEditController");

// Mounted at /api in app.js (before the main router). Per-route auth, so it can
// never block unrelated routes.
const router = Router();
router.patch("/projects/:id", requireAuth, c.updateProject);

module.exports = router;
