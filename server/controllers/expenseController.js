const xlsx = require("xlsx");
const Expense = require("../models/Expense");
const aiController = require("../controllers/aicontroller")
const Budget = require("../models/Budget");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");
const PDFDocument = require("pdfkit");



function buildFilter(query, userId) {
  const filter = { userId };
  if (query.category) filter.category = query.category;
  if (query.paymentMode) filter.paymentMode = query.paymentMode;
  if (query.type) filter.type = query.type;

  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) filter.date.$lte = new Date(query.endDate);
  }
  return filter;
}



exports.addExpense = async (req, res) => {
  const userId = req.user.userId;

  try {
    const { title, category, amount, paymentMode, date, type } = req.body;

    
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


exports.getAllExpense = async (req, res) => {
  const userId = req.user.userId;
  try {
    const filter = buildFilter(req.query, userId);
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Fetch Expense Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


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


exports.getMonthlySummary = async (req, res) => {
  const userId = req.user.userId;
  const { month, year } = req.query;
  if (!month || !year) return res.status(400).json({ message: "month and year required" });

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

    
    const catTotals = {};
    expenses
      .filter((e) => e.type === "expense")
      .forEach((e) => (catTotals[e.category] = (catTotals[e.category] || 0) + e.amount));

    const topCategories = Object.entries(catTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat, amt]) => ({ category: cat, amount: amt }));

    const budget = await Budget.findOne({ userId, month, year });
    const budgetLimit = budget ? budget.limit : 0;
    const progress = budgetLimit ? ((totalExpense / budgetLimit) * 100).toFixed(2) : "0.00";
    const overBudget = budgetLimit ? totalExpense > budgetLimit : false;

    res.json({
      totalIncome,
      totalExpense,
      budgetLimit,
      progress: parseFloat(progress),
      overBudget,
      topCategories,
    });
  } catch (error) {
    console.error("Monthly Summary Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


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


exports.downloadExpenseCSV = async (req, res) => {
  const userId = req.user.userId;
  try {
    const filter = buildFilter(req.query, userId);
    const expenses = await Expense.find(filter).sort({ date: -1 });

    const csvPath = `expenses_${userId}_${Date.now()}.csv`;
    const csvWriter = createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: "title", title: "Title" },
        { id: "category", title: "Category" },
        { id: "amount", title: "Amount" },
        { id: "type", title: "Type" },
        { id: "paymentMode", title: "PaymentMode" },
        { id: "date", title: "Date" },
      ],
    });

    const data = expenses.map((e) => ({
      title: e.title,
      category: e.category,
      amount: e.amount,
      type: e.type,
      paymentMode: e.paymentMode,
      date: new Date(e.date).toISOString(),
    }));

    await csvWriter.writeRecords(data);
    res.download(csvPath, (err) => {
      if (!err) fs.unlinkSync(csvPath);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.downloadExpensePDF = async (req, res) => {
  const userId = req.user.userId;

  try {
    const { month, year } = req.query;
    const filter = buildFilter(req.query, userId);
    const expenses = await Expense.find(filter).sort({ date: -1 });

   
    let aiSummary = "No AI summary available.";
    if (month && year) {
      try {
        const fakeReq = { user: { userId }, query: { month, year } };
        const fakeRes = {
          json: (data) => (aiSummary = data.summary || "No summary generated"),
          status: () => ({ json: () => {} }),
        };
        await aiController.monthlySummaryParagraph(fakeReq, fakeRes);
      } catch (e) {
        console.warn("AI Summary generation failed:", e.message);
      }
    }

  
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    res.setHeader("Content-disposition", `attachment; filename=filtered_expenses_${userId}.pdf`);
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);

   
    doc.fontSize(18).text("Expense Report", { align: "center" });
    doc.moveDown();

  
    doc.fontSize(12).fillColor("#000").text("AI Summary:", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor("#333").text(aiSummary, { align: "left" });
    doc.moveDown(1);

   
    if (!expenses.length) {
      doc.fontSize(12).text("No data found for the selected filters.");
    } else {
      expenses.forEach((e, idx) => {
        doc.fontSize(12).text(
          `${idx + 1}. ${e.title} — ${e.category} — ₹${e.amount} — ${e.paymentMode} — ${new Date(
            e.date
          ).toLocaleDateString()}`
        );
        doc.moveDown(0.2);
      });
    }

    doc.end();
  } catch (err) {
    console.error("Filtered PDF generation failed:", err);
    res.status(500).json({ message: "Server error generating filtered PDF" });
  }
};

