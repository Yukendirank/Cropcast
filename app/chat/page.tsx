"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ChatWidget } from "@/components/chat/chat-widget"
import { ChatProvider } from "@/lib/chat-context"
import { Button } from "@/components/ui/button"
import { useChat } from "@/lib/chat-context"
import { Trash2 } from "lucide-react"

function ChatPageContent() {
  const { clearMessages } = useChat()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">AI Assistant</h1>
              <Button
                variant="outline"
                size="sm"
                onClick={clearMessages}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Chat
              </Button>
            </div>
            <p className="text-xl text-muted-foreground">
              Get AI-powered guidance on farming, crop selection, and pest management
            </p>
          </div>

          <div className="bg-background border rounded-lg" style={{ height: "600px" }}>
            <ChatWidget />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatProvider>
        <ChatPageContent />
      </ChatProvider>
    </ProtectedRoute>
  )
}
