/**
 * Weather API integration with OpenWeatherMap
 * Free tier API for current weather and 5-day forecast
 */

const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data"
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

export interface CurrentWeather {
  temperature: number
  humidity: number
  rainfall: number
  windSpeed: number
  description: string
  icon: string
  feelsLike: number
}

export interface WeatherForecastDay {
  date: string
  temperature: number
  humidity: number
  rainfall: number
  description: string
  icon: string
}

export interface WeatherData {
  location: {
    latitude: number
    longitude: number
    city?: string
    country?: string
  }
  current: CurrentWeather
  forecast: WeatherForecastDay[]
}

class WeatherApi {
  private apiKey: string

  constructor(apiKey: string = WEATHER_API_KEY || "") {
    this.apiKey = apiKey
    if (!this.apiKey) {
      console.warn("[v0] OpenWeatherMap API key not configured. Weather features will be limited.")
    }
  }

  async getCurrentWeather(latitude: number, longitude: number): Promise<CurrentWeather> {
    if (!this.apiKey) {
      throw new Error("Weather API key not configured")
    }

    try {
      const url = `${WEATHER_API_BASE_URL}/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`
      console.log("[v0] Fetching current weather for:", { latitude, longitude })

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`)
      }

      const data = await response.json()

      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        rainfall: data.rain?.["1h"] || 0,
        windSpeed: data.wind.speed,
        description: data.weather[0].main,
        icon: data.weather[0].icon,
        feelsLike: data.main.feels_like,
      }
    } catch (error) {
      console.error("[v0] Error fetching weather:", error)
      throw error
    }
  }

  async getWeatherForecast(latitude: number, longitude: number): Promise<WeatherForecastDay[]> {
    if (!this.apiKey) {
      throw new Error("Weather API key not configured")
    }

    try {
      const url = `${WEATHER_API_BASE_URL}/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`
      console.log("[v0] Fetching weather forecast for:", { latitude, longitude })

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`)
      }

      const data = await response.json()

      // Group by day and take one entry per day
      const dailyForecasts: { [key: string]: any } = {}

      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toISOString().split("T")[0]

        if (!dailyForecasts[date]) {
          dailyForecasts[date] = item
        }
      })

      return Object.entries(dailyForecasts)
        .slice(0, 7) // Take 7 days
        .map(([date, item]: [string, any]) => ({
          date,
          temperature: item.main.temp,
          humidity: item.main.humidity,
          rainfall: item.rain?.["3h"] || 0,
          description: item.weather[0].main,
          icon: item.weather[0].icon,
        }))
    } catch (error) {
      console.error("[v0] Error fetching forecast:", error)
      throw error
    }
  }

  async getCompleteWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      const [current, forecast] = await Promise.all([
        this.getCurrentWeather(latitude, longitude),
        this.getWeatherForecast(latitude, longitude),
      ])

      return {
        location: { latitude, longitude },
        current,
        forecast,
      }
    } catch (error) {
      console.error("[v0] Error getting complete weather data:", error)
      throw error
    }
  }

  async getWeatherByCity(city: string): Promise<WeatherData> {
    if (!this.apiKey) {
      throw new Error("Weather API key not configured")
    }

    try {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`
      console.log("[v0] Fetching coordinates for city:", city)

      const geoResponse = await fetch(geoUrl)

      if (!geoResponse.ok) {
        throw new Error(`Geo API error: ${geoResponse.status}`)
      }

      const [geoData] = await geoResponse.json()

      if (!geoData) {
        throw new Error(`City not found: ${city}`)
      }

      const weatherData = await this.getCompleteWeatherData(geoData.lat, geoData.lon)

      return {
        ...weatherData,
        location: {
          ...weatherData.location,
          city: geoData.name,
          country: geoData.country,
        },
      }
    } catch (error) {
      console.error("[v0] Error getting weather by city:", error)
      throw error
    }
  }
}

export const weatherApi = new WeatherApi()
