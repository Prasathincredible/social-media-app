const express=require('express');
const Profile=require('../models/mongodb');
const PostModel=require('../models/postModel');
const router=express.Router();
const jwt=require("jsonwebtoken");
require('dotenv').config();
router.use(express.json())


router.get('/', async(req,res)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const loggedInUserName=decoded.userName;
        const users=await Profile.find({userName : {$ne : loggedInUserName}},'userName bio avatar');
        //console.log(users)
        res.json(users);
    }catch(error)
    {
        res.status(500).json({message : 'Error fetching in users'});
    }
})


router.get('/:userName',async(req,res)=>{
    try{
        const user=await Profile.findOne({userName:req.params.userName});

        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        //console.log(user);

        res.json(user);
    }catch(error)
    {
        res.status(500).json({message:"Server error"});
    }
})


router.get('/:userName/posts',async(req,res)=>{
    const {userName}=req.params;

    const user=await Profile.findOne({userName});
    //console.log(user)

    if(user){
        const posts=await PostModel.find({userName: user.userName});
       // console.log(posts);
        res.json(posts);
    }else{
        res.status(404).json({error: 'User not found'});
    }
});


module.exports=router;