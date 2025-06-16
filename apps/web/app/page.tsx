import Link from "next/link"
import { Button } from "@repo/ui/components/button"
import { Palette, Users, Brush, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="h-8 w-8 text-slate-400" />
            <span className="text-2xl font-bold">Excaliberate</span>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="border-slate-700 text-slate-300 hover:text-slate-100">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-slate-700 text-slate-200 hover:bg-slate-600">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Draw Together,
            <br />
            Create Forever
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Join collaborative drawing rooms where creativity knows no bounds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-slate-700 text-slate-200 hover:bg-slate-600 text-lg px-8">
                Start Drawing
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 text-slate-400 hover:text-slate-100 text-lg px-8"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold">Collaborative Rooms</h3>
            <p className="text-slate-400">Join or create drawing rooms with friends and collaborate in real-time</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
              <Brush className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold">Professional Tools</h3>
            <p className="text-slate-400">Access a full suite of drawing tools, brushes, and creative features</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold">Endless Creativity</h3>
            <p className="text-slate-400">Express yourself with unlimited canvas space and creative possibilities</p>
          </div>
        </div>
      </main>
    </div>
  )
}
