import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DashboardCharts } from "@/components/dashboard-charts"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Analytics Dashboard</h1>
            <p className="text-xl text-muted-foreground">Monitor prediction trends and system performance</p>
          </div>
          <DashboardCharts />
        </div>
      </main>
      <Footer />
    </div>
  )
}
