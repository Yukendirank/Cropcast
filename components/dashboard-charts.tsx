"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Sprout, BarChart3 } from "lucide-react"
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"

// Mock data for dashboard
const monthlyPredictions = [
  { month: "Jan", predictions: 45, avgYield: 3200 },
  { month: "Feb", predictions: 52, avgYield: 3400 },
  { month: "Mar", predictions: 78, avgYield: 3600 },
  { month: "Apr", predictions: 95, avgYield: 3800 },
  { month: "May", predictions: 120, avgYield: 4000 },
  { month: "Jun", predictions: 98, avgYield: 3900 },
]

const cropDistribution = [
  { name: "Maize", value: 35, fill: "#22c55e" },
  { name: "Wheat", value: 28, fill: "#16a34a" },
  { name: "Rice", value: 20, fill: "#84cc16" },
  { name: "Soybeans", value: 12, fill: "#059669" },
  { name: "Others", value: 5, fill: "#10b981" },
]

const yieldTrends = [
  { year: "2020", yield: 3200, target: 3500 },
  { year: "2021", yield: 3400, target: 3600 },
  { year: "2022", yield: 3100, target: 3700 },
  { year: "2023", yield: 3800, target: 3800 },
  { year: "2024", yield: 4000, target: 4000 },
]

const historicalYieldData = [
  { year: "2020", yield: 1350, fill: "#22c55e" },
  { year: "2021", yield: 1550, fill: "#16a34a" },
  { year: "2022", yield: 1250, fill: "#84cc16" },
  { year: "2023", yield: 1750, fill: "#059669" },
  { year: "2024 (Predicted)", yield: 1650, fill: "#10b981" },
]

export function DashboardCharts() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Yield</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,850</div>
            <p className="text-xs text-muted-foreground">kg/ha this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Model confidence</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Predictions */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Predictions</CardTitle>
            <CardDescription>Number of predictions and average yield by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyPredictions}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
                <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "3px solid hsl(var(--primary))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                    padding: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="predictions" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Crop Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Crop Distribution</CardTitle>
            <CardDescription>Most predicted crop types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cropDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cropDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "3px solid hsl(var(--primary))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                    padding: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
                  formatter={(value: number) => [`${value}%`, "Percentage"]}
                />
                <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Yield Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Yield Trends</CardTitle>
          <CardDescription>Historical yield performance vs targets</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yieldTrends}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="year" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
              <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "3px solid hsl(var(--primary))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                  padding: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
                formatter={(value: number) => [`${value.toLocaleString()} kg/ha`, ""]}
              />
              <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
              <Line
                type="monotone"
                dataKey="yield"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                name="Actual Yield"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#16a34a"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#16a34a", strokeWidth: 2, r: 4 }}
                name="Target Yield"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Historical Yield Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Historical Yield Comparison
          </CardTitle>
          <CardDescription>Predicted yield compared to historical averages for similar conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={historicalYieldData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="year" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
              <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "3px solid hsl(var(--primary))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                  padding: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
                formatter={(value: number) => [`${value.toLocaleString()} kg/ha`, "Yield"]}
              />
              <Bar dataKey="yield" radius={[8, 8, 0, 0]}>
                {historicalYieldData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
