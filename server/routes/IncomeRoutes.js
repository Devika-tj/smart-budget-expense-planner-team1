const express = require("express");
const router = express.Router();
const Income = require("../models/Income");

// ✅ Create Income
router.post("/", async (req, res) => {
  try {
    const { title, description, amount, category } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const newIncome = new Income({
      title,
      description,
      amount,
      category,
    });

    const savedIncome = await newIncome.save();
    res.status(201).json(savedIncome);
  } catch (error) {
    res.status(500).json({ message: "Error creating income", error });
  }
});

// ✅ Get All Income
router.get("/", async (req, res) => {
  try {
    const incomes = await Income.find().sort({ createdAt: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching income data", error });
  }
});

// ✅ Get Income by ID
router.get("/:id", async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) return res.status(404).json({ message: "Income not found" });
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: "Error fetching income", error });
  }
});

// ✅ Update Income
router.put("/:id", async (req, res) => {
  try {
    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedIncome)
      return res.status(404).json({ message: "Income not found" });

    res.status(200).json(updatedIncome);
  } catch (error) {
    res.status(500).json({ message: "Error updating income", error });
  }
});

// ✅ Delete Income
router.delete("/:id", async (req, res) => {
  try {
    const deletedIncome = await Income.findByIdAndDelete(req.params.id);
    if (!deletedIncome)
      return res.status(404).json({ message: "Income not found" });
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting income", error });
  }
});

module.exports = router;
