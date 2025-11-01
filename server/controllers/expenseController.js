const xlsx = require("xlsx");
const Expense = require("../models/Expense");
const Budget = require("../models/Budget"); 

//  Add Expense or Income
exports.addExpense = async (req, res) => {
  const userId = req.user.userId;

  try {
    const { title, category, amount, paymentMode, date, type } = req.body;

    // Validation
    if (!title || !category || !amount || !date || !paymentMode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newExpense = new Expense({
      userId,
      title,
      category,
      amount,
      paymentMode,
      type,
      date: new Date(date),
    });

    await newExpense.save();

    res.status(200).json({
      message: "Expense added successfully",
      expense: newExpense,
    });
  } catch (error) {
    console.error("Add Expense Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//  Get all expenses for a user
exports.getAllExpense = async (req, res) => {
  const userId = req.user.userId;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Fetch Expense Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Expense
exports.updateExpense = async (req, res) => {
  try {
    const { title, category, amount, paymentMode, date, type } = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { title, category, amount, paymentMode, date, type },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("Update Expense Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//  Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete Expense Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//  Monthly Summary & Budget Progress
exports.getMonthlySummary = async (req, res) => {
  const userId = req.user.userId;
  const { month, year } = req.query;

  try {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const expenses = await Expense.find({
      userId,
      date: { $gte: start, $lte: end },
    });

    const totalExpense = expenses
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0);

    const totalIncome = expenses
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0);

    // Optional: integrate with budget if you have one
    const budget = await Budget.findOne({ userId, month, year });
    const budgetLimit = budget ? budget.limit : 0;
    const progress = budgetLimit ? (totalExpense / budgetLimit) * 100 : 0;

    res.json({
      totalIncome,
      totalExpense,
      budgetLimit,
      progress: progress.toFixed(2) + "%",
    });
  } catch (error) {
    console.error("Monthly Summary Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//  Download Expense Report (Excel)
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.userId;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    const data = expenses.map((item) => ({
      Title: item.title,
      Category: item.category,
      Amount: item.amount,
      Type: item.type,
      PaymentMode: item.paymentMode,
      Date: new Date(item.date).toLocaleDateString(),
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");

    const filePath = "expense_details.xlsx";
    xlsx.writeFile(wb, filePath);

    res.download(filePath);
  } catch (error) {
    console.error("Download Excel Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
