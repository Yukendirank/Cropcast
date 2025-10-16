import { PredictionForm } from "@/components/prediction-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PredictPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Crop Yield Prediction</h1>
            <p className="text-xl text-muted-foreground text-balance">
              Enter your crop and environmental data to get AI-powered yield predictions
            </p>
          </div>
          <PredictionForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
