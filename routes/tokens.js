//https://docs.google.com/document/d/1ozOTTw4E03K6BaW0hjNj5bpdADq49xzGMP6yVLM6PM4/mobilebasic?urp=gmail_link&gxids=7628

const JWT = require("jsonwebtoken");
const privateKey = "randomWords";

const createJWT = ({id, role})=>{
   return JWT.sign( {id, role},privateKey,{expiresIn:"1h"} )
}

const authenticate = async (req,res,next)=>{

   try {
       const bearer = await req.headers["authorization"];
       if(!bearer) return res.json({message:"Access Denied"});

       JWT.verify(bearer,privateKey,(err,decode)=>{
           if(res){
               req.body.auth = decode;
               next();
           }
           else res.json({message:"Authentication failed"})
       })
   } catch (error) {
       return res.json({
           message:"Something went wrong with authentication"
       })
   }
}

const permit = (...roles)=>{

   return (req,res,next)=>{
       const { role } = req.body.auth;
       if(roles.includes(role)){
           next();
       }else{
           res.json({message:"no access to this route"})
       }
   }
}

module.exports = { createJWT, authenticate, permit }