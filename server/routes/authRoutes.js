const express=require('express')
const router=express.Router()
const userModel=require('../models/User')

router.get('/',async (req,res)=>{
    try{
        const users=await userModel.find();
        res.status(200).send(users)
    }catch(er){
        console.error(er)
        res.status(400).send("Can't get all users")
    }
})

router.post('/signup',async (req,res)=>{
    try{
        const { role, fullName, email, password} = req.body;
         if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
           return res.status(400).json({ message: 'Email already registered' });
        }
        const roles = ['user', 'admin'];
        const userRole = roles.includes(role) ? role : 'user';
        const newUser= new userModel(req.body)
        await newUser.save()
        res.status(200).send({message:"Successfully added new user!"})

    }catch(er){
        console.error(er)
        res.status(400).send("Can't add new user")
    }
})

router.post('/login',async(req,res)=>{
    try{
        const user= await userModel.findOne({email:req.body.email})
        if(!user){
            res.status(404).send("User not found")
        }
        if(user.password===req.body.password){
            res.status(200).send({message:'Login Successfully!',user})
        }else{
            res.status(401).send({message:'Invalid Credentials'})
        }
    }catch(er){
        console.error(er)
        res.status(400).send("Server Error")
    }
})

module.exports=router