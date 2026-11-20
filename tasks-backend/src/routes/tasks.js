"use strict";

const { Router } = require("express");
const _auth = require("../middleware/requireAuth");
const requireAuth = _auth.requireAuth || _auth;
const c = require("../controllers/taskController");

const router = Router();
router.use(requireAuth);

router.get("/",       c.listTasks);
router.post("/",      c.createTask);
router.get("/:id",    c.getTask);
router.patch("/:id",  c.updateTask);
router.delete("/:id", c.deleteTask);

module.exports = router;