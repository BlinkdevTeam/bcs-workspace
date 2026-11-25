"use strict";

const { sequelize } = require("../config/database");

/**
 * requirePermission("leave.configure", ...)
 * Must run after `protect` (needs req.user.id). Passes when the signed-in HRIS user's role
 * is super_admin or holds at least one of the listed permissions in role_permissions.
 */
module.exports = function requirePermission(...permissions) {
  return async function (req, res, next) {
    try {
      if (!req.user?.id) return res.sendStatus(401);

      const [rows] = await sequelize.query(
        `SELECT 1
           FROM hris_users hu
           JOIN roles r ON r.id = hu.role_id
      LEFT JOIN role_permissions rp ON rp.role_id = hu.role_id AND rp.permission = ANY(ARRAY[:perms]::text[])
          WHERE hu.employee_id = :id AND hu.is_active = true
            AND (r.name = 'super_admin' OR rp.id IS NOT NULL)
          LIMIT 1`,
        { replacements: { id: req.user.id, perms: permissions } }
      );

      if (!rows.length) {
        return res.status(403).json({ message: "You do not have permission to do this." });
      }
      next();
    } catch (err) {
      console.error("requirePermission error:", err);
      res.status(500).json({ message: "Authorization error" });
    }
  };
};
