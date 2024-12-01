export enum TaskStatus {
    COMPLETED = 'completed',
    PENDING = 'pending',
}

export interface Task {
        id : string,
        title: string,
    description: string,
    projectId: string,
    status: string,
    expectedHours : number,
    actualHours : number,

}