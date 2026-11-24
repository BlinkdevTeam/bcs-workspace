"use strict";

const { Router } = require("express");
const _auth = require("../middleware/requireAuth");
const requireAuth = _auth.requireAuth || _auth;
const c = require("../controllers/attachmentController");

// Mounted at /api in app.js. requireAuth is applied per route so it can never
// block unrelated routes such as /auth/login. It runs BEFORE the upload is read.
const router = Router();

router.get("/tasks/:taskId/attachments",    requireAuth, c.list);
router.post("/tasks/:taskId/attachments",   requireAuth, c.uploadMiddleware, c.create);
router.get("/attachments/:id/download",     requireAuth, c.download);
router.delete("/attachments/:id",           requireAuth, c.remove);

module.exports = router;
