"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware/auth_middleware"));
const task_1 = __importDefault(require("../model/task"));
const project_1 = __importDefault(require("../model/project"));
const taskRouter = (0, express_1.Router)();
// @ts-ignore
taskRouter.get('/tasks/:project', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { project } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = { project };
        if (req.query.status) {
            filter.status = req.query.status;
        }
        const totalTasks = yield task_1.default.countDocuments(filter);
        const tasks = yield task_1.default.find(filter)
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
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal Server Error !!" });
    }
}));
// @ts-ignore
taskRouter.post('/task', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            return res.status(403).json({ error: "Unauthorized to create tasks" });
        }
        const { title, description, projectId, status, expectedHours, actualHours } = req.body;
        const project = yield project_1.default.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        const newTask = new task_1.default({
            title,
            description,
            projectId,
            status,
            expectedHours,
            actualHours
        });
        yield newTask.save();
        return res.status(201).json({
            task: {
                id: newTask._id,
                title: newTask.title,
                projectId: newTask.project,
                status: newTask.status
            }
        });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal Server Error !!" });
    }
}));
