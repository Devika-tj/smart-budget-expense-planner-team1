const mongoose=require('mongoose')
require('dotenv').config()
const MONGO_URL=process.env.MONGO_URL

const connectDB= async()=>{
    try{
        await mongoose.connect(MONGO_URL)
        console.log("MongoDB Connected...")
    }catch(er){
        console.error(er)
        process.exit(1)
    }
}
module.exports=connectDB