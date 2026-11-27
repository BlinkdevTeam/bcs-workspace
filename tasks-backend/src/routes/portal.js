"use strict";

const { Router } = require("express");
const _auth = require("../middleware/requireAuth");
const requireAuth = _auth.requireAuth || _auth;
const c = require("../controllers/portalController");

// Mounted at /api/portal in app.js, so requireAuth only ever sees portal requests.
const router = Router();
router.use(requireAuth);

router.get("/leave",                   c.getLeave);
router.post("/leave-requests",         c.createLeave);
router.delete("/leave-requests/:id",   c.cancelLeave);

router.get("/overtime",                c.getOvertime);
router.post("/overtime",               c.createOvertime);
router.delete("/overtime/:id",         c.cancelOvertime);

router.get("/attendance",              c.getAttendance);

module.exports = router;
