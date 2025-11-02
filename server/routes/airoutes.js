const express = require("express");
const router = express.Router();
const { suggestions } = require("../controllers/aicontroller");
const { protect } = require("../middleware/authMiddleware");

router.get("/suggestions", protect, suggestions);

module.exports = router;