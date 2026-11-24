"use strict";

const { Router } = require("express");
const _auth = require("../middleware/requireAuth");
const requireAuth = _auth.requireAuth || _auth;
const c = require("../controllers/projectStatusController");

// Mounted at /api in app.js. requireAuth is applied per route (not router-wide)
// so it can never block unrelated routes such as /auth/login.
const router = Router();

router.get("/project-statuses",                 requireAuth, c.listAll);
router.post("/projects/:projectId/statuses",    requireAuth, c.create);
router.delete("/project-statuses/:id",          requireAuth, c.remove);

module.exports = router;
