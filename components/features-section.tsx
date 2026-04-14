import { CloudRain, Thermometer, Droplets, TestTube, Sprout, Bug, BarChart3, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

export function FeaturesSection() {
  const inputFeatures = [
    { icon: CloudRain, title: "Weather Data", description: "Rainfall, temperature, and humidity patterns", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", glow: "hover:shadow-blue-100" },
    { icon: TestTube, title: "Soil Analysis", description: "Soil type, fertility, pH levels, and composition", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", glow: "hover:shadow-amber-100" },
    { icon: Droplets, title: "Irrigation Systems", description: "Water management and irrigation methods", color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100", glow: "hover:shadow-cyan-100" },
    { icon: Sprout, title: "Crop Varieties", description: "Seed genetics and crop type specifications", color: "text-green-600", bg: "bg-green-50", border: "border-green-100", glow: "hover:shadow-green-100" },
    { icon: Bug, title: "Pest Management", description: "Disease presence and pest control measures", color: "text-red-500", bg: "bg-red-50", border: "border-red-100", glow: "hover:shadow-red-100" },
    { icon: Thermometer, title: "Environmental Factors", description: "Climate conditions and seasonal variations", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100", glow: "hover:shadow-orange-100" },
  ]

  const outputFeatures = [
    { icon: TrendingUp, title: "Yield Predictions", description: "Accurate forecasts in kg per hectare with confidence intervals", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { icon: BarChart3, title: "Visual Analytics", description: "Interactive charts and data visualization for better insights", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
  ]

  return (
    <section id="features" className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-green-50/30 to-white -z-10" />
      <div className="absolute inset-0 -z-10" style={{
        backgroundImage: 'linear-gradient(#0A4D3C08 1px, transparent 1px), linear-gradient(90deg, #0A4D3C08 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100/80 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            What We Analyze
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
            Comprehensive Agricultural<br />
            <span className="bg-gradient-to-r from-[#0A4D3C] to-emerald-600 bg-clip-text text-transparent">Intelligence</span>
          </h2>
          <p className="text-lg text-gray-500 text-balance max-w-2xl mx-auto">
            Our AI system analyzes multiple agricultural factors to provide accurate, actionable yield predictions.
          </p>
        </div>

        {/* Input parameters */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Input Parameters</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {inputFeatures.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-white border ${feature.border} rounded-2xl p-5 hover:shadow-lg ${feature.glow} hover:-translate-y-1 transition-all duration-300 cursor-default overflow-hidden`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Hover shimmer */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative flex items-start gap-4">
                  <div className={`w-11 h-11 ${feature.bg} border ${feature.border} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-800 group-hover:text-gray-900 transition-colors">{feature.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Output features */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Prediction Results</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {outputFeatures.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-white border ${feature.border} rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${feature.bg} border ${feature.border} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1.5 text-gray-800">{feature.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA banner */}
        <div className="relative bg-gradient-to-br from-[#0A4D3C] via-[#0d5e49] to-[#083D2F] rounded-3xl p-10 text-center text-white overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 text-white/90 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Ready to transform your farm?
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Start Making Smarter Decisions</h2>
            <p className="mb-8 text-white/70 max-w-xl mx-auto leading-relaxed">
              Join thousands of farmers using AI-powered insights. No credit card required to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/predict"
                className="group inline-flex items-center justify-center gap-2 bg-white text-[#0A4D3C] px-7 py-3 rounded-2xl font-bold hover:bg-green-50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 active:scale-95"
              >
                Start Predicting <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/get-started"
                className="group inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-7 py-3 rounded-2xl font-bold hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 active:scale-95"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
