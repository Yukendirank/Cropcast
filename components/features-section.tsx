import { Card } from "@/components/ui/card"
import { CloudRain, Thermometer, Droplets, TestTube, Sprout, Bug, BarChart3, TrendingUp } from "lucide-react"

export function FeaturesSection() {
  const inputFeatures = [
    {
      icon: CloudRain,
      title: "Weather Data",
      description: "Rainfall, temperature, and humidity patterns",
    },
    {
      icon: TestTube,
      title: "Soil Analysis",
      description: "Soil type, fertility, pH levels, and composition",
    },
    {
      icon: Droplets,
      title: "Irrigation Systems",
      description: "Water management and irrigation methods",
    },
    {
      icon: Sprout,
      title: "Crop Varieties",
      description: "Seed genetics and crop type specifications",
    },
    {
      icon: Bug,
      title: "Pest Management",
      description: "Disease presence and pest control measures",
    },
    {
      icon: Thermometer,
      title: "Environmental Factors",
      description: "Climate conditions and seasonal variations",
    },
  ]

  const outputFeatures = [
    {
      icon: TrendingUp,
      title: "Yield Predictions",
      description: "Accurate forecasts in kg per hectare",
    },
    {
      icon: BarChart3,
      title: "Visual Analytics",
      description: "Interactive charts and data visualization",
    },
  ]

  return (
    <section id="features" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Agricultural Analysis</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto">
            Our AI system analyzes multiple agricultural factors to provide accurate yield predictions
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Input Parameters</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inputFeatures.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-center mb-8">Prediction Results</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {outputFeatures.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
