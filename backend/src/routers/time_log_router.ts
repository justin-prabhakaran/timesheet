import {Router} from "express";
import authMiddleware from "../middleware/auth_middleware";
import Task from "../model/task";
import TimeLog from "../model/time_log";
import Project from "../model/project";

const timeLogRouter = Router();

// @ts-ignore
timeLogRouter.post("/add", authMiddleware, async (req, res) => {
    try {
        const { project, task, date, hoursSpent, taskStatus } = req.body;

        // Validate project and task references
        const projectExists = await Project.findById(project);
        const taskExists = await Task.findById(task);

        if (!projectExists) {
            return res.status(400).json({ error: "Invalid project ID" });
        }

        if (!taskExists) {
            return res.status(400).json({ error: "Invalid task ID" });
        }

        const newLog = await TimeLog.create({
            user: req.user?.id,
            project,
            task,
            date: date || new Date(),
            hoursSpent,
            taskStatus: taskStatus || "progress",
        });

        return res.status(200).json(newLog);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


// @ts-ignore
timeLogRouter.get('/logs/:user',authMiddleware, async (req, res) => {
    try {
        const {user} = req.params;

        if(req.user?.id !== user && req.user?.role !== 'admin'){
            return res.status(403).json({ error: "Unauthorized access!" });
        }

        const logs = await TimeLog.find({user})
            .populate({path : 'user', select : 'userName id'})
            .populate({path : 'project', select : 'name id'})
            .populate({path : 'task', select : 'title id'})
            .sort({date : -1}).lean();

        console.log(logs);

         return res.status(200).json(logs);
    }catch (e) {
        console.error(e);
         res.status(500).json({error : "Internal Server Error !!"});
    }

})

// @ts-ignore
timeLogRouter.get('/logs', authMiddleware, async (req, res) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ error: "Unauthorized!" });
        }

        const logs = await TimeLog.find()
            .populate({ path: 'user', select: 'userName id' })
            .populate({ path: 'project', select: 'name id' })
            .populate({ path: 'task', select: 'title id' })
            .sort({ date: -1 })
            .lean();


        console.log(logs);
        // Filter out logs with missing project or task data
        const validLogs = logs.filter(log => log.project && log.task);

        return res.status(200).json(validLogs);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/*
import { Router } from 'express';
import TimeLog from './time_log';
import authMiddleware from '../middleware/auth_middleware';


const timeLogRouter = Router();

// Create a new time log entry
// @ts-ignore
timeLogRouter.post('/log', authMiddleware, async (req, res) => {
    try {
        const { project, task, date, hoursSpent, taskStatus } = req.body;

        const newTimeLog = new TimeLog({
            user: req.user?.id,
            project,
            task,
            date: date || Date.now(),
            hoursSpent,
            taskStatus
        });

        await newTimeLog.save();
        res.status(201).json(newTimeLog);
    } catch (error) {
        // @ts-ignore
        res.status(400).json({ message: error.message });
    }
});

// User's time log views
// @ts-ignore
timeLogRouter.get('/user/logs', authMiddleware, async (req, res) => {
    const { period, date } = req.query;
    let startDate, endDate;

    switch(period) {
        case 'day':
            // @ts-ignore
            startDate = new Date(date);
            // @ts-ignore
            endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            break;
        case 'week':
            // @ts-ignore
            startDate = new Date(date);
            startDate.setDate(startDate.getDate() - startDate.getDay());
            endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 7);
            break;
        case 'month':
            // @ts-ignore
            startDate = new Date(date);
            startDate.setDate(1);
            endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);
            break;
        case 'year':
            // @ts-ignore
            startDate = new Date(date);
            startDate.setMonth(0, 1);
            endDate = new Date(startDate);
            endDate.setFullYear(endDate.getFullYear() + 1);
            break;
        default:
            return res.status(400).json({ message: 'Invalid period' });
    }

    try {
        const logs = await TimeLog.find({
            user: req.user?.id,
            date: { $gte: startDate, $lt: endDate }
        }).populate('project task');

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

// Admin view of all time logs
// @ts-ignore
timeLogRouter.get('/admin/logs', authMiddleware, adminMiddleware, async (req, res) => {
    const { period, date } = req.query;
    let startDate, endDate;

    // Similar date calculation logic as user route
    switch(period) {
        // ... (same date calculation as user route)
    }

    try {
        const logs = await TimeLog.find({
            date: { $gte: startDate, $lt: endDate }
        }).populate('user project task');

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default timeLogRouter;
 */

export default timeLogRouter;