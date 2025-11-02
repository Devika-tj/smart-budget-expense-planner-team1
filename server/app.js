const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");

const userRoute = require("./routes/authRoutes");
const forgetPassword = require("./routes/forgetPassword");
const budgetRoutes = require("./routes/Budgetroutes");
const aiRoutes = require("./routes/airoutes");
const expenseRoutes=require("./routes/ExpenseRoutes")

const createAdmin = require("./utils/admin");
createAdmin();

const PORT = process.env.PORT || 8000;


connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);


app.use("/auth", userRoute);
app.use("/api/auth", forgetPassword);
app.use("/api/budget", budgetRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/expense", expenseRoutes)


console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded " : "Missing ");

app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
