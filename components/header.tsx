import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10">
              <Image
                src="/generate an image fo.png"
                alt="CropCast Icon"
                width={40}
                height={40}
                priority
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0A4D3C]">CropCast</h1>
              <p className="text-xs text-muted-foreground">Yield Prediction and Analytics</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#features" className="text-foreground hover:text-primary transition-colors">
              Features
            </a>
            <Link href="/predict" className="text-foreground hover:text-primary transition-colors">
              Predict Yield
            </Link>
            <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden md:inline-flex bg-transparent">
              Sign In
            </Button>
            <Link href="/predict">
              <Button>Get Started</Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
