"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Cloud, MessageCircle, Beaker } from "lucide-react"

export function ExploreSection() {
  const suggestions = [
    {
      id: "weather",
      title: "Weather Insights",
      description: "Check real-time weather impact on your prediction",
      icon: Cloud,
      href: "/weather",
    },
    {
      id: "chatbot",
      title: "Ask AI Assistant",
      description: "Get personalized farming advice from our AI expert",
      icon: MessageCircle,
      href: "/chat",
    },
    {
      id: "fertilizer",
      title: "Fertilizer Guide",
      description: "Optimize fertilizer recommendations for better yield",
      icon: Beaker,
      href: "/fertilizer",
    },
  ]

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="text-xl">You may also explore</CardTitle>
        <CardDescription>Discover related tools to optimize your farming</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((item) => {
            const IconComponent = item.icon
            return (
              <Link key={item.id} href={item.href}>
                <div className="p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                  <div className="flex items-start gap-3 mb-2">
                    <IconComponent className="w-5 h-5 text-primary mt-1" />
                    <h4 className="font-semibold group-hover:text-primary transition-colors">{item.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <Button variant="ghost" size="sm" className="p-0 h-auto text-primary">
                    Explore
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
