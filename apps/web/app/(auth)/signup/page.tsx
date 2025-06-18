"use client"
import Link from "next/link"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@repo/ui/components/card"
import { Palette } from "lucide-react"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { BACKEND_URL } from "@/config"
import { toast } from "sonner"

export default function SignupPage() {
    const router = useRouter()
    const { data, status } = useSession()

    useEffect(() => {
        if (status === "authenticated") {
            return router.replace("/dashboard")
        }
    }, [status, data, router])

    async function handleSignup(formData: FormData) {
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        if (!name || !email || !password) {
            toast("Please fill all fields!")
            return
        }

        try {
            await axios.post(BACKEND_URL + "/api/user/signup", {
                name,
                email,
                password
            })
            toast("Signed up successfully!")
            router.push("/login")
        } catch (error) {
            console.log(JSON.stringify(error))
            if (error instanceof AxiosError) {
                if (error.response) {
                    const errorMessage =
                        error.response.data?.message || "An error occurred during signup."
                    toast(`Error: ${errorMessage}`)
                } else if (error.request) {
                    toast(
                        "Network Error: No response received. Please check your connection."
                    )
                } else {
                    toast("An unexpected error occurred during signup setup.")
                }
            } else {
                toast("An unknown error occurred. Please try again.")
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a0a05] via-[#2a0c0c] to-[#3a0c0c] flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-[#2a0c0c] border border-red-800">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center space-x-2">
                            <Palette className="h-8 w-8 text-red-400" />
                            <Link href={"/"}>
                                <span className="text-2xl font-bold text-white">Excaliberate</span>
                            </Link>
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-white">Create your account</CardTitle>
                    <CardDescription className="text-red-300">
                        Join drawing rooms and unleash your creativity
                    </CardDescription>
                </CardHeader>
                <form action={handleSignup}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-red-200">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                                required
                                className="bg-[#3a0c0c] border-red-800 text-white placeholder:text-red-400 focus:border-red-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-red-200">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                                className="bg-[#3a0c0c] border-red-800 text-white placeholder:text-red-400 focus:border-red-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-red-200">
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Create a password"
                                required
                                className="bg-[#3a0c0c] border-red-800 text-white placeholder:text-red-400 focus:border-red-700"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full bg-red-700 hover:bg-red-600 text-white my-5"
                        >
                            Create Account
                        </Button>
                        <div className="text-center text-sm text-red-400">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-red-300 hover:text-white underline"
                            >
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
