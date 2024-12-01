import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { Department, User } from "@/model/user.ts";
import { projectStore } from "@/zustand/store/project_store.ts";
import { useEffect, useState } from "react";
import {userStore} from "@/zustand/store/user_store.ts";
import {Task} from "@/model/task.ts";
import {taskStore} from "@/zustand/store/task_store.ts";


export default function ProjectEditPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const projects = projectStore((state) => state.projects);
    const getAllUsers = userStore(state => state.getAllUsers);
    const currentUser = userStore(state => state.user);

    const addProject = projectStore(state => state.addProject);
    const updateProject = projectStore(state => state.updateProject);


    const getAllTasks = taskStore(state => state.getAllTasks);

    const [project, setProject] = useState({
        name: "",
        department: "",
        businessUnit: 1,
        type: "",
        clientName: "",
        address: "",
    });

    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        getAllTasks({
            token : currentUser?.token || "",
            projectId : projectId || "",
        }).then((tasks) =>{
            setTasks(tasks);
        });

    }, [currentUser?.token, getAllTasks, projectId,tasks]);





    useEffect(() => {
        if (projectId && projectId !== "new") {
            const selectedProject = projects.find((project) => project.id === projectId);
            if (selectedProject) {
                setProject({
                    name: selectedProject.name,
                    department: selectedProject.department,
                    businessUnit: selectedProject.businessUnit,
                    type: selectedProject.type,
                    clientName: selectedProject.clientName,
                    address: selectedProject.address
                });
                setSelectedUsers(selectedProject.users);
            }
        }
    }, [projectId, projects]);

    useEffect(() => {
        getAllUsers(currentUser?.token || "").then((users) =>{
            setAllUsers(users);
        });
    }, []);

    const handleInputChange = (field: string, value: any) => {
        setProject((prev) => ({ ...prev, [field]: value }));
    };


    return (
        <div className="p-4">
            <form className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold">Edit/Add Project</h1>
                <p className="text-1xl font-normal">
                    Edit/Add project details and add or remove users and tasks of the project.
                </p>

                <div className="flex flex-col items-center mt-8">
                    <div className="flex flex-col gap-2 mt-6 w-full">
                        <Label htmlFor="projectName">Project Name</Label>
                        <Input
                            value={project.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="w-full max-w-3xl"
                            id="projectName"
                            type="text"
                        />
                    </div>

                    <div className="flex flex-col gap-2 mt-6 w-full">
                        <Label htmlFor="clientName">Client Name</Label>
                        <Input
                            value={project.clientName}
                            onChange={(e) => handleInputChange("clientName", e.target.value)}
                            className="w-full max-w-3xl"
                            id="clientName"
                            type="text"
                        />
                    </div>

                    <div className="flex flex-col gap-2 mt-6 w-full">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            value={project.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            className="w-full max-w-3xl"
                            id="address"
                            type="text"
                        />
                    </div>

                    <div className="flex flex-row gap-9 mt-6">
                        <Select  value={project.businessUnit.toString()} onValueChange={(value) => handleInputChange("businessUnit", parseInt(value))}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Business Unit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Unit 1</SelectItem>
                                <SelectItem value="2">Unit 2</SelectItem>
                                <SelectItem value="3">Unit 3</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={project.department} onValueChange={(value) => handleInputChange("department", value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={Department.CSE}>CSE</SelectItem>
                                <SelectItem value={Department.MECH}>Mech</SelectItem>
                                <SelectItem value={Department.CIVIL}>Civil</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={project.type} onValueChange={(value) => handleInputChange("type", value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="type1">Type 1</SelectItem>
                                <SelectItem value="type2">Type 2</SelectItem>
                                <SelectItem value="type3">Type 3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Users Section */}
                <Separator orientation="horizontal" className="mt-5 w-full" />
                <h1 className="mt-5 text-2xl font-bold">Users</h1>
                <div className="grid grid-cols-3 gap-4 px-4 py-4">
                    {selectedUsers.map((user, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle>{user.userName}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4">
                                    <h1>{user.department}</h1>
                                    <h1>{user.businessUnit}</h1>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/*all users*/}
                <Separator orientation="horizontal" className="mt-5 w-full" />
                {/*<h1 className="mt-5 text-2xl font-bold">Users</h1>*/}
                <div className="grid grid-cols-3 gap-4 px-4 py-4">
                    {allUsers.map((user, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle>{user.userName}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4">
                                    <h1>{user.department}</h1>
                                    <h1>{user.businessUnit}</h1>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Tasks Section */}
                <Separator className="my-10" orientation="horizontal" />
                <h1 className="font-bold text-2xl">Tasks</h1>
                <div className="m-4 grid grid-cols-3 gap-4">
                    {tasks.map((task, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle>{task.title}</CardTitle>
                                <CardDescription>{task.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <h1>Expected Hours: {task.expectedHours}</h1>
                                <h1>Status: {task.status}</h1>

                            </CardContent>
                        </Card>
                    ))}
                </div>
            </form>

            <div className="flex justify-center my-10">
                <Button onClick={ async ()=>{
                    if(projectId && projectId === "new"){
                       const status =  await addProject({
                           token : currentUser?.token || "",
                            name : project.name,
                            address : project.address,
                            businessUnit : project.businessUnit,
                            type : project.type,
                            clientName : project.clientName,
                            department : project.department
                        });

                       console.log(status);
                    }else if(projectId && projectId !== "new"){
                        const status = await updateProject({
                            token : currentUser?.token || "",
                            projectId : projectId,
                            name : project.name,
                            address : project.address,
                            businessUnit : project.businessUnit,
                            type : project.type,
                            clientName : project.clientName,
                            department : project.department
                        });

                        console.log(status);

                        }
                } } className="w-2/12">Save</Button>
            </div>
        </div>
    );
}
