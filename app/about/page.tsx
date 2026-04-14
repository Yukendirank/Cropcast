import Link from 'next/link';
import { Leaf, Cpu, Lightbulb, Users, ArrowRight, Zap, Shield } from 'lucide-react';

export default function AboutPage() {
  const steps = [
    { icon: Cpu, title: 'Data Collection', description: 'We analyze multiple factors including soil conditions, weather patterns, and historical yield data from across India.', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { icon: Zap, title: 'AI Processing', description: 'Our advanced Gemini AI models process this data to generate accurate, real-time yield predictions and recommendations.', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { icon: Lightbulb, title: 'Actionable Insights', description: 'Receive detailed reports and clear recommendations to optimize your farming decisions and maximize yield.', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
  ];

  const stats = [
    { value: '95%+', label: 'Prediction Accuracy' },
    { value: '5+', label: 'AI-Powered Tools' },
    { value: '10K+', label: 'Farmers Served' },
    { value: '50+', label: 'Crop Varieties' },
  ];

  return (
    <main className="relative min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/40 via-white to-white" />
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-br from-green-100/40 to-transparent" />
      </div>

      <div className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">

          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
              <Leaf className="w-3 h-3" /> Our Story
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-5 leading-tight">
              About <span className="bg-gradient-to-r from-[#0A4D3C] to-emerald-600 bg-clip-text text-transparent">CropCast</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              We're on a mission to revolutionize agriculture through advanced AI technology, giving every farmer access to data-driven insights.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map(({ value, label }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="text-3xl font-bold text-[#0A4D3C] mb-1 group-hover:scale-110 transition-transform duration-300">{value}</div>
                <div className="text-xs text-gray-500 font-medium">{label}</div>
              </div>
            ))}
          </div>

          {/* Mission */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 mb-8 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-green-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">
              CropCast is dedicated to revolutionizing agriculture through advanced AI technology.
              We provide farmers and agricultural professionals with precise yield predictions and
              analytical insights to optimize their farming operations — making expert-level knowledge
              accessible to every farmer, regardless of farm size.
            </p>
          </div>

          {/* How it works */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How CropCast Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {steps.map(({ icon: Icon, title, description, color, bg, border }, i) => (
                <div key={title} className={`group relative bg-white border ${border} rounded-3xl p-6 hover:shadow-lg hover:-translate-y-2 transition-all duration-300`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${bg} border ${border} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-gray-300">0{i + 1}</span>
                        <h3 className="font-bold text-gray-900">{title}</h3>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div className="bg-gradient-to-br from-[#0A4D3C] to-[#083D2F] rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-300" />
                <h2 className="text-xl font-bold">Built with Cutting-Edge Technology</h2>
              </div>
              <p className="text-white/70 mb-6 leading-relaxed">
                CropCast is powered by Google Gemini AI, OpenWeatherMap data, and trained machine learning models
                specifically designed for Indian agricultural conditions and crop varieties.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Google Gemini AI', 'OpenWeatherMap', 'Next.js', 'Machine Learning', 'Real-time Data'].map(tech => (
                  <span key={tech} className="bg-white/15 border border-white/20 text-white/90 text-xs font-semibold px-4 py-2 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/predict"
              className="group inline-flex items-center gap-2 bg-[#0A4D3C] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-900/25 hover:shadow-2xl hover:shadow-green-900/30 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 overflow-hidden relative"
            >
              <span className="relative z-10">Try CropCast Now</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
