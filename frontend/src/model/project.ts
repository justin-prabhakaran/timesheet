import {Department, User} from "@/model/user.ts";

export interface Project {
    id: string;
    name: string;
    clientName : string;
    address: string;
    department : Department;
    businessUnit : number;
    type : string,
    createdAt : Date,
    users : [User]

}