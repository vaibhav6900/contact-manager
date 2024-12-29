const asyncHandler= require("express-async-handler");

const jwt=require("jsonwebtoken");

const validateToken= asyncHandler(async (req,res,next)=> {
  let token;
  let authHeader=req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    //split on space basis then on 0th index we have bearer and on 1th index we have actual token
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,decoded)=>{
     if (err) {
        res.status(401);
        throw new Error("user is not authorized");
        
     }
     console.log(decoded);
     req.user= decoded.user;
     next();
     
    })

    if (!token) {
      res.status(401);
      throw new Error("user is not authorized or token is missing");
    }
  }
     
});

module.exports = validateToken;