"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card"
import { Separator } from "@repo/ui/components/separator"
import { Palette, Plus, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { signOut, useSession } from 'next-auth/react'
import axios, { AxiosError } from 'axios'
import { BACKEND_URL } from '@/config'
import { toast } from 'sonner'

function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="text-center text-red-300 mt-12">Loading session...</div>;
  }

  async function createRoom(formData: FormData) {
    const roomName = formData.get("roomName") as string;
    if (!roomName || roomName.length <= 3) {
      toast("Room name must be at least 3 characters");
    }

    try {
      await axios.post(BACKEND_URL + "/api/user/room", {
        name: roomName
      }, {
        headers: {
          "authorization": session?.user.accessToken
        }
      })
      router.push("/room/" + roomName);
      toast("Room created successfully!");
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        console.error(error.toJSON());
      }
      toast("Could not create room");
    }
  }

  async function joinRoom(formData: FormData) {
    const roomId = formData.get("roomId") as string;
    if (roomId.length < 3) {
      toast("Room ID must be at least 3 characters");
    }
    router.push("room/" + roomId);
  }

  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0a05] via-[#2a0c0c] to-[#3a0c0c] text-white">
        {/* Header */}
        <header className="border-b border-red-900 bg-[#1a0a05]/80">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Palette className="h-8 w-8 text-red-400" />
              <span className="text-2xl font-bold text-red-100">Excaliberate</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-red-300">Welcome {session.user.name}!</span>
              <Button variant="ghost" className="text-red-300 hover:text-white">
                Profile
              </Button>
              <Button
                onClick={async () => {
                  await signOut({ callbackUrl: "/login" });
                  toast("Logged out successfully");
                }}
                variant="ghost"
                className="text-red-300 hover:text-white"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Ready to Create?</h1>
            <p className="text-xl text-red-300 max-w-2xl mx-auto">
              Start a new drawing room or join friends in an existing one. Your canvas awaits!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Create Room */}
            <Card className="bg-[#2a0c0c] border-red-900 hover:border-red-700 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-[#3a0c0c] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-red-300" />
                </div>
                <CardTitle className="text-2xl text-white">Create Room</CardTitle>
                <CardDescription className="text-red-300">
                  Start a new drawing session and invite others to join
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={createRoom} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomName" className="text-red-200">Room Name</Label>
                    <Input
                      id="roomName"
                      name="roomName"
                      type="text"
                      placeholder="Enter a name for your room"
                      required
                      className="bg-[#3a0c0c] border-red-800 text-white placeholder:text-red-400"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-red-700 hover:bg-red-600 text-white group">
                    Create Room
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Join Room */}
            <Card className="bg-[#2a0c0c] border-red-900 hover:border-red-700 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-[#3a0c0c] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-red-300" />
                </div>
                <CardTitle className="text-2xl text-white">Join Room</CardTitle>
                <CardDescription className="text-red-300">
                  Enter a room ID to join an existing drawing session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={joinRoom} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomId" className="text-red-200">Room ID</Label>
                    <Input
                      id="roomId"
                      name="roomId"
                      type="text"
                      placeholder="Enter room ID"
                      required
                      className="bg-[#3a0c0c] border-red-800 text-white placeholder:text-red-400 uppercase"
                      style={{ textTransform: "uppercase" }}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-red-700 hover:bg-red-600 text-white group">
                    Join Room
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Recent Rooms */}
          <div className="mt-16 max-w-4xl mx-auto">
            <Separator className="bg-red-900 mb-8" />
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-white">Recent Rooms</h2>
              <div className="bg-[#2a0c0c] border border-red-900 rounded-lg p-8">
                <Palette className="h-12 w-12 mx-auto mb-4 opacity-50 text-red-400" />
                <p className="text-red-300">No recent rooms yet</p>
                <p className="text-sm text-red-400">Your recently visited rooms will appear here</p>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-12 max-w-2xl mx-auto">
            <Card className="bg-[#2a0c0c] border-red-900">
              <CardHeader>
                <CardTitle className="text-lg text-white text-center">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Room IDs are case-insensitive and automatically generated when you create a room",
                  "Share your room ID with friends to collaborate on drawings in real-time",
                  "All drawings are automatically saved and synced across all participants",
                ].map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-red-300">{tip}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }
}

export default Dashboard;
