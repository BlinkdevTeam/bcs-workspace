const { createRoleWithPermissions } = require("../services/roleService");

exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;

    const role = await createRoleWithPermissions(name);

    res.json({
      message: "Role created with permissions",
      role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create role" });
  }
};
