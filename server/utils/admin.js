const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
     const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      const admin = new User({
        fullName: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin", 
      });

      await admin.save();
      console.log(" Admin user created:", adminEmail, "| password: Admin@123");
    } else {
      console.log(" Admin user already exists:", adminEmail);
    }
  } catch (err) {
    console.error(" Error seeding admin:", err.message);
  }
};

module.exports = createAdmin;
