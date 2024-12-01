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
const project_1 = __importDefault(require("../model/project"));
const projectRouter = (0, express_1.Router)();
// @ts-ignore
projectRouter.get('/projects', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = {};
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "admin") {
            if (req.query.department) {
                filter.department = req.query.department;
            }
            if (req.query.businessUnit) {
                filter.businessUnit = { $in: [req.query.businessUnit] };
            }
            if (req.query.type) {
                filter.type = req.query.type;
            }
            const totalProjects = yield project_1.default.countDocuments(filter);
            const projects = yield project_1.default.find(filter)
                .populate({
                path: 'users',
                select: "id userName department businessUnit role"
            })
                .skip(skip)
                .limit(limit)
                .lean();
            return res.status(200).json({
                total: totalProjects,
                page,
                totalPages: Math.ceil(totalProjects / limit),
                projects: projects.map(project => ({
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
        else {
            const userProjects = yield project_1.default.find(Object.assign({ users: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id }, filter))
                .populate({
                path: 'users',
                select: 'userName department businessUnit role'
            })
                .skip(skip)
                .limit(limit)
                .lean();
            const totalUserProjects = yield project_1.default.countDocuments(Object.assign({ users: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id }, filter));
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
    }
    catch (e) {
        console.error('Error retrieving projects:', e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
// @ts-ignore
projectRouter.post('/add', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin')
            return res.status(403).json({ error: "Unauthorized !!" });
        const { name, clientName, address, department, businessUnit, type } = req.body;
        const project = new project_1.default({
            name,
            clientName,
            address,
            department,
            businessUnit,
            type
        });
        yield project.save();
        return res.status(200).json({ project: {
                id: project._id,
                name: project.name
            } });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal Server Error !!" });
    }
}));
// @ts-ignore
projectRouter.put('/update/:id', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            return res.status(403).json({ error: "Unauthorized !!" });
        }
        const { id } = req.params;
        const { name, clientName, address, department, businessUnit, type } = req.body;
        const project = yield project_1.default.findById(id);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        project.name = name || project.name;
        project.clientName = clientName || project.clientName;
        project.address = address || project.address;
        project.department = department || project.department;
        project.businessUnit = businessUnit || project.businessUnit;
        project.type = type || project.type;
        yield project.save();
        return res.status(200).json(project.toObject());
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal Server Error !!" });
    }
}));
