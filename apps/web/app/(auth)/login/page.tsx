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
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const { data, status } = useSession()

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard")
    }
  }, [status, data, router])

  async function handleLogin(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      toast("Please fill all fields!")
      return
    }

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email,
        password
      })
      if (response?.error) {
        toast(response.error)
      } else if (response?.ok) {
        router.replace("/dashboard")
      }
    } catch (error) {
      console.log(error)
      toast("Something went wrong! | Please try again later")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a05] via-[#2a0c0c] to-[#3a0c0c] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#2a0c0c] border border-red-800">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2">
              <Palette className="h-8 w-8 text-red-400" />
              <Link href="/">
                <span className="text-2xl font-bold text-white">Excaliberate</span>
              </Link>
            </div>
          </div>
          <CardTitle className="text-2xl text-white">Welcome back</CardTitle>
          <CardDescription className="text-red-300">
            Sign in to join drawing rooms and create amazing art
          </CardDescription>
        </CardHeader>
        <form action={handleLogin}>
          <CardContent className="space-y-4">
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
                placeholder="Enter your password"
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
              Sign In
            </Button>
            <div className="text-center text-sm text-red-400">
              {"Don't have an account? "}
              <Link href="/signup" className="text-red-300 hover:text-white underline">
                Create one
              </Link>
            </div>
            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-red-400 hover:text-red-300 underline"
              >
                Forgot your password?
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
