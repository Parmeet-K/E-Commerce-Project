const express = require("express");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { createToken } = require("../utils/token");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      existingUser.name = name.trim();
      if (password) {
        existingUser.setPassword(password);
      }
      await existingUser.save();

      const token = createToken({ id: existingUser._id.toString(), role: existingUser.role });
      return res.status(200).json({ token, user: existingUser.toSafeObject() });
    }

    const user = new User({ name, email, role: "customer" });
    if (password) {
      user.setPassword(password);
    }
    await user.save();

    const token = createToken({ id: user._id.toString(), role: user.role });
    res.status(201).json({ token, user: user.toSafeObject() });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (password && !user.comparePassword(password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (name?.trim() && user.name !== name.trim()) {
      user.name = name.trim();
      await user.save();
    }

    const token = createToken({ id: user._id.toString(), role: user.role });
    res.json({ token, user: user.toSafeObject() });
  })
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(req.user.toSafeObject());
  })
);

module.exports = router;
