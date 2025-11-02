const express = require("express");
const {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpensePDF,
  downloadExpenseCSV,
  updateExpense,
  getMonthlySummary
} = require("../controllers/expenseController");
const { suggestions: getAISuggestions } = require("../controllers/aicontroller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpense);
router.put("/update/:id", protect, updateExpense);
router.get("/downloadpdf", protect, downloadExpensePDF);
router.get("/downloadcsv", protect, downloadExpenseCSV);
router.get("/aisuggestions", protect, getAISuggestions);
router.get("/summary", protect, getMonthlySummary);
router.delete("/:id", protect, deleteExpense);

module.exports = router;
