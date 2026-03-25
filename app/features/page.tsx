'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/auth';

export default function FeaturesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated());
  }, []);
  const features = [
    {
      title: "AI-Powered Predictions",
      description: "Advanced machine learning models analyze multiple data points to provide accurate yield predictions.",
      icon: "🤖"
    },
    {
      title: "Weather Integration",
      description: "Real-time weather data and forecasts are incorporated into our prediction models.",
      icon: "🌤️"
    },
    {
      title: "Soil Analysis",
      description: "Comprehensive soil quality assessment and recommendations for optimal crop growth.",
      icon: "🌱"
    },
    {
      title: "Historical Data Analysis",
      description: "Learn from past yields and patterns to improve future farming decisions.",
      icon: "📊"
    },
    {
      title: "Custom Reports",
      description: "Generate detailed reports tailored to your specific crops and location.",
      icon: "📑"
    },
    {
      title: "Mobile Accessibility",
      description: "Access your predictions and insights anywhere, anytime from any device.",
      icon: "📱"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-[#0A4D3C] text-center mb-8">Features</h1>
      
      {!isAuthenticated && (
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 100-2 1 1 0 000 2zm3 1a1 1 0 11-2 0 1 1 0 012 0zm3-1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-blue-800">
              You can explore all features freely. <Link href="/signin" className="font-semibold hover:text-blue-900">Sign in to save your data</Link> and access your dashboard.
            </p>
          </div>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-[#0A4D3C] mb-2">{feature.title}</h3>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link 
          href="/predict" 
          className="bg-[#0A4D3C] text-white px-8 py-4 rounded-lg hover:bg-[#083D2F] transition-colors inline-block"
        >
          Start Predicting
        </Link>
      </div>
    </div>
  );
}
