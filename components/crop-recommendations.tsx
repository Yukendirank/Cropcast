"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getRecommendations, getAllCrops, type CropRecommendation } from "@/lib/crop-recommendations"
import { Leaf, TrendingUp, AlertCircle, CheckCircle2, Search } from "lucide-react"

interface CropRecommendationsProps {
  temperature: number
  soilMoisture: number
  rainfall: number
  onSelectCrop?: (crop: string) => void
}

export function CropRecommendations({
  temperature,
  soilMoisture,
  rainfall,
  onSelectCrop,
}: CropRecommendationsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewAll, setViewAll] = useState(false)

  const recommendations = useMemo(
    () => getRecommendations(temperature, soilMoisture, rainfall),
    [temperature, soilMoisture, rainfall]
  )

  const allCrops = useMemo(() => getAllCrops(), [])

  const cropsToDisplay = viewAll
    ? allCrops.filter((crop) =>
        crop.cropName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : recommendations

  const getSuitabilityColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800"
    if (score >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getSuitabilityLabel = (score: number) => {
    if (score >= 80) return "Highly Suitable"
    if (score >= 60) return "Moderately Suitable"
    return "Less Suitable"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recommended Crops</CardTitle>
          <CardDescription>
            Based on your climate and soil conditions:
            Temperature: {temperature.toFixed(1)}°C | Soil Moisture: {soilMoisture.toFixed(1)}% |
            Rainfall: {rainfall.toFixed(1)}mm
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!viewAll && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {recommendations.map((crop) => (
                <button
                  key={crop.cropName}
                  onClick={() => onSelectCrop?.(crop.cropName)}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm">{crop.cropName}</h3>
                    <Badge className={`text-xs ${getSuitabilityColor(crop.suitability)}`}>
                      {crop.suitability.toFixed(0)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {getSuitabilityLabel(crop.suitability)}
                  </p>
                  <p className="text-xs text-muted-foreground">{crop.season}</p>
                </button>
              ))}
            </div>
          )}

          {viewAll && (
            <>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search crops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {cropsToDisplay.map((crop) => (
                  <div
                    key={crop.cropName}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{crop.cropName}</h3>
                        <p className="text-sm text-muted-foreground">{crop.season}</p>
                      </div>
                      <Badge className={getSuitabilityColor(crop.suitability)}>
                        {crop.suitability.toFixed(0)}%
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-3 text-sm">
                      <p className="text-xs">
                        Temperature: {crop.temperature.min}°C - {crop.temperature.max}°C
                      </p>
                      <p className="text-xs">
                        Soil Moisture: {crop.soilMoisture.min}% - {crop.soilMoisture.max}%
                      </p>
                      <p className="text-xs">
                        Rainfall: {crop.rainfall.min}mm - {crop.rainfall.max}mm
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-green-700 flex items-center gap-1 mb-1">
                          <CheckCircle2 className="h-3 w-3" /> Benefits
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {crop.benefits.slice(0, 2).map((benefit, i) => (
                            <li key={i}>• {benefit}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-red-700 flex items-center gap-1 mb-1">
                          <AlertCircle className="h-3 w-3" /> Risks
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {crop.risks.map((risk, i) => (
                            <li key={i}>• {risk}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => onSelectCrop?.(crop.cropName)}
                    >
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewAll(!viewAll)}
            >
              {viewAll ? "Show Top 5" : "View All Crops"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Top Recommendation: {recommendations[0].cropName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" /> Benefits
                </h4>
                <ul className="space-y-1">
                  {recommendations[0].benefits.map((benefit, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      • {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" /> Risks
                </h4>
                <ul className="space-y-1">
                  {recommendations[0].risks.map((risk, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      • {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" /> Optimal Conditions
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Temperature</p>
                  <p className="font-semibold text-sm">
                    {recommendations[0].temperature.min}°C -{" "}
                    {recommendations[0].temperature.max}°C
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Soil Moisture</p>
                  <p className="font-semibold text-sm">
                    {recommendations[0].soilMoisture.min}% -{" "}
                    {recommendations[0].soilMoisture.max}%
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Rainfall</p>
                  <p className="font-semibold text-sm">
                    {recommendations[0].rainfall.min}mm -{" "}
                    {recommendations[0].rainfall.max}mm
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
