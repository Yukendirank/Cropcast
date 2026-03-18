"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Cloud, CloudRain, Sun } from "lucide-react"
import { weatherApi, type WeatherForecastDay } from "@/lib/weather-api"
import { format, parseISO } from "date-fns"

interface WeatherForecastProps {
  latitude?: number
  longitude?: number
  city?: string
}

export function WeatherForecast({ latitude, longitude, city }: WeatherForecastProps) {
  const [forecast, setForecast] = useState<WeatherForecastDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (city) {
          const weatherData = await weatherApi.getWeatherByCity(city)
          setForecast(weatherData.forecast)
        } else if (latitude !== undefined && longitude !== undefined) {
          const forecastData = await weatherApi.getWeatherForecast(latitude, longitude)
          setForecast(forecastData)
        } else {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const { latitude: lat, longitude: lon } = position.coords
                const forecastData = await weatherApi.getWeatherForecast(lat, lon)
                setForecast(forecastData)
              },
              () => {
                setError("Unable to get your location")
              }
            )
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load forecast"
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchForecast()
  }, [latitude, longitude, city])

  const getWeatherIcon = (description: string) => {
    const lower = description.toLowerCase()
    if (lower.includes("rain")) return <CloudRain className="h-5 w-5 text-blue-500" />
    if (lower.includes("cloud")) return <Cloud className="h-5 w-5 text-gray-500" />
    if (lower.includes("clear") || lower.includes("sunny")) return <Sun className="h-5 w-5 text-yellow-500" />
    return <Cloud className="h-5 w-5 text-gray-500" />
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Forecast</CardTitle>
        <CardDescription>Weather prediction for the coming week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecast.map((day) => (
            <div key={day.date} className="p-3 border rounded-lg text-center space-y-2">
              <p className="text-sm font-semibold">
                {format(parseISO(day.date), "EEE")}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(parseISO(day.date), "MMM d")}
              </p>
              <div className="flex justify-center">
                {getWeatherIcon(day.description)}
              </div>
              <p className="text-sm font-semibold">{day.temperature.toFixed(0)}°C</p>
              <p className="text-xs text-muted-foreground capitalize">
                {day.description}
              </p>
              <div className="text-xs space-y-1">
                <p className="text-muted-foreground">Humidity: {day.humidity}%</p>
                <p className="text-muted-foreground">Rain: {day.rainfall.toFixed(1)} mm</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
