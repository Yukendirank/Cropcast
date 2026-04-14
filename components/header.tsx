'use client'

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { auth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Menu, X, ChevronDown, Sparkles } from "lucide-react"

const NAV_FEATURES = [
  { href: '/predict', label: '🌾 Yield Prediction' },
  { href: '/weather', label: '🌦️ Weather Insights' },
  { href: '/chatbot', label: '🤖 AI Assistant' },
  { href: '/recommend-crop', label: '🌱 Crop Recommendation' },
  { href: '/fertilizer', label: '🧪 Fertilizer Suggestion' },
]

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative px-3 py-2 text-sm text-gray-600 hover:text-[#0A4D3C] rounded-lg transition-colors duration-200 font-medium group"
    >
      <span className="relative z-10">{label}</span>
      <span className="absolute inset-x-3 bottom-1 h-0.5 bg-[#0A4D3C] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
      <span className="absolute inset-0 bg-green-50 rounded-lg scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200" />
    </Link>
  )
}

export function Header() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openFeatures = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current)
      hoverTimeout.current = null
    }
    setFeaturesOpen(true)
  }

  const closeFeatures = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current)
    }
    hoverTimeout.current = setTimeout(() => {
      setFeaturesOpen(false)
      hoverTimeout.current = null
    }, 180)
  }

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated())
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    auth.logout()
    setIsAuthenticated(false)
    router.push("/")
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
      ? 'bg-white/95 backdrop-blur-md shadow-md shadow-black/5 border-b border-gray-100/80'
      : 'bg-white/75 backdrop-blur-sm border-b border-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-9 h-9 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <div className="absolute inset-0 bg-green-400/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image src="/cropcast-icon.png" alt="CropCast" width={36} height={36} className="object-contain relative z-10" priority />
            </div>
            <div>
              <p className="text-base font-bold text-[#0A4D3C] leading-tight tracking-tight">CropCast</p>
              <p className="text-[10px] text-gray-400 leading-tight hidden sm:block font-medium">AI Yield Prediction</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">

            <NavLink href="/" label="Home" />

            {/* All Features Dropdown */}
            <div
              className="relative"
              onMouseEnter={openFeatures}
              onMouseLeave={closeFeatures}
            >
              <button className="relative flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-[#0A4D3C] rounded-lg transition-colors duration-200 font-medium group">
                <span className="relative z-10 flex items-center gap-1">
                  All Features
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${featuresOpen ? 'rotate-180' : ''}`} />
                </span>
                <span className="absolute inset-x-3 bottom-1 h-0.5 bg-[#0A4D3C] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
                <span className="absolute inset-0 bg-green-50 rounded-lg scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200" />
              </button>

              <div className={`absolute top-full left-0 mt-2 w-56 transition-all duration-300 ease-in-out origin-top-left ${featuresOpen
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'}`}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-black/10 py-2 overflow-hidden"
                     onMouseEnter={openFeatures}
                     onMouseLeave={closeFeatures}>
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Tools
                    </p>
                  </div>
                  {NAV_FEATURES.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-[#0A4D3C] transition-all duration-150 group/item"
                    >
                      <span className="transition-transform duration-150 group-hover/item:translate-x-0.5">{label}</span>
                    </Link>
                  ))}
                  <div className="border-t border-gray-50 mt-1 pt-1">
                    <Link
                      href="/features"
                      className="flex items-center px-4 py-2.5 text-sm font-semibold text-[#0A4D3C] hover:bg-green-50 transition-all duration-150"
                    >
                      View all features →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard */}
            <NavLink href={isAuthenticated ? "/dashboard" : "/signin"} label="Dashboard" />

            {/* About */}
            <NavLink href="/about" label="About" />
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium active:scale-95"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="px-4 py-2 text-sm text-gray-600 hover:text-[#0A4D3C] hover:bg-green-50 rounded-lg transition-all duration-200 font-medium active:scale-95"
                >
                  Sign In
                </Link>
                <Link
                  href="/get-started"
                  className="relative px-5 py-2 text-sm bg-[#0A4D3C] text-white rounded-xl hover:bg-[#0d5e49] transition-all duration-200 font-semibold shadow-md shadow-green-900/20 hover:shadow-lg hover:shadow-green-900/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 overflow-hidden group"
                >
                  <span className="relative z-10">Get Started</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-90"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="border-t border-gray-100 py-3 space-y-0.5">
            {[
              { href: '/', label: 'Home' },
              { href: '/features', label: 'All Features' },
              { href: isAuthenticated ? '/dashboard' : '/signin', label: 'Dashboard' },
              { href: '/about', label: 'About' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-[#0A4D3C] rounded-xl transition-all duration-150 font-medium"
              >
                {label}
              </Link>
            ))}

            <div className="px-3 py-2">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">AI Tools</p>
              {NAV_FEATURES.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 pl-2 text-sm text-gray-600 hover:text-[#0A4D3C] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 mt-1 flex gap-2 px-3">
              {isAuthenticated ? (
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="flex-1 py-2.5 text-sm text-red-600 border border-red-200 rounded-xl font-medium"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link href="/signin" onClick={() => setMobileOpen(false)} className="flex-1 py-2.5 text-sm text-center text-gray-700 border border-gray-200 rounded-xl font-medium">Sign In</Link>
                  <Link href="/get-started" onClick={() => setMobileOpen(false)} className="flex-1 py-2.5 text-sm text-center text-white bg-[#0A4D3C] rounded-xl font-semibold shadow-md shadow-green-900/20">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
