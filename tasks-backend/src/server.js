"use strict";

require("dotenv").config();

const app            = require("./app");
const { connectDB }  = require("./config/database");
const config         = require("./config");
require("./models");  // ← add this line

const startServer = async () => {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`🚀 tasks-backend running on http://localhost:${config.port}`);
    console.log(`📦 Environment: ${config.env}`);
  });
};

startServer();