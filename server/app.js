const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 8000;


const createAdmin=require('./utils/admin')
createAdmin()
connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


const userRoute = require("./routes/authRoutes");
const forgetPassword = require("./routes/forgetPassword");
const budgetRoutes = require("./routes/Budgetroutes");
const aiRoutes = require("./routes/airoutes");
const expenseRoutes = require("./routes/ExpenseRoutes");
const incomeRoutes = require("./routes/IncomeRoutes");
const adminRoutes = require("./routes/dashboardRoute");


app.use("/auth", userRoute);
app.use("/api/forgot-password", forgetPassword);
app.use("/api/budget", budgetRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/admin", adminRoutes);


const CreateAdmin = require("./utils/admin");
CreateAdmin();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
