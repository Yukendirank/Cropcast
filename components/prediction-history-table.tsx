"use client"

import { useState, useMemo } from "react"
import { ArrowUpDown, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"

export interface Prediction {
  id: string
  cropType: string
  soilMoisture: number
  temperature: number
  humidity: number
  rainfall: number
  predictedYield: number
  confidence: number
  createdAt: string
}

interface PredictionHistoryTableProps {
  predictions: Prediction[]
  isLoading?: boolean
}

type SortField = "date" | "crop" | "yield"
type SortOrder = "asc" | "desc"

export function PredictionHistoryTable({
  predictions,
  isLoading = false,
}: PredictionHistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCrop, setSelectedCrop] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const crops = useMemo(
    () => Array.from(new Set(predictions.map((p) => p.cropType))),
    [predictions]
  )

  const filteredAndSorted = useMemo(() => {
    let filtered = predictions.filter((p) => {
      const matchesSearch =
        p.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCrop = selectedCrop === "all" || p.cropType === selectedCrop
      return matchesSearch && matchesCrop
    })

    filtered.sort((a, b) => {
      let aVal: any = a.createdAt
      let bVal: any = b.createdAt

      if (sortField === "crop") {
        aVal = a.cropType
        bVal = b.cropType
      } else if (sortField === "yield") {
        aVal = a.predictedYield
        bVal = b.predictedYield
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase()
        bVal = (bVal as string).toLowerCase()
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }

      return sortOrder === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })

    return filtered
  }, [predictions, searchTerm, selectedCrop, sortField, sortOrder])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const exportCSV = () => {
    const headers = ["ID", "Crop Type", "Soil Moisture", "Temperature", "Humidity", "Rainfall", "Predicted Yield", "Confidence", "Date"]
    const rows = filteredAndSorted.map((p) => [
      p.id,
      p.cropType,
      p.soilMoisture,
      p.temperature,
      p.humidity,
      p.rainfall,
      p.predictedYield.toFixed(2),
      (p.confidence * 100).toFixed(1),
      format(new Date(p.createdAt), "yyyy-MM-dd HH:mm"),
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `predictions-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction History</CardTitle>
        <CardDescription>View and manage your past predictions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:gap-4 flex-1">
            <div className="flex-1">
              <Input
                placeholder="Search by crop type or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All crops</SelectItem>
                {crops.map((crop) => (
                  <SelectItem key={crop} value={crop}>
                    {crop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            disabled={filteredAndSorted.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">
                  <button
                    onClick={() => toggleSort("crop")}
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    Crop Type
                    {sortField === "crop" && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-semibold">Soil Moisture</th>
                <th className="text-left py-3 px-4 font-semibold">Temperature</th>
                <th className="text-left py-3 px-4 font-semibold">Humidity</th>
                <th className="text-left py-3 px-4 font-semibold">
                  <button
                    onClick={() => toggleSort("yield")}
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    Predicted Yield
                    {sortField === "yield" && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-semibold">Confidence</th>
                <th className="text-left py-3 px-4 font-semibold">
                  <button
                    onClick={() => toggleSort("date")}
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    Date
                    {sortField === "date" && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    Loading predictions...
                  </td>
                </tr>
              ) : filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    No predictions found
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((prediction) => (
                  <tr key={prediction.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{prediction.cropType}</td>
                    <td className="py-3 px-4">{prediction.soilMoisture.toFixed(1)}%</td>
                    <td className="py-3 px-4">{prediction.temperature.toFixed(1)}°C</td>
                    <td className="py-3 px-4">{prediction.humidity.toFixed(1)}%</td>
                    <td className="py-3 px-4 font-semibold">{prediction.predictedYield.toFixed(2)} kg/ha</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        prediction.confidence >= 0.8
                          ? "bg-green-100 text-green-800"
                          : prediction.confidence >= 0.6
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {(prediction.confidence * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {format(new Date(prediction.createdAt), "yyyy-MM-dd HH:mm")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredAndSorted.length > 0 && (
          <div className="text-sm text-muted-foreground pt-4">
            Showing {filteredAndSorted.length} of {predictions.length} predictions
          </div>
        )}
      </CardContent>
    </Card>
  )
}
