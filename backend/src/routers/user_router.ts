import {Router} from "express";
import User from "../model/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/auth_middleware";
const userRouter = Router();

// @ts-ignore
userRouter.post('/register',authMiddleware,async (req,res)=>{
   try{
       if(req.user?.role !== "admin"){
           return res.status(403).json({error:"Unauthorized !"});
       }
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

       return res.status(200).json({...others,token})
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

        const {password : _, ...others} = user.toObject();

        return res.status(200).json({
            ...others,
            token
        });
    }catch (e){
        console.error(e);
        return res.status(500).json({error : "Internal Server Error !!"});
    }
});

// @ts-ignore
userRouter.get('/users',authMiddleware, async (req,res)=>{
    try {
        if(req.user?.role !== "admin"){
            return res.status(401).json({error : "Unauthorized !"});
        }

        const users = await User.find().select("-password").lean();

        const filtered = users.map(user =>({
            id : user._id,
            userName: user.userName,
            department: user.department,
            businessUnit: user.businessUnit,
            role: user.role,
            createdAt: user.createdAt
        }));

        return res.status(200).json({
            message: "Users retrieved successfully",
            total: filtered.length,
            users: filtered
        });

    }catch (e){
        console.error(e);
        return res.status(500).json({error : "Internal Server Error !!"});
    }
});

// @ts-ignore
userRouter.put('/update/:id',authMiddleware, async(req,res) => {
    try {
        if(req.user?.role !== "admin")
            return res.status(403).json({error : "Unauthorized !!"});

        const {id} = req.params;

        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const {
            userName,
            department,
            businessUnit,
            role,
        } = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            {
                ...(userName && { userName }),
                ...(department && { department }),
                ...(businessUnit && { businessUnit }),
                ...(role && { role }),
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { password, ...userResponse } = user.toObject();

        return res.status(200).json({
            message: "User updated successfully",
            user: userResponse
        });

    }catch (e) {
        console.error(e);
        return res.status(500).json({error: "Internal Server ERror !!"});
    }
});


// @ts-ignore
userRouter.delete('/delete/:id',authMiddleware, async (req,res)=>{
    if(req.user?.role !== "admin")
        return res.status(403).json({error : "Unauthorized !!"});

    const {id} = req.params;
    if (id === req.user?.id) {
        return res.status(403).json({ error: "Cannot delete own account" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
    }
});



