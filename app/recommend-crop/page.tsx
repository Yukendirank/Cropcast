'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2, Sprout } from 'lucide-react'

interface CropRecommendation {
  cropName: string
  suitability: "Highly Suitable" | "Suitable" | "Moderately Suitable"
  explanation: string
  farmingTips: string[]
  expectedYield?: string
  seasonalAdvice?: string
}

interface RecommendationResponse {
  recommendations: CropRecommendation[]
  bestCrop: string
  generalAdvice: string[]
}

const getSuitabilityColor = (suitability: string) => {
  switch (suitability) {
    case 'Highly Suitable':
      return 'bg-green-50 border-green-200'
    case 'Suitable':
      return 'bg-blue-50 border-blue-200'
    default:
      return 'bg-yellow-50 border-yellow-200'
  }
}

const getSuitabilityBadgeColor = (suitability: string) => {
  switch (suitability) {
    case 'Highly Suitable':
      return 'bg-green-100 text-green-800'
    case 'Suitable':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-yellow-100 text-yellow-800'
  }
}

export default function RecommendCropPage() {
  const [soilType, setSoilType] = useState('')
  const [temperature, setTemperature] = useState('')
  const [rainfall, setRainfall] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RecommendationResponse | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)

    try {
      const response = await fetch('/api/recommend-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soilType,
          temperature: parseFloat(temperature),
          rainfall: parseFloat(rainfall),
          location,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get crop recommendations')
      }

      const data: RecommendationResponse = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A4D3C] mb-4">Crop Recommendation</h1>
          <p className="text-lg text-gray-600">
            Discover the best crops for your location based on soil, climate, and environmental conditions.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Location & Climate</CardTitle>
                <CardDescription>Enter your details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Location */}
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Chennai, India"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>

                  {/* Soil Type */}
                  <div>
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Select value={soilType} onValueChange={setSoilType}>
                      <SelectTrigger id="soilType">
                        <SelectValue placeholder="Select soil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="loamy">Loamy</SelectItem>
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="silty">Silty</SelectItem>
                        <SelectItem value="red">Red Soil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Temperature */}
                  <div>
                    <Label htmlFor="temperature">Avg Temperature (°C)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      placeholder="15-35"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      required
                    />
                  </div>

                  {/* Rainfall */}
                  <div>
                    <Label htmlFor="rainfall">Annual Rainfall (mm)</Label>
                    <Input
                      id="rainfall"
                      type="number"
                      placeholder="500-2000"
                      value={rainfall}
                      onChange={(e) => setRainfall(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || !soilType || !temperature || !rainfall || !location}
                    className="w-full bg-[#0A4D3C] hover:bg-[#083D2F]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sprout className="mr-2 h-4 w-4" />
                        Recommend Crops
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          {result && (
            <div className="lg:col-span-3 space-y-6">
              {/* Best Crop Highlight */}
              <Card className="border-[#0A4D3C] border-2">
                <CardHeader className="bg-[#0A4D3C] text-white rounded-t-lg">
                  <CardTitle className="text-2xl">Best Recommendation</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-[#0A4D3C] mb-4">{result.bestCrop}</p>
                  <p className="text-gray-700">
                    Based on the soil type, temperature, and rainfall patterns, {result.bestCrop} is the most suitable
                    crop for your region.
                  </p>
                </CardContent>
              </Card>

              {/* General Advice */}
              {result.generalAdvice && (
                <Card>
                  <CardHeader>
                    <CardTitle>General Advice</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.generalAdvice.map((advice, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="text-[#0A4D3C] font-bold">→</span>
                          <span className="text-gray-700">{advice}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* All Recommendations */}
              <div>
                <h3 className="text-xl font-bold text-[#0A4D3C] mb-4">All Recommendations</h3>
                <div className="space-y-4">
                  {result.recommendations.map((crop, idx) => (
                    <Card key={idx} className={`border-2 ${getSuitabilityColor(crop.suitability)}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="text-xl font-bold text-[#0A4D3C]">{crop.cropName}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSuitabilityBadgeColor(crop.suitability)}`}>
                            {crop.suitability}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-4">{crop.explanation}</p>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-semibold text-[#0A4D3C] mb-2">Farming Tips</h5>
                            <ul className="space-y-1">
                              {crop.farmingTips.map((tip, i) => (
                                <li key={i} className="text-sm text-gray-700 flex gap-2">
                                  <span className="text-[#0A4D3C]">•</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            {crop.expectedYield && (
                              <div>
                                <h5 className="font-semibold text-[#0A4D3C] mb-1">Expected Yield</h5>
                                <p className="text-sm text-gray-700">{crop.expectedYield}</p>
                              </div>
                            )}
                            {crop.seasonalAdvice && (
                              <div>
                                <h5 className="font-semibold text-[#0A4D3C] mb-1">Best Season</h5>
                                <p className="text-sm text-gray-700">{crop.seasonalAdvice}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
