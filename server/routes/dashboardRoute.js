// const express = require("express");
// const router = express.Router();
// const User = require("../models/User.js");
// const jwt = require("jsonwebtoken");


// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

//   if (!token) {
//     return res.status(401).json({ message: "Access denied. No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // attach decoded payload to request
//     next();
//   } catch (error) {
//     res.status(400).json({ message: "Invalid token." });
//   }
// };


// router.get("/users", verifyToken, async (req, res) => {
//   try {
//     // only allow admins
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access forbidden. Admins only." });
//     }

//     const users = await User.find({}, "-password"); // exclude password field
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const User = require("../models/User.js");
// const jwt = require("jsonwebtoken");
// const { getOverallSpendingTrends } = require("../controllers/adminController");

// // --- Middleware to verify token ---
// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

//   if (!token) {
//     return res.status(401).json({ message: "Access denied. No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // attach decoded payload to request
//     next();
//   } catch (error) {
//     res.status(400).json({ message: "Invalid token." });
//   }
// };

// // --- Middleware to check admin role ---
// const authAdmin = (req, res, next) => {
//   verifyToken(req, res, () => {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access forbidden. Admins only." });
//     }
//     next();
//   });
// };

// // ✅ Route to get all users (admin only)
// router.get("/users", authAdmin, async (req, res) => {
//   try {
//     const users = await User.find({}, "-password");
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// // ✅ Route to get overall spending trends (admin only)
// router.get("/spending-trends", authAdmin, getOverallSpendingTrends);

// module.exports = router;


const express = require("express");
const router = express.Router();
const { getOverallSpendingTrends } = require("../controllers/adminController");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify token
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

// Only admin access
const authAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }
    next();
  });
};

//  ✅ Route to get all users (admin only)
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
