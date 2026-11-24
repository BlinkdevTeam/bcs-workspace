"use strict";

const fs     = require("fs");
const path   = require("path");
const crypto = require("crypto");
const multer = require("multer");
const { Task, Employee } = require("../models");
const TaskAttachment = require("../models/task/taskAttachment");

// Make sure the table exists even if the server started before this file did
TaskAttachment.sync().catch((err) => console.error("task_attachments sync failed:", err.message));

// ── Settings ──────────────────────────────────────────────────────────────────
const UPLOAD_DIR   = path.join(__dirname, "..", "..", "uploads", "tasks");
const MAX_BYTES    = 10 * 1024 * 1024;                       // 10 MB per file
const ALLOWED_EXTS = [".docx", ".pdf", ".xlsx", ".csv"];
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const fixName = (n) => Buffer.from(n, "latin1").toString("utf8");   // multer reads names as latin1

// ── Upload middleware (saves to disk under a random name) ─────────────────────
const uploader = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename:    (_req, file, cb) =>
      cb(null, crypto.randomUUID() + path.extname(fixName(file.originalname)).toLowerCase()),
  }),
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(fixName(file.originalname)).toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      const err = new Error("Only .docx, .pdf, .xlsx and .csv files can be added.");
      err.code = "BAD_TYPE";
      return cb(err);
    }
    cb(null, true);
  },
}).single("file");

function uploadMiddleware(req, res, next) {
  uploader(req, res, (err) => {
    if (!err) return next();
    if (err.code === "LIMIT_FILE_SIZE")
      return res.status(413).json({ message: "That file is too large. The limit is 10 MB." });
    if (err.code === "BAD_TYPE")
      return res.status(400).json({ message: err.message });
    if (err.code === "LIMIT_UNEXPECTED_FILE")
      return res.status(400).json({ message: "Send one file at a time." });
    return next(err);
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const removeFile = (stored) => fs.promises.unlink(path.join(UPLOAD_DIR, stored)).catch(() => {});

// Check the file's first bytes really look like what its extension claims
function looksValid(fullPath, ext) {
  const fd = fs.openSync(fullPath, "r");
  try {
    const head = Buffer.alloc(1024);
    const n = fs.readSync(fd, head, 0, 1024, 0);
    const b = head.subarray(0, n);
    if (ext === ".pdf")                    return b.toString("latin1").includes("%PDF-");
    if (ext === ".docx" || ext === ".xlsx") return n >= 4 && b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04;
    if (ext === ".csv")                    return !b.includes(0x00);   // plain text has no NUL bytes
    return false;
  } finally {
    fs.closeSync(fd);
  }
}

async function serialize(rows) {
  const ids = [...new Set(rows.map((r) => r.uploaded_by).filter(Boolean))];
  const people = ids.length
    ? await Employee.findAll({ where: { id: ids }, attributes: ["id", "first_name", "last_name"] })
    : [];
  const byId = Object.fromEntries(people.map((p) => [p.id, `${p.first_name} ${p.last_name}`.replace(/\s+/g, " ").trim()]));
  return rows.map((r) => ({
    id:          r.id,
    task_id:     r.task_id,
    name:        r.original_name,
    size:        r.size,
    mime_type:   r.mime_type,
    uploaded_by: r.uploaded_by ? { id: r.uploaded_by, name: byId[r.uploaded_by] || "Unknown" } : null,
    created_at:  r.created_at,
  }));
}

// ── Handlers ──────────────────────────────────────────────────────────────────
// GET /api/tasks/:taskId/attachments
async function list(req, res, next) {
  try {
    const rows = await TaskAttachment.findAll({
      where: { task_id: req.params.taskId },
      order: [["created_at", "ASC"]],
    });
    return res.status(200).json({ attachments: await serialize(rows) });
  } catch (err) {
    next(err);
  }
}

// POST /api/tasks/:taskId/attachments   (multipart, field name "file")
async function create(req, res, next) {
  const file = req.file;
  try {
    if (!file) return res.status(400).json({ message: "No file received." });

    const task = await Task.findByPk(req.params.taskId);
    if (!task) { await removeFile(file.filename); return res.status(404).json({ message: "Task not found." }); }

    const originalName = fixName(file.originalname).slice(0, 255);
    const ext = path.extname(originalName).toLowerCase();
    if (!looksValid(file.path, ext)) {
      await removeFile(file.filename);
      return res.status(400).json({ message: "That file doesn't look like a real " + ext.slice(1).toUpperCase() + " file." });
    }

    const row = await TaskAttachment.create({
      task_id:       task.id,
      uploaded_by:   req.user.sub,
      original_name: originalName,
      stored_name:   file.filename,
      mime_type:     file.mimetype,
      size:          file.size,
    });

    const [out] = await serialize([row]);
    return res.status(201).json({ attachment: out });
  } catch (err) {
    if (file) await removeFile(file.filename);
    next(err);
  }
}

// GET /api/attachments/:id/download
async function download(req, res, next) {
  try {
    const row = await TaskAttachment.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "File not found." });

    const full = path.join(UPLOAD_DIR, path.basename(row.stored_name));
    if (!fs.existsSync(full)) return res.status(404).json({ message: "The file is missing from the server." });

    return res.download(full, row.original_name);   // always sent as a download, never rendered
  } catch (err) {
    next(err);
  }
}

// DELETE /api/attachments/:id   (only the person who added it)
async function remove(req, res, next) {
  try {
    const row = await TaskAttachment.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "File not found." });
    if (row.uploaded_by !== req.user.sub) {
      return res.status(403).json({ message: "Only the person who added a file can delete it." });
    }

    await row.destroy();
    await removeFile(path.basename(row.stored_name));
    return res.status(200).json({ message: "File deleted." });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadMiddleware, list, create, download, remove };
