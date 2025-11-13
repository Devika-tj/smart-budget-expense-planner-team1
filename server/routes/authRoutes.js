const express = require("express");
const router = express.Router();
const userModel = require("../models/User");
const passport = require("../config/Passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const PendingUser = require("../models/PendingUser");
const {generateOTP}=require("../utils/generateotp")
const {sendEmail}=require("../utils/sendemail")
const { protect } = require("../middleware/authMiddleware");


router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, role } = req.body;

    if (!fullName || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const existingPending = await PendingUser.findOne({ email });
    if (existingPending) await PendingUser.deleteOne({ email });

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    await PendingUser.create({
      fullName,
      email,
      password: hashed,
      role: role === "admin" ? "admin" : "user",
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000,
    });

    await sendEmail(email, "Your PiggyTrack Verification OTP", `Your OTP is: ${otp}`);

    res.status(200).json({
      message: "OTP sent to your email for verification.",
      email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while sending OTP" });
  }
});

// 🔹 Step 2: Verify OTP (Create Real User)
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const pending = await PendingUser.findOne({ email });
    if (!pending) return res.status(404).json({ message: "No pending signup found" });

    if (pending.otpExpires < Date.now())
      return res.status(400).json({ message: "OTP expired. Please resend." });

    if (pending.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    const { fullName, password, role } = pending;

    const newUser = new userModel({
      fullName,
      email,
      password,
      role,
      isVerified: true,
    });

    await newUser.save();
    await PendingUser.deleteOne({ email });

    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verification failed" });
  }
});

// 🔹 Step 3: Resend OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const pending = await PendingUser.findOne({ email });
    if (!pending) return res.status(404).json({ message: "No pending signup found" });

    const otp = generateOTP();
    pending.otp = otp;
    pending.otpExpires = Date.now() + 5 * 60 * 1000;
    await pending.save();

    await sendEmail(email, "Your new FinTrack OTP", `Your new OTP is: ${otp}`);

    res.json({ message: "New OTP sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to resend OTP" });
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
    await userModel.findByIdAndUpdate(user._id, { status: "Active", lastActive: new Date() });
    res.status(200).json({ message: "Login successful", token, user });
  } catch (er) {
    console.error(er);
    res.status(500).json({ message: "Server error" });
  }
});


// ------------------ USER LOGOUT ------------------
router.post("/logout", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(400).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = "Inactive";
    user.lastActive = new Date();
    await user.save();

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});




// ------------------ ADMIN UPDATE USER ------------------
router.patch("/update/:id", protect, async (req, res) => {
  try {
    //Only admin can update users
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const userId = req.params.id;
    const updateData = req.body;

    //Prevent password change here for safety
    if (updateData.password) {
      delete updateData.password;
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
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

// ------------------ UPDATE USER PROFILE ------------------
router.put("/update", protect, async (req, res) => {
  try {
    const { fullName, currentPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: "Current password incorrect" });
    }

    // Update name
    if (fullName) user.fullName = fullName;

    // Update password if provided
    if (newPassword && newPassword.trim() !== "") {
      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
    }

    await user.save();

    res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});


module.exports = router;
