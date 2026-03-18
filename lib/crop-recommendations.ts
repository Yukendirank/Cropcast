/**
 * Crop Recommendation Engine
 * Provides intelligent crop recommendations based on soil and climate conditions
 */

export interface CropRecommendation {
  cropName: string
  suitability: number // 0-100
  temperature: { min: number; max: number }
  soilMoisture: { min: number; max: number }
  rainfall: { min: number; max: number }
  season: string
  benefits: string[]
  risks: string[]
}

const CROP_DATABASE: CropRecommendation[] = [
  {
    cropName: "Wheat",
    suitability: 75,
    temperature: { min: 10, max: 25 },
    soilMoisture: { min: 30, max: 70 },
    rainfall: { min: 300, max: 650 },
    season: "Winter",
    benefits: [
      "High protein content",
      "Long shelf life",
      "Good for crop rotation",
      "Drought resistant",
    ],
    risks: ["Fungal diseases in wet seasons", "Pest susceptibility"],
  },
  {
    cropName: "Rice",
    suitability: 85,
    temperature: { min: 20, max: 35 },
    soilMoisture: { min: 60, max: 100 },
    rainfall: { min: 800, max: 1500 },
    season: "Monsoon",
    benefits: [
      "High yield potential",
      "Profitable crop",
      "Good for wet areas",
      "Complete protein",
    ],
    risks: ["Requires flooding", "Pest attacks in humid areas"],
  },
  {
    cropName: "Corn/Maize",
    suitability: 80,
    temperature: { min: 18, max: 27 },
    soilMoisture: { min: 40, max: 80 },
    rainfall: { min: 500, max: 800 },
    season: "Summer",
    benefits: [
      "Versatile crop",
      "High yield",
      "Good for animal feed",
      "Fast growing",
    ],
    risks: ["Drought sensitive during flowering", "Pest susceptibility"],
  },
  {
    cropName: "Cotton",
    suitability: 70,
    temperature: { min: 21, max: 30 },
    soilMoisture: { min: 40, max: 60 },
    rainfall: { min: 400, max: 600 },
    season: "Summer",
    benefits: ["High value crop", "Good for textiles", "Perennial income"],
    risks: ["High pest pressure", "Needs frequent irrigation"],
  },
  {
    cropName: "Sugarcane",
    suitability: 75,
    temperature: { min: 20, max: 30 },
    soilMoisture: { min: 50, max: 85 },
    rainfall: { min: 600, max: 1500 },
    season: "Year-round",
    benefits: ["High income", "Long harvest period", "Industrial use"],
    risks: ["Water intensive", "Slow growth in cool weather"],
  },
  {
    cropName: "Soybean",
    suitability: 72,
    temperature: { min: 15, max: 27 },
    soilMoisture: { min: 35, max: 75 },
    rainfall: { min: 450, max: 750 },
    season: "Summer",
    benefits: [
      "High protein",
      "Nitrogen fixing",
      "Good rotation crop",
      "Growing demand",
    ],
    risks: ["Sensitive to frost", "Requires proper drainage"],
  },
  {
    cropName: "Tomato",
    suitability: 78,
    temperature: { min: 15, max: 28 },
    soilMoisture: { min: 40, max: 70 },
    rainfall: { min: 400, max: 800 },
    season: "Summer",
    benefits: ["High market demand", "Good profit", "Multiple harvests"],
    risks: ["Fungal diseases", "Pest management challenges"],
  },
  {
    cropName: "Potato",
    suitability: 76,
    temperature: { min: 10, max: 20 },
    soilMoisture: { min: 50, max: 80 },
    rainfall: { min: 500, max: 750 },
    season: "Winter",
    benefits: [
      "High yield",
      "Nutritious",
      "Good storage",
      "Soil improvement",
    ],
    risks: ["Late blight in humid conditions", "Pest susceptibility"],
  },
  {
    cropName: "Groundnut",
    suitability: 68,
    temperature: { min: 20, max: 30 },
    soilMoisture: { min: 40, max: 60 },
    rainfall: { min: 300, max: 500 },
    season: "Summer",
    benefits: ["Protein rich", "Oil content", "Nitrogen fixing"],
    risks: ["Drought sensitive", "Requires well-drained soil"],
  },
  {
    cropName: "Cabbage",
    suitability: 74,
    temperature: { min: 10, max: 20 },
    soilMoisture: { min: 50, max: 75 },
    rainfall: { min: 400, max: 600 },
    season: "Winter",
    benefits: ["Long shelf life", "High nutritional value", "Easy to grow"],
    risks: ["Pest management", "Fungal diseases"],
  },
]

export function getRecommendations(
  temperature: number,
  soilMoisture: number,
  rainfall: number
): CropRecommendation[] {
  const scored = CROP_DATABASE.map((crop) => {
    let score = 100

    // Temperature scoring (40% weight)
    const tempDiff =
      temperature < crop.temperature.min
        ? crop.temperature.min - temperature
        : temperature > crop.temperature.max
          ? temperature - crop.temperature.max
          : 0
    score -= tempDiff * 2

    // Soil moisture scoring (30% weight)
    const moistureDiff =
      soilMoisture < crop.soilMoisture.min
        ? crop.soilMoisture.min - soilMoisture
        : soilMoisture > crop.soilMoisture.max
          ? soilMoisture - crop.soilMoisture.max
          : 0
    score -= moistureDiff * 1.5

    // Rainfall scoring (30% weight)
    const rainfallDiff =
      rainfall < crop.rainfall.min
        ? crop.rainfall.min - rainfall
        : rainfall > crop.rainfall.max
          ? rainfall - crop.rainfall.max
          : 0
    score -= rainfallDiff * 0.5

    return {
      ...crop,
      suitability: Math.max(0, Math.min(100, score)),
    }
  })

  // Sort by suitability and return top recommendations
  return scored.sort((a, b) => b.suitability - a.suitability).slice(0, 5)
}

export function getCropDetails(cropName: string): CropRecommendation | undefined {
  return CROP_DATABASE.find(
    (crop) => crop.cropName.toLowerCase() === cropName.toLowerCase()
  )
}

export function getAllCrops(): CropRecommendation[] {
  return CROP_DATABASE
}
