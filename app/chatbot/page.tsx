'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertCircle, Loader2, Send, MessageSquare } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your CropCast AI Assistant. I\'m here to help you with farming advice, crop recommendations, weather insights, and more. How can I help you today?',
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [crop, setCrop] = useState('')
  const [location, setLocation] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setError('')

    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Prepare conversation history
      const conversationHistory = messages.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        content: msg.content,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          crop: crop || undefined,
          location: location || undefined,
          conversationHistory,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: data.timestamp,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      // Remove the user message if there was an error
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m your CropCast AI Assistant. I\'m here to help you with farming advice, crop recommendations, weather insights, and more. How can I help you today?',
        timestamp: new Date().toISOString(),
      },
    ])
    setInput('')
  }

  return (
    <main className="py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A4D3C] mb-4">AI Chat Assistant</h1>
          <p className="text-lg text-gray-600">
            Get personalized farming advice from our intelligent AI assistant.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 h-[600px]">
          {/* Chat Panel */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Chat with CropCast AI</CardTitle>
                <CardDescription>Ask questions about farming, crops, and more</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages Area */}
                <ScrollArea className="flex-1 pr-4 mb-4 border rounded-lg p-4 bg-gray-50">
                  <div ref={scrollRef} className="space-y-4">
                    {messages.map((message, idx) => (
                      <div key={idx} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-xs px-4 py-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-[#0A4D3C] text-white rounded-br-none'
                              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}

                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg rounded-bl-none">
                          <div className="flex gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question here..."
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-[#0A4D3C] hover:bg-[#083D2F]"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Context Panel */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">Context</CardTitle>
                <CardDescription>Optional farming details</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                {/* Crop Type */}
                <div>
                  <Label htmlFor="cropSelect">Crop Type</Label>
                  <Select value={crop} onValueChange={setCrop}>
                    <SelectTrigger id="cropSelect">
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rice">Rice</SelectItem>
                      <SelectItem value="wheat">Wheat</SelectItem>
                      <SelectItem value="corn">Corn</SelectItem>
                      <SelectItem value="sugarcane">Sugarcane</SelectItem>
                      <SelectItem value="vegetables">Vegetables</SelectItem>
                      <SelectItem value="cotton">Cotton</SelectItem>
                      <SelectItem value="groundnut">Groundnut</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Chennai"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                {/* Clear Chat */}
                <Button
                  onClick={handleClearChat}
                  variant="outline"
                  className="mt-auto w-full border-[#0A4D3C] text-[#0A4D3C] hover:bg-[#0A4D3C] hover:text-white"
                >
                  Clear Chat
                </Button>

                {/* Suggested Questions */}
                <div className="border-t pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Suggested Questions</p>
                  <div className="space-y-2">
                    {[
                      'What should I plant this season?',
                      'How do I improve soil quality?',
                      'Best fertilizer for my crop?',
                    ].map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInput(question)
                        }}
                        className="w-full text-left text-xs bg-gray-100 hover:bg-[#0A4D3C] hover:text-white text-gray-700 p-2 rounded transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
