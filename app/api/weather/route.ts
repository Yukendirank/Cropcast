import { type NextRequest, NextResponse } from "next/server"

const OWM_API_KEY = process.env.OPENWEATHER_API_KEY || "20d3e2866bcce3455d318761421bf94a"
const BASE = "https://api.openweathermap.org/data/2.5"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")
  const lat  = searchParams.get("lat")
  const lon  = searchParams.get("lon")

  let locationQuery: string
  if (lat && lon) {
    locationQuery = `lat=${lat}&lon=${lon}`
  } else if (city) {
    locationQuery = `q=${encodeURIComponent(city)}`
  } else {
    return NextResponse.json({ error: "Provide city or lat/lon" }, { status: 400 })
  }

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`${BASE}/weather?${locationQuery}&appid=${OWM_API_KEY}&units=metric`),
      fetch(`${BASE}/forecast?${locationQuery}&appid=${OWM_API_KEY}&units=metric&cnt=40`),
    ])

    if (!currentRes.ok) {
      const err = await currentRes.json()
      return NextResponse.json({ error: err.message || "City not found" }, { status: currentRes.status })
    }

    const current  = await currentRes.json()
    const forecast = await forecastRes.json()

    // Group forecast by day (take noon reading per day)
    const dailyMap: Record<string, typeof forecast.list[0]> = {}
    for (const item of forecast.list as Array<{ dt_txt: string; main: { temp_max?: number; temp_min?: number; temp: number; humidity: number }; weather: Array<{ main: string; description: string; icon: string }>; wind: { speed: number }; pop: number }>) {
      const date = item.dt_txt.split(" ")[0]
      if (!dailyMap[date] || item.dt_txt.includes("12:00:00")) {
        dailyMap[date] = item
      }
    }
    const daily = Object.values(dailyMap).slice(0, 5)

    return NextResponse.json({ current, daily })
  } catch {
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
