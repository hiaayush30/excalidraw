"use client"
import Link from "next/link"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/card"
import { Palette } from "lucide-react"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { BACKEND_URL } from "@/config"
import { toast } from "sonner"

export default function SignupPage() {
    const router = useRouter();

    const { data, status } = useSession();

    useEffect(() => {
        if (status == "authenticated") {
            return router.replace("/dashboard");
        }
    }, [status, data, router])
    async function handleSignup(formData: FormData) {
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        // Here you would typically handle the signup logic
        console.log("Signup attempt:", { name, email, password })

        if (!name || !email || !password) {
            toast("Please fill all fields!");
            return;
        }
        try {
            await axios.post(BACKEND_URL + "/api/user/signup", {
                name,
                email,
                password
            });
            toast("Signed up successfully!")
            router.push("/login");
        } catch (error) {
            console.log(JSON.stringify(error))
            // --- ERROR BLOCK ---
            if (error instanceof AxiosError) {
                // AxiosError means it's an HTTP error response from the server (e.g., 400, 401, 409, 500)
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    const errorMessage = error.response.data?.message || "An error occurred during signup.";
                    toast(`Error: ${errorMessage}`);
                    console.error("Signup error response:", error.response.data);
                    console.error("Status:", error.response.status);
                    console.error("Headers:", error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and http.ClientRequest in node.js
                    toast("Network Error: No response received. Please check your internet connection or server.");
                    console.error("Signup network error:", error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    toast("An unexpected error occurred during signup setup.");
                    console.error("Signup request setup error:", error.message);
                }
            } else {
                // Any other type of error (e.g., a programming error, or a non-Axios error)
                toast("An unknown error occurred. Please try again.");
                console.error("Unknown error during signup:", error);
            }
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-slate-900 border-slate-800">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center space-x-2">
                            <Palette className="h-8 w-8 text-slate-400" />
                            <Link href={"/"}>
                                <span className="text-2xl font-bold text-white">Excaliberate</span>
                            </Link>
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-white">Create your account</CardTitle>
                    <CardDescription className="text-slate-400">Join drawing rooms and unleash your creativity</CardDescription>
                </CardHeader>
                <form action={handleSignup}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-200">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                                required
                                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-200">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-200">
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Create a password"
                                required
                                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-600 text-white my-5">
                            Create Account
                        </Button>
                        <div className="text-center text-sm text-slate-400">
                            Already have an account?{" "}
                            <Link href="/login" className="text-slate-300 hover:text-white underline">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
