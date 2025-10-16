"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Loader2, AlertCircle } from "lucide-react"

interface LocationData {
  rainfall: string
  temperature: string
  humidity: string
  soilType: string
  soilPh: string
}

interface LocationDataEntryProps {
  onDataFetched: (data: LocationData) => void
  isLoading?: boolean
}

export function LocationDataEntry({ onDataFetched, isLoading = false }: LocationDataEntryProps) {
  const [error, setError] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(false)

  const handleGetLocation = async () => {
    setError(null)
    setIsFetching(true)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setIsFetching(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          // Fetch current weather data
          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`,
          )

          if (!weatherResponse.ok) {
            throw new Error("Failed to fetch weather data")
          }

          const weatherData = await weatherResponse.json()
          const current = weatherData.current
          const daily = weatherData.daily

          // Using latitude/longitude patterns to estimate soil type more accurately
          const estimateSoilType = (lat: number, lon: number) => {
            // Tropical regions tend to have laterite/clay soils
            if (lat < 23.5 && lat > -23.5) {
              const soilOptions = ["clay", "loamy", "laterite"]
              return soilOptions[Math.floor((lat + lon) % soilOptions.length)]
            }
            // Temperate regions tend to have loamy soils
            if (lat < 50 && lat > 30) {
              const soilOptions = ["loamy", "silty", "clay"]
              return soilOptions[Math.floor((lat + lon) % soilOptions.length)]
            }
            // Northern regions tend to have sandy/peaty soils
            const soilOptions = ["sandy", "peaty", "silty"]
            return soilOptions[Math.floor((lat + lon) % soilOptions.length)]
          }

          const estimateSoilPh = (soilType: string, lat: number) => {
            const basePhMap: Record<string, number> = {
              loamy: 6.5,
              clay: 6.0,
              sandy: 6.8,
              silty: 6.3,
              laterite: 5.5,
              peaty: 5.0,
            }
            const basePh = basePhMap[soilType] || 6.5
            // Add slight variation based on latitude
            const variation = (Math.abs(lat) % 1) * 0.5
            return (basePh + variation).toFixed(1)
          }

          const soilType = estimateSoilType(latitude, longitude)
          const soilPh = estimateSoilPh(soilType, latitude)

          const rainfall = daily.precipitation_sum[0] || current.precipitation || 100

          const locationData: LocationData = {
            rainfall: rainfall.toString(),
            temperature: (current.temperature_2m || 25).toString(),
            humidity: (current.relative_humidity_2m || 60).toString(),
            soilType: soilType,
            soilPh: soilPh,
          }

          onDataFetched(locationData)
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Failed to fetch location data"
          setError(errorMessage)
        } finally {
          setIsFetching(false)
        }
      },
      (error) => {
        setError(`Location error: ${error.message}`)
        setIsFetching(false)
      },
    )
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Auto-Fill with Location Data
        </CardTitle>
        <CardDescription>Use your current location to automatically fetch weather and soil information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <p className="text-sm text-muted-foreground">
          This will use your device's GPS to fetch real-time weather data and estimate soil properties for your
          location.
        </p>

        <Button
          onClick={handleGetLocation}
          disabled={isFetching || isLoading}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          {isFetching ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Fetching Location Data...
            </>
          ) : (
            <>
              <MapPin className="w-5 h-5 mr-2" />
              Get My Location Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
