"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const timeLogSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    project: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    task: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    hoursSpent: {
        type: Number,
        required: true,
        min: 0,
    },
    taskStatus: {
        type: String,
        enum: ['in-progress', 'completed'],
        default: 'in-progress',
    },
}, {
    timestamps: true,
});
timeLogSchema.index({ user: 1, date: -1 });
timeLogSchema.index({ project: 1, date: -1 });
timeLogSchema.post('save', function (log) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const Task = mongoose_1.default.model('Task');
            const task = yield Task.findById(log.task);
            if (!task) {
                throw new Error('Associated task not found');
            }
            task.actualHours += log.hoursSpent;
            if (log.taskStatus === 'completed') {
                task.status = 'completed';
            }
            else {
                task.status = 'in-progress';
            }
            yield task.save();
        }
        catch (error) {
            console.error('Error updating task based on time log:', error);
        }
    });
});
exports.default = mongoose_1.default.model('TimeLog', timeLogSchema);
