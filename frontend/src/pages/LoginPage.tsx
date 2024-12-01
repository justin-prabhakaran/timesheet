import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {userStore} from "@/zustand/store/user_store.ts";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";


function LoginPage() {

    const login = userStore((state) => state.login);

    const [username , setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const navigator = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(username,password);
        const status = await login(username,password);
        if(status){
            navigator('/project');
        }
        console.log(status);

    }

    return(
        <div className={"h-screen flex items-center justify-center"}>
            <Card className={"w-1/2"}>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your details to be logged in</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" placeholder="Ex. justin_17" onChange={(val) => setUsername(val.target.value)}/>
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input type={"password"} id="password" placeholder="password..." onChange={(val) => setPassword(val.target.value)}/>
                            </div>
                        </div>
                    </form>
                </CardContent>

                <CardFooter>
                    <Button onClick={handleSubmit} className={"w-1/2 mx-auto"}>Login</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default LoginPage
