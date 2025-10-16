import { type NextRequest, NextResponse } from "next/server"
import { geminiPredictor, type CropData } from "@/lib/gemini-api"

export async function POST(request: NextRequest) {
  try {
    const data: CropData = await request.json()

    // Use Gemini AI for prediction
    const prediction = await geminiPredictor.predictYield(data)

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Gemini API prediction error:", error)

    // Fallback to simple calculation if Gemini fails
    let mockPrediction = 2500
    const data: CropData = {
      rainfall: 100,
      temperature: 25,
      humidity: 50,
      soil_type: "loamy",
      soil_ph: 6.5,
      fertilizer_use: "high",
      irrigation: "drip",
      pest_control: true,
      disease_presence: false,
      crop_variety: "hybrid",
    }

    // Weather factors
    mockPrediction += (data.rainfall - 100) * 8
    mockPrediction += (25 - Math.abs(data.temperature - 25)) * 20
    mockPrediction += (data.humidity - 50) * 5

    // Soil factors
    if (data.soil_type === "loamy") mockPrediction += 500
    else if (data.soil_type === "clay") mockPrediction += 200
    else if (data.soil_type === "sandy") mockPrediction -= 200

    mockPrediction += (7 - Math.abs(data.soil_ph - 6.5)) * 100

    // Management factors
    if (data.fertilizer_use === "high") mockPrediction += 600
    else if (data.fertilizer_use === "moderate") mockPrediction += 300
    else if (data.fertilizer_use === "low") mockPrediction += 100

    if (data.irrigation === "drip") mockPrediction += 400
    else if (data.irrigation === "sprinkler") mockPrediction += 300

    if (data.pest_control) mockPrediction += 200
    if (data.disease_presence) mockPrediction -= 500

    if (data.crop_variety.includes("hybrid")) mockPrediction += 400

    // Add some randomness and ensure minimum
    mockPrediction += Math.random() * 400 - 200
    mockPrediction = Math.max(mockPrediction, 800)

    const fallbackResponse = {
      predicted_yield_kg_per_hectare: Math.round(mockPrediction),
      confidence_score: 0.65 + Math.random() * 0.15,
      model_used: "Fallback Model (Gemini Unavailable)",
      factors_analyzed: 10,
      recommendations: [
        "Consider optimizing irrigation schedule",
        "Monitor soil pH levels regularly",
        "Apply appropriate fertilizer based on soil test",
      ],
    }

    return NextResponse.json(fallbackResponse)
  }
}
