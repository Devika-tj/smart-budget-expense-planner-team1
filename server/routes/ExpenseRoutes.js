const express = require("express");
const router = express.Router();
const {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpensePDF,
  downloadExpenseCSV,
  updateExpense,
  getMonthlySummary,
} = require("../controllers/expenseController");

const { suggestions, monthlySummaryParagraph } = require("../controllers/aicontroller");
const { protect } = require("../middleware/authMiddleware");


router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpense);
router.put("/update/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);


router.get("/downloadcsv", protect, downloadExpenseCSV);
router.get("/downloadpdf", protect, downloadExpensePDF);


router.get("/aisuggestions", protect, suggestions);
router.get("/ai-monthly-summary", protect, monthlySummaryParagraph);

router.get("/summary", protect, getMonthlySummary);

module.exports = router