import {Router} from "express";
import User from "../model/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userRouter = Router();

// @ts-ignore
userRouter.post('/register', async (req,res)=>{
   try{
       const {userName, password, department, businessUnit, role} = req.body;


       const passhash = await bcrypt.hash(password, 10);
       const user = new User({
           userName,
           password : passhash,
           department,
           businessUnit,
           role
       });

       await user.save();

       const token = jwt.sign({id : user.id, role : user.role},process.env.SECRET_KEY!,{expiresIn : "1h"});

       const {password : _, ...others}= user.toObject()

       return res.status(200).json({...others,token:token})
   }catch (e) {
        console.error(e);
        res.status(500).json({error : "Internal Server Error !!"});
   }
});


// @ts-ignore
userRouter.post('/login', async (req,res)=>{

    try{
        const {userName, password} = req.body;
        const user = await User.findOne({userName});

        if(!user){
            return res.status(401).json({error : "User Not Found"});
        }
        
        const match = await bcrypt.compare(password,user.password)
        if(!match){
            return res.status(401).json({error : "User Not Found"});
        }

        const token = jwt.sign({id : user.id, role : user.role},process.env.SECRET_KEY!,{expiresIn : "1h"});

        return res.status(200).json({
            userName,
            token
        });
    }catch (e){
        console.error(e);
        return res.status(500).json({error : "Internal Server Error !!"});
    }
});
