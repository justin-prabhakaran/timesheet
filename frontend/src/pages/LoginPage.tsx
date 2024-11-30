import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";


function LoginPage() {
    return(
        <div className={"h-screen flex items-center justify-center"}>
            <Card className={"w-1/2"}>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your details to be logged in</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" placeholder="Ex. justin_17"/>
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input type={"password"} id="password" placeholder="password..."/>
                            </div>
                        </div>
                    </form>
                </CardContent>

                <CardFooter>
                    <Button className={"w-1/2 mx-auto"}>Login</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default LoginPage
