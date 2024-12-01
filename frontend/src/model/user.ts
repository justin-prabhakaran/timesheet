export enum Department {

    CSE="CSE",
    MECH="MECH",
    CIVIL="CIVIL",
}

export enum Role{
    admin= "admin",
    user ="user"
}

export interface User {
    createdAt : Date,
    updatedAt : Date,
    userName: string;
    department : Department,
    businessUnit: number,
    role : Role,
    token : string
    _id : string
}
