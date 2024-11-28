import mongoose, { Schema } from 'mongoose';

const timeLogSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        task: {
            type: Schema.Types.ObjectId,
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
    },
    {
        timestamps: true,
    }
);

// Indexes for better performance
timeLogSchema.index({ user: 1, date: -1 });
timeLogSchema.index({ project: 1, date: -1 });

// Post-save hook to update task
timeLogSchema.post('save', async function (log) {
    try {
        // Find the associated task
        const Task = mongoose.model('Task');
        const task = await Task.findById(log.task);

        if (!task) {
            throw new Error('Associated task not found');
        }

        // Update actual hours spent on the task
        task.actualHours += log.hoursSpent;

        // If the log indicates completion, mark the task as completed
        if (log.taskStatus === 'completed') {
            task.status = 'completed';
        } else {
            task.status = 'in-progress';
        }

        await task.save();
    } catch (error) {
        console.error('Error updating task based on time log:', error);
    }
});

export default mongoose.model('TimeLog', timeLogSchema);
