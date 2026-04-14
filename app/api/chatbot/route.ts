import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

interface ChatMessage {
  role: 'user' | 'assistant' | string
  content: string
}

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "Missing GOOGLE_GEMINI_API_KEY" }, { status: 500 })
  }

  const ai = new GoogleGenAI({ apiKey })

  try {
    const body = await req.json()
    const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : []

    if (!messages.length) {
      return NextResponse.json({ error: "Chat history is required" }, { status: 400 })
    }

    const conversation = messages
      .map((message) => {
        const role = message.role === 'assistant' ? 'Assistant' : 'User'
        return `${role}: ${message.content}`
      })
      .join('\n\n')

    const prompt = `You are CropCast, a friendly agriculture expert for farmers.
Help users with practical guidance on crops, soil, fertilizer, weather, pests, irrigation, and farm management. Answer clearly and avoid unnecessary marketing.

${conversation}

Assistant:`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    })

    const reply = response.text?.trim() ?? ""
    if (!reply) {
      throw new Error("Empty response from Gemini")
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("Chatbot error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: `Failed to generate reply: ${message}` }, { status: 500 })
  }
}
