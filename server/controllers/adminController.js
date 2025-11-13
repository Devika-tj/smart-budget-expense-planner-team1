const Expense = require("../models/Expense");
const Income = require("../models/Income");
const User = require("../models/User");


exports.getOverallSpendingTrends = async (req, res) => {
  try {
    
    const [expenses, incomes, users] = await Promise.all([
      Expense.find({}),
      Income.find({}),
      User.find({ role: "user" }),
    ]);

    
    const totalUsers = users.length;
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalIncome = incomes.reduce((sum, e) => sum + (e.amount || 0), 0);

    
    const userSpending = users.map((user) => {
      const userExpenses = expenses.filter(
        (e) => e.userId?.toString() === user._id.toString()
      );
      const total = userExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
      return { name: user.fullName, email: user.email, totalSpent: total };
    });

    
    const topSpenders = [...userSpending]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

   
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
