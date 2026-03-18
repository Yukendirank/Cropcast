"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert as AlertComponent, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertSeverity, getAlertColor } from "@/lib/alerts-system"
import { format } from "date-fns"
import { X, AlertTriangle, CheckCircle2, Clock } from "lucide-react"

interface AlertsDisplayProps {
  alerts: Alert[]
  onDismiss?: (alertId: string) => void
  onResolve?: (alertId: string) => void
}

export function AlertsDisplay({
  alerts,
  onDismiss,
  onResolve,
}: AlertsDisplayProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts((prev) => new Set([...prev, alertId]))
    onDismiss?.(alertId)
  }

  const handleResolve = (alertId: string) => {
    setDismissedAlerts((prev) => new Set([...prev, alertId]))
    onResolve?.(alertId)
  }

  const activeAlerts = alerts.filter(
    (alert) => !dismissedAlerts.has(alert.id) && alert.status !== "resolved"
  )
  const criticalAlerts = activeAlerts.filter((a) => a.severity === "critical")
  const highAlerts = activeAlerts.filter((a) => a.severity === "high")
  const mediumAlerts = activeAlerts.filter((a) => a.severity === "medium")
  const lowAlerts = activeAlerts.filter((a) => a.severity === "low")

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-5 w-5" />
      case "medium":
        return <Clock className="h-5 w-5" />
      default:
        return <CheckCircle2 className="h-5 w-5" />
    }
  }

  const renderAlertItem = (alert: Alert) => (
    <div
      key={alert.id}
      className={`p-4 border-l-4 rounded-lg ${getAlertColor(alert.severity)}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {getSeverityIcon(alert.severity)}
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{alert.title}</h4>
            <p className="text-sm opacity-90 mt-1">{alert.message}</p>

            {alert.recommendations.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold opacity-75 mb-2">Recommendations:</p>
                <ul className="text-xs space-y-1 opacity-85">
                  {alert.recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-2">
                      <span>•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-2 mt-3 text-xs opacity-75">
              <Badge variant="outline" className="text-xs">
                {alert.type}
              </Badge>
              <span>{format(alert.createdAt, "MMM d, HH:mm")}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => handleDismiss(alert.id)}
          className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-2 mt-3">
        <Button
          size="sm"
          variant="outline"
          className="text-xs"
          onClick={() => handleResolve(alert.id)}
        >
          Mark Resolved
        </Button>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Smart Alerts</span>
          <Badge variant="outline">{activeAlerts.length} Active</Badge>
        </CardTitle>
        <CardDescription>Real-time alerts for your farm</CardDescription>
      </CardHeader>

      <CardContent>
        {activeAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-muted-foreground">No active alerts. Your farm conditions are optimal!</p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                All <Badge variant="outline" className="ml-1 text-xs">{activeAlerts.length}</Badge>
              </TabsTrigger>
              {criticalAlerts.length > 0 && (
                <TabsTrigger value="critical">
                  Critical <Badge className="ml-1 text-xs bg-red-600">{criticalAlerts.length}</Badge>
                </TabsTrigger>
              )}
              {highAlerts.length > 0 && (
                <TabsTrigger value="high">
                  High <Badge className="ml-1 text-xs bg-orange-600">{highAlerts.length}</Badge>
                </TabsTrigger>
              )}
              {mediumAlerts.length > 0 && (
                <TabsTrigger value="medium">
                  Medium <Badge className="ml-1 text-xs bg-yellow-600">{mediumAlerts.length}</Badge>
                </TabsTrigger>
              )}
              {lowAlerts.length > 0 && (
                <TabsTrigger value="low">
                  Low <Badge className="ml-1 text-xs bg-blue-600">{lowAlerts.length}</Badge>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {activeAlerts.map(renderAlertItem)}
            </TabsContent>

            {criticalAlerts.length > 0 && (
              <TabsContent value="critical" className="space-y-3">
                {criticalAlerts.map(renderAlertItem)}
              </TabsContent>
            )}

            {highAlerts.length > 0 && (
              <TabsContent value="high" className="space-y-3">
                {highAlerts.map(renderAlertItem)}
              </TabsContent>
            )}

            {mediumAlerts.length > 0 && (
              <TabsContent value="medium" className="space-y-3">
                {mediumAlerts.map(renderAlertItem)}
              </TabsContent>
            )}

            {lowAlerts.length > 0 && (
              <TabsContent value="low" className="space-y-3">
                {lowAlerts.map(renderAlertItem)}
              </TabsContent>
            )}
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
