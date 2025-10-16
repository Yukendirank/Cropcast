"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Target, Award, Lightbulb, AlertTriangle, AlertCircle } from "lucide-react"
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadialBarChart,
  RadialBar,
} from "recharts"

interface PredictionData {
  rainfall: string
  temperature: string
  humidity: string
  soilType: string
  soilPh: string
  fertilizerUse: string
  irrigation: string
  pestControl: boolean
  cropVariety: string
  diseasePresence: boolean
}

interface PredictionResultsProps {
  prediction: number
  confidence: number
  formData: PredictionData
  recommendations?: string[]
  riskFactors?: string[]
}

export function PredictionResults({
  prediction,
  confidence,
  formData,
  recommendations = [],
  riskFactors = [],
}: PredictionResultsProps) {
  // Prepare data for input parameters visualization
  const inputFactorsData = [
    {
      name: "Weather",
      value: Math.round(
        ((Number.parseFloat(formData.rainfall) / 200 +
          Number.parseFloat(formData.temperature) / 40 +
          Number.parseFloat(formData.humidity) / 100) *
          100) /
          3,
      ),
      fill: "#22c55e" /* Bright green */,
    },
    {
      name: "Soil Quality",
      value: Math.round(
        ((Number.parseFloat(formData.soilPh) / 14 + (formData.soilType === "loamy" ? 1 : 0.7)) * 100) / 2,
      ),
      fill: "#16a34a" /* Medium green */,
    },
    {
      name: "Management",
      value: Math.round(
        (((formData.fertilizerUse === "high" ? 1 : formData.fertilizerUse === "moderate" ? 0.8 : 0.6) +
          (formData.irrigation === "drip" ? 1 : 0.8) +
          (formData.pestControl ? 1 : 0.5)) *
          100) /
          3,
      ),
      fill: "#84cc16" /* Lime green */,
    },
    {
      name: "Crop Type",
      value: Math.round((formData.cropVariety.includes("hybrid") ? 1 : 0.8) * 100),
      fill: "#059669" /* Teal green */,
    },
  ]

  // Yield range data
  const yieldRangeData = [
    {
      name: "Predicted Yield",
      value: confidence * 100,
      fill: "#22c55e",
    },
  ]

  // Risk factors
  const riskFactorData = [
    {
      factor: "Disease Risk",
      risk: formData.diseasePresence ? "High" : "Low",
      color: formData.diseasePresence ? "destructive" : "secondary",
    },
    {
      factor: "Weather Dependency",
      risk: Number.parseFloat(formData.rainfall) < 80 ? "High" : "Medium",
      color: Number.parseFloat(formData.rainfall) < 80 ? "destructive" : "accent",
    },
    {
      factor: "Soil Suitability",
      risk: formData.soilType === "loamy" ? "Low" : "Medium",
      color: formData.soilType === "loamy" ? "secondary" : "accent",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Prediction Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            AI-Powered Prediction Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-primary mb-2">{prediction.toLocaleString()} kg/ha</div>
            <p className="text-muted-foreground">Predicted crop yield using Google Gemini AI</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-secondary">Confidence Level</div>
              <div className="text-2xl font-bold text-secondary">{Math.round(confidence * 100)}%</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-accent">Model Used</div>
              <div className="text-muted-foreground">Gemini AI</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-chart-4">Factors Analyzed</div>
              <div className="text-muted-foreground">10 Parameters</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-chart-5">Yield Category</div>
              <div className="text-muted-foreground">
                {prediction > 4000 ? "High" : prediction > 2500 ? "Medium" : "Low"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Disclaimer */}
      <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
            <AlertCircle className="w-5 h-5" />
            Important Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-orange-800 dark:text-orange-200">
            This AI prediction is based on historical data and machine learning models. While CropCast strives for
            accuracy, AI systems can make mistakes. Predictions should be used as a reference tool alongside expert
            agricultural advice. Actual crop yields may vary based on unforeseen factors such as extreme weather events,
            pest outbreaks, or other environmental changes. Always consult with agricultural experts before making
            critical farming decisions.
          </p>
        </CardContent>
      </Card>

      {/* AI Recommendations section */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              AI Recommendations
            </CardTitle>
            <CardDescription>Personalized farming recommendations from Gemini AI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                >
                  <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-green-800 dark:text-green-200">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Risk Factors section */}
      {riskFactors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Risk Factors
            </CardTitle>
            <CardDescription>Potential risks identified by AI analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {riskFactors.map((risk, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800"
                >
                  <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-800 dark:text-orange-200">{risk}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Factors Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Input Factors Analysis
            </CardTitle>
            <CardDescription>How your input parameters contribute to the prediction</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inputFactorsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
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
                  formatter={(value: number) => [`${value}%`, "Score"]}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {inputFactorsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Confidence Gauge */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Prediction Confidence
            </CardTitle>
            <CardDescription>AI model confidence in the yield prediction</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={yieldRangeData}>
                <RadialBar dataKey="value" cornerRadius={10} fill="#22c55e" />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground text-2xl font-bold"
                >
                  {Math.round(confidence * 100)}%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
          <CardDescription>Potential risks that could affect your predicted yield</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskFactorData.map((risk, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <span className="font-medium">{risk.factor}</span>
                <Badge variant={risk.color as any}>{risk.risk} Risk</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
