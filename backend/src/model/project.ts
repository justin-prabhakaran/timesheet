import * as mongoose from "mongoose";
import {Schema} from "mongoose";
const projectSchema = new mongoose.Schema({
    name : {
        type: String,
    },

    clientName : {
        type: String,
    },

    address : {
        type: String,
    },

    department : {
        type : String
    },

    businessUnit : {
        type : [Number],
        required : true
    },

    type : {
        type : String
    },

    users : {
        type : [Schema.Types.ObjectId],
        ref : "User"
    },

},{
    timestamps : true
})

projectSchema.pre('save',async function (next) {
    if(this.isNew || this.isModified("businessUnit")) {
        try {
            const users = await mongoose.model('User').find({businessUnit : { $in: this.businessUnit } });
            this.users = users.map((user)=> user._id);
        }catch (e){
            // @ts-ignore
            return next(e);
        }
    }
    next();
})



export default mongoose.model('Project', projectSchema);