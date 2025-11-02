const express = require("express");
const router = express.Router();
const userModel = require("../models/User");
const passport = require("../config/Passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/authMiddleware");

// ------------------ USER SIGNUP ------------------
router.post("/signup", async (req, res) => {
  try {
    const { role, fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      role: role === "admin" ? "admin" : "user",
      fullName,
      email,
      password: hashed,
    });

    await newUser.save();
    res.status(201).json({ message: "Signup successful!" });
  } catch (er) {
    console.error(er);
    res.status(400).send("Can't add new user");
  }
});

// ------------------ USER LOGIN ------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "Login successful", token, user });
  } catch (er) {
    console.error(er);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------ GOOGLE OAUTH ------------------
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing");

      const token = jwt.sign(
        { id: req.user._id, role: req.user.role, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Encode user for redirect
      const encodedUser = encodeURIComponent(JSON.stringify(req.user));

    
      res.redirect(
        `${process.env.CLIENT_URL}/auth-success?token=${token}&role=${req.user.role}&user=${encodedUser}`
      );
    } catch (error) {
      console.error("Google login error:", error);
      res.redirect(`${process.env.CLIENT_URL}/?error=google_failed`);
    }
  }
);

// ------------------ CURRENT USER ------------------
router.get("/me", protect, async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("fullName email role");
    if (!user)
      return res.status(404).json({ success: false, msg: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
