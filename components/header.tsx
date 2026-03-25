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

          <nav className="flex items-center gap-4">
            <Link href="/" className="text-foreground hover:text-[#0A4D3C] transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-foreground hover:text-[#0A4D3C] transition-colors">
              About
            </Link>
            <Link href="/features" className="text-foreground hover:text-[#0A4D3C] transition-colors">
              Features
            </Link>
            <Link href="/predict" className="text-foreground hover:text-[#0A4D3C] transition-colors">
              Predict Yield
            </Link>
            <Link href="/dashboard" className="text-foreground hover:text-[#0A4D3C] transition-colors">
              Dashboard
            </Link>
            <Link href="/signin" className="text-foreground hover:text-[#0A4D3C] transition-colors">
              Sign In
            </Link>
            <Link href="/get-started" className="bg-[#0A4D3C] text-white px-4 py-2 rounded-lg hover:bg-[#083D2F] transition-colors">
              Get Started
            </Link>
          </nav>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
