"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChat } from "@/lib/chat-context"
import { Send, Loader2 } from "lucide-react"

interface ChatInputProps {
  disabled?: boolean
}

export function ChatInput({ disabled = false }: ChatInputProps) {
  const { sendMessage, isLoading } = useChat()
  const [input, setInput] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || disabled || isLoading) return

    await sendMessage(input)
    setInput("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Ask for farming advice, crop recommendations, etc..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled || isLoading}
        className="flex-1"
      />
      <Button
        type="submit"
        disabled={disabled || isLoading || !input.trim()}
        size="icon"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  )
}
