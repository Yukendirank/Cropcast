import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

const GEMINI_KEY = process.env.GOOGLE_GEMINI_API_KEY

export interface CropRecommendationInput {
  nitrogen: number
  phosphorus: number
  potassium: number
  temperature: number
  humidity: number
  ph: number
  rainfall: number
  location: string
  season: string
}

export async function POST(request: NextRequest) {
  if (!GEMINI_KEY) {
    return NextResponse.json({ error: "Missing GOOGLE_GEMINI_API_KEY" }, { status: 500 })
  }

  const ai = new GoogleGenAI({
    apiKey: GEMINI_KEY,
  })

  try {
    const data: CropRecommendationInput = await request.json()

    const prompt = `You are an expert agronomist with 30 years of experience. Analyze the following soil and environmental conditions and recommend the TOP 5 most suitable crops.

INPUT DATA:
- Nitrogen (N): ${data.nitrogen} kg/ha
- Phosphorus (P): ${data.phosphorus} kg/ha  
- Potassium (K): ${data.potassium} kg/ha
- Temperature: ${data.temperature}°C
- Humidity: ${data.humidity}%
- Soil pH: ${data.ph}
- Annual Rainfall: ${data.rainfall}mm
- Region: ${data.location}
- Season: ${data.season}

TASK: Return ONLY a valid JSON array with exactly 5 crops. No markdown, no code blocks, no explanation text outside the JSON.

[
  {
    "crop": "Crop Name",
    "suitabilityScore": 92,
    "reason": "2-3 sentence explanation of why this crop matches the given conditions",
    "growingPeriod": "3-4 months",
    "expectedYield": "4-6 tonnes/ha",
    "tips": [
      "Specific actionable tip 1",
      "Specific actionable tip 2", 
      "Specific actionable tip 3"
    ]
  }
]

Return ONLY the JSON array starting with [ and ending with ]. Nothing else.`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    })

    const text = response.text!.trim()

    // Strip any markdown code blocks if present
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.error("Raw response:", text)
      throw new Error("Could not extract JSON array from response")
    }

    const recommendations = JSON.parse(jsonMatch[0])

    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      throw new Error("Invalid recommendations format")
    }

    return NextResponse.json({ recommendations })
  } catch (err) {
    console.error("Crop recommendation error:", err)
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: `Failed to generate recommendations: ${message}` }, { status: 500 })
  }
}
