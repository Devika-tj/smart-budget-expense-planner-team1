const { GoogleGenerativeAI } = require("@google/generative-ai");
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const Income = require("../models/Income");

require("dotenv").config();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = "gemini-2.5-flash";

function buildCategorySummary(expenses) {
  const totals = {};
  let total = 0;
  expenses.forEach((e) => {
    totals[e.category] = (totals[e.category] || 0) + (e.amount || 0);
    total += e.amount || 0;
  });
  return { totals, total };
}

exports.suggestions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const expenses = await Expense.find({
      userId,
      type: "expense",
      date: { $gte: since },
    });

    if (!expenses.length) return res.json({ suggestions: [] });

    const { totals, total } = buildCategorySummary(expenses);
    const catList = Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([c, a]) => `${c}: ₹${a}`);

    const summary = `Total last 30 days: ₹${total}. Category totals: ${catList.join(", ")}`;

    const prompt = `
You are a concise financial assistant. Analyze the user's recent spending:
${summary}

Produce up to 3 short, actionable suggestions (1 sentence each, under 20 words) that tell the user what to change.
Each suggestion should mention the category and an action, e.g.:
"You spent 30% more on dining — consider reducing frequency."
Return suggestions as newline-separated sentences only. No intro or footer.
    `;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response.text().trim();
    const suggestions = text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);

    res.json({ suggestions });
  } catch (err) {
    console.error("Gemini Suggestion Error:", err);
    res.status(500).json({ message: "AI suggestion failed", suggestions: [] });
  }
};


exports.monthlySummaryParagraph = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { month, year } = req.query;
    if (!month || !year)
      return res.status(400).json({ message: "month and year required" });

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);


    const incomes = await Income.find({
      userId,
      date: { $gte: start, $lte: end },
    });

    const out = await Expense.find({
      userId,
      date: { $gte: start, $lte: end },
    });

    const { totals: expenseTotals, total: totalExpense } = buildCategorySummary(out);
    const { total: totalIncome } = buildCategorySummary(incomes);




    const topCats = Object.entries(expenseTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([c, a]) => `${c} (₹${a})`)
      .join(", ");

    const budget = await Budget.findOne({ userId, month, year });
    let budgetText = "";
    if (budget && budget.limit) {
      const progress = ((totalExpense / budget.limit) * 100).toFixed(2);
      budgetText = ` You used ${progress}% of your budget (₹${budget.limit}).`;
    }

    const prompt = `
You are a helpful financial assistant. Write one concise paragraph (max 50 words) summarizing the user's month (${month}/${year}):
- include total income and expenses,
- highlight top 2 expense categories,
- mention if they exceeded budget if budget provided (budget info: ${budget ? JSON.stringify(budget) : "none"}),
- give one short actionable tip.

Use normal sentences, no bullet points.
Income: ₹${totalIncome}. Expenses: ₹${totalExpense}. Top categories: ${topCats}.${budgetText}
    `;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response.text().trim();
    res.json({ summary: text });
  } catch (err) {
    console.error("AI Monthly Summary Error:", err);
    res.status(500).json({ message: "AI monthly summary failed" });
  }
}



