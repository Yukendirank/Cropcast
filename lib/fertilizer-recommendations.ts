/**
 * Fertilizer Recommendation Engine
 * Provides intelligent fertilizer recommendations based on crop type and soil conditions
 */

export interface FertilizerRecommendation {
  fertilizerName: string
  type: "NPK" | "Organic" | "Micronutrient" | "Bio"
  nContent: number // Nitrogen %
  pContent: number // Phosphorus %
  kContent: number // Potassium %
  dosage: string // kg/hectare
  timing: string
  application: string
  benefits: string[]
  compatibility: string[]
  costPerKg: number
  organicFriendly: boolean
}

const FERTILIZER_DATABASE: FertilizerRecommendation[] = [
  {
    fertilizerName: "NPK 10:26:26",
    type: "NPK",
    nContent: 10,
    pContent: 26,
    kContent: 26,
    dosage: "300-400",
    timing: "Before sowing",
    application: "Broadcast and incorporate",
    benefits: [
      "Balanced nutrients",
      "Strong root development",
      "High yield potential",
    ],
    compatibility: ["Wheat", "Rice", "Corn", "Sugarcane"],
    costPerKg: 25,
    organicFriendly: false,
  },
  {
    fertilizerName: "Urea (46% N)",
    type: "NPK",
    nContent: 46,
    pContent: 0,
    kContent: 0,
    dosage: "150-200",
    timing: "Top dressing at growth stage",
    application: "Broadcast or band placement",
    benefits: ["High nitrogen content", "Quick absorption", "Cost effective"],
    compatibility: [
      "Wheat",
      "Rice",
      "Corn",
      "Sugarcane",
      "Tobacco",
      "Cabbage",
    ],
    costPerKg: 22,
    organicFriendly: false,
  },
  {
    fertilizerName: "Single Super Phosphate (SSP)",
    type: "NPK",
    nContent: 0,
    pContent: 16,
    kContent: 0,
    dosage: "200-250",
    timing: "Before planting",
    application: "Incorporated into soil",
    benefits: [
      "Root development",
      "Flower and fruit formation",
      "Phosphorus rich",
    ],
    compatibility: [
      "Groundnut",
      "Cotton",
      "Soybean",
      "Tomato",
      "Potato",
    ],
    costPerKg: 15,
    organicFriendly: false,
  },
  {
    fertilizerName: "Muriate of Potash (MOP)",
    type: "NPK",
    nContent: 0,
    pContent: 0,
    kContent: 60,
    dosage: "100-150",
    timing: "Before sowing or as top dressing",
    application: "Broadcast and incorporate",
    benefits: ["High potassium", "Disease resistance", "Fruit quality"],
    compatibility: ["Tomato", "Cotton", "Sugarcane", "Potato"],
    costPerKg: 28,
    organicFriendly: false,
  },
  {
    fertilizerName: "Farmyard Manure (FYM)",
    type: "Organic",
    nContent: 0.5,
    pContent: 0.2,
    kContent: 0.5,
    dosage: "10000-15000",
    timing: "Before sowing (2-3 weeks)",
    application: "Incorporated into soil",
    benefits: [
      "Soil conditioning",
      "Organic matter enrichment",
      "Microbial activity",
      "Cost effective",
    ],
    compatibility: ["All crops"],
    costPerKg: 2,
    organicFriendly: true,
  },
  {
    fertilizerName: "Vermicompost",
    type: "Organic",
    nContent: 2.5,
    pContent: 1.8,
    kContent: 0.9,
    dosage: "5000-8000",
    timing: "Before sowing",
    application: "Mixed with soil",
    benefits: [
      "Excellent soil improvement",
      "Slow release nutrients",
      "Microbial inoculants",
      "Sustainable",
    ],
    compatibility: ["All crops"],
    costPerKg: 8,
    organicFriendly: true,
  },
  {
    fertilizerName: "Neem Cake",
    type: "Bio",
    nContent: 3.5,
    pContent: 1,
    kContent: 1.5,
    dosage: "1000-1500",
    timing: "At planting and as top dressing",
    application: "Mixed into soil",
    benefits: [
      "Natural pest deterrent",
      "Nitrogen enriched",
      "Soil conditioning",
      "Sustainable",
    ],
    compatibility: ["All crops"],
    costPerKg: 18,
    organicFriendly: true,
  },
  {
    fertilizerName: "Bio-Fertilizer (Azotobacter)",
    type: "Bio",
    nContent: 0,
    pContent: 0,
    kContent: 0,
    dosage: "5-10",
    timing: "Before sowing",
    application: "With seed treatment",
    benefits: [
      "Nitrogen fixation",
      "Plant growth promotion",
      "Cost effective",
      "Sustainable",
    ],
    compatibility: ["Wheat", "Corn", "Soybean", "Legumes"],
    costPerKg: 50,
    organicFriendly: true,
  },
  {
    fertilizerName: "Zinc Sulfate (Micronutrient)",
    type: "Micronutrient",
    nContent: 0,
    pContent: 0,
    kContent: 0,
    dosage: "20-25",
    timing: "As foliar spray or soil application",
    application: "Foliar spray at growth stages",
    benefits: ["Zinc deficiency correction", "Enzyme activation"],
    compatibility: ["All crops"],
    costPerKg: 120,
    organicFriendly: false,
  },
  {
    fertilizerName: "Boron (Micronutrient)",
    type: "Micronutrient",
    nContent: 0,
    pContent: 0,
    kContent: 0,
    dosage: "1-2",
    timing: "Foliar spray",
    application: "Foliar spray at flowering",
    benefits: [
      "Boron deficiency correction",
      "Fruit set improvement",
      "Sugar translocation",
    ],
    compatibility: ["Sugarcane", "Cotton", "Fruits"],
    costPerKg: 350,
    organicFriendly: false,
  },
]

