import { ArrowRight, Leaf, Zap, Shield, TrendingUp } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-green-200/80 text-[#0A4D3C] px-5 py-2 rounded-full text-sm font-semibold mb-8 shadow-sm shadow-green-100 hover:shadow-md hover:shadow-green-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-default group">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Leaf className="w-3 h-3 text-green-600" />
            </div>
            Powered by Google Gemini AI
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping absolute right-4 opacity-60" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-balance mb-6 leading-[1.1] tracking-tight">
            Smarter Farming<br />
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#0A4D3C] via-emerald-600 to-[#0A4D3C] bg-clip-text text-transparent">Starts Here</span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-green-400/0 via-green-400/60 to-green-400/0 rounded-full" />
            </span>
          </h1>

          <p className="text-xl text-gray-600 text-balance max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered crop yield predictions, weather insights, fertilizer planning, and smart crop recommendations — all in one platform built for farmers.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/predict">
              <button className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-[#0A4D3C] text-white rounded-2xl font-semibold text-base shadow-lg shadow-green-900/25 hover:shadow-xl hover:shadow-green-900/30 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] transition-all duration-300 overflow-hidden">
                <span className="relative z-10">Start Predicting Free</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-[#0A4D3C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            </Link>
            <Link href="/features">
              <button className="group inline-flex items-center gap-2 px-8 py-3.5 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-[#0A4D3C]/40 text-gray-700 hover:text-[#0A4D3C] rounded-2xl font-semibold text-base hover:shadow-md hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] transition-all duration-300">
                Explore All Features
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            {[
              { icon: Zap, text: 'Instant AI predictions', color: 'text-amber-500' },
              { icon: Shield, text: 'No login required to try', color: 'text-blue-500' },
              { icon: Leaf, text: 'Built for Indian farmers', color: 'text-green-600' },
              { icon: TrendingUp, text: '95%+ accuracy rate', color: 'text-purple-500' },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-2 group cursor-default">
                <div className={`w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 ${color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="group-hover:text-gray-700 transition-colors duration-200">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          {[
            {
              emoji: '🌾',
              title: 'Yield Prediction',
              desc: 'Enter soil & weather data and get AI-powered crop yield predictions with confidence scores.',
              href: '/predict',
              gradient: 'from-green-50 to-emerald-50',
              border: 'border-green-100',
              glow: 'hover:shadow-green-200/60',
              accent: 'bg-green-500',
            },
            {
              emoji: '🤖',
              title: 'AI Farming Assistant',
              desc: 'Chat with our Gemini-powered agricultural expert about crops, soil, pests, and best practices.',
              href: '/chatbot',
              gradient: 'from-blue-50 to-indigo-50',
              border: 'border-blue-100',
              glow: 'hover:shadow-blue-200/60',
              accent: 'bg-blue-500',
            },
            {
              emoji: '🌱',
              title: 'Crop Recommendation',
              desc: 'Tell us your soil conditions and location — get the top 5 crops ranked by suitability score.',
              href: '/recommend-crop',
              gradient: 'from-amber-50 to-yellow-50',
              border: 'border-amber-100',
              glow: 'hover:shadow-amber-200/60',
              accent: 'bg-amber-500',
            },
          ].map(({ emoji, title, desc, href, gradient, border, glow, accent }) => (
            <Link key={href} href={href} className="group">
              <div className={`relative bg-white shadow-md border border-gray-100 rounded-3xl p-7 h-full hover:shadow-xl ${glow} hover:-translate-y-2 transition-all duration-300 overflow-hidden`}>
                {/* Top accent line */}
                <div className={`absolute top-0 left-8 right-8 h-0.5 ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-full`} />
                {/* Background glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/20 to-transparent" />

                <div className="relative z-10">
                  <div className="text-5xl mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 inline-block">{emoji}</div>
                  <h3 className="text-lg font-bold mb-2.5 text-gray-800">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">{desc}</p>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0A4D3C] group-hover:gap-2.5 transition-all duration-300">
                    Try it free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
