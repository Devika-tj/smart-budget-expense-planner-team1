const mongoose=require('mongoose')
const userModel=new mongoose.Schema({
    role: {
        type: String,
        enum: ['user','admin'],
        default: 'user'
    },
    fullName:{
        type: String,
        required: [true,"Full Name is required"],
        minlength:[3,"Name must be atleast 3 characters"]
    },
    email:{
        type: String,
        required: [true,"Email is required"],
        unique: true,
        match: [/.+\@.+\..+/,"Please enter a valid email"]
    },
    password:{
        type: String,
        required: [true,"Password is required"],
        minlength: [6,"Password must be atleast 6 characters"]
    }
})

module.exports=mongoose.model('users',userModel)