interface RecommendationInput {
  cropType: string
  soilType?: string
  yieldTarget?: number
  organicPreference?: boolean
}

export function getFertilizerRecommendations(
  input: RecommendationInput
): FertilizerRecommendation[] {
  const compatible = FERTILIZER_DATABASE.filter((fert) => {
    const isCompatible = fert.compatibility.includes(input.cropType) ||
      fert.compatibility.includes("All crops")

    if (input.organicPreference && !fert.organicFriendly) {
      return false
    }

    return isCompatible
  })

  // Sort by suitability (base NPK content for crop type)
  return compatible.sort((a, b) => {
    const aScore = a.nContent + a.pContent + a.kContent
    const bScore = b.nContent + b.pContent + b.kContent
    return bScore - aScore
  })
}

export function getFertilizerDetails(
  name: string
): FertilizerRecommendation | undefined {
  return FERTILIZER_DATABASE.find(
    (fert) => fert.fertilizerName.toLowerCase() === name.toLowerCase()
  )
}

export function calculateFertilizerCost(
  fertilizer: FertilizerRecommendation,
  areaHectares: number
): number {
  const dosageMin = parseInt(fertilizer.dosage.split("-")[0])
  const totalQuantity = dosageMin * areaHectares
  return totalQuantity * fertilizer.costPerKg
}

export function createFertilizerSchedule(
  cropType: string,
  areaHectares: number
): Array<{
  stage: string
  fertilizer: string
  dosage: string
  date: string
}> {
  const recommendations = getFertilizerRecommendations({ cropType })

  return [
    {
      stage: "Pre-sowing",
      fertilizer:
        recommendations.find((f) => f.timing.includes("Before sowing"))?.fertilizerName ||
        "Farmyard Manure",
      dosage: "As per recommendation",
      date: "2-3 weeks before sowing",
    },
    {
      stage: "At sowing",
      fertilizer:
        recommendations.find((f) => f.timing.includes("At sowing"))?.fertilizerName ||
        "NPK 10:26:26",
      dosage: "As per recommendation",
      date: "At the time of sowing",
    },
    {
      stage: "Growth stage",
      fertilizer:
        recommendations.find((f) => f.timing.includes("growth"))?.fertilizerName ||
        "Urea",
      dosage: "As per recommendation",
      date: "45-60 days after sowing",
    },
    {
      stage: "Flowering",
      fertilizer:
        recommendations.find((f) => f.timing.includes("flowering"))?.fertilizerName ||
        "Potassium based",
      dosage: "As per recommendation",
      date: "At flowering stage",
    },
  ]
}

export function getAllFertilizers(): FertilizerRecommendation[] {
  return FERTILIZER_DATABASE
}
