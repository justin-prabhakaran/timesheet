import {Schema} from "mongoose";
import * as mongoose from "mongoose";

const timeLogSchema = new mongoose.Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },

    project : {
        type : Schema.Types.ObjectId,
        ref : 'Project',
        required : true,
    },

    task : {
        type : Schema.Types.ObjectId,
        ref : 'Task',
    }

},{
    timestamps: true
})

export default mongoose.model('TimeLog', timeLogSchema);