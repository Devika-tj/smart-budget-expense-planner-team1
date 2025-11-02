const express = require("express");
const router = express.Router();
const { setBudget, getBudget } = require("../controllers/budgetController");
const { protect } = require("../middleware/authMiddleware");

router.post("/set", protect, setBudget);
router.get("/get", protect, getBudget);

module.exports = router;