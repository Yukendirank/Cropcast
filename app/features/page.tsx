import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Sprout, 
  Cloud, 
  MessageCircle, 
  History, 
  Lightbulb, 
  Beaker,
  ArrowRight
} from "lucide-react"

export const metadata = {
  title: "Features - CropCast",
  description: "Explore all CropCast farming tools and features",
}

const iconMap: Record<string, React.ReactNode> = {
  sprout: <Sprout className="w-8 h-8 text-gray-700 dark:text-gray-300" />,
  cloud: <Cloud className="w-8 h-8 text-gray-700 dark:text-gray-300" />,
  messageCircle: <MessageCircle className="w-8 h-8 text-gray-700 dark:text-gray-300" />,
  history: <History className="w-8 h-8 text-gray-700 dark:text-gray-300" />,
  lightbulb: <Lightbulb className="w-8 h-8 text-gray-700 dark:text-gray-300" />,
  beaker: <Beaker className="w-8 h-8 text-gray-700 dark:text-gray-300" />,
}

export default function FeaturesPage() {
  const features = [
    {
      id: "predict",
      title: "Crop Prediction",
      description: "Get AI-powered crop yield predictions based on your environmental data",
      icon: "sprout",
      href: "/predict",
      color: "bg-green-50 dark:bg-green-950/20",
      badge: "Core Feature",
    },
    {
      id: "weather",
      title: "Weather Insights",
      description: "Real-time weather data and impact analysis for your region",
      icon: "cloud",
      href: "/weather",
      color: "bg-blue-50 dark:bg-blue-950/20",
      badge: "New",
    },
    {
      id: "chatbot",
      title: "AI Assistant",
      description: "Chat with our agriculture expert AI for personalized advice",
      icon: "messageCircle",
      href: "/chat",
      color: "bg-purple-50 dark:bg-purple-950/20",
      badge: "Beta",
    },
    {
      id: "recommend",
      title: "Crop Recommendations",
      description: "Discover the best crops for your specific farming conditions",
      icon: "lightbulb",
      href: "/recommend-crop",
      color: "bg-amber-50 dark:bg-amber-950/20",
      badge: "Smart",
    },
    {
      id: "fertilizer",
      title: "Fertilizer Guide",
      description: "Get optimal fertilizer recommendations to maximize yield",
      icon: "beaker",
      href: "/fertilizer",
      color: "bg-orange-50 dark:bg-orange-950/20",
      badge: "Guide",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">All Features</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Explore all the tools and features available in CropCast to optimize your farming operations
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link key={feature.id} href={feature.href}>
                <Card className={`h-full cursor-pointer hover:shadow-lg transition-all hover:scale-105 ${feature.color}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      {iconMap[feature.icon]}
                      <span className="text-xs font-semibold px-2 py-1 bg-white/80 dark:bg-gray-800/80 rounded-full">
                        {feature.badge}
                      </span>
                    </div>
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="group p-0 h-auto">
                      Explore
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
