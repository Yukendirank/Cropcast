"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getFertilizerRecommendations,
  createFertilizerSchedule,
  calculateFertilizerCost,
  type FertilizerRecommendation,
} from "@/lib/fertilizer-recommendations"
import { Leaf, Calendar, DollarSign, Beaker } from "lucide-react"

interface FertilizerRecommendationsProps {
  cropType: string
  areaHectares?: number
  organicPreference?: boolean
}

export function FertilizerRecommendations({
  cropType,
  areaHectares = 1,
  organicPreference = false,
}: FertilizerRecommendationsProps) {
  const [selectedFertilizer, setSelectedFertilizer] = useState<FertilizerRecommendation | null>(
    null
  )

  const recommendations = useMemo(
    () =>
      getFertilizerRecommendations({
        cropType,
        organicPreference,
      }),
    [cropType, organicPreference]
  )

  const schedule = useMemo(() => createFertilizerSchedule(cropType, areaHectares), [cropType, areaHectares])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "NPK":
        return "bg-blue-100 text-blue-800"
      case "Organic":
        return "bg-green-100 text-green-800"
      case "Micronutrient":
        return "bg-purple-100 text-purple-800"
      case "Bio":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Recommended Fertilizers for {cropType}
          </CardTitle>
          <CardDescription>
            Based on your crop type and preferences
            {organicPreference && " (Organic only)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recommendations" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.slice(0, 4).map((fert) => (
                  <button
                    key={fert.fertilizerName}
                    onClick={() => setSelectedFertilizer(fert)}
                    className={`p-4 border rounded-lg text-left transition-all ${
                      selectedFertilizer?.fertilizerName === fert.fertilizerName
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{fert.fertilizerName}</h3>
                      <Badge className={getTypeColor(fert.type)}>{fert.type}</Badge>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground mb-3">
                      <p>N: {fert.nContent}% | P: {fert.pContent}% | K: {fert.kContent}%</p>
                      <p>Dosage: {fert.dosage} kg/ha</p>
                      <p>Cost: {fert.costPerKg} per kg</p>
                    </div>

                    <div className="flex gap-2">
                      {fert.organicFriendly && (
                        <Badge variant="outline" className="text-xs">
                          Organic
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {fert.compatibility.length === 1 && fert.compatibility[0] === "All crops"
                          ? "All crops"
                          : `${fert.compatibility.length} crops`}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>

              {recommendations.length > 4 && (
                <div className="text-sm text-muted-foreground text-center pt-2">
                  +{recommendations.length - 4} more recommendations available
                </div>
              )}
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div className="space-y-3">
                {schedule.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          {item.stage}
                        </h4>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Fertilizer:</span> {item.fertilizer}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Dosage:</span> {item.dosage}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Estimated Cost
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Based on {areaHectares} hectare(s) of land:
                </p>
                <div className="space-y-1">
                  {recommendations.slice(0, 3).map((fert) => (
                    <div key={fert.fertilizerName} className="flex justify-between text-sm">
                      <span>{fert.fertilizerName}</span>
                      <span className="font-semibold">
                        ${calculateFertilizerCost(fert, areaHectares).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              {selectedFertilizer ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Beaker className="h-5 w-5" />
                        {selectedFertilizer.fertilizerName}
                      </h3>
                      <Badge className={`mt-2 ${getTypeColor(selectedFertilizer.type)}`}>
                        {selectedFertilizer.type}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 bg-muted rounded">
                        <p className="text-xs text-muted-foreground">Nitrogen (N)</p>
                        <p className="text-lg font-semibold">{selectedFertilizer.nContent}%</p>
                      </div>
                      <div className="p-3 bg-muted rounded">
                        <p className="text-xs text-muted-foreground">Phosphorus (P)</p>
                        <p className="text-lg font-semibold">{selectedFertilizer.pContent}%</p>
                      </div>
                      <div className="p-3 bg-muted rounded">
                        <p className="text-xs text-muted-foreground">Potassium (K)</p>
                        <p className="text-lg font-semibold">{selectedFertilizer.kContent}%</p>
                      </div>
                      <div className="p-3 bg-muted rounded">
                        <p className="text-xs text-muted-foreground">Cost/kg</p>
                        <p className="text-lg font-semibold">${selectedFertilizer.costPerKg}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Application Details</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Dosage:</span> {selectedFertilizer.dosage} kg/hectare
                          </p>
                          <p>
                            <span className="font-medium">Timing:</span> {selectedFertilizer.timing}
                          </p>
                          <p>
                            <span className="font-medium">Application:</span>{" "}
                            {selectedFertilizer.application}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Benefits</h4>
                        <ul className="text-sm space-y-1">
                          {selectedFertilizer.benefits.map((benefit, i) => (
                            <li key={i} className="text-muted-foreground">
                              • {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Compatible Crops</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedFertilizer.compatibility.slice(0, 5).map((crop) => (
                            <Badge key={crop} variant="outline" className="text-xs">
                              {crop}
                            </Badge>
                          ))}
                          {selectedFertilizer.compatibility.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{selectedFertilizer.compatibility.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Select a fertilizer from the Recommendations tab to view details</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
