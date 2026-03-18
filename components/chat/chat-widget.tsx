"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { useChat } from "@/lib/chat-context"
import { Loader2 } from "lucide-react"

export function ChatWidget() {
  const { messages, isLoading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Agriculture Assistant</CardTitle>
        <CardDescription>AI-powered farming guidance and recommendations</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <ChatInput disabled={isLoading} />
      </CardContent>
    </Card>
  )
}
