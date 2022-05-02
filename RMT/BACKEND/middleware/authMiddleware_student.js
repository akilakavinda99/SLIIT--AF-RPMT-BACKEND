const jwt=require("jsonwebtoken")
const asyncHandler=require('express-async-handler')
const Student=require('../models/student')

const protect_student=asyncHandler(async(req,res,next)=>{
    let token

    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')){
        try{
            //get token from header
            token=req.headers.authorization.split(' ')[1]
            
            //verify token
            const decoded=jwt.verify(token,process.env.JWT_SECRET)

            //get the user from the token
            req.user=await Student.findById(decoded.id).select('-password')
            next()

        }catch(error){
            console.log(error)
            res.status(401)
            throw new Error('not authorized')

        }
    } 

    if(!token){
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})
module.exports={protect_student}