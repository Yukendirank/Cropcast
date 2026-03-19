"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  Sprout, 
  Cloud, 
  MessageCircle, 
  History, 
  Lightbulb, 
  Beaker 
} from "lucide-react"

interface FeatureCardProps {
  id: string
  title: string
  description: string
  icon: "sprout" | "cloud" | "messageCircle" | "history" | "lightbulb" | "beaker"
  href: string
  badge: string
  color: string
}

const iconMap = {
  sprout: Sprout,
  cloud: Cloud,
  messageCircle: MessageCircle,
  history: History,
  lightbulb: Lightbulb,
  beaker: Beaker,
}

export function FeatureCard({
  id,
  title,
  description,
  icon,
  href,
  badge,
  color,
}: FeatureCardProps) {
  const IconComponent = iconMap[icon]

  return (
    <Link key={id} href={href}>
      <Card className={`h-full cursor-pointer hover:shadow-lg transition-all hover:scale-105 ${color}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <IconComponent className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <span className="text-xs font-semibold px-2 py-1 bg-white/80 dark:bg-gray-800/80 rounded-full">
              {badge}
            </span>
          </div>
          <CardTitle className="mt-4">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="ghost" className="group p-0 h-auto">
            Explore
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
