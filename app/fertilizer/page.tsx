'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2, Zap } from 'lucide-react'

interface FertilizerResponse {
  fertilizerName: string
  npkRatio: string
  usageInstructions: string[]
  applicationRate: string
  tips: string[]
  warnings: string[]
  improvementTips: string[]
}

export default function FertilizerPage() {
  const [nitrogen, setNitrogen] = useState('')
  const [phosphorus, setPhosphorus] = useState('')
  const [potassium, setKotassium] = useState('')
  const [cropType, setCropType] = useState('')
  const [soilType, setSoilType] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FertilizerResponse | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)

    try {
      const response = await fetch('/api/fertilizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nitrogen: parseFloat(nitrogen),
          phosphorus: parseFloat(phosphorus),
          potassium: parseFloat(potassium),
          cropType,
          soilType,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get fertilizer recommendation')
      }

      const data: FertilizerResponse = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Determine nutrient levels
  const getNLevel = (n: number) => (n < 100 ? 'Low' : n < 200 ? 'Medium' : 'High')
  const getPLevel = (p: number) => (p < 20 ? 'Low' : p < 40 ? 'Medium' : 'High')
  const getKLevel = (k: number) => (k < 100 ? 'Low' : k < 200 ? 'Medium' : 'High')

  return (
    <main className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A4D3C] mb-4">Fertilizer Suggestion</h1>
          <p className="text-lg text-gray-600">
            Get personalized fertilizer recommendations based on your soil nutrients and crop type.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Input Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Soil Nutrient Analysis</CardTitle>
                <CardDescription>Enter your soil test results and crop information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* NPK Inputs */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="nitrogen">Nitrogen (mg/kg)</Label>
                      <Input
                        id="nitrogen"
                        type="number"
                        placeholder="0-300"
                        value={nitrogen}
                        onChange={(e) => setNitrogen(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phosphorus">Phosphorus (mg/kg)</Label>
                      <Input
                        id="phosphorus"
                        type="number"
                        placeholder="0-100"
                        value={phosphorus}
                        onChange={(e) => setPhosphorus(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="potassium">Potassium (mg/kg)</Label>
                      <Input
                        id="potassium"
                        type="number"
                        placeholder="0-300"
                        value={potassium}
                        onChange={(e) => setKotassium(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Crop Type */}
                  <div>
                    <Label htmlFor="cropType">Crop Type</Label>
                    <Select value={cropType} onValueChange={setCropType}>
                      <SelectTrigger id="cropType">
                        <SelectValue placeholder="Select crop type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="corn">Corn</SelectItem>
                        <SelectItem value="sugarcane">Sugarcane</SelectItem>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                        <SelectItem value="groundnut">Groundnut</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Soil Type */}
                  <div>
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Select value={soilType} onValueChange={setSoilType}>
                      <SelectTrigger id="soilType">
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="loamy">Loamy</SelectItem>
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="silty">Silty</SelectItem>
                        <SelectItem value="clayLoam">Clay Loam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || !nitrogen || !phosphorus || !potassium || !cropType || !soilType}
                    className="w-full bg-[#0A4D3C] hover:bg-[#083D2F]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Get Recommendation
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Nutrient Status Card */}
          {nitrogen || phosphorus || potassium ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nutrient Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {nitrogen && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Nitrogen</span>
                      <span className="text-sm">{getNLevel(parseFloat(nitrogen))}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          getNLevel(parseFloat(nitrogen)) === 'Low'
                            ? 'bg-red-500'
                            : getNLevel(parseFloat(nitrogen)) === 'Medium'
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((parseFloat(nitrogen) / 250) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {phosphorus && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Phosphorus</span>
                      <span className="text-sm">{getPLevel(parseFloat(phosphorus))}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          getPLevel(parseFloat(phosphorus)) === 'Low'
                            ? 'bg-red-500'
                            : getPLevel(parseFloat(phosphorus)) === 'Medium'
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((parseFloat(phosphorus) / 50) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {potassium && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Potassium</span>
                      <span className="text-sm">{getKLevel(parseFloat(potassium))}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          getKLevel(parseFloat(potassium)) === 'Low'
                            ? 'bg-red-500'
                            : getKLevel(parseFloat(potassium)) === 'Medium'
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((parseFloat(potassium) / 250) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Main Recommendation */}
            <Card className="border-[#0A4D3C] border-2">
              <CardHeader className="bg-[#0A4D3C] text-white rounded-t-lg">
                <CardTitle className="text-2xl">{result.fertilizerName}</CardTitle>
                <CardDescription className="text-blue-100">NPK Ratio: {result.npkRatio}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-[#0A4D3C]">Application Rate</h4>
                    <p className="text-lg text-gray-700">{result.applicationRate}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-[#0A4D3C]">Usage Instructions</h4>
                    <ul className="space-y-2">
                      {result.usageInstructions.map((instruction, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-[#0A4D3C] font-bold">{idx + 1}.</span>
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best Practices */}
            {result.tips && result.tips.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.tips.map((tip, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-[#0A4D3C] font-bold">✓</span>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Warnings */}
            {result.warnings && result.warnings.length > 0 && (
              <Alert className="border-yellow-300 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="ml-2 text-yellow-800">
                  <strong>Important Notes:</strong>
                  <ul className="mt-2 space-y-1">
                    {result.warnings.map((warning, idx) => (
                      <li key={idx} className="text-sm">
                        • {warning}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Improvement Tips */}
            {result.improvementTips && result.improvementTips.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Improvement Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.improvementTips.map((tip, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-[#0A4D3C] font-bold">→</span>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
