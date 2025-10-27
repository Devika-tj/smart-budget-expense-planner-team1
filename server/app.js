const express=require("express")
const cors=require("cors")
const path=require("path")
require("dotenv").config()


const connectDB = require("./config/db.js");

connectDB();


const app=express()

app.use(
    cors({
        origin:process.env.CLIENT_URL || "*",
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-type","Authorization"]
    })
)

app.use(express.json())

const PORT= process.env.PORT || 8000
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))

