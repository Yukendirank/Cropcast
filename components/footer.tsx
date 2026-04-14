import Link from "next/link"
import { Leaf, ArrowRight } from "lucide-react"

const LINKS = {
  Features: [
    { href: '/predict', label: 'Yield Prediction' },
    { href: '/weather', label: 'Weather Insights' },
    { href: '/chatbot', label: 'AI Assistant' },
    { href: '/recommend-crop', label: 'Crop Recommendation' },
    { href: '/fertilizer', label: 'Fertilizer Suggestion' },
  ],
  Platform: [
    { href: '/features', label: 'All Features' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/about', label: 'About' },
    { href: '/get-started', label: 'Create Account' },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-gray-100 bg-white py-16 px-4 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-green-50/30 -z-10" />

      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0A4D3C] to-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-green-900/20 group-hover:scale-110 transition-transform duration-300">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg leading-tight">CropCast</p>
                <p className="text-xs text-gray-400 font-medium">AI Yield Prediction</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
              Helping farmers make smarter, data-driven decisions with AI-powered crop analysis and predictions across India.
            </p>
            <Link
              href="/get-started"
              className="group inline-flex items-center gap-2 bg-[#0A4D3C] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0d5e49] hover:shadow-md hover:shadow-green-900/20 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              Get Started Free <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{title}</p>
              <ul className="space-y-2.5">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-gray-500 hover:text-[#0A4D3C] transition-colors duration-200 hover:translate-x-0.5 inline-block transition-transform"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} CropCast. All rights reserved.</p>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            Powered by
            <span className="font-semibold text-gray-500">Google Gemini AI</span>
            &
            <span className="font-semibold text-gray-500">OpenWeatherMap</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
