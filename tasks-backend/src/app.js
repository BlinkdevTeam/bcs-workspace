"use strict";
 
const express      = require("express");
const helmet       = require("helmet");
const cors         = require("cors");
const morgan       = require("morgan");
const router       = require("./routes");
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
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
app.use("/api", router);
 
app.use(notFound);
app.use(errorHandler);
 
module.exports = app;