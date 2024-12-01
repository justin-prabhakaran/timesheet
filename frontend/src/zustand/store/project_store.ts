import {Project} from "@/model/project.ts";
import {create} from "zustand";
import axios from "axios";


export type ProjectStoreType = {
    projects: Project[];
    getAllProjects: (filter : string, token : string) => Promise<Project[]>;
    addProject: ({token,name,clientName,address,department,businessUnit,type} : {token : string, name : string, clientName : string, address : string, department : string, businessUnit : number, type : string}) => Promise<boolean>;
    removeProject: (token : string, projectId: string) => Promise<boolean>;
    updateProject : ({token,projectId,name,clientName,address,department,businessUnit,type} : {token: string,projectId : string,name : string, clientName : string, address : string, department : string, businessUnit : number, type : string}) => Promise<boolean>;
}



export const projectStore = create<ProjectStoreType>((set) => {
    return ({
        projects: [],
        getAllProjects: async (filter, token) => {
            const response = await axios.get(`http://localhost:3003/api/project/projects/${filter}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (response.status == 200) {
                const projectlist: Project[] = response.data.projects as Project[];

                console.log(projectlist.length);
                set({projects: projectlist});
                return projectlist;
            }else {
                throw new Error("Something went wrong");
            }
        },


        addProject : async ({token,name,clientName,address,department,businessUnit,type} : {token :string,name : string, clientName : string, address : string, department : string, businessUnit : number, type : string}) => {
            const response = await  axios.post<Project>('http://localhost:3003/api/project/add', {
                name,
                clientName,
                address,
                department ,
                businessUnit ,
                type
            },{
                headers : {
                    Authorization :`Bearer ${token}`
                }
            });

            if(response.status == 200){
                set((state)=>({projects : [...state.projects, response.data]}))
                return true;
            }

            return false;
        },

        updateProject :  async ({token, projectId, name,clientName,address,department,businessUnit,type} : {token : string,projectId : string,name : string, clientName : string, address : string, department : string, businessUnit : number, type : string}) => {
            const response = await  axios.put<Project>(`http://localhost:3003/api/project/update/${projectId}`, {
                name,
                clientName,
                address,
                department ,
                businessUnit ,
                type
            },{
                headers : {
                    Authorization :`Bearer ${token}`
                }
            });

            if(response.status == 200){
                set((state) => (
                    {
                        projects : state.projects.map(project => project.id === projectId ? response.data : project)
                    }
                ))
                return true;
            }

            return false;
        },

        removeProject: async (token: string ,projectId: string) => {
            const response = await axios.delete(`http://localhost:3003/api/project/delete/${projectId}`,{
                headers : {
                    Authorization : `Bearer ${token}`
                }
            })
            if(response.status == 200){
                set((state)=>(
                    {
                        projects : state.projects.filter(project => project.id !== projectId)
                    }
                ))

                return true;
            }

            return false;
        }
    });
})