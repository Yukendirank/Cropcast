'use client';

import { PredictionForm } from "@/components/prediction-form"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function PredictPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated());
  }, []);

  return (
    <main className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Crop Yield Prediction</h1>
          <p className="text-xl text-muted-foreground text-balance">
            Enter your crop and environmental data to get AI-powered yield predictions
          </p>
        </div>

        {!isAuthenticated && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 100-2 1 1 0 000 2zm3 1a1 1 0 11-2 0 1 1 0 012 0zm3-1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-800">
                You can use predictions right now without login. <Link href="/signin" className="font-semibold hover:text-blue-900">Sign in to save your results</Link> and access them from your dashboard anytime.
              </p>
            </div>
          </div>
        )}

        <PredictionForm />
      </div>
    </main>
  )
}
