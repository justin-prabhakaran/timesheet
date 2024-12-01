import {Router} from "express";
import authMiddleware from "../middleware/auth_middleware";
import Task from "../model/task";
import Project from "../model/project";

const taskRouter = Router();

// @ts-ignore
taskRouter.get('/tasks/:project',authMiddleware,async (req,res)=>{
    try {
        const {project} = req.params;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const filter: any = { project };

        if (req.query.status) {
            filter.status = req.query.status;
        }

        const totalTasks = await Task.countDocuments(filter);

        const tasks = await Task.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            total: totalTasks,
            page,
            totalPages: Math.ceil(totalTasks / limit),
            tasks: tasks.map(task => ({
                id: task._id,
                title: task.title,
                description: task.description,
                status: task.status,
                expectedHours: task.expectedHours,
                actualHours: task.actualHours,
                projectId: task.project
            }))
        });

    }catch (e) {
        console.error(e);
        return res.status(500).json({error :"Internal Server Error !!"})
    }
})

// @ts-ignore
taskRouter.post('/task',authMiddleware, async(req,res)=>{
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: "Unauthorized to create tasks" });
        }

        const {
            title,
            description,
            projectId,
            status,
            expectedHours,
            actualHours
        } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        const newTask = new Task({
            title,
            description,
            projectId,
            status,
            expectedHours,
            actualHours
        });

        await newTask.save();

        return res.status(201).json({
            task: {
                id: newTask._id,
                title: newTask.title,
                projectId: newTask.project,
                status: newTask.status
            }
        });

    }catch (e) {
        console.error(e);
        return res.status(500).json({error : "Internal Server Error !!"})
    }
})

export default taskRouter;