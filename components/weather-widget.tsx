"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Cloud, CloudRain, Sun, Wind, Droplets } from "lucide-react"
import { weatherApi, type CurrentWeather } from "@/lib/weather-api"

interface WeatherWidgetProps {
  latitude?: number
  longitude?: number
  city?: string
  onWeatherLoaded?: (weather: CurrentWeather) => void
}

export function WeatherWidget({
  latitude,
  longitude,
  city,
  onWeatherLoaded,
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<CurrentWeather | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (city) {
          const weatherData = await weatherApi.getWeatherByCity(city)
          setWeather(weatherData.current)
          onWeatherLoaded?.(weatherData.current)
        } else if (latitude !== undefined && longitude !== undefined) {
          const current = await weatherApi.getCurrentWeather(latitude, longitude)
          setWeather(current)
          onWeatherLoaded?.(current)
        } else {
          // Try to get user's location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const { latitude: lat, longitude: lon } = position.coords
                const current = await weatherApi.getCurrentWeather(lat, lon)
                setWeather(current)
                onWeatherLoaded?.(current)
              },
              (err) => {
                console.warn("[v0] Geolocation error:", err)
                setError("Unable to get your location. Please enable location access.")
              }
            )
          } else {
            setError("Geolocation not supported by your browser")
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load weather"
        setError(errorMessage)
        console.error("[v0] Weather widget error:", errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeather()
  }, [latitude, longitude, city, onWeatherLoaded])

  const getWeatherIcon = (description: string) => {
    const lower = description.toLowerCase()
    if (lower.includes("rain")) return <CloudRain className="h-8 w-8 text-blue-500" />
    if (lower.includes("cloud")) return <Cloud className="h-8 w-8 text-gray-500" />
    if (lower.includes("clear") || lower.includes("sunny")) return <Sun className="h-8 w-8 text-yellow-500" />
    return <Cloud className="h-8 w-8 text-gray-500" />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!weather) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Weather</CardTitle>
        <CardDescription>Real-time weather conditions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold">{weather.temperature.toFixed(1)}°C</div>
              <p className="text-muted-foreground capitalize">{weather.description}</p>
              <p className="text-sm text-muted-foreground">Feels like {weather.feelsLike.toFixed(1)}°C</p>
            </div>
            <div>{getWeatherIcon(weather.description)}</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Droplets className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-muted-foreground">Humidity</span>
              </div>
              <p className="text-lg font-semibold">{weather.humidity}%</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CloudRain className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-muted-foreground">Rainfall</span>
              </div>
              <p className="text-lg font-semibold">{weather.rainfall.toFixed(1)} mm</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Wind className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm text-muted-foreground">Wind</span>
              </div>
              <p className="text-lg font-semibold">{weather.windSpeed.toFixed(1)} m/s</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
