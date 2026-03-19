import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FeatureCard } from "@/components/feature-card"

export const metadata = {
  title: "Features - CropCast",
  description: "Explore all CropCast farming tools and features",
}

export default function FeaturesPage() {
  const features = [
    {
      id: "predict",
      title: "Crop Prediction",
      description: "Get AI-powered crop yield predictions based on your environmental data",
      icon: "sprout" as const,
      href: "/predict",
      color: "bg-green-50 dark:bg-green-950/20",
      badge: "Core Feature",
    },
    {
      id: "weather",
      title: "Weather Insights",
      description: "Real-time weather data and impact analysis for your region",
      icon: "cloud" as const,
      href: "/weather",
      color: "bg-blue-50 dark:bg-blue-950/20",
      badge: "New",
    },
    {
      id: "chatbot",
      title: "AI Assistant",
      description: "Chat with our agriculture expert AI for personalized advice",
      icon: "messageCircle" as const,
      href: "/chat",
      color: "bg-purple-50 dark:bg-purple-950/20",
      badge: "Beta",
    },
    {
      id: "recommend",
      title: "Crop Recommendations",
      description: "Discover the best crops for your specific farming conditions",
      icon: "lightbulb" as const,
      href: "/recommend-crop",
      color: "bg-amber-50 dark:bg-amber-950/20",
      badge: "Smart",
    },
    {
      id: "fertilizer",
      title: "Fertilizer Guide",
      description: "Get optimal fertilizer recommendations to maximize yield",
      icon: "beaker" as const,
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
              <FeatureCard key={feature.id} {...feature} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
