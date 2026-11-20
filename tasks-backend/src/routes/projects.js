"use strict";

const { Router } = require("express");
const _auth = require("../middleware/requireAuth");
const requireAuth = _auth.requireAuth || _auth;
const c = require("../controllers/projectController");

const router = Router();
router.use(requireAuth);

router.get("/",  c.listProjects);
router.post("/", c.createProject);

module.exports = router;