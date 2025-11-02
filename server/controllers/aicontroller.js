const Expense = require("../models/Expense");


exports.suggestions = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

    const expenses = await Expense.find({
      userId,
      type: "expense",
      date: { $gte: threeMonthsAgo, $lte: now },
    });

    if (!expenses.length) return res.json({ suggestions: ["No expenses found to analyze."] });

 
    const byCat = {};
    let total = 0;
    expenses.forEach((e) => {
      total += e.amount || 0;
      byCat[e.category] = (byCat[e.category] || 0) + (e.amount || 0);
    });

    const suggestions = [];
    const sortedCats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);

    sortedCats.slice(0, 3).forEach(([cat, amt]) => {
      const pct = ((amt / total) * 100).toFixed(1);
      if (pct > 20) {
        suggestions.push(`You spent ${pct}% on ${cat} — consider cutting down or finding cheaper alternatives.`);
      } else {
        suggestions.push(`Your ${cat} expenses are ${pct}% of total — looks okay.`);
      }
    });

   
    if ((byCat["Dining"] || byCat["Food"] || 0) / total > 0.25) {
      suggestions.push("Dining/food is a big chunk of your spending. Try meal prepping or reducing takeout to save.");
    }


    suggestions.push("Consider setting a monthly auto-transfer to savings when you receive income.");

    res.json({ suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
