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
const time_log_1 = __importDefault(require("../model/time_log"));
const timeLogRouter = (0, express_1.Router)();
// @ts-ignore
timeLogRouter.post("/add", auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { project, task, date, hoursSpent, taskStatus } = req.body;
        const newLog = yield time_log_1.default.create({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            project,
            task,
            date: date || new Date(),
            hoursSpent,
            taskStatus: taskStatus || 'In Progress',
        });
        return res.status(200).json(newLog);
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal Server Error !!" });
    }
}));
// @ts-ignore
timeLogRouter.get('/logs/:user', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { user } = req.params;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== user && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
            return res.status(403).json({ error: "Unauthorized access!" });
        }
        const logs = yield time_log_1.default.find({ user })
            .populate({ path: 'project', select: 'name createdAt' })
            .populate({ path: 'task', select: 'name createdAt' })
            .sort({ date: -1 });
        return res.status(200).json({ logs });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error !!" });
    }
}));
// @ts-ignore
timeLogRouter.get('/logs', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
            return res.status(403).json({ error: "Unauthorized !" });
        }
        const logs = yield time_log_1.default.find()
            .populate({ path: 'user', select: 'userName businessUnit id' })
            .populate({ path: 'project', select: 'name id' })
            .populate({ path: 'task', select: 'name status id' })
            .sort({ date: -1 });
        return res.status(200).json({ logs });
    }
    catch (e) {
    }
}));
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
