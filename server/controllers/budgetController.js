const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

exports.setBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    let { month, year, limit, categories = [], isYearly = false } = req.body;

    if (!month || !year) return res.status(400).json({ message: "month and year required" });

   
    if (isYearly) {
      limit = Number(limit) / 12;
    }

    const update = { limit, categories };
    const budget = await Budget.findOneAndUpdate(
      { userId, month, year },
      { $set: update },
      { upsert: true, new: true }
    );

    res.json({
      message: isYearly
        ? "Yearly budget converted and saved as monthly budget"
        : "Monthly budget saved",
      budget,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;
    if (!month || !year) return res.status(400).json({ message: "month and year required" });

    const budget = await Budget.findOne({ userId, month, year });
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const expenses = await Expense.find({
      userId,
      type: "expense",
      date: { $gte: start, $lte: end },
    });

    const totalExpense = expenses.reduce((s, e) => s + (e.amount || 0), 0);

    const progress = budget && budget.limit ? ((totalExpense / budget.limit) * 100).toFixed(2) : "0.00";

    res.json({ budget, totalExpense, progress: parseFloat(progress) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

