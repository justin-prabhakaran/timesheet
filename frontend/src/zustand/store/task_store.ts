import {Task} from "@/model/task.ts";
import {create} from "zustand";
import axios from "axios";

export type TaskStoreType = {
    tasks: Task[];
    addTask: ({token,title,description,projectId,status,expectedHours,actualHours} : {token : string,title : string,description : string,projectId : string,status : string,expectedHours : number,actualHours : number}) => Promise<boolean>;
    getAllTasks : ({token , projectId} : {token : string, projectId : string}) => Promise<Task[]>
}

export const taskStore = create<TaskStoreType>((set)=>(
    {
        tasks : [],
        addTask: async ({token,title,description,projectId,status,expectedHours,actualHours} : {token : string,title : string,description : string,projectId : string,status : string,expectedHours : number,actualHours : number}) => {
            const response = await axios.post<Task>('http://localhost:3003/api/task/add/',{
                title,
                description,
                projectId,
                status,
                expectedHours,
                actualHours
            },{
                headers : {
                    Authorization : `Bearer ${token}`
                }
            });

            if(response.status == 200){
                set((state)=>({
                    tasks : [...state.tasks,response.data]
                }));
                return true;
            }
            return false;

        },
        getAllTasks : async ({token , projectId} : {token : string, projectId : string}) => {
            const response = await axios.get(`http://localhost:3003/api/task/tasks/${projectId}`, {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            });
            console.log(response.data)
            if (response.status == 200) {
                const tasks = response.data as Task[];
                set({tasks : tasks});
                console.log(tasks);
                return tasks;
            }
            return [];
        }
    }
))