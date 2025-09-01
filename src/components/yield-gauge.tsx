import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type YieldGaugeProps = {
  yieldValue: number;
};

// Values are now in kg/acre. 1 hectare ~ 2.47 acres.
// Original thresholds (kg/hectare): 5000, 3500, 2000
// New thresholds (kg/acre): 5000/2.47=2024, 3500/2.47=1417, 2000/2.47=810
const getYieldQuality = (yieldValue: number) => {
    if (yieldValue > 2000) return { label: "Excellent Yield", color: "text-green-600 dark:text-green-400", Icon: TrendingUp };
    if (yieldValue > 1400) return { label: "Good Yield", color: "text-green-500 dark:text-green-500", Icon: TrendingUp };
    if (yieldValue > 800) return { label: "Average Yield", color: "text-yellow-500 dark:text-yellow-400", Icon: Minus };
    return { label: "Low Yield", color: "text-red-500 dark:text-red-400", Icon: TrendingDown };
};

export default function YieldGauge({ yieldValue }: YieldGaugeProps) {
  const { label, color, Icon } = getYieldQuality(yieldValue);
  
  return (
    <Card className="text-center shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Simulated Yield Prediction</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <div className="text-6xl font-bold text-primary">
          {yieldValue.toLocaleString('en-US', { maximumFractionDigits: 1 })}
        </div>
        <div className="text-lg text-muted-foreground">kg / acre</div>
        <div className={`mt-4 flex items-center gap-2 font-semibold text-lg ${color}`}>
            <Icon className="h-6 w-6" />
            <span>{label}</span>
        </div>
      </CardContent>
    </Card>
  );
}
