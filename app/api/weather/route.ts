import { type NextRequest, NextResponse } from "next/server"

export interface WeatherRequest {
  city?: string
  latitude?: number
  longitude?: number
}

export interface WeatherResponse {
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

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "20d3e2866bcce3455d318761421bf94a"

async function getWeatherByCity(city: string): Promise<WeatherResponse> {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch weather data")
  }

  const data = await response.json()

  return formatWeatherResponse(data)
}

async function getWeatherByCoords(latitude: number, longitude: number): Promise<WeatherResponse> {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch weather data")
  }

  const data = await response.json()

  return formatWeatherResponse(data)
}

function formatWeatherResponse(data: any): WeatherResponse {
  const farmingTips = generateFarmingTips(data.main.temp, data.clouds.all, data.main.humidity, data.weather[0].main)

  return {
    city: data.name,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
    weatherCondition: data.weather[0].main,
    pressure: data.main.pressure,
    cloudiness: data.clouds.all,
    farmingTips,
  }
}

function generateFarmingTips(temp: number, cloudiness: number, humidity: number, condition: string): string[] {
  const tips: string[] = []

  // Temperature-based tips
  if (temp > 35) {
    tips.push("High temperature alert: Ensure adequate irrigation")
  } else if (temp < 10) {
    tips.push("Low temperature: Delay sensitive crop operations")
  } else if (temp >= 20 && temp <= 30) {
    tips.push("Ideal temperature for most crop growth")
  }

  // Weather condition tips
  if (condition.includes("Rain") || condition.includes("Drizzle")) {
    tips.push("Rain expected: Delay irrigation and pesticide spraying")
    tips.push("Good soil moisture: Monitor for waterlogging")
  } else if (condition.includes("Clear") || condition.includes("Sunny")) {
    tips.push("Clear skies: Ensure proper irrigation schedule")
  }

  // Humidity-based tips
  if (humidity > 80) {
    tips.push("High humidity: Increase ventilation to prevent fungal diseases")
  } else if (humidity < 40) {
    tips.push("Low humidity: Increase irrigation frequency")
  }

  // Cloud coverage tips
  if (cloudiness > 70) {
    tips.push("Cloudy conditions: Monitor crop growth, consider fertilizer adjustment")
  }

  // Ensure at least one tip
  if (tips.length === 0) {
    tips.push("Weather conditions are stable for farming activities")
  }

  return tips.slice(0, 4) // Return max 4 tips
}

export async function POST(request: NextRequest) {
  try {
    const body: WeatherRequest = await request.json()

    let weatherData: WeatherResponse

    if (body.city) {
      weatherData = await getWeatherByCity(body.city)
    } else if (body.latitude !== undefined && body.longitude !== undefined) {
      weatherData = await getWeatherByCoords(body.latitude, body.longitude)
    } else {
      return NextResponse.json(
        { error: "Please provide either city name or coordinates" },
        { status: 400 }
      )
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Weather API Error:", error)

    // Fallback response
    const fallbackResponse: WeatherResponse = {
      city: "Unknown Location",
      temperature: 25,
      feelsLike: 26,
      humidity: 65,
      windSpeed: 12,
      weatherCondition: "Clear Sky",
      pressure: 1013,
      cloudiness: 20,
      farmingTips: [
        "Ideal conditions for crop growth",
        "Ensure regular irrigation schedule",
        "Monitor soil moisture levels",
        "Perfect time for field operations",
      ],
    }

    return NextResponse.json(fallbackResponse)
  }
}
