// const Expense = require("../models/Expense");
// const User = require("../models/User");

// // Admin: View overall spending trends
// exports.getOverallSpendingTrends = async (req, res) => {
//   try {
//     const expenses = await Expense.find({});
//     const users = await User.find({ role: "user" });

//     // Calculate totals
//     const totalUsers = users.length;
//     const totalExpenses = expenses
//       .filter((e) => e.type === "expense")
//       .reduce((sum, e) => sum + e.amount, 0);

//     const totalIncome = expenses
//       .filter((e) => e.type === "income")
//       .reduce((sum, e) => sum + e.amount, 0);

//     // Spending per user
//     const userSpending = users.map((user) => {
//       const userExpenses = expenses.filter(
//         (e) => e.userId.toString() === user._id.toString() && e.type === "expense"
//       );
//       const total = userExpenses.reduce((sum, e) => sum + e.amount, 0);
//       return { name: user.fullName, email: user.email, totalSpent: total };
//     });

//     // Top 5 biggest spenders
//     const topSpenders = [...userSpending]
//       .sort((a, b) => b.totalSpent - a.totalSpent)
//       .slice(0, 5);

//     // Category breakdown
//     const categoryTotals = {};
//     expenses
//       .filter((e) => e.type === "expense")
//       .forEach((e) => {
//         categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
//       });

//     const topCategories = Object.entries(categoryTotals)
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, 5)
//       .map(([cat, amt]) => ({ category: cat, amount: amt }));

//     res.json({
//       totalUsers,
//       totalIncome,
//       totalExpenses,
//       topSpenders,
//       topCategories,
//     });
//   } catch (err) {
//     console.error("Admin Spending Trends Error:", err);
//     res.status(500).json({ message: "Server error fetching spending trends" });
//   }
// };

const Expense = require("../models/Expense");
const Income = require("../models/Income");
const User = require("../models/User");

// Admin: View overall spending trends
exports.getOverallSpendingTrends = async (req, res) => {
  try {
    // Fetch all data
    const [expenses, incomes, users] = await Promise.all([
      Expense.find({}),
      Income.find({}),
      User.find({ role: "user" }),
    ]);

    // Totals
    const totalUsers = users.length;
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalIncome = incomes.reduce((sum, e) => sum + (e.amount || 0), 0);

    // Spending per user
    const userSpending = users.map((user) => {
      const userExpenses = expenses.filter(
        (e) => e.userId?.toString() === user._id.toString()
      );
      const total = userExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
      return { name: user.fullName, email: user.email, totalSpent: total };
    });

    // Top 5 spenders
    const topSpenders = [...userSpending]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    // Category breakdown
    const categoryTotals = {};
    expenses.forEach((e) => {
      if (e.category) {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
      }
    });

    const topCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat, amt]) => ({ category: cat, amount: amt }));

    res.json({
      totalUsers,
      totalIncome,
      totalExpenses,
      topSpenders,
      topCategories,
    });
  } catch (err) {
    console.error("Admin Spending Trends Error:", err);
    res.status(500).json({ message: "Server error fetching spending trends" });
  }
};
