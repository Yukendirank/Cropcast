import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "")
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
})

export interface CropData {
  rainfall: number
  temperature: number
  humidity: number
  soil_type: string
  soil_ph: number
  fertilizer_use: string
  irrigation: string
  pest_control: boolean
  crop_variety: string
  disease_presence: boolean
}

export interface PredictionResponse {
  predicted_yield_kg_per_hectare: number
  confidence_score: number
  model_used: string
  factors_analyzed: number
  recommendations?: string[]
  risk_factors?: string[]
}

export class GeminiCropPredictor {
  private createPrompt(data: CropData): string {
    return `You are an expert agricultural AI system specializing in crop yield prediction. Based on the following agricultural data, provide a detailed crop yield prediction.

**Input Data:**
- Rainfall: ${data.rainfall}mm
- Temperature: ${data.temperature}°C
- Humidity: ${data.humidity}%
- Soil Type: ${data.soil_type}
- Soil pH: ${data.soil_ph}
- Fertilizer Use: ${data.fertilizer_use}
- Irrigation: ${data.irrigation}
- Pest Control: ${data.pest_control ? "Applied" : "Not Applied"}
- Crop Variety: ${data.crop_variety}
- Disease Presence: ${data.disease_presence ? "Detected" : "Not Detected"}

**Required Response Format (JSON only):**
{
  "predicted_yield_kg_per_hectare": [number between 1000-8000],
  "confidence_score": [number between 0.6-0.95],
  "model_used": "Gemini AI Agricultural Model",
  "factors_analyzed": 10,
  "recommendations": [
    "specific farming recommendation 1",
    "specific farming recommendation 2",
    "specific farming recommendation 3"
  ],
  "risk_factors": [
    "potential risk factor 1",
    "potential risk factor 2"
  ]
}

**Analysis Guidelines:**
- Consider optimal ranges: Temperature 20-30°C, Rainfall 500-1500mm, Humidity 50-70%, pH 6.0-7.5
- Higher fertilizer use and pest control generally increase yield
- Hybrid varieties typically yield 20-30% more than traditional varieties
- Disease presence reduces yield by 15-25%
- Drip irrigation is most efficient, followed by sprinkler systems
- Soil type affects water retention and nutrient availability

Provide ONLY the JSON response, no additional text or explanation.`
  }

  async predictYield(data: CropData): Promise<PredictionResponse> {
    try {
      const prompt = this.createPrompt(data)
      const result = await model.generateContent(prompt)
      const responseText = result.response.text()

      // Clean the response to extract JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Invalid response format from Gemini API")
      }

      const prediction = JSON.parse(jsonMatch[0])

      // Validate the response structure
      if (!prediction.predicted_yield_kg_per_hectare || !prediction.confidence_score) {
        throw new Error("Incomplete prediction data")
      }

      return prediction
    } catch (error) {
      console.error("Gemini API Error:", error)
      throw new Error("Failed to generate crop yield prediction")
    }
  }

  async getModelInfo() {
    return {
      model_type: "Gemini AI Agricultural Model",
      version: "2.0-flash-exp",
      capabilities: "Advanced crop yield prediction with contextual recommendations",
      feature_count: 10,
      training_data: "Global agricultural datasets and expert knowledge",
    }
  }
}

export const geminiPredictor = new GeminiCropPredictor()

// Utility function to transform form data to API format
export function transformFormDataToAPI(formData: {
  rainfall: string
  temperature: string
  humidity: string
  soilType: string
  soilPh: string
  fertilizerUse: string
  irrigation: string
  pestControl: boolean
  cropVariety: string
  diseasePresence: boolean
}): CropData {
  return {
    rainfall: Number.parseFloat(formData.rainfall) || 0,
    temperature: Number.parseFloat(formData.temperature) || 0,
    humidity: Number.parseFloat(formData.humidity) || 0,
    soil_type: formData.soilType,
    soil_ph: Number.parseFloat(formData.soilPh) || 6.5,
    fertilizer_use: formData.fertilizerUse,
    irrigation: formData.irrigation,
    pest_control: formData.pestControl,
    crop_variety: formData.cropVariety,
    disease_presence: formData.diseasePresence,
  }
}
