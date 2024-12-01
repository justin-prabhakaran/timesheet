import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {BsThreeDotsVertical} from "react-icons/bs";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx";
import {useEffect, useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {User} from "@/model/user.ts";
import {userStore} from "@/zustand/store/user_store.ts";

export default function UserManagementPage() {

    const [isShowFilter, setShowFilter] = useState<boolean>(false);

    const getAllUser = userStore(state => state.getAllUsers);
    const currentUser = userStore(state => state.user);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        getAllUser(currentUser?.token || "").then((users)=>{
            setUsers(users);
        })
    }, []);


    return (
        <>
            <div className="p-4">
                <nav className="flex flex-row justify-around items-center gap-4">
                    <Input type="search" placeholder="Search users..."/>
                    <Button variant="outline" onClick={()=>{
                        setShowFilter(!isShowFilter);
                    }}>Filter</Button>
                </nav>

                { isShowFilter &&
                    <nav className="pt-2 flex flex-row-reverse gap-4">
                        <Select >
                            <SelectTrigger className="w-max px-5">
                                <SelectValue placeholder="Select a business unit"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Business Unit</SelectLabel>
                                    <SelectItem value="unit1">unit 1</SelectItem>
                                    <SelectItem value="unit2">unit 2</SelectItem>
                                    <SelectItem value="unit3">unit 3</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-max px-5">
                                <SelectValue placeholder="Select a department"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Department</SelectLabel>
                                    <SelectItem value="Cse">Cse</SelectItem>
                                    <SelectItem value="Mech">Mech</SelectItem>
                                    <SelectItem value="Civil">Civil</SelectItem>
                                    <SelectItem value="IT">IT</SelectItem>
                                    <SelectItem value="Eee && Ece">Eee && Ece</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </nav>
                }
            </div>

            <Separator/>

            <div className="flex flex-row justify-between items-center px-4 mt-2">
                <h2 className="text-lg font-semibold">User Management</h2>
                <Button>Add User</Button>
            </div>

            <div className="px-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user, index) => (

                        <Card key={index} className={"shadow-sw hover:shadow-md transition-shadow"}>
                            <CardHeader>
                                <div className={"flex flex-row items-center justify-between"}>
                                    <h1 className={"font-bold text-2xl"}>{user.userName}</h1>
                                    <Popover>
                                        <PopoverTrigger>
                                            <BsThreeDotsVertical />
                                        </PopoverTrigger>
                                        <PopoverContent className={"w-max"}>
                                            <h1 className={"hover:cursor-pointer"}>edit</h1>

                                            <h1 className={"hover:cursor-pointer"}>delete</h1>
                                        </PopoverContent>
                                    </Popover>

                                </div>
                            </CardHeader>
                            <CardContent>
                                <h1 className={"font-normal text-1xl"}>Department : {user.department}</h1>
                                <h1 className={"font-thin text-1xl"}>Business group: {user.businessUnit}</h1>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
