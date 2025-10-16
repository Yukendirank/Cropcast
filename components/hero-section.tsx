import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, TrendingUp, Leaf, BarChart3 } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Leaf className="w-4 h-4" />
            Powered by Advanced AI & Machine Learning
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Predict Your <span className="text-primary">Crop Yields</span> with CropCast AI
          </h1>

          <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto mb-8">
            Harness the power of artificial intelligence to forecast crop yields based on weather patterns, soil
            conditions, and farming practices. Make data-driven decisions for better harvests.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/predict">
              <Button size="lg" className="text-lg px-8">
                Start Predicting
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              View Demo
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Accurate Predictions</h3>
            <p className="text-muted-foreground text-sm">
              Advanced ML models trained on comprehensive agricultural datasets
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Multiple Factors</h3>
            <p className="text-muted-foreground text-sm">
              Weather, soil, irrigation, fertilizer, and pest management analysis
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Visual Insights</h3>
            <p className="text-muted-foreground text-sm">
              Interactive charts and graphs to understand your predictions
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
