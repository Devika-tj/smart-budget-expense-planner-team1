const express=require("express")
const app=express()
require("dotenv").config()
const PORT= process.env.PORT || 8000
const cors=require("cors")


const userModel=require('./models/User')
const userRoute=require('./routes/authRoutes')
const connectDB=require('./config/db')

connectDB();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use('/user',userRoute)


app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))

