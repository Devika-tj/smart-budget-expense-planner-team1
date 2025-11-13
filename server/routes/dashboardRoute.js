const express = require("express");
const router = express.Router();
const { getOverallSpendingTrends } = require("../controllers/adminController");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Access denied. No token provided." });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(400).json({ message: "Invalid token." });
  }
};


const authAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }
    next();
  });
};


router.get("/users", authAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
     res.status(500).json({ message: "Server error", error: error.message });
   }
 });

router.get("/spending-trends", authAdmin, getOverallSpendingTrends);

module.exports = router;
