import {Schema} from "mongoose";
import * as mongoose from "mongoose";

const taksSchema = new mongoose.Schema({
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
    }

})

export default mongoose.model("Task", taksSchema);