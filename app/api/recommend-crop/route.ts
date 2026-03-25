import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "")
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

export interface CropRecommendationRequest {
  soilType: string
  temperature: number
  rainfall: number
  location: string
}

export interface CropRecommendation {
  cropName: string
  suitability: "Highly Suitable" | "Suitable" | "Moderately Suitable"
  explanation: string
  farmingTips: string[]
  expectedYield?: string
  seasonalAdvice?: string
}

export interface CropRecommendationResponse {
  recommendations: CropRecommendation[]
  bestCrop: string
  generalAdvice: string[]
}

function createPrompt(data: CropRecommendationRequest): string {
  return `You are an expert agricultural scientist specializing in crop selection. Based on the following environmental conditions, recommend suitable crops.

**Environmental Data:**
- Soil Type: ${data.soilType}
- Temperature: ${data.temperature}°C
- Rainfall: ${data.rainfall}mm annually
- Location: ${data.location}

**Analysis Guidelines:**
- Consider temperature tolerance ranges for different crops
- Match rainfall requirements to local climate
- Account for soil suitability for each crop type
- Recommend 4-5 crops with different suitability levels
- Highlight the best option based on all factors

**Required Response Format (JSON only):**
{
  "recommendations": [
    {
      "cropName": "Crop name",
      "suitability": "Highly Suitable|Suitable|Moderately Suitable",
      "explanation": "Why this crop is suitable for the given conditions",
      "farmingTips": [
        "Tip 1",
        "Tip 2",
        "Tip 3"
      ],
      "expectedYield": "Expected yield range (optional)",
      "seasonalAdvice": "Best season to plant (optional)"
    }
  ],
  "bestCrop": "Name of the most suitable crop",
  "generalAdvice": [
    "Advice 1",
    "Advice 2",
    "Advice 3"
  ]
}

Provide ONLY the JSON response, no additional text or explanation.`
}

export async function POST(request: NextRequest) {
  try {
    const data: CropRecommendationRequest = await request.json()

    // Validate input
    if (!data.soilType || !data.location) {
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

    const recommendations: CropRecommendationResponse = JSON.parse(jsonMatch[0])

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Crop Recommendation API Error:", error)

    // Fallback response
    const fallbackResponse: CropRecommendationResponse = {
      recommendations: [
        {
          cropName: "Rice",
          suitability: "Highly Suitable",
          explanation: "Well suited to tropical conditions with high rainfall",
          farmingTips: [
            "Plant during monsoon season",
            "Maintain water logging during growing period",
            "Use quality seeds for better yield",
          ],
          expectedYield: "4-6 tons/hectare",
          seasonalAdvice: "June to October",
        },
        {
          cropName: "Sugarcane",
          suitability: "Suitable",
          explanation: "Requires moderate temperature and good water availability",
          farmingTips: [
            "Plant in cooler months",
            "Ensure proper irrigation",
            "Apply balanced fertilizer",
          ],
          expectedYield: "60-70 tons/hectare",
          seasonalAdvice: "October to December",
        },
        {
          cropName: "Vegetables",
          suitability: "Suitable",
          explanation: "Various vegetables can thrive in diverse conditions",
          farmingTips: [
            "Choose varieties suited to local conditions",
            "Maintain proper spacing",
            "Regular pest management",
          ],
          seasonalAdvice: "Year-round with seasonal rotation",
        },
      ],
      bestCrop: "Rice",
      generalAdvice: [
        "Conduct soil testing before deciding on crops",
        "Follow local agricultural extension recommendations",
        "Practice crop rotation for soil health",
      ],
    }

    return NextResponse.json(fallbackResponse)
  }
}
