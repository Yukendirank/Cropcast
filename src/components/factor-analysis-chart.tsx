'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { cn } from "../lib/utils";
import type { AnalyzeCropFactorsOutput } from '../ai/flows/analyze-crop-factors';

type FactorAnalysisChartProps = {
  factorRanking: AnalyzeCropFactorsOutput['factor_ranking'];
};

const impactMap: { [key: string]: { value: number; color: string; className: string } } = {
  High: { value: 3, color: "hsl(var(--chart-1))", className: "text-red-500" },
  Moderate: { value: 2, color: "hsl(var(--chart-4))", className: "text-yellow-500" },
  Low: { value: 1, color: "hsl(var(--chart-2))", className: "text-green-500" },
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="rounded-lg border bg-background p-2 shadow-sm text-sm max-w-xs">
                <div className="font-bold mb-1">{label}</div>
                <div className="flex justify-between items-center mb-2">
                    <span>Impact:</span>
                    <span className={`font-medium ${impactMap[data.impact]?.className}`}>{data.impact}</span>
                </div>
                <p className="text-xs text-muted-foreground whitespace-normal">{data.reason}</p>
            </div>
        );
    }
    return null;
};

export default function FactorAnalysisChart({ factorRanking }: FactorAnalysisChartProps) {
  const chartData = factorRanking.map(item => ({
    ...item,
    impactValue: impactMap[item.impact]?.value || 0,
    fillColor: impactMap[item.impact]?.color || "hsl(var(--muted))",
  })).sort((a, b) => b.impactValue - a.impactValue);

  const ImpactPill = ({ impact }: { impact: string }) => (
    <span className={cn(
        "px-2 py-0.5 text-xs font-semibold rounded-full",
        impact === "High" && "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
        impact === "Moderate" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
        impact === "Low" && "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    )}>
        {impact}
    </span>
  )

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Influential Factor Analysis</CardTitle>
        <CardDescription>AI-powered ranking of factors affecting your crop yield.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="factor" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} interval={0} angle={-30} textAnchor="end" height={50} />
                    <YAxis
                        tickFormatter={(value) => ["", "Low", "Mod", "High"][value]}
                        domain={[0, 3.5]}
                        ticks={[1, 2, 3]}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', radius: 4 }} />
                    <Bar dataKey="impactValue" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fillColor} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div>
            <h3 className="text-lg font-semibold mb-2">Detailed Breakdown</h3>
            <Accordion type="single" collapsible className="w-full">
            {chartData.map((item) => (
              <AccordionItem value={item.factor} key={item.factor}>
                <AccordionTrigger className="text-base font-medium hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span>{item.factor}</span>
                    <ImpactPill impact={item.impact} />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pl-2">
                  {item.reason}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
