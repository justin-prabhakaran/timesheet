import {Schema} from "mongoose";
import * as mongoose from "mongoose";
import Project from "./project";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    status: {
        type: String,
        enum: ['completed', 'pending']
    },

    expectedHours : {
        type: Number,
    },

    actualHours : {
        type : Number,
    },

    projectId : {
        required : true,
        type : Schema.Types.ObjectId,
        ref : 'Project',

    }

})


taskSchema.post('save', async function(task) {
    try {

        await Project.findByIdAndUpdate(
            task.projectId,
            {
                $addToSet: { tasks: task._id }
            },
            { new: true }
        );
    } catch (error) {
        console.error('Error updating project with new task:', error);
    }
});


taskSchema.post('findOneAndUpdate', async function(task) {
    if (task && task.projectId) {
        try {
            await Project.findByIdAndUpdate(
                task.projectId,
                {
                    $addToSet: { tasks: task._id }
                },
                { new: true }
            );
        } catch (error) {
            console.error('Error updating project with updated task:', error);
        }
    }
});

export default mongoose.model("Task", taskSchema);