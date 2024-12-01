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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../model/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_middleware_1 = __importDefault(require("../middleware/auth_middleware"));
const userRouter = (0, express_1.Router)();
// @ts-ignore
userRouter.post('/register', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
            return res.status(403).json({ error: "Unauthorized !" });
        }
        const { userName, password, department, businessUnit, role } = req.body;
        const passhash = yield bcrypt_1.default.hash(password, 10);
        const user = new user_1.default({
            userName,
            password: passhash,
            department,
            businessUnit,
            role
        });
        yield user.save();
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" });
        const _b = user.toObject(), { password: _ } = _b, others = __rest(_b, ["password"]);
        return res.status(200).json(Object.assign(Object.assign({}, others), { token }));
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error !!" });
    }
}));
// @ts-ignore
userRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password } = req.body;
        const user = yield user_1.default.findOne({ userName });
        if (!user) {
            return res.status(401).json({ error: "User Not Found" });
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "User Not Found" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" });
        const _a = user.toObject(), { password: _ } = _a, others = __rest(_a, ["password"]);
        return res.status(200).json(Object.assign(Object.assign({}, others), { token }));
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal Server Error !!" });
    }
}));
// @ts-ignore
userRouter.get('/users', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
            return res.status(401).json({ error: "Unauthorized !" });
        }
        const users = yield user_1.default.find().select("-password").lean();
        const filtered = users.map(user => ({
            id: user._id,
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
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal Server Error !!" });
    }
}));
// @ts-ignore
userRouter.put('/update/:id', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin")
            return res.status(403).json({ error: "Unauthorized !!" });
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const { userName, department, businessUnit, role, } = req.body;
        const user = yield user_1.default.findByIdAndUpdate(id, Object.assign(Object.assign(Object.assign(Object.assign({}, (userName && { userName })), (department && { department })), (businessUnit && { businessUnit })), (role && { role })), {
            new: true,
            runValidators: true
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const _b = user.toObject(), { password } = _b, userResponse = __rest(_b, ["password"]);
        return res.status(200).json({
            message: "User updated successfully",
            user: userResponse
        });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal Server ERror !!" });
    }
}));
// @ts-ignore
userRouter.delete('/delete/:id', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin")
        return res.status(403).json({ error: "Unauthorized !!" });
    const { id } = req.params;
    if (id === ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
        return res.status(403).json({ error: "Cannot delete own account" });
    }
    const deletedUser = yield user_1.default.findByIdAndDelete(id);
    if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
    }
}));
