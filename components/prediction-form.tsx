"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CloudRain, TestTube, Droplets, Sprout, Bug, Loader2, AlertCircle } from "lucide-react"
import { PredictionResults } from "./prediction-results"
import { transformFormDataToAPI, type PredictionResponse } from "@/lib/gemini-api"
import { LocationDataEntry } from "./location-data-entry"

interface PredictionData {
  rainfall: string
  temperature: string
  humidity: string
  soilType: string
  soilPh: string
  fertilizerUse: string
  irrigation: string
  pestControl: boolean
  cropVariety: string
  diseasePresence: boolean
}

export function PredictionForm() {
  const [formData, setFormData] = useState<PredictionData>({
    rainfall: "",
    temperature: "",
    humidity: "",
    soilType: "",
    soilPh: "",
    fertilizerUse: "",
    irrigation: "",
    pestControl: false,
    cropVariety: "",
    diseasePresence: false,
  })

  const [entryMethod, setEntryMethod] = useState<"manual" | "location">("manual")
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof PredictionData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError(null)
  }

  const handleLocationDataFetched = (locationData: {
    rainfall: string
    temperature: string
    humidity: string
    soilType: string
    soilPh: string
  }) => {
    setFormData((prev) => ({
      ...prev,
      rainfall: locationData.rainfall,
      temperature: locationData.temperature,
      humidity: locationData.humidity,
      soilType: locationData.soilType,
      soilPh: locationData.soilPh,
    }))
    setEntryMethod("manual")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const apiData = transformFormDataToAPI(formData)

      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        throw new Error("Prediction failed")
      }

      const result: PredictionResponse = await response.json()
      setPrediction(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Alert>
        <Sprout className="h-4 w-4" />
        <AlertDescription>
          Powered by Google Gemini AI for advanced crop yield predictions with personalized recommendations.
        </AlertDescription>
      </Alert>

      <div className="flex gap-4">
        <Button
          type="button"
          variant={entryMethod === "manual" ? "default" : "outline"}
          onClick={() => setEntryMethod("manual")}
          className="flex-1"
        >
          Manual Entry
        </Button>
        <Button
          type="button"
          variant={entryMethod === "location" ? "default" : "outline"}
          onClick={() => setEntryMethod("location")}
          className="flex-1"
        >
          Use My Location
        </Button>
      </div>

      {entryMethod === "location" && (
        <LocationDataEntry onDataFetched={handleLocationDataFetched} isLoading={isLoading} />
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Weather Data Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-primary" />
              Weather Conditions
            </CardTitle>
            <CardDescription>Enter the weather data for your growing region</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="rainfall">Rainfall (mm)</Label>
                <Input
                  id="rainfall"
                  type="number"
                  placeholder="120"
                  value={formData.rainfall}
                  onChange={(e) => handleInputChange("rainfall", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  placeholder="28"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange("temperature", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="humidity">Humidity (%)</Label>
                <Input
                  id="humidity"
                  type="number"
                  placeholder="65"
                  value={formData.humidity}
                  onChange={(e) => handleInputChange("humidity", e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Soil Properties Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5 text-secondary" />
              Soil Properties
            </CardTitle>
            <CardDescription>Provide information about your soil conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="soilType">Soil Type</Label>
                <Select value={formData.soilType} onValueChange={(value) => handleInputChange("soilType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="loamy">Loamy</SelectItem>
                    <SelectItem value="sandy">Sandy</SelectItem>
                    <SelectItem value="silty">Silty</SelectItem>
                    <SelectItem value="peaty">Peaty</SelectItem>
                    <SelectItem value="chalky">Chalky</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="soilPh">Soil pH Level</Label>
                <Input
                  id="soilPh"
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  placeholder="6.8"
                  value={formData.soilPh}
                  onChange={(e) => handleInputChange("soilPh", e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crop Management Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-accent" />
              Crop Management
            </CardTitle>
            <CardDescription>Details about your farming practices and crop variety</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cropVariety">Crop Variety</Label>
                <Select value={formData.cropVariety} onValueChange={(value) => handleInputChange("cropVariety", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop variety" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hybrid-maize">Hybrid Maize</SelectItem>
                    <SelectItem value="traditional-maize">Traditional Maize</SelectItem>
                    <SelectItem value="hybrid-wheat">Hybrid Wheat</SelectItem>
                    <SelectItem value="traditional-wheat">Traditional Wheat</SelectItem>
                    <SelectItem value="hybrid-rice">Hybrid Rice</SelectItem>
                    <SelectItem value="traditional-rice">Traditional Rice</SelectItem>
                    <SelectItem value="soybeans">Soybeans</SelectItem>
                    <SelectItem value="cotton">Cotton</SelectItem>
                    <SelectItem value="barley">Barley</SelectItem>
                    <SelectItem value="oats">Oats</SelectItem>
                    <SelectItem value="rye">Rye</SelectItem>
                    <SelectItem value="millet">Millet</SelectItem>
                    <SelectItem value="sorghum">Sorghum</SelectItem>
                    <SelectItem value="chickpea">Chickpea</SelectItem>
                    <SelectItem value="lentil">Lentil</SelectItem>
                    <SelectItem value="peanut">Peanut</SelectItem>
                    <SelectItem value="sunflower">Sunflower</SelectItem>
                    <SelectItem value="canola">Canola</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fertilizerUse">Fertilizer Use</Label>
                <Select
                  value={formData.fertilizerUse}
                  onValueChange={(value) => handleInputChange("fertilizerUse", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fertilizer level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="irrigation">Irrigation Method</Label>
                <Select value={formData.irrigation} onValueChange={(value) => handleInputChange("irrigation", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select irrigation method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Rain-fed</SelectItem>
                    <SelectItem value="flood">Flood Irrigation</SelectItem>
                    <SelectItem value="drip">Drip Irrigation</SelectItem>
                    <SelectItem value="sprinkler">Sprinkler System</SelectItem>
                    <SelectItem value="furrow">Furrow Irrigation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pestControl"
                  checked={formData.pestControl}
                  onCheckedChange={(checked) => handleInputChange("pestControl", checked as boolean)}
                />
                <Label htmlFor="pestControl" className="flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Pest control measures applied
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="diseasePresence"
                  checked={formData.diseasePresence}
                  onCheckedChange={(checked) => handleInputChange("diseasePresence", checked as boolean)}
                />
                <Label htmlFor="diseasePresence" className="flex items-center gap-2">
                  <Bug className="w-4 h-4" />
                  Disease presence detected
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing Data...
            </>
          ) : (
            "Predict Crop Yield"
          )}
        </Button>
      </form>

      {prediction && (
        <PredictionResults
          prediction={prediction.predicted_yield_kg_per_hectare}
          confidence={prediction.confidence_score}
          formData={formData}
          recommendations={prediction.recommendations}
          riskFactors={prediction.risk_factors}
        />
      )}
    </div>
  )
}
