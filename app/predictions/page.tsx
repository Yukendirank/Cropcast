"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { PredictionHistoryTable, type Prediction } from "@/components/prediction-history-table"
import { PredictionStats, type PredictionStats as PredictionStatsType } from "@/components/prediction-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [stats, setStats] = useState<PredictionStatsType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await apiClient.request<Prediction[]>("/api/predictions")
        const predictionsData = Array.isArray(response) ? response : response?.data || []

        setPredictions(predictionsData)

        // Calculate stats
        if (predictionsData.length > 0) {
          const totalPredictions = predictionsData.length
          const averageYield =
            predictionsData.reduce((sum, p) => sum + p.predictedYield, 0) / totalPredictions
          const bestYield = Math.max(...predictionsData.map((p) => p.predictedYield))
          const averageConfidence =
            predictionsData.reduce((sum, p) => sum + p.confidence, 0) / totalPredictions

          setStats({
            totalPredictions,
            averageYield,
            bestYield,
            averageConfidence,
          })
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load predictions"
        setError(errorMessage)
        console.error("[v0] Error loading predictions:", errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPredictions()
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12 px-4">
          <div className="container mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Predictions</h1>
              <p className="text-xl text-muted-foreground">
                Track all your crop yield predictions and analytics
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">Loading your predictions...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {predictions.length > 0 && stats && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Statistics</h2>
                      <PredictionStats stats={stats} />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold mb-4">History</h2>
                      <PredictionHistoryTable predictions={predictions} isLoading={false} />
                    </div>
                  </div>
                )}

                {predictions.length === 0 && !error && (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Predictions Yet</CardTitle>
                      <CardDescription>
                        Start by making a prediction to see your history here
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
