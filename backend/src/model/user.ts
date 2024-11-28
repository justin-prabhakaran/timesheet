import * as mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName : {
        type: String,
        required: true,
        unique: true,
    },

    password : {
        type: String,
        required: true,
    },

    department : {
        type: String,
        required: true,
    },

    businessUnit : {
        type : Number
    },

    role : {
        type : String,
        enum : ['admin', 'user'],
        default: 'user',
    },

}, {
    timestamps : true
})

export default mongoose.model('User', userSchema);