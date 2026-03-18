/**
 * Smart Alerts System
 * Monitors farm conditions and sends automated alerts for issues
 */

export type AlertType = "weather" | "pest" | "disease" | "soil" | "irrigation" | "prediction"
export type AlertSeverity = "low" | "medium" | "high" | "critical"
export type AlertStatus = "new" | "acknowledged" | "resolved"

export interface Alert {
  id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  recommendations: string[]
  cropType: string
  createdAt: Date
  status: AlertStatus
  dismissedAt?: Date
  weatherCondition?: string
  pestType?: string
  diseaseType?: string
}

export interface AlertThresholds {
  temperatureMin: number
  temperatureMax: number
  humidityMax: number
  soilMoistureMin: number
  rainfallMax: number
}

export const DEFAULT_THRESHOLDS: AlertThresholds = {
  temperatureMin: 10,
  temperatureMax: 35,
  humidityMax: 90,
  soilMoistureMin: 30,
  rainfallMax: 100,
}

const PEST_DATABASE = {
  wheat: ["Armyworm", "Aphid", "Grasshopper", "Thrips"],
  rice: ["Brown planthopper", "Leaf folder", "Stem borer", "Gall midge"],
  corn: ["Fall armyworm", "Corn borer", "Corn earworm", "Aphids"],
  cotton: ["Bollworm", "Whitefly", "Jassid", "Spider mite"],
}

const DISEASE_DATABASE = {
  wheat: ["Rust", "Powdery mildew", "Septoria", "Loose smut"],
  rice: ["Blast", "Sheath blight", "Brown spot", "Bacterial leaf streak"],
  corn: ["Gray leaf spot", "Anthracnose", "Common rust", "Head smut"],
  cotton: ["Bacterial blight", "Leaf curl", "Root rot", "Fusarium wilt"],
}

export function generateAlerts(
  temperature: number,
  humidity: number,
  soilMoisture: number,
  rainfall: number,
  cropType: string,
  thresholds: AlertThresholds = DEFAULT_THRESHOLDS
): Alert[] {
  const alerts: Alert[] = []

  // Temperature alerts
  if (temperature < thresholds.temperatureMin) {
    alerts.push({
      id: `temp-low-${Date.now()}`,
      type: "weather",
      severity: "high",
      title: "Low Temperature Warning",
      message: `Temperature is ${temperature}°C, below the minimum threshold of ${thresholds.temperatureMin}°C`,
      recommendations: [
        "Apply frost protection measures if available",
        "Check crop for frost damage",
        "Consider postponing new plantings",
      ],
      cropType,
      createdAt: new Date(),
      status: "new",
    })
  }

  if (temperature > thresholds.temperatureMax) {
    alerts.push({
      id: `temp-high-${Date.now()}`,
      type: "weather",
      severity: "high",
      title: "High Temperature Alert",
      message: `Temperature is ${temperature}°C, above the maximum threshold of ${thresholds.temperatureMax}°C`,
      recommendations: [
        "Increase irrigation frequency",
        "Apply mulch to retain soil moisture",
        "Monitor crop stress indicators",
      ],
      cropType,
      createdAt: new Date(),
      status: "new",
    })
  }

  // Humidity alerts
  if (humidity > thresholds.humidityMax) {
    alerts.push({
      id: `humid-high-${Date.now()}`,
      type: "disease",
      severity: "medium",
      title: "High Humidity - Disease Risk",
      message: `Humidity is ${humidity}%, creating favorable conditions for fungal diseases`,
      recommendations: [
        "Improve air circulation in the field",
        "Apply fungicide if needed",
        "Monitor plants for disease symptoms",
        "Avoid overhead irrigation",
      ],
      cropType,
      createdAt: new Date(),
      status: "new",
    })
  }

  // Soil moisture alerts
  if (soilMoisture < thresholds.soilMoistureMin) {
    alerts.push({
      id: `soil-dry-${Date.now()}`,
      type: "irrigation",
      severity: "high",
      title: "Irrigation Required",
      message: `Soil moisture is ${soilMoisture}%, below the minimum threshold of ${thresholds.soilMoistureMin}%`,
      recommendations: [
        "Start irrigation immediately",
        "Check irrigation system for proper functioning",
        "Consider mulching to retain moisture",
        "Water deeply to promote root development",
      ],
      cropType,
      createdAt: new Date(),
      status: "new",
    })
  }

  // Rainfall alerts
  if (rainfall > thresholds.rainfallMax) {
    alerts.push({
      id: `rain-high-${Date.now()}`,
      type: "weather",
      severity: "medium",
      title: "Heavy Rainfall Alert",
      message: `Rainfall is ${rainfall}mm, above the normal range`,
      recommendations: [
        "Ensure proper drainage in the field",
        "Check for waterlogging",
        "Monitor for root rot and fungal diseases",
        "Avoid new applications of water-soluble fertilizers",
      ],
      cropType,
      createdAt: new Date(),
      status: "new",
    })
  }

  // Pest and disease risk based on conditions
  if (temperature >= 20 && temperature <= 28 && humidity >= 60) {
    const possiblePests = (PEST_DATABASE as any)[cropType.toLowerCase()] || []
    if (possiblePests.length > 0) {
      alerts.push({
        id: `pest-risk-${Date.now()}`,
        type: "pest",
        severity: "medium",
        title: "Pest Risk Alert",
        message: `Current conditions are favorable for pest activity. Watch for: ${possiblePests.slice(0, 2).join(", ")}`,
        recommendations: [
          "Scout fields regularly for pest presence",
          "Apply IPM strategies before population builds up",
          "Use appropriate pesticides if thresholds are crossed",
          "Encourage natural predators",
        ],
        cropType,
        createdAt: new Date(),
        status: "new",
        pestType: possiblePests[0],
      })
    }
  }

  // Disease risk based on humidity and temperature
  if (humidity > 70 && temperature >= 15 && temperature <= 25) {
    const possibleDiseases = (DISEASE_DATABASE as any)[cropType.toLowerCase()] || []
    if (possibleDiseases.length > 0) {
      alerts.push({
        id: `disease-risk-${Date.now()}`,
        type: "disease",
        severity: "medium",
        title: "Disease Risk Alert",
        message: `High humidity and moderate temperature favor disease development. Risk: ${possibleDiseases[0]}`,
        recommendations: [
          "Scout plants for disease symptoms daily",
          "Apply preventive fungicide if recommended",
          "Reduce leaf wetness duration",
          "Remove infected plant material",
        ],
        cropType,
        createdAt: new Date(),
        status: "new",
        diseaseType: possibleDiseases[0],
      })
    }
  }

  return alerts
}

export function getAlertColor(severity: AlertSeverity): string {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-300"
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-300"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-300"
    case "low":
      return "bg-blue-100 text-blue-800 border-blue-300"
  }
}

export function getAlertIcon(type: AlertType) {
  switch (type) {
    case "weather":
      return "🌦️"
    case "pest":
      return "🐛"
    case "disease":
      return "🍂"
    case "soil":
      return "🌱"
    case "irrigation":
      return "💧"
    case "prediction":
      return "📊"
  }
}
