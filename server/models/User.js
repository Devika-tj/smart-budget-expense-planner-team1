const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: function () {
        return !this.googleId; 
      },
      minlength: [3, "Name must be at least 3 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId; 
      },
      minlength: [6, "Password must be at least 6 characters"],
    },

    googleId: {
      type: String,
      default: null,
    },

    avatar: {
      type: String,
      default: "", 
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],

      default: "Inactive",
    },
    lastActive: {
      type: Date,
      default: Date.now,

      default: "Active", 
    },
     resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("users", userSchema);
