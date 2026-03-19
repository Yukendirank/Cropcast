import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardCharts } from "@/components/dashboard-charts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Activity, Calendar } from "lucide-react"

export const metadata = {
  title: "Dashboard - CropCast",
  description: "Your farming analytics and prediction history",
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Your Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Track your predictions, analytics, and farming activity
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Yield</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,850 kg</div>
                <p className="text-xs text-muted-foreground">Per hectare</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Past 7 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2d ago</div>
                <p className="text-xs text-muted-foreground">Last prediction</p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Charts */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Analytics</h2>
              <Link href="/predictions">
                <Button variant="outline">View History</Button>
              </Link>
            </div>
            <DashboardCharts />
          </div>

          {/* Recent Activity Section */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest predictions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { crop: "Maize", yield: "4,200 kg", date: "2 days ago" },
                  { crop: "Wheat", yield: "3,800 kg", date: "4 days ago" },
                  { crop: "Rice", yield: "3,500 kg", date: "1 week ago" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.crop} Prediction</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <p className="font-semibold text-green-600">{item.yield}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      </div>
    </ProtectedRoute>
  )
}
