const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

// 🔒 Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded payload to request
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// 🧩 GET all users (Admin only)
router.get("/users", verifyToken, async (req, res) => {
  try {
    // only allow admins
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access forbidden. Admins only." });
    }

    const users = await User.find({}, "-password"); // exclude password field
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;