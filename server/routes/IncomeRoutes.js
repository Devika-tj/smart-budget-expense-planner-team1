const express = require("express");
const router = express.Router();
const Income = require("../models/Income");
const { protect } = require("../middleware/authMiddleware");


router.post("/", protect, async (req, res) => {
  try {
    const { title, description, amount, category } = req.body;
    const userId = req.user.id; // from token

    if (!title || !amount || !category) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const newIncome = new Income({
      userId,
      title,
      description,
      amount,
      category,
    });

    const savedIncome = await newIncome.save();
    res.status(201).json(savedIncome);
  } catch (error) {
    res.status(500).json({ message: "Error creating income", error: error.message });
  }
});


router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const incomes = await Income.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching incomes", error: error.message });
  }
});


router.get("/:id", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const income = await Income.findOne({ _id: req.params.id, userId });
    if (!income) return res.status(404).json({ message: "Income not found" });
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: "Error fetching income", error: error.message });
  }
});


router.put("/:id", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedIncome = await Income.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true }
    );

    if (!updatedIncome)
      return res.status(404).json({ message: "Income not found or not authorized" });

    res.status(200).json(updatedIncome);
  } catch (error) {
    res.status(500).json({ message: "Error updating income", error: error.message });
  }
});


router.delete("/:id", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const deletedIncome = await Income.findOneAndDelete({ _id: req.params.id, userId });
    if (!deletedIncome)
      return res.status(404).json({ message: "Income not found or not authorized" });

    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting income", error: error.message });
  }
});

module.exports = router;
