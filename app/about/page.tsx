import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-[#0A4D3C] mb-6">About CropCast</h1>
      
      <div className="grid gap-8">
        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-[#0A4D3C] mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            CropCast is dedicated to revolutionizing agriculture through advanced AI technology. 
            We provide farmers and agricultural professionals with precise yield predictions and 
            analytical insights to optimize their farming operations.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-[#0A4D3C] mb-4">How It Works</h2>
          <div className="grid gap-4">
            <div className="border-l-4 border-[#0A4D3C] pl-4">
              <h3 className="font-semibold text-lg">Data Collection</h3>
              <p className="text-gray-700">We analyze multiple factors including soil conditions, weather patterns, and historical yield data.</p>
            </div>
            <div className="border-l-4 border-[#0A4D3C] pl-4">
              <h3 className="font-semibold text-lg">AI Processing</h3>
              <p className="text-gray-700">Our advanced AI models process this data to generate accurate yield predictions.</p>
            </div>
            <div className="border-l-4 border-[#0A4D3C] pl-4">
              <h3 className="font-semibold text-lg">Actionable Insights</h3>
              <p className="text-gray-700">Receive detailed reports and recommendations to optimize your farming decisions.</p>
            </div>
          </div>
        </section>

        <div className="text-center mt-8">
          <Link 
            href="/predict" 
            className="bg-[#0A4D3C] text-white px-6 py-3 rounded-lg hover:bg-[#083D2F] transition-colors"
          >
            Try CropCast Now
          </Link>
        </div>
      </div>
    </div>
  );
}