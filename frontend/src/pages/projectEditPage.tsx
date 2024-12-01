import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

export default function ProjectEditPage() {

    const selected = [{
        name : "user 1",
        department : "cse",
        bu : 1
    },
        {
            name : "user 2",
            department : "cse",
            bu : 1
        },
        {
            name : "user 3",
            department : "cse",
            bu : 1
        },
        {
            name : "user 4",
            department : "cse",
            bu : 1
        }]

    const tasks = [{
        title : "title1",
        description : "description 1",
        expectedHr : 12
    },{
        title : "title1",
        description : "description 1",
        expectedHr : 12
    },{
        title : "title1",
        description : "description 1",
        expectedHr : 12
    },{
        title : "title1",
        description : "description 1",
        expectedHr : 12
    }]

    return (
        <div className="p-4">
            <form className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold">Edit Project</h1>
                <p className="text-1xl font-normal">
                    Edit project details and add or remove users and tasks of the project.
                </p>

                <div className="flex flex-col items-center mt-8">

                    <div className="flex flex-col gap-2 mt-6 w-full">
                        <Label htmlFor="projectName">Project Name</Label>
                        <Input className="w-full max-w-3xl" id="projectName" type="text"/>
                    </div>

                    <div className="flex flex-col gap-2 mt-6 w-full">
                        <Label htmlFor="clientName">Client Name</Label>
                        <Input className="w-full max-w-3xl" id="clientName" type="text"/>
                    </div>

                    <div className="flex flex-col gap-2 mt-6 w-full">
                        <Label htmlFor="address">Address</Label>
                        <Input className="w-full max-w-3xl" id="address" type="text"/>
                    </div>

                    <div className={"flex flex-row gap-9 mt-6"}>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Business Unit"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="unit1">Unit 1</SelectItem>
                                <SelectItem value="unit2">Unit 2</SelectItem>
                                <SelectItem value="unit3">Unit 3</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Department"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cse">Cse</SelectItem>
                                <SelectItem value="mech">Mech</SelectItem>
                                <SelectItem value="civil">Civil</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Type"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="type1">type 1</SelectItem>
                                <SelectItem value="type2">type 2</SelectItem>
                                <SelectItem value="type3">type 3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                </div>

                <Separator orientation={"horizontal"} className={"mt-5 w-full"}/>
                <h1 className={"mt-5 text-2xl font-bold"}>Users</h1>

                <div className={"px-4 py-4"}>
                    <div className={"grid grid-cols-3 gap-4"}>
                        {selected.map((user, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle>{user.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={"flex gap-4"}><h1>{user.department}</h1>
                                        <h1>{user.bu}</h1></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <Separator orientation={"horizontal"} className={"w-full my-6"}/>

                <div className={"px-4 py-4"}>
                    <div className={"grid grid-cols-3 gap-4"}>
                        {selected.map((user, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle>{user.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={"flex gap-4"}><h1>{user.department}</h1>
                                        <h1>{user.bu}</h1></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <Separator orientation={"horizontal"} className={"w-full my-6"} />

                <h1 className={"font-bold text-2xl"}>Tasks</h1>

                <div className={"flex justify-around items-end my-4 gap-4"}>
                    <div className={"flex flex-row gap-4"}>
                        <div className={"flex flex-col gap-2"}>
                            <Label htmlFor={"title"}>Title</Label>
                            <Input id={"title"} type={"text"} placeholder={"Ex.User Management"}/>
                        </div>

                        <div className={"flex flex-col gap-2"}>
                            <Label htmlFor={"description"}>Description</Label>
                            <Input id={"description"} type={"text"} placeholder={"...."}/>
                        </div>

                        <div className={"flex flex-col gap-2"}>
                            <Label htmlFor={"expectedhr"}>Expected Hours</Label>
                            <Input id={"expectedhr"} type={"number"} placeholder={"Ex.12"}/>
                        </div>

                    </div>

                    <Button variant={"outline"}>add</Button>

                </div>


                <Separator className={"my-10"} orientation={"horizontal"}/>

                <div className={"m-4"}>
                    <div className={"grid grid-cols-3 gap-4"}>
                        {tasks.map((task, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle>{task.title}</CardTitle>
                                    <CardDescription>{task.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <h1>expected hours : {task.expectedHr}</h1>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

            </form>

            <div className="flex justify-center my-10">
                <Button className={"w-2/12"}>Save</Button>
            </div>


        </div>
    );
}
