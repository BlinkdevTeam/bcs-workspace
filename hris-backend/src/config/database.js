"use strict";

// Load environment variables first
require("dotenv").config();

const { Sequelize } = require("sequelize");
const config = require("./index"); // now process.env is loaded

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: "postgres",
    logging: config.env === "development" ? console.log : false,
  },
);

// ── SAFETY GUARD ────────────────────────────────────────────
// The tasks app shares the `employees` table and needs columns this app's models don't list
// (email_verified, failed_login_attempts, locked_until). Something kept dropping them on
// startup, which locked people out of the tasks app. This app is never allowed to drop a
// column automatically; if code tries, it is skipped and a warning (with where it came
// from) is printed instead. Drop columns by hand with a deliberate ALTER TABLE.
const queryInterface = sequelize.getQueryInterface();
queryInterface.removeColumn = async (table, column) => {
  const name = typeof table === "object" ? `${table.schema || "public"}.${table.tableName}` : table;
  console.warn(`[db-guard] Skipped DROP COLUMN ${name}.${column}`);
  console.warn(new Error("db-guard").stack.split("\n").slice(2, 9).join("\n"));
};

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected.");

    if (config.env === "development") {
      await sequelize.sync();
      console.log("Database synced.");
    }
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

module.exports = { sequelize, connectDB };
