import { Router } from "express";
import authMiddleware from "../middleware/auth_middleware";
import Task from "../model/task";
import Project from "../model/project";

const taskRouter = Router();

// @ts-ignore
taskRouter.get('/tasks/:projectId', authMiddleware, async (req, res) => {
    try {
        const { projectId } = req.params;

        // Find tasks for the given projectId
        const tasks = await Task.find({ projectId }).lean();

        // Return tasks with `id` field derived from `_id`
        return res.status(200).json(
            tasks.map(task => ({
                id: task._id,
                title: task.title,
                description: task.description,
                status: task.status,
                expectedHours: task.expectedHours,
                actualHours: task.actualHours,
                projectId: task.projectId,
            }))
        );
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal Server Error !!" });
    }
});

// @ts-ignore
taskRouter.post('/add', authMiddleware, async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: "Unauthorized to create tasks" });
        }

        const { title, description, projectId, status, expectedHours, actualHours } = req.body;

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
            actualHours,
        });

        await newTask.save();

        return res.status(200).json({ id: newTask._id, ...newTask.toObject() });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal Server Error !!" });
    }
});

export default taskRouter;
