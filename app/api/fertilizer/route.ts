import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export interface FertilizerInput {
  cropName: string
  soilType: string
  nitrogen: number
  phosphorus: number
  potassium: number
  ph: number
  organicMatter: string
  cropStage: string
  previousCrop: string
  targetYield: string
  weatherCondition?: string
  nutrientDeficiency?: string
}

export async function POST(request: NextRequest) {
  const GEMINI_KEY = process.env.GOOGLE_GEMINI_API_KEY
  if (!GEMINI_KEY) {
    return NextResponse.json({ error: "Missing GOOGLE_GEMINI_API_KEY" }, { status: 500 })
  }

  const ai = new GoogleGenAI({
    apiKey: GEMINI_KEY,
  })

  try {
    const data: FertilizerInput = await request.json()

    const prompt = `You are a senior agronomist and fertilizer specialist. Based on the following crop, soil, weather, and nutrient deficiency details, provide a practical fertilizer plan.

CROP & GROWTH DATA:
- Crop: ${data.cropName}
- Soil Type: ${data.soilType}
- Current Nitrogen: ${data.nitrogen} kg/ha
- Current Phosphorus: ${data.phosphorus} kg/ha
- Current Potassium: ${data.potassium} kg/ha
- Soil pH: ${data.ph}
- Organic Matter: ${data.organicMatter}
- Crop Stage: ${data.cropStage}
- Previous Crop: ${data.previousCrop}
- Target Yield: ${data.targetYield}
- Weather Condition: ${data.weatherCondition ?? 'Not provided'}
- Nutrient Deficiency: ${data.nutrientDeficiency ?? 'Not provided'}

Return ONLY a valid JSON object with exactly these keys: fertilizer, dosage, application_method, timing, precautions.
No markdown, no code blocks, and no explanation outside the returned JSON object.

Example response:
{
  "fertilizer": "Urea 46-0-0 and DAP 18-46-0",
  "dosage": "150 kg/ha Urea and 100 kg/ha DAP",
  "application_method": "Apply half before sowing and half at tillering, broadcast and incorporate.",
  "timing": "Apply the first dose at pre-sowing and the second dose at 30 days after emergence.",
  "precautions": [
    "Do not apply before heavy rain.",
    "Avoid direct contact with leaves to prevent burning.",
    "Wear gloves and wash hands after handling fertilizer."
  ]
}`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    })

    const text = response.text?.trim() ?? ""
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error("Raw response:", text)
      throw new Error("Could not extract JSON object from response")
    }

    const suggestion = JSON.parse(jsonMatch[0])
    return NextResponse.json({ suggestion })
  } catch (err) {
    console.error("Fertilizer suggestion error:", err)
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: `Failed to generate suggestion: ${message}` }, { status: 500 })
  }
}
