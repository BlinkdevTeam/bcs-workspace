"use strict";

const bcrypt = require("bcrypt");
const User = require("../models/core/user");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by work_email (not the old 'email' column)
    const user = await User.findOne({
      where: { work_email: email }, // updated column
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // compare password with hash
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // optionally update last login timestamp
    user.last_login_at = new Date();
    await user.save();

    return res.json({
      success: true,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        work_email: user.work_email, // use work_email
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
