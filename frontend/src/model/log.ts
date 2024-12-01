import {TaskStatus} from "@/model/task.ts";


export interface Log{
    user : {
        id : string;
        userName : string;
    },

    project : {
        id : string;
        name : string;
    },

    task : {
        id : string;
        title : string;
    },

    date : Date,
    hoursSpent : number,
    taskStatus : TaskStatus,
}