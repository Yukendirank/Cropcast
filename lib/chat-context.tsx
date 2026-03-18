"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface ChatContextType {
  messages: Message[]
  isLoading: boolean
  addMessage: (content: string, role: "user" | "assistant") => void
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  error: string | null
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm the CropCast Agriculture Assistant. I can help you with crop recommendations, fertilizer advice, pest management, and farming best practices. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addMessage = (content: string, role: "user" | "assistant") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const sendMessage = async (content: string) => {
    setIsLoading(true)
    setError(null)

    try {
      addMessage(content, "user")

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from AI")
      }

      const data = await response.json()
      addMessage(data.response || data.message, "assistant")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      console.error("[v0] Chat error:", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const clearMessages = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hello! I'm the CropCast Agriculture Assistant. I can help you with crop recommendations, fertilizer advice, pest management, and farming best practices. How can I assist you today?",
        timestamp: new Date(),
      },
    ])
    setError(null)
  }

  return (
    <ChatContext.Provider
      value={{ messages, isLoading, addMessage, sendMessage, clearMessages, error }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within ChatProvider")
  }
  return context
}
