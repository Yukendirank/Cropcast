import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "")
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

export interface ChatRequest {
  message: string
  crop?: string
  location?: string
  conversationHistory?: Array<{ role: string; content: string }>
}

export interface ChatResponse {
  response: string
  timestamp: string
}

function createSystemPrompt(crop?: string, location?: string): string {
  let prompt = `You are an expert agricultural assistant for CropCast, a smart farming platform. Your role is to provide helpful, practical advice about farming, crop cultivation, weather impacts, fertilizers, and agricultural best practices.

Guidelines:
- Be friendly, professional, and informative
- Provide practical, actionable advice
- Consider local farming conditions when relevant
- Focus on sustainable and efficient farming practices
- If asked about specific crops or locations, tailor your advice accordingly`

  if (crop) {
    prompt += `\n- The user is currently working with ${crop} crop`
  }

  if (location) {
    prompt += `\n- The user is farming in ${location}`
  }

  prompt += `\n\nProvide concise, helpful responses that are easy to understand.`

  return prompt
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()

    if (!body.message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const systemPrompt = createSystemPrompt(body.crop, body.location)

    // Build conversation history for context (excluding the current message)
    const history = []

    // Add conversation history if provided
    if (body.conversationHistory && body.conversationHistory.length > 0) {
      for (const msg of body.conversationHistory) {
        if (msg.role === "user") {
          history.push({
            role: "user",
            parts: [{ text: msg.content }],
          })
        } else if (msg.role === "model" || msg.role === "assistant") {
          history.push({
            role: "model",
            parts: [{ text: msg.content }],
          })
        }
      }
    }

    // Start chat session with system prompt and previous history
    const chat = model.startChat({
      history: history.length > 0 ? history : undefined,
      systemInstruction: systemPrompt,
    })

    // Send the current message (this will be added to history automatically)
    const result = await chat.sendMessage(body.message)
    const responseText = result.response.text()

    const response: ChatResponse = {
      response: responseText,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Chat API Error:", error)

    // Fallback response
    const fallbackResponse: ChatResponse = {
      response:
        "I apologize, but I'm currently unable to process your request. Please try again in a moment. In the meantime, you can explore our other features like crop recommendations, weather insights, and fertilizer suggestions.",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(fallbackResponse)
  }
}
