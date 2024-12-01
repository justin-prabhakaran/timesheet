"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['completed', 'pending', 'in-progress'],
        default: 'pending',
    },
    expectedHours: {
        type: Number,
        min: 0,
        required: true,
    },
    actualHours: {
        type: Number,
        min: 0,
        default: 0,
    },
    project: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Task', taskSchema);
