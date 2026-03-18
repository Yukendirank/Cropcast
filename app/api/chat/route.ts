import { generateCropPrediction } from "@/lib/gemini-api"

export const runtime = "nodejs"

const SYSTEM_PROMPT = `You are an expert agriculture and farming consultant with deep knowledge of:
- Crop selection and recommendations based on climate and soil conditions
- Fertilizer management and optimal nutrient ratios
- Pest and disease management
- Sustainable farming practices
- Weather patterns and their impact on farming
- Irrigation and water management
- Soil health and improvement

Always provide practical, actionable advice tailored to the farmer's context. When users ask about specific crops or conditions, consider multiple factors and provide comprehensive recommendations. Be supportive and encouraging of sustainable farming practices.`

export async function POST(request: Request) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!message || typeof message !== "string") {
      return Response.json(
        { error: "Invalid message format" },
        { status: 400 }
      )
    }

    console.log("[v0] Chat request received:", message)

    // Format conversation history for the API
    const formattedHistory = conversationHistory
      .map(
        (msg: any) =>
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n")

    const prompt = `${SYSTEM_PROMPT}

Conversation History:
${formattedHistory}

User: ${message}
