'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/auth';
import { FeatureCard } from '@/components/feature-card';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FeaturesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated());
  }, []);

  const features = [
    { title: 'Crop Prediction', description: 'Advanced AI models analyze environmental and soil data to provide accurate yield predictions for your crops.', icon: '🌾', link: '/predict', badge: 'Core' as const, requiresAuth: false },
    { title: 'Weather Insights', description: 'Real-time weather data and forecasts integrated into our prediction models for accurate insights.', icon: '🌦️', link: '/weather', badge: 'Core' as const, requiresAuth: false },
    { title: 'AI Assistant', description: 'Get personalized recommendations and answer questions about your farming operations with our AI chatbot.', icon: '🤖', link: '/chatbot', requiresAuth: false },
    { title: 'Crop Recommendation', description: 'Intelligent crop suggestions based on your location, soil quality, and weather patterns.', icon: '🌱', link: '/recommend-crop', badge: 'New' as const, requiresAuth: false },
    { title: 'Fertilizer Suggestion', description: 'Optimize fertilizer usage with AI-powered recommendations tailored to your specific crops.', icon: '🧪', link: '/fertilizer', badge: 'Beta' as const, requiresAuth: false },
    { title: 'Prediction History', description: 'Access and review all your past predictions and results to track trends over time.', icon: '📊', link: '/history', badge: 'Login Required' as const, requiresAuth: true },
  ];

  return (
    <main className="relative min-h-screen">
      {/* Page background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 via-white to-white" />
        <div className="absolute inset-0 opacity-[0.018]" style={{
          backgroundImage: 'radial-gradient(circle, #0A4D3C 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />
      </div>

      <div className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">

          {/* Hero header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-green-100/80 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
              <Sparkles className="w-3 h-3" /> All Features
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Powerful Tools for<br />
              <span className="bg-gradient-to-r from-[#0A4D3C] to-emerald-600 bg-clip-text text-transparent">Better Farming</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Explore all available features and tools to make data-driven decisions for your crops.
            </p>
          </div>

          {/* Auth banner */}
          {!isAuthenticated && (
            <div className="mb-10 bg-blue-50 border border-blue-200/80 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">ℹ️</span>
              </div>
              <p className="text-sm text-blue-800 flex-1">
                All features are available to explore freely.{' '}
                <Link href="/signin" className="font-bold underline underline-offset-2 hover:text-blue-900 transition-colors">
                  Sign in
                </Link>{' '}
                to save your data and access your personal dashboard.
              </p>
            </div>
          )}

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {features.map((feature) => (
              <FeatureCard key={feature.link} {...feature} />
            ))}
          </div>

          {/* CTA Section */}
          <div className="relative bg-gradient-to-br from-[#0A4D3C] via-[#0d5e49] to-[#083D2F] rounded-3xl p-10 text-center text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Get Started?</h2>
              <p className="mb-8 text-white/70 max-w-xl mx-auto">
                Start making data-driven decisions today. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/predict" className="group inline-flex items-center justify-center gap-2 bg-white text-[#0A4D3C] px-7 py-3 rounded-2xl font-bold hover:bg-green-50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 active:scale-95">
                  Start Predicting <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/get-started" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-7 py-3 rounded-2xl font-bold hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 active:scale-95">
                  Create Account
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
