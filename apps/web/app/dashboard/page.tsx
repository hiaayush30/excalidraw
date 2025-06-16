"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card"
import { Separator } from "@repo/ui/components/separator"
import { Palette, Plus, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

function Dashboard() {
    const router = useRouter();
    if (!localStorage.getItem("token")) {
        return router.replace("/login");
    }
    async function createRoom(formData: FormData) {

        const roomName = formData.get("roomName") as string

        // Here you would typically create the room in your database
        // and generate a unique room ID
        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase()

        console.log("Creating room:", { roomName, roomId })

        // Redirect to the drawing room (you'd implement this)
        // redirect(`/room/${roomId}`)
    }

    async function joinRoom(formData: FormData) {

        const roomId = formData.get("roomId") as string

        // Here you would typically validate if the room exists
        console.log("Joining room:", { roomId })

        // Redirect to the drawing room (you'd implement this)
        // redirect(`/room/${roomId}`)
    }
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-slate-800">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <Palette className="h-8 w-8 text-slate-400" />
                        <span className="text-2xl font-bold">Excaliberate</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <span className="text-slate-400">Welcome back!</span>
                        <Button variant="ghost" className="text-slate-300 hover:text-white">
                            Profile
                        </Button>
                        <Button
                            onClick={() => {
                                localStorage.removeItem("token");
                                alert("logged out successfully")
                                router.push("/login");
                            }}
                            variant="ghost" className="text-slate-300 hover:text-white">
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Ready to Create?</h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Start a new drawing room or join friends in an existing one. Your canvas awaits!
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Create Room Card */}
                    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                        <CardHeader className="text-center pb-4">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Plus className="h-8 w-8 text-slate-400" />
                            </div>
                            <CardTitle className="text-2xl text-white">Create Room</CardTitle>
                            <CardDescription className="text-slate-400">
                                Start a new drawing session and invite others to join
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={createRoom} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="roomName" className="text-slate-200">
                                        Room Name
                                    </Label>
                                    <Input
                                        id="roomName"
                                        name="roomName"
                                        type="text"
                                        placeholder="Enter a name for your room"
                                        required
                                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600"
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-600 text-white group">
                                    Create Room
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </form>

                            <div className="mt-6 p-4 bg-slate-800 rounded-lg">
                                <h4 className="text-sm font-medium text-slate-300 mb-2">What happens next?</h4>
                                <ul className="text-sm text-slate-400 space-y-1">
                                    <li>• You'll get a unique room ID to share</li>
                                    <li>• Others can join using this ID</li>
                                    <li>• Start drawing together instantly</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Join Room Card */}
                    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                        <CardHeader className="text-center pb-4">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-slate-400" />
                            </div>
                            <CardTitle className="text-2xl text-white">Join Room</CardTitle>
                            <CardDescription className="text-slate-400">
                                Enter a room ID to join an existing drawing session
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={joinRoom} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="roomId" className="text-slate-200">
                                        Room ID
                                    </Label>
                                    <Input
                                        id="roomId"
                                        name="roomId"
                                        type="text"
                                        placeholder="Enter room ID"
                                        required
                                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600 uppercase"
                                        style={{ textTransform: "uppercase" }}
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-600 text-white group">
                                    Join Room
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </form>

                            <div className="mt-6 p-4 bg-slate-800 rounded-lg">
                                <h4 className="text-sm font-medium text-slate-300 mb-2">Need a room ID?</h4>
                                <p className="text-sm text-slate-400">
                                    Ask the room creator to share their unique room ID with you. It's usually a 6-character code like
                                    "ABC123".
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Rooms Section */}
                <div className="mt-16 max-w-4xl mx-auto">
                    <Separator className="bg-slate-800 mb-8" />
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4 text-white">Recent Rooms</h2>
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
                            <div className="text-slate-400 mb-4">
                                <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No recent rooms yet</p>
                                <p className="text-sm mt-2">Your recently visited rooms will appear here</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Tips */}
                <div className="mt-12 max-w-2xl mx-auto">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-lg text-white text-center">Quick Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-slate-400">
                                    Room IDs are case-insensitive and automatically generated when you create a room
                                </p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-slate-400">
                                    Share your room ID with friends to collaborate on drawings in real-time
                                </p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-slate-400">
                                    All drawings are automatically saved and synced across all participants
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default Dashboard
