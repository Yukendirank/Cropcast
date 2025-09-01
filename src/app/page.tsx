'use client';

import { useState, useEffect } from 'react';
import { Leaf, MapPin, Loader2, CalendarDays } from 'lucide-react';
import type { AnalyzeCropFactorsInput } from '../ai/flows/analyze-crop-factors';
import CropForm from '../components/crop-form';
import ResultsDisplay from '../components/results-display';
import { getAnalysis, fetchWeather, reverseGeocode, fetchCropRecommendations } from './actions';
import type { AnalysisResult as AnalysisResultType, WeatherDataResult, CropRecommendationResult } from './actions';
import { useToast } from '../hooks/use-toast';
import { Skeleton } from '../components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';


export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherDataResult | null>(null);
  const [cropRecommendations, setCropRecommendations] = useState<CropRecommendationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(() => Date.now());
  const [district, setDistrict] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(true);
  const { toast } = useToast();

  const handleLocationRequest = () => {
    setLocationError(null);
    setIsGeocoding(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { district } = await reverseGeocode({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setDistrict(district);
          } catch (e) {
            const error = e instanceof Error ? e.message : 'Could not determine district from location.';
            setLocationError(error);
            toast({
              variant: "destructive",
              title: "Location Error",
              description: error,
            });
          } finally {
            setIsGeocoding(false);
          }
        },
        (error) => {
          let message = 'An unknown error occurred.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'You denied the request for Geolocation.';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              message = 'The request to get user location timed out.';
              break;
          }
          setLocationError(message);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: message,
          });
          setIsGeocoding(false);
        }
      );
    } else {
      const message = "Geolocation is not supported by this browser.";
      setLocationError(message);
       toast({
        variant: "destructive",
        title: "Browser Error",
        description: message,
      });
      setIsGeocoding(false);
    }
  };
  
  useEffect(() => {
    // Automatically request location when component mounts
    handleLocationRequest();
  }, []);


  useEffect(() => {
    if (district) {
      const fetchPageData = async () => {
        setIsWeatherLoading(true);
        setIsRecommendationsLoading(true);
        
        try {
          const weatherPromise = fetchWeather({ district });
          const month = new Date().toLocaleString('default', { month: 'long' });
          const recommendationsPromise = fetchCropRecommendations({ district, month });

          const [weather, recommendations] = await Promise.all([weatherPromise, recommendationsPromise]);
          
          setWeatherData(weather);
          setCropRecommendations(recommendations);

           toast({
            title: "Data Loaded",
            description: `Fetched weather and crop recommendations for ${district}.`,
          });

        } catch (e) {
          const error = e instanceof Error ? e.message : 'Could not fetch page data.';
          toast({
            variant: "destructive",
            title: "Error",
            description: error,
          });
          console.error(e);
        } finally {
          setIsWeatherLoading(false);
          setIsRecommendationsLoading(false);
        }
      };
      fetchPageData();
    }
  }, [district, toast]);

  const handleAnalysis = async (data: AnalyzeCropFactorsInput) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await getAnalysis(data);
      setAnalysisResult(result);
    } catch (e) {
      const error = e instanceof Error ? e.message : 'An unexpected error occurred. Please try again.';
      setError(error);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
    setFormKey(Date.now());
  };
  
  if (isGeocoding || (!district && !locationError)) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
            <Card className="max-w-md mx-auto shadow-lg border-2 border-primary/20">
              <CardHeader>
                <div className="inline-flex items-center gap-3 justify-center mb-2">
                  <MapPin className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-bold font-headline text-primary">Location Access Required</h2>
                </div>
                <p className="text-muted-foreground">
                  This app needs your location to fetch local weather data and provide accurate crop predictions.
                </p>
              </CardHeader>
              <CardContent>
                {isGeocoding ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Getting your location...</span>
                  </div>
                ) : (
                   <Button onClick={handleLocationRequest} className="w-full">
                      <MapPin className="mr-2 h-4 w-4" />
                      Use My Current Location
                    </Button>
                )}
              </CardContent>
              {locationError && (
                 <CardFooter className="pt-4">
                    <p className="text-sm text-destructive text-center w-full">{locationError}</p>
                 </CardFooter>
              )}
            </Card>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-3 justify-center">
             <Leaf className="w-10 h-10 text-primary" />
             <h1 className="text-4xl sm:text-5xl font-bold font-headline text-primary">
              CropCast
            </h1>
          </div>
           <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Leverage AI to forecast crop yield for <span className="font-semibold text-primary">{district}</span> district.
          </p>
            {cropRecommendations?.season && (
                 <div className="mt-2 inline-flex items-center gap-2 bg-secondary text-secondary-foreground text-sm font-medium px-3 py-1 rounded-full">
                    <CalendarDays className="w-4 h-4" />
                    Current Season: <span className="font-bold">{cropRecommendations.season}</span>
                 </div>
            )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2">
            {isWeatherLoading || isRecommendationsLoading ? (
                 <Card className="w-full shadow-lg border-2 border-primary/20">
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Skeleton className="h-14 w-full" />
                          <Skeleton className="h-14 w-full" />
                          <Skeleton className="h-14 w-full" />
                          <Skeleton className="h-14 w-full" />
                       </div>
                       <Skeleton className="h-14 w-full" />
                    </CardContent>
                    <CardFooter>
                       <Skeleton className="h-10 w-full" />
                    </CardFooter>
                 </Card>
            ): (
              <CropForm
                key={formKey}
                onAnalyze={handleAnalysis}
                onReset={handleReset}
                isLoading={isLoading}
                hasResult={!!analysisResult}
                weatherData={weatherData}
                recommendations={cropRecommendations}
              />
            )}
          </div>
          <div className="lg:col-span-3">
            <ResultsDisplay result={analysisResult} isLoading={isLoading} error={error} />
          </div>
        </div>
        
        <footer className="text-center mt-16 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CropCast. All Rights Reserved.</p>
        </footer>
      </main>
    </div>
  );
}
