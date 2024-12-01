import {Router} from "express";
import authMiddleware from "../middleware/auth_middleware";
import Task from "../model/task";
import Project from "../model/project";

const taskRouter = Router();

// @ts-ignore
taskRouter.get('/tasks/:projectId', authMiddleware, async (req, res) => {
    try {
        const { projectId } = req.params;

        const tasks = await Task.find({ projectId }).lean();

        console.log(tasks)
        return res.status(200).json(tasks);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal Server Error !!" });
    }
});

// @ts-ignore
taskRouter.post('/add',authMiddleware, async(req,res)=>{
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

        return res.status(200).json(newTask.toObject());

    }catch (e) {
        console.error(e);
        return res.status(500).json({error : "Internal Server Error !!"})
    }
})

export default taskRouter;