import {Router} from "express";
import authMiddleware from "../middleware/auth_middleware";
import Project from "../model/project";
import mongoose from "mongoose";

const projectRouter = Router();

// @ts-ignore
projectRouter.get('/projects',authMiddleware,async (req,res)=>{

    try{
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const filter: any = {};

        if(req.user?.role === "admin"){
            if(req.query.department){
                filter.department = req.query.department;
            }
            if (req.query.businessUnit) {
                filter.businessUnit = { $in: [req.query.businessUnit] };
            }
            if (req.query.type) {
                filter.type = req.query.type;
            }

            const totalProjects = await Project.countDocuments(filter);

            const projects = await Project.find(filter)
                .populate({
                    path : 'users',
                    select : "id userName department businessUnit role"
                })
                .skip(skip)
                .limit(limit)
                .lean();

            return res.status(200).json({
                total : totalProjects,
                page,
                totalPages : Math.ceil(totalProjects / limit),
                projects : projects.map(project => ({
                    id : project._id,
                    name : project.name,
                    clientName : project.clientName,
                    department: project.department,
                    businessUnit: project.businessUnit,
                    type: project.type,
                    users: project.users,
                     createdAt: project.createdAt
                }))
            })

        }else {
            const userProjects = await Project.find({
                users: req.user?.id,
                ...filter
            })
                .populate({
                    path : 'users',
                    select : 'userName department businessUnit role'
                })
                .skip(skip)
                .limit(limit)
                .lean();

            const totalUserProjects = await Project.countDocuments({
                users : req.user?.id,
                ...filter
            })

            return res.status(200).json({
                total: totalUserProjects,
                page,
                totalPages: Math.ceil(totalUserProjects / limit),
                projects: userProjects.map(project => ({
                    id: project._id,
                    name: project.name,
                    clientName: project.clientName,
                    department: project.department,
                    businessUnit: project.businessUnit,
                    type: project.type,
                    users: project.users,
                    createdAt: project.createdAt
                }))
            });
        }
    }catch (e){
        console.error('Error retrieving projects:', e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

// @ts-ignore
projectRouter.post('/add',authMiddleware,async (req,res)=>{
    try{
        if(req.user?.role !== 'admin')
             return res.status(403).json({error : "Unauthorized !!"});

        const {name, clientName, address, department, businessUnit, type} = req.body;

        const project = new Project({
            name,
            clientName,
            address,
            department,
            businessUnit,
            type
        });

        await project.save();

        return res.status(200).json(project.toObject());
    }catch(e){
        console.error(e)
        return res.status(500).json({error : "Internal Server Error !!"})
    }

});

// @ts-ignore
projectRouter.put('/update/:id',authMiddleware, async (req,res)=>{
   try{
        if(req.user?.role !== 'admin'){
            return res.status(403).json({error : "Unauthorized !!"});
        }
       const { id } = req.params;
       const { name, clientName, address, department, businessUnit, type } = req.body;
       console.log(id)
       const project = await Project.findById(id);
       console.log(project);
       if (!project) {
           return res.status(404).json({ error: "Project not found" });
       }

       project.name = name || project.name;
       project.clientName = clientName || project.clientName;
       project.address = address || project.address;
       project.department = department || project.department;
       project.businessUnit = businessUnit || project.businessUnit;
       project.type = type || project.type;

       await project.save();

       return res.status(200).json(project.toObject())

   }catch(e){
       console.error(e);
       return res.status(500).json({error  : "Internal Server Error !!"});
   }
});

// @ts-ignore
projectRouter.delete('/delete/:id', authMiddleware, async (req, res) => {
    try {

        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: "Unauthorized !!" });
        }

        const { id } = req.params;

        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(404).json({ error: "Project not found !!" });
        }


        return res.status(200).json(deletedProject);
    } catch (e) {
        console.error("Error deleting project:", e);
        return res.status(500).json({ error: "Internal server error !!" });
    }
});


export default projectRouter;
