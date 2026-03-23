// seeders/seedRolePermissions.js
import { ALL_PERMISSIONS } from "../config/permissions.js";
import db from "../models/index.js";

export async function seedPermissionsForRole(roleName) {
  const RolePermission = db.RolePermission;

  for (const [module, perms] of Object.entries(ALL_PERMISSIONS)) {
    for (const perm of perms) {
      await RolePermission.create({
        role: roleName,
        module,
        permission: perm,
      });
    }
  }

  console.log(`Permissions seeded for role: ${roleName}`);
}
