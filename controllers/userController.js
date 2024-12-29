const asyncHandler= require("express-async-handler");
const User= require("../models/userModel");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

//@desc register user 
//@ POST /api/users/register
// @public

const registerUser= asyncHandler(async(req,res) =>{
    console.log('the data coming from client side is ' ,req.body);
    const {username,email,password}=req.body;
    if(!username || !password || !email)
    {
        res.status(400);
        throw new Error("All fields are mandatory");
        
    }
    const userAvailable= await User.findOne({email});
    if(userAvailable)
        {
            res.status(400);
            throw new Error("User already registered");
            
        }
    // Hash Password
    const hashedPassword= await bcrypt.hash(password, 10);
    console.log('hashed password is ',hashedPassword);
    const user= await User.create({
        username,
        email,
        password:hashedPassword
    });
    console.log(`user created ${user}`);

    if(user){
           res.status(201).json({_id: user.id, email : user.email});
        }
        else{
            res.status(400);
            throw new Error("User data is not valid");
        }
        
});

//@desc login user 
//@ POST /api/users/login
// @public

const loginUser= asyncHandler(async(req,res) =>{
    const {email,password}= req.body;
    if(!email || !password)
    {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user= await User.findOne({email});

    //password- jo client side se daala login krte time
    //user.password- jo password databse me stored hai i.e hashed password
    if(user && (await bcrypt.compare(password,user.password)))
    {
        const accessToken=jwt.sign({
            user:{
                username:user.username,
                email:user.email,
                id:user.id
            }
        },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
        res.status(200).json({accessToken});
    }
    else{
        res.status(401);
        throw new Error("email or password is not valid");
    }
    
});

//@desc current user 
//@ GET /api/users/current
// @private

const currentUser= asyncHandler(async(req,res) =>{
    res.status(200).json(req.user);
});

module.exports={registerUser, loginUser, currentUser};