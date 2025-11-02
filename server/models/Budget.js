const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  categories: [
    {
      name: { type: String, required: true },
      limit: { type: Number, default: 0 }
    }
  ],
  limit: { type: Number, default: 0 }, 
}, { timestamps: true });

BudgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Budget", BudgetSchema);