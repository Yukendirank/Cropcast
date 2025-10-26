import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#0A4D3C] text-center mb-6">Sign In to CropCast</h1>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4D3C]"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4D3C]"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-[#0A4D3C] focus:ring-[#0A4D3C] border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-[#0A4D3C] hover:text-[#083D2F]">
              Forgot password?
            </a>
          </div>

          <Button className="w-full bg-[#0A4D3C] text-white py-2 rounded-md hover:bg-[#083D2F] transition-colors">
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/get-started" className="text-[#0A4D3C] hover:text-[#083D2F] font-semibold">
              Get Started
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}