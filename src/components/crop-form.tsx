import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Switch } from './ui/switch';
import { Thermometer, CloudRain, Droplets, Leaf, TestTube2, SprayCan, Bug, ShieldAlert, Sprout, Loader2, RefreshCw } from 'lucide-react';
import type { AnalyzeCropFactorsInput } from '../ai/flows/analyze-crop-factors';
import type { WeatherDataResult, CropRecommendationResult } from '../app/actions';
import { useEffect } from 'react';

const formSchema = z.object({
  rainfall: z.coerce.number().min(0, "Must be positive").max(1000, "Rainfall seems too high"),
  temperature: z.coerce.number().min(-50, "Temperature seems too low").max(60, "Temperature seems too high"),
  humidity: z.coerce.number().min(0, "Must be non-negative").max(100, "Humidity must be between 0 and 100"),
  soil_type: z.string().min(1, "Soil type is required"),
  soil_ph: z.coerce.number().min(0, "pH must be positive").max(14, "pH must be between 0 and 14"),
  fertilizer_use: z.string().min(1, "Fertilizer use is required"),
  irrigation: z.string().min(1, "Irrigation type is required"),
  pest_control: z.boolean(),
  crop_variety: z.string().min(1, "Crop variety is required").max(50, "Please keep under 50 characters"),
  disease_presence: z.boolean(),
});

type CropFormProps = {
  onAnalyze: (data: AnalyzeCropFactorsInput) => void;
  onReset: () => void;
  isLoading: boolean;
  hasResult: boolean;
  weatherData: WeatherDataResult | null;
  recommendations: CropRecommendationResult | null;
};

export default function CropForm({ onAnalyze, onReset, isLoading, hasResult, weatherData, recommendations }: CropFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rainfall: 120,
      temperature: 28,
      humidity: 65,
      soil_type: "Loamy",
      soil_ph: 6.8,
      fertilizer_use: "Moderate",
      irrigation: "Drip Irrigation",
      pest_control: true,
      crop_variety: "",
      disease_presence: false,
    },
  });

  useEffect(() => {
    if (weatherData) {
        form.setValue('temperature', weatherData.temperature);
        form.setValue('humidity', weatherData.humidity);
        form.setValue('rainfall', weatherData.rainfall);
    }
    if (recommendations && recommendations.varieties.length > 0) {
        form.setValue('crop_variety', recommendations.varieties[0]);
    }
  }, [weatherData, recommendations, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAnalyze(values);
  }

  return (
    <Card className="w-full shadow-lg border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Crop & Environment Data</CardTitle>
        <CardDescription>Enter the details below to predict your crop yield.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField name="temperature" control={form.control} render={({ field }) => (
                <FormItem><FormLabel className="flex items-center gap-2"><Thermometer className="w-4 h-4 text-primary"/>Temperature (°C)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField name="rainfall" control={form.control} render={({ field }) => (
                <FormItem><FormLabel className="flex items-center gap-2"><CloudRain className="w-4 h-4 text-primary"/>Rainfall (mm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField name="humidity" control={form.control} render={({ field }) => (
                <FormItem><FormLabel className="flex items-center gap-2"><Droplets className="w-4 h-4 text-primary"/>Humidity (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField name="soil_ph" control={form.control} render={({ field }) => (
                <FormItem><FormLabel className="flex items-center gap-2"><TestTube2 className="w-4 h-4 text-primary"/>Soil pH</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <FormField control={form.control} name="soil_type" render={({ field }) => (
                <FormItem><FormLabel className="flex items-center gap-2"><Leaf className="w-4 h-4 text-primary"/>Soil Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select soil type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Loamy">Loamy</SelectItem><SelectItem value="Sandy">Sandy</SelectItem><SelectItem value="Clay">Clay</SelectItem><SelectItem value="Silty">Silty</SelectItem><SelectItem value="Peaty">Peaty</SelectItem></SelectContent></Select><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="fertilizer_use" render={({ field }) => (
                <FormItem><FormLabel className="flex items-center gap-2"><Sprout className="w-4 h-4 text-primary"/>Fertilizer Use</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select fertilizer level" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Low">Low</SelectItem><SelectItem value="Moderate">Moderate</SelectItem><SelectItem value="High">High</SelectItem></SelectContent></Select><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="irrigation" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><SprayCan className="w-4 h-4 text-primary"/>Irrigation</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select irrigation type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Drip Irrigation">Drip Irrigation</SelectItem>
                        <SelectItem value="Sprinkler Irrigation">Sprinkler Irrigation</SelectItem>
                        <SelectItem value="Surface Irrigation">Surface Irrigation</SelectItem>
                        <SelectItem value="Furrow Irrigation">Furrow Irrigation</SelectItem>
                        <SelectItem value="Flood Irrigation">Flood Irrigation</SelectItem>
                        <SelectItem value="Subsurface Irrigation">Subsurface Irrigation</SelectItem>
                        <SelectItem value="Manual Irrigation">Manual Irrigation</SelectItem>
                        <SelectItem value="Center Pivot Irrigation">Center Pivot Irrigation</SelectItem>
                        <SelectItem value="Lateral Move Irrigation">Lateral Move Irrigation</SelectItem>
                        <SelectItem value="Basin Irrigation">Basin Irrigation</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="crop_variety" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Leaf className="w-4 h-4 text-primary"/>Crop Variety</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a crop variety" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {recommendations?.varieties.map((variety) => (
                        <SelectItem key={variety} value={variety}>{variety}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <FormField control={form.control} name="pest_control" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background/60"><div className="space-y-0.5"><FormLabel className="flex items-center gap-2"><Bug className="w-4 h-4 text-primary"/>Pest Control</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
              )}/>
              <FormField control={form.control} name="disease_presence" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background/60"><div className="space-y-0.5"><FormLabel className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-primary"/>Disease</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
              )}/>
            </div>
          </CardContent>
          <CardFooter>
            {hasResult ? (
              <Button type="button" onClick={onReset} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <RefreshCw className="mr-2 h-4 w-4" />
                Start New Analysis
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : 'Predict Yield'}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
