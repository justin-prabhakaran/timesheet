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

export default function TimeLogManagement() {

    const logs = [
        {
            date : new Date(),
            project: "Project 1",
            taks : "Task 1",
            hrs : 12,
            status : "pending"
        },
        {
            date : new Date(),
            project: "Project 1",
            taks : "Task 1",
            hrs : 12,
            status : "pending"
        },
        {
            date : new Date(),
            project: "Project 1",
            taks : "Task 1",
            hrs : 12,
            status : "pending"
        },
        {
            date : new Date(),
            project: "Project 1",
            taks : "Task 1",
            hrs : 12,
            status : "pending"
        }
    ]

    return (
        <>
            <div className="max-w-6xl mx-auto my-10">
                <h1 className="text-2xl font-bold">Log Management</h1>

                <div className="flex justify-around items-end my-10 gap-4">
                    <div className="flex flex-row justify-start items-end gap-4">
                        <div className="flex flex-col gap-2">
                            <Label>Project</Label>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Project" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Project</Label>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Task" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="expectedhr">Expected Hours</Label>
                            <Input
                                id="expectedhr"
                                type="number"
                                placeholder="Ex.12"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Status</Label>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button variant="outline">Add</Button>
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
                                       <TableCell>{log.date.toDateString()}</TableCell>
                                       <TableCell>{log.project}</TableCell>
                                       <TableCell>{log.taks}</TableCell>
                                       <TableCell>{log.hrs}</TableCell>
                                       <TableCell>{log.status}</TableCell>

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
