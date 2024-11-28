import { Schema, model } from 'mongoose';

const taskSchema = new Schema(
    {
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
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default model('Task', taskSchema);
