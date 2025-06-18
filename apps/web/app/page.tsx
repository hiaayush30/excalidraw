import Link from "next/link"
import { Button } from "@repo/ui/components/button"
import { Palette, Users, Brush, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a05] via-[#2e0d08] to-[#3a0c0c] text-white">
      {/* Header */}
      <header className="border-b border-red-900 bg-[#1a0a05]/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold text-red-200">Excaliberate</span>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-red-400 hover:text-red-200">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-red-600 text-white hover:bg-red-500">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
            Draw Together,
            <br />
            Create Forever
          </h1>
          <p className="text-xl text-red-300 max-w-2xl mx-auto">
            Join collaborative drawing rooms where creativity knows no bounds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-red-600 text-white hover:bg-red-500 text-lg px-8"
              >
                Start Drawing
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-red-600 text-red-400 hover:text-white text-lg px-8"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-800/60 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-red-300" />
            </div>
            <h3 className="text-xl font-semibold text-red-200">Collaborative Rooms</h3>
            <p className="text-red-400">Join or create drawing rooms with friends and collaborate in real-time</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-800/60 rounded-full flex items-center justify-center mx-auto">
              <Brush className="h-8 w-8 text-red-300" />
            </div>
            <h3 className="text-xl font-semibold text-red-200">Professional Tools</h3>
            <p className="text-red-400">Access a full suite of drawing tools, brushes, and creative features</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-800/60 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="h-8 w-8 text-red-300" />
            </div>
            <h3 className="text-xl font-semibold text-red-200">Endless Creativity</h3>
            <p className="text-red-400">Express yourself with unlimited canvas space and creative possibilities</p>
          </div>
        </div>
      </main>
    </div>
  )
}
