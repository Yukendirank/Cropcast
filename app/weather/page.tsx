'use client'

import { useState } from 'react'
import { Cloud, Wind, Droplets, Thermometer, MapPin, Search, Eye, Gauge, Sunrise, Sunset } from 'lucide-react'

interface CurrentWeather {
  name: string
  sys: { country: string; sunrise: number; sunset: number }
  main: { temp: number; feels_like: number; humidity: number; pressure: number; temp_min: number; temp_max: number }
  weather: Array<{ main: string; description: string; icon: string }>
  wind: { speed: number; deg: number }
  visibility: number
  clouds: { all: number }
}

interface ForecastDay {
  dt_txt: string
  main: { temp: number; humidity: number }
  weather: Array<{ main: string; description: string; icon: string }>
  wind: { speed: number }
  pop: number
}

const QUICK_CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bengaluru', 'Hyderabad']

export default function WeatherPage() {
  const [city, setCity] = useState('')
  const [current, setCurrent] = useState<CurrentWeather | null>(null)
  const [daily, setDaily] = useState<ForecastDay[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usingLocation, setUsingLocation] = useState(false)

  const fetchWeather = async (params: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/weather?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch weather')
      setCurrent(data.current)
      setDaily(data.daily)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const fetchLocationByIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/')
      if (!response.ok) throw new Error('IP lookup failed')
      const data = await response.json()
      if (data.latitude && data.longitude) {
        fetchWeather(`lat=${data.latitude}&lon=${data.longitude}`)
      } else if (data.city) {
        fetchWeather(`city=${encodeURIComponent(data.city)}`)
      } else {
        throw new Error('Could not resolve IP location')
      }
    } catch (err) {
      setError('Unable to determine your location automatically. Please enter a city.')
    } finally {
      setUsingLocation(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!city.trim()) {
      setError('Enter a city name or use location search.')
      return
    }
    fetchWeather(`city=${encodeURIComponent(city.trim())}`)
  }

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported in this browser.')
      return
    }

    setUsingLocation(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      pos => {
        setUsingLocation(false)
        fetchWeather(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
      },
      async (error) => {
        setUsingLocation(false)
        if (error.code === error.PERMISSION_DENIED) {
          setError('Location permission denied. Falling back to IP-based location.')
        } else {
          setError('Could not retrieve your location. Trying IP fallback.')
        }
        await fetchLocationByIP()
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const iconUrl = (code: string) => `https://openweathermap.org/img/wn/${code}@2x.png`
  const formatTime = (unix: number) => new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const getDayName = (dtTxt: string) => {
    const d = new Date(dtTxt)
    return d.toDateString() === new Date().toDateString() ? 'Today' : d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
  }
  const getWindDir = (deg: number) => ['N','NE','E','SE','S','SW','W','NW'][Math.round(deg / 45) % 8]

  const agriAdvice = (w: CurrentWeather) => {
    const { temp, humidity } = w.main
    const desc = w.weather[0].main.toLowerCase()
    const wind = w.wind.speed
    const tips: { icon: string; text: string; type: 'warn' | 'info' | 'ok' }[] = []
    if (desc.includes('rain')) tips.push({ icon: '🌧️', text: 'Delay fertilizer application — rain causes nutrient runoff.', type: 'warn' })
    if (desc.includes('clear') && temp > 32) tips.push({ icon: '☀️', text: 'Heat alert: increase irrigation frequency for sensitive crops.', type: 'warn' })
    if (humidity > 80) tips.push({ icon: '🍄', text: 'High humidity increases fungal disease risk — inspect crops regularly.', type: 'warn' })
    if (humidity < 40) tips.push({ icon: '🌵', text: 'Low humidity detected: mulch beds to retain soil moisture.', type: 'info' })
    if (temp < 10) tips.push({ icon: '🌡️', text: 'Cold temperatures may slow germination — protect seedlings with covers.', type: 'warn' })
    if (wind > 10) tips.push({ icon: '💨', text: 'Strong winds: avoid spraying pesticides or liquid fertilizers today.', type: 'warn' })
    if (tips.length === 0) tips.push({ icon: '✅', text: 'Conditions look good for most field operations today.', type: 'ok' })
    return tips
  }

  return (
    <main className="min-h-screen py-12 px-4" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 50%, #eff6ff 100%)' }}>
      <div className="container mx-auto max-w-4xl">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Cloud className="w-4 h-4" /> Real-time Weather Data
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Weather Insights</h1>
          <p className="text-gray-500 text-lg">Real-time forecasts with agricultural advisories for your region</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Enter city name..." value={city} onChange={e => setCity(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors text-sm" />
            </div>
            <button type="submit" disabled={loading}
              className="bg-[#0A4D3C] text-white px-6 py-3 rounded-xl hover:bg-[#083D2F] active:scale-95 disabled:opacity-50 font-medium transition-all">
              Search
            </button>
          </form>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={handleLocate} disabled={loading || usingLocation}
              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50">
              <MapPin className="w-4 h-4" />
              {usingLocation ? 'Detecting...' : 'Use my location'}
            </button>
            <span className="text-gray-300">|</span>
            <div className="flex gap-2 flex-wrap">
              {QUICK_CITIES.map(c => (
                <button key={c} onClick={() => { setCity(c); fetchWeather(`city=${c}`) }}
                  className="text-xs bg-gray-100 hover:bg-green-100 hover:text-green-800 text-gray-600 px-3 py-1 rounded-full transition-colors">
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">{error}</div>}

        {loading && (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin mb-4" />
            <p className="text-gray-500">Fetching weather data...</p>
          </div>
        )}

        {current && !loading && (
          <>
            {/* Main weather card */}
            <div className="bg-gradient-to-br from-[#0A4D3C] to-[#0d6b52] text-white rounded-2xl p-8 mb-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{current.name}, {current.sys.country}</span>
                    </div>
                    <p className="text-7xl font-bold tracking-tight">{Math.round(current.main.temp)}°</p>
                    <p className="text-xl opacity-80 capitalize mt-1">{current.weather[0].description}</p>
                    <p className="text-sm opacity-60 mt-1">Feels like {Math.round(current.main.feels_like)}° · H:{Math.round(current.main.temp_max)}° L:{Math.round(current.main.temp_min)}°</p>
                  </div>
                  <img src={iconUrl(current.weather[0].icon)} alt="" className="w-28 h-28 opacity-90" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    { icon: Droplets, label: 'Humidity', value: `${current.main.humidity}%` },
                    { icon: Wind, label: 'Wind', value: `${current.wind.speed} m/s ${getWindDir(current.wind.deg)}` },
                    { icon: Eye, label: 'Visibility', value: `${(current.visibility / 1000).toFixed(1)} km` },
                    { icon: Gauge, label: 'Pressure', value: `${current.main.pressure} hPa` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-white/10 backdrop-blur rounded-xl p-3">
                      <div className="flex items-center gap-1.5 opacity-70 mb-1">
                        <Icon className="w-3.5 h-3.5" />
                        <span className="text-xs">{label}</span>
                      </div>
                      <p className="font-bold">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-6 text-sm opacity-60">
                  <span className="flex items-center gap-1.5"><Sunrise className="w-3.5 h-3.5" />{formatTime(current.sys.sunrise)}</span>
                  <span className="flex items-center gap-1.5"><Sunset className="w-3.5 h-3.5" />{formatTime(current.sys.sunset)}</span>
                  <span>☁️ {current.clouds.all}% cloud cover</span>
                </div>
              </div>
            </div>

            {/* 5-day forecast */}
            {daily.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-blue-500" /> 5-Day Forecast
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {daily.map(day => (
                    <div key={day.dt_txt} className="text-center bg-gray-50 hover:bg-blue-50 rounded-xl p-3 transition-colors">
                      <p className="text-xs text-gray-500 font-medium mb-1">{getDayName(day.dt_txt)}</p>
                      <img src={iconUrl(day.weather[0].icon)} alt="" className="w-12 h-12 mx-auto" />
                      <p className="text-xl font-bold text-gray-800">{Math.round(day.main.temp)}°</p>
                      <p className="text-xs text-gray-400 capitalize">{day.weather[0].description}</p>
                      <div className="mt-2 flex items-center justify-center gap-1 text-xs text-blue-500">
                        <Droplets className="w-3 h-3" />
                        <span>{Math.round(day.pop * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agricultural Advisory */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h2 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                🌾 Agricultural Advisory
              </h2>
              <div className="space-y-2">
                {agriAdvice(current).map((tip, i) => (
                  <div key={i} className={`flex items-start gap-3 rounded-xl p-3 text-sm ${
                    tip.type === 'warn' ? 'bg-amber-100/70 text-amber-800' :
                    tip.type === 'ok' ? 'bg-green-100/70 text-green-800' :
                    'bg-blue-100/70 text-blue-800'}`}>
                    <span className="flex-shrink-0 text-base">{tip.icon}</span>
                    <span>{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!current && !loading && !error && (
          <div className="text-center py-20 text-gray-300">
            <Cloud className="w-20 h-20 mx-auto mb-4 opacity-40" />
            <p className="text-gray-400 text-lg font-medium">Search for a city to get started</p>
            <p className="text-gray-400 text-sm mt-1">Or use your current location for instant results</p>
          </div>
        )}
      </div>
    </main>
  )
}
