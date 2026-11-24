"use strict";

const express      = require("express");
const helmet       = require("helmet");
const cors         = require("cors");
const morgan       = require("morgan");
const cookieParser = require("cookie-parser");
const router       = require("./routes");
const projectStatusRoutes = require("./routes/projectStatuses");
const attachmentRoutes    = require("./routes/attachments");
const projectEditRoutes   = require("./routes/projectEdit");
const errorHandler = require("./middleware/errorHandler");
const notFound     = require("./middleware/notFound");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",  // hris-frontend
      "http://localhost:5174",  // tasks-frontend
    ],
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());   // lets the auth routes read the refresh-token cookie

app.use("/api", projectStatusRoutes);   // custom status labels per project
app.use("/api", attachmentRoutes);      // files attached to tasks
app.use("/api", projectEditRoutes);     // rename / edit a project
app.use("/api", router);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
