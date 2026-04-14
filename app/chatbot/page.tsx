'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Bot, User, Loader2, Trash2, Sprout, CloudRain, Bug, FlaskConical, Wheat, Droplets, Sun, ChevronDown } from 'lucide-react'

interface Message {
  role: 'user' | 'model'
  content: string
}

// Categorised starter questions so users know what to ask
const CATEGORIES = [
  {
    label: 'Soil & Nutrients',
    icon: FlaskConical,
    color: 'bg-amber-50 border-amber-200 text-amber-700',
    questions: [
      'How to improve nitrogen levels in sandy soil naturally?',
      'My soil pH is 5.2 — how do I fix it for vegetable farming?',
      'What does low potassium do to crops and how to fix it?',
    ]
  },
  {
    label: 'Crop Management',
    icon: Sprout,
    color: 'bg-green-50 border-green-200 text-green-700',
    questions: [
      'What crops grow best in black cotton soil with low rainfall?',
      'When is the best time to sow rice in Tamil Nadu?',
      'How do I increase yield for my wheat crop this Rabi season?',
    ]
  },
  {
    label: 'Pest & Disease',
    icon: Bug,
    color: 'bg-red-50 border-red-200 text-red-700',
    questions: [
      'How do I manage aphids organically without pesticides?',
      'My tomato leaves have yellow spots — what disease is this?',
      'What are the best natural pesticides for rice paddy?',
    ]
  },
  {
    label: 'Weather & Water',
    icon: CloudRain,
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    questions: [
      'How does excess rain affect paddy crops at flowering stage?',
      'My area gets only 400mm rainfall — which crops can I grow?',
      'How to protect crops from heat stress in summer?',
    ]
  },
]

function FormattedMessage({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <br key={i} />
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <p key={i} className="leading-relaxed">
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
          </p>
        )
      })}
    </div>
  )
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [openCategory, setOpenCategory] = useState<string | null>('Crop Management')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    const newMessages: Message[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to get response')
      setMessages(prev => [...prev, { role: 'model', content: data.reply }])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setMessages(prev => [...prev, { role: 'model', content: `⚠️ Sorry, I couldn't process that. ${msg}` }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [messages, loading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <main className="min-h-screen py-8 px-4" style={{ background: 'radial-gradient(circle at top left, rgba(74,222,128,0.18), transparent 18%), radial-gradient(circle at bottom right, rgba(34,197,94,0.14), transparent 18%), linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 45%, #eff6ff 100%)' }}>
      <div className="container mx-auto max-w-5xl">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-medium mb-3">
            <Bot className="w-4 h-4" /> Powered by Gemini AI
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">AI Farming Assistant</h1>
          <p className="text-gray-500">Ask anything about crops, soil, pests, and farming practices</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* Left: Question starter panel */}
          <div className="lg:col-span-2 space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sun className="w-3.5 h-3.5" /> Tap any question to ask
            </p>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon
              const isOpen = openCategory === cat.label
              return (
                <div key={cat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setOpenCategory(isOpen ? null : cat.label)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${cat.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{cat.label}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="border-t border-gray-50 px-3 pb-3 pt-1 space-y-1">
                      {cat.questions.map(q => (
                        <button key={q} onClick={() => sendMessage(q)}
                          className="w-full text-left text-xs text-gray-600 hover:text-[#0A4D3C] bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-[#0A4D3C]/20 rounded-lg px-3 py-2 transition-all">
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            <div className="bg-green-50 border border-green-200 rounded-xl p-3 mt-3">
              <p className="text-xs font-semibold text-green-800 mb-1">💡 Better questions = better answers</p>
              <p className="text-xs text-green-700 leading-relaxed">Mention your crop, location, soil type, or specific problem for more accurate advice.</p>
              <p className="text-xs text-green-600 mt-1 italic">Example: "My rice in Tamil Nadu has yellow leaves after heavy rain — what's wrong?"</p>
            </div>
          </div>

          {/* Right: Chat */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden" style={{ height: '72vh' }}>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#0A4D3C] to-[#1a7a5e] rounded-2xl flex items-center justify-center mb-5 shadow-lg">
                      <Bot className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">CropCast AI Assistant</h3>
                    <p className="text-gray-400 text-sm mb-3 max-w-xs">
                      Your expert farming companion. Pick a question from the left panel or type your own below.
                    </p>
                    <div className="bg-gray-50 rounded-xl p-3 text-left max-w-xs">
                      <p className="text-xs font-semibold text-gray-500 mb-2">You can ask me about:</p>
                      <ul className="text-xs text-gray-400 space-y-1">
                        {['Which crops suit my soil & climate', 'Fertilizer & nutrient planning', 'Pest & disease identification', 'Irrigation & water management', 'Harvest timing & post-harvest care'].map(t => (
                          <li key={t} className="flex items-center gap-1.5"><span className="text-[#0A4D3C]">✓</span>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' ? 'bg-[#0A4D3C]' : 'bg-gradient-to-br from-[#0A4D3C] to-[#1a7a5e]'
                    }`}>
                      {msg.role === 'user'
                        ? <User className="w-4 h-4 text-white" />
                        : <Bot className="w-4 h-4 text-white" />}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === 'user'
                        ? 'bg-[#0A4D3C] text-white rounded-tr-sm'
                        : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-sm'
                    }`}>
                      <FormattedMessage text={msg.content} />
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0A4D3C] to-[#1a7a5e] flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-[#0A4D3C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-[#0A4D3C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-[#0A4D3C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input bar */}
              <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3">
                {messages.length > 0 && (
                  <div className="flex justify-end mb-2">
                    <button onClick={() => setMessages([])}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3 h-3" /> Clear conversation
                    </button>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="e.g. My rice leaves are turning yellow after rain — what's wrong?"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A4D3C]/30 focus:border-[#0A4D3C] disabled:opacity-50 text-sm transition-colors"
                  />
                  <button type="submit" disabled={loading || !input.trim()}
                    className="bg-[#0A4D3C] text-white w-10 h-10 rounded-xl hover:bg-[#083D2F] active:scale-95 disabled:opacity-40 transition-all flex items-center justify-center flex-shrink-0">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
