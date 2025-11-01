const express=require("express")
const{addExpense,getAllExpense,deleteExpense,downloadExpenseExcel,updateExpense,getMonthlySummary}=require("../controllers/expenseController")
const {protect}=require("../middleware/authMiddleware")

const router=express.Router()

router.post("/add",protect, addExpense)
router.get("/get",protect,getAllExpense)
router.put("/update/:id", protect, updateExpense);
router.get("/downloadexcel",protect,downloadExpenseExcel)
router.get("/summary", protect, getMonthlySummary)
router.delete("/:id",protect,deleteExpense)

module.exports=router