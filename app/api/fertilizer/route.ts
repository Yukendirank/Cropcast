import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "")
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

export interface FertilizerRequest {
  nitrogen: number
  phosphorus: number
  potassium: number
  cropType: string
  soilType: string
}

export interface FertilizerResponse {
  fertilizerName: string
  npkRatio: string
  usageInstructions: string[]
  applicationRate: string
  tips: string[]
  warnings: string[]
  improvementTips: string[]
}

function createPrompt(data: FertilizerRequest): string {
  return `You are an expert agricultural chemist specializing in fertilizer recommendations. Based on the following soil and crop data, suggest the best fertilizer.

**Input Data:**
- Nitrogen (N): ${data.nitrogen} mg/kg
- Phosphorus (P): ${data.phosphorus} mg/kg
- Potassium (K): ${data.potassium} mg/kg
- Crop Type: ${data.cropType}
- Soil Type: ${data.soilType}

**Analysis Guidelines:**
- Low N (<100), Medium N (100-200), High N (>200)
- Low P (<20), Medium P (20-40), High P (>40)
- Low K (<100), Medium K (100-200), High K (>200)
- Recommend appropriate NPK fertilizer ratios

**Required Response Format (JSON only):**
{
  "fertilizerName": "Name of recommended fertilizer with NPK ratio (e.g., 'NPK 10-20-10')",
  "npkRatio": "Specific NPK ratio recommendation (e.g., '10-20-10')",
  "usageInstructions": [
    "Instruction 1",
    "Instruction 2",
    "Instruction 3"
  ],
  "applicationRate": "Recommended application rate (e.g., '50 kg/hectare')",
  "tips": [
    "Best practice tip 1",
    "Best practice tip 2",
    "Best practice tip 3"
  ],
  "warnings": [
    "Warning 1 if nutrient is too high",
    "Warning 2 if nutrient is too low"
  ],
  "improvementTips": [
    "Improvement tip 1",
    "Improvement tip 2"
  ]
}

Provide ONLY the JSON response, no additional text or explanation.`
}

export async function POST(request: NextRequest) {
  try {
    const data: FertilizerRequest = await request.json()

    // Validate input
    if (!data.cropType || !data.soilType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const prompt = createPrompt(data)
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Invalid response format from Gemini API")
    }

    const recommendation: FertilizerResponse = JSON.parse(jsonMatch[0])

    return NextResponse.json(recommendation)
  } catch (error) {
    console.error("Fertilizer API Error:", error)

    // Fallback response
    const fallbackResponse: FertilizerResponse = {
      fertilizerName: "NPK 10-20-10",
      npkRatio: "10-20-10",
      usageInstructions: [
        "Apply during planting season",
        "Mix with soil thoroughly",
        "Water immediately after application",
      ],
      applicationRate: "50 kg/hectare",
      tips: [
        "Apply fertilizer in split doses for better absorption",
        "Avoid direct contact with plant stems",
        "Use organic matter to improve soil structure",
      ],
      warnings: [
        "Check soil test results for accurate recommendations",
      ],
      improvementTips: [
        "Conduct soil testing before fertilizer application",
        "Use organic fertilizers for sustainable farming",
      ],
    }

    return NextResponse.json(fallbackResponse)
  }
}
