

// server.js
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// const userRoute = require("./routes/authRoutes");
// const forgetPassword = require("./routes/forgetPassword");
// const budgetRoutes = require("./routes/Budgetroutes");
// const aiRoutes = require("./routes/airoutes");
// const expenseRoutes=require("./routes/ExpenseRoutes")

const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Import Routes
const userRoute = require("./routes/authRoutes");
const forgetPassword = require("./routes/forgetPassword");
const budgetRoutes = require("./routes/Budgetroutes");
const aiRoutes = require("./routes/airoutes");
const expenseRoutes = require("./routes/ExpenseRoutes");
const incomeRoutes = require("./routes/IncomeRoutes");

// Use Routes
app.use("/auth", userRoute);
app.use("/api/forgot-password", forgetPassword);
app.use("/api/budget", budgetRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incomeRoutes);

// Start server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
