import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, Info, LineChart } from "lucide-react";
import type { AnalysisResult } from '../app/actions';
import YieldGauge from './yield-gauge';
import FactorAnalysisChart from './factor-analysis-chart';

type ResultsDisplayProps = {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
};

const LoadingSkeleton = () => (
    <Card className="h-full">
        <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
            <div className="flex flex-col items-center justify-center p-8 border-b">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-6 w-48 mt-6" />
                <Skeleton className="h-4 w-32 mt-2" />
            </div>
            <div className="space-y-4 pt-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </CardContent>
    </Card>
)

export default function ResultsDisplay({ result, isLoading, error }: ResultsDisplayProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
        <Alert variant="destructive" className="h-full">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    );
  }
  
  if (!result) {
    return (
      <Card className="flex flex-col items-center justify-center text-center h-full min-h-[600px] lg:min-h-full shadow-inner border-dashed">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Awaiting Analysis</CardTitle>
          <CardDescription>Your prediction and factor analysis will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="p-8">
                <LineChart className="mx-auto h-24 w-24 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">Submit the form to get started.</p>
            </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-8">
      <YieldGauge yieldValue={result.simulatedYield} />
      <FactorAnalysisChart factorRanking={result.factorRanking} />
      <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Disclaimer</AlertTitle>
          <AlertDescription>
            This is only based on predicted data; this result may not be accurate.
          </AlertDescription>
      </Alert>
    </div>
  );
}
