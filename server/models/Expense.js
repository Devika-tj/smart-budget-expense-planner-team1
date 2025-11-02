const mongoose=require("mongoose");

const ExpenseSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    title: { type: String, required: true },
    category:{type:String, required:true},
    amount:{type:Number, required:true},
    paymentMode: { type: String, enum: ['Cash','Card','UPI'], default: 'Cash' },
    date:{type: Date, default:Date.now},
    type: { type: String, enum: ['expense','income'], default: 'expense' }
}, {timestamps:true});

module.exports=mongoose.model("expenses",ExpenseSchema)

