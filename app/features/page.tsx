'use client';

import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/auth';
import { FeatureCard } from '@/components/feature-card';

export default function FeaturesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated());
  }, []);

  const features = [
    {
      title: 'Crop Prediction',
      description: 'Advanced AI models analyze environmental and soil data to provide accurate yield predictions for your crops.',
      icon: '🌾',
      link: '/predict',
      badge: 'Core' as const,
      requiresAuth: false,
    },
    {
      title: 'Weather Insights',
      description: 'Real-time weather data and forecasts integrated into our prediction models for accurate insights.',
      icon: '🌦️',
      link: '/weather',
      badge: 'Core' as const,
      requiresAuth: false,
    },
    {
      title: 'AI Assistant',
      description: 'Get personalized recommendations and answer questions about your farming operations with our AI chatbot.',
      icon: '🤖',
      link: '/chatbot',
      requiresAuth: false,
    },
    {
      title: 'Crop Recommendation',
      description: 'Intelligent crop suggestions based on your location, soil quality, and weather patterns.',
      icon: '🌱',
      link: '/recommend-crop',
      badge: 'New' as const,
      requiresAuth: false,
    },
    {
      title: 'Fertilizer Suggestion',
      description: 'Optimize fertilizer usage with AI-powered recommendations tailored to your specific crops.',
      icon: '🧪',
      link: '/fertilizer',
      badge: 'Beta' as const,
      requiresAuth: false,
    },
    {
      title: 'Prediction History',
      description: 'Access and review all your past predictions and results to track trends over time.',
      icon: '📊',
      link: '/history',
      badge: 'Login Required' as const,
      requiresAuth: true,
    },
  ];

  return (
    <main className="py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A4D3C] mb-4">
            Powerful Features for Better Farming
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Explore all available features and tools to make data-driven decisions for your crops.
          </p>
        </div>

        {/* Info Banner */}
        {!isAuthenticated && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-600 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 100-2 1 1 0 000 2zm3 1a1 1 0 11-2 0 1 1 0 012 0zm3-1a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-800">
                You can explore all features freely.{' '}
                <Link href="/signin" className="font-semibold hover:text-blue-900">
                  Sign in to save your data
                </Link>{' '}
                and access your dashboard.
              </p>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => (
            <FeatureCard key={feature.link} {...feature} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#0A4D3C] to-[#0D5A48] rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
          <p className="mb-6 text-blue-50 max-w-xl mx-auto">
            Start making data-driven decisions today. No credit card required to explore our features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/predict"
              className="bg-white text-[#0A4D3C] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Predicting
            </Link>
            <Link
              href="/get-started"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#0A4D3C] transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
