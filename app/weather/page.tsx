'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2, MapPin, Cloud, Droplets, Wind, Eye } from 'lucide-react'

interface WeatherData {
  city: string
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  weatherCondition: string
  pressure: number
  cloudiness: number
  farmingTips: string[]
}

const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition.toLowerCase()
  if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) return '🌧️'
  if (lowerCondition.includes('cloud')) return '☁️'
  if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) return '☀️'
  if (lowerCondition.includes('snow')) return '❄️'
  if (lowerCondition.includes('storm') || lowerCondition.includes('thunder')) return '⛈️'
  if (lowerCondition.includes('wind')) return '💨'
  return '🌤️'
}

export default function WeatherPage() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [locationLoading, setLocationLoading] = useState(false)

  // Auto-detect location on mount
  useEffect(() => {
    const autoDetectLocation = async () => {
      if (!navigator.geolocation) {
        console.log('[v0] Geolocation not available')
        return
      }

      setLocationLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch('/api/weather', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              }),
            })

            if (response.ok) {
              const data = await response.json()
              setWeather(data)
            }
          } catch (err) {
            console.log('[v0] Auto-detect weather fetch failed')
          } finally {
            setLocationLoading(false)
          }
        },
        () => {
          setLocationLoading(false)
          console.log('[v0] Location permission denied')
        }
      )
    }

    autoDetectLocation()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city }),
      })

      if (!response.ok) {
        throw new Error('City not found or API error')
      }

      const data: WeatherData = await response.json()
      setWeather(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A4D3C] mb-4">Weather Insights</h1>
          <p className="text-lg text-gray-600">
            Get real-time weather data and farming tips for your location.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Search Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Search Location</CardTitle>
                <CardDescription>Enter a city name</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="city">City Name</Label>
                    <Input
                      id="city"
                      placeholder="e.g., Chennai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
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
                    disabled={loading || !city}
                    className="w-full bg-[#0A4D3C] hover:bg-[#083D2F]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <MapPin className="mr-2 h-4 w-4" />
                        Search
                      </>
                    )}
                  </Button>
                </form>

                {locationLoading && (
                  <div className="mt-4 text-center text-sm text-gray-600">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                    Detecting location...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Weather Display */}
          {weather && (
            <div className="lg:col-span-3 space-y-6">
              {/* Main Weather Card */}
              <Card className="border-[#0A4D3C] border-2">
                <CardHeader className="bg-[#0A4D3C] text-white rounded-t-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-3xl">{weather.city}</CardTitle>
                      <CardDescription className="text-blue-100">{weather.weatherCondition}</CardDescription>
                    </div>
                    <div className="text-6xl">{getWeatherIcon(weather.weatherCondition)}</div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Temperature */}
                    <div className="text-center">
                      <p className="text-gray-600 text-sm mb-1">Temperature</p>
                      <p className="text-4xl font-bold text-[#0A4D3C]">{weather.temperature}°C</p>
                      <p className="text-xs text-gray-500 mt-1">Feels like {weather.feelsLike}°C</p>
                    </div>

                    {/* Humidity */}
                    <div className="text-center">
                      <p className="text-gray-600 text-sm mb-1">Humidity</p>
                      <div className="flex items-center justify-center gap-2">
                        <Droplets className="h-6 w-6 text-blue-500" />
                        <p className="text-3xl font-bold text-[#0A4D3C]">{weather.humidity}%</p>
                      </div>
                    </div>

                    {/* Wind Speed */}
                    <div className="text-center">
                      <p className="text-gray-600 text-sm mb-1">Wind Speed</p>
                      <div className="flex items-center justify-center gap-2">
                        <Wind className="h-6 w-6 text-gray-500" />
                        <p className="text-3xl font-bold text-[#0A4D3C]">{weather.windSpeed} km/h</p>
                      </div>
                    </div>

                    {/* Cloud Coverage */}
                    <div className="text-center">
                      <p className="text-gray-600 text-sm mb-1">Cloud Cover</p>
                      <div className="flex items-center justify-center gap-2">
                        <Cloud className="h-6 w-6 text-gray-400" />
                        <p className="text-3xl font-bold text-[#0A4D3C]">{weather.cloudiness}%</p>
                      </div>
                    </div>

                    {/* Pressure */}
                    <div className="text-center">
                      <p className="text-gray-600 text-sm mb-1">Pressure</p>
                      <p className="text-2xl font-bold text-[#0A4D3C]">{weather.pressure} mb</p>
                    </div>

                    {/* Visibility */}
                    <div className="text-center">
                      <p className="text-gray-600 text-sm mb-1">Condition</p>
                      <div className="flex items-center justify-center gap-2">
                        <Eye className="h-6 w-6 text-gray-500" />
                        <p className="text-lg font-bold text-[#0A4D3C]">Good</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Farming Tips */}
              {weather.farmingTips && weather.farmingTips.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Farming Tips Based on Weather</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {weather.farmingTips.map((tip, idx) => (
                        <Alert key={idx} className="border-[#0A4D3C] bg-green-50">
                          <AlertCircle className="h-4 w-4 text-[#0A4D3C]" />
                          <AlertDescription className="text-gray-800">{tip}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Weather Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Weather Insights</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-[#0A4D3C] mb-2">Temperature Analysis</h4>
                    <p className="text-sm text-gray-700">
                      {weather.temperature > 35
                        ? 'High temperature - Increase irrigation frequency'
                        : weather.temperature < 10
                          ? 'Low temperature - Reduce irrigation and protect sensitive crops'
                          : 'Optimal temperature for crop growth'}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-[#0A4D3C] mb-2">Humidity Analysis</h4>
                    <p className="text-sm text-gray-700">
                      {weather.humidity > 80
                        ? 'High humidity - Risk of fungal diseases'
                        : weather.humidity < 40
                          ? 'Low humidity - Increase watering schedule'
                          : 'Healthy humidity levels for farming'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
