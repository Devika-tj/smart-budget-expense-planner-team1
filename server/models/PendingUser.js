const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  otp: String,
  otpExpires: Date,
});

module.exports = mongoose.model("PendingUser", pendingUserSchema);