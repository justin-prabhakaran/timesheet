import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {projectStore} from "@/zustand/store/project_store.ts";
import {taskStore} from "@/zustand/store/task_store.ts";
import {Task, TaskStatus} from "@/model/task.ts";
import {useEffect, useState} from "react";
import {Log} from "@/model/log.ts";
import {timeLogStore} from "@/zustand/store/timelog_store.ts";
import {userStore} from "@/zustand/store/user_store.ts";

export default function TimeLogManagement() {


    const projects = projectStore(state => state.projects);
    const currentUser = userStore(state => state.user);
    const getTasks = taskStore(state => state.getAllTasks);

    const addLog = timeLogStore(state => state.addTimeLog)
    const getLogs = timeLogStore(state => state.getLogs)
    const getUserLogs = timeLogStore(state => state.getUserLogs)
    const logsStoreDate = timeLogStore(state => state.timelogs);

    const [logs, setLogs] = useState<Log[]>([]);
    const [tasks, setTasks] =useState<Task[]>([])
    const [log, setLog] = useState({
        project : "",
        task : "",
        hrs : 0,
        taskStatus : ""
    });

    useEffect(() => {
        if(log.project && log.project != ""){
            getTasks({
                token : currentUser?.token || "",
                projectId : log.project,
            }).then((tasks)=>{
                setTasks(tasks)
            })
        }
    }, [log.project]);

    useEffect(() => {
        if(currentUser?.role === 'admin'){
            getLogs({token : currentUser?.token || ""}).then((logss)=>{
                setLogs([...logs,...logss]);
            })
        }else{
            getUserLogs({token : currentUser?.token || "", user : currentUser?._id || ""}).then((logss)=>{
                setLogs([...logs,...logss]);
            })
        }
    }, []);

    useEffect(() => {
        setLogs([...logs,...logsStoreDate])
    }, [logsStoreDate]);




    return (
        <>
            <div className="max-w-6xl mx-auto my-10">
                <h1 className="text-2xl font-bold">Log Management</h1>

                <div className="flex justify-around items-end my-10 gap-4">
                    <div className="flex flex-row justify-start items-end gap-4">
                        <div className="flex flex-col gap-2">
                            <Label>Project</Label>
                            <Select onValueChange={(val)=>{
                                setLog({...log,project:  val})
                            }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        projects.map(project => (
                                            <SelectItem key={project.id}  value={project.id}>{project.name}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Task</Label>
                            <Select onValueChange={(val)=>{
                                setLog({...log,task: val})
                            }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Task" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        tasks.map(task => (
                                            <SelectItem key={task.id} value={task.id}>{task.title}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="expectedhr">Expected Hours</Label>
                            <Input
                                value={log.hrs}
                                onChange={(e)=>{
                                    setLog({...log,hrs: Number.parseInt(e.target.value)})
                                }}
                                id="expectedhr"
                                type="number"
                                placeholder="Ex.12"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Status</Label>
                            <Select onValueChange={(val)=>{
                                setLog({...log,taskStatus: val})
                            }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={TaskStatus.PENDING}>Pending</SelectItem>
                                    <SelectItem value={TaskStatus.COMPLETED}>Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button onClick={ async ()=>{

                        console.log(log);

                       const status =  await addLog({
                           token : currentUser?.token || "",
                           task : log.task,
                           project : log.project,
                           taskStatus : log.taskStatus,
                           date : new Date(),
                           hoursSpent : log.hrs
                       });

                       console.log(status);

                    }} type={"button"} variant="outline">Add</Button>
                </div>
                <Separator  orientation={"horizontal"} />

                <div className={"my-6"}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Task</TableHead>
                                <TableHead>Hours Spend</TableHead>
                                <TableHead>Task Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                               logs.map((log, index) => (
                                   <TableRow key={index}>
                                       <TableCell>{new Date(log.date).toDateString()}</TableCell>
                                       <TableCell>{log.project.name}</TableCell>
                                       <TableCell>{log.task.name}</TableCell>
                                       <TableCell>{log.hoursSpent}</TableCell>
                                       <TableCell>{log.taskStatus}</TableCell>

                                   </TableRow>
                               ))
                            }
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
