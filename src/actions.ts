import { analyzeCropFactors, AnalyzeCropFactorsInput, AnalyzeCropFactorsOutput } from './ai/flows/analyze-crop-factors';
import { getWeatherData, GetWeatherDataInput, GetWeatherDataOutput } from './ai/flows/get-weather-data';
import { reverseGeocode as reverseGeocodeFlow, ReverseGeocodeInput, ReverseGeocodeOutput } from './ai/flows/reverse-geocode';
import { getCropRecommendations, GetCropRecommendationsInput, GetCropRecommendationsOutput } from './ai/flows/get-crop-recommendations';

// --- Type definitions ---
export type AnalysisResult = {
  simulatedYield: number;
  factorRanking: AnalyzeCropFactorsOutput['factor_ranking'];
};

export type WeatherDataResult = GetWeatherDataOutput;
export type ReverseGeocodeResult = ReverseGeocodeOutput;
export type CropRecommendationResult = GetCropRecommendationsOutput;

type FactorScores = {
    [key: string]: number;
};

// --- Heuristic Calculation Logic ---

const BASE_YIELD_HECTARE = 6000; // kg/hectare, an optimistic base for ideal conditions
const HECTARE_TO_ACRE = 2.47105;

const calculateScore = (value: number, ideal: number, range: number): number => {
  const diff = Math.abs(value - ideal);
  const score = Math.max(0, 1 - (diff / range));
  return score;
};

const getCategoricalScore = (value: string | boolean, scores: Record<string, number>): number => {
    return scores[String(value).toLowerCase()] || 0;
};

const calculateSimulatedYield = (
  input: AnalyzeCropFactorsInput,
  analysis: AnalyzeCropFactorsOutput
): number => {
  const scores: FactorScores = {
    temperature: calculateScore(input.temperature, 26, 15), // Ideal 26C, range +/- 15
    rainfall: calculateScore(input.rainfall, 130, 100), // Ideal 130mm/season, range +/- 100
    humidity: calculateScore(input.humidity, 65, 35), // Ideal 65%, range +/- 35
    soil_ph: calculateScore(input.soil_ph, 6.7, 1.5), // Ideal 6.7, range +/- 1.5
    soil_type: getCategoricalScore(input.soil_type, { 'loamy': 1, 'silty': 0.9, 'peaty': 0.8, 'clay': 0.7, 'sandy': 0.5 }),
    fertilizer_use: getCategoricalScore(input.fertilizer_use, { 'moderate': 1, 'high': 0.8, 'low': 0.4 }),
    irrigation: getCategoricalScore(input.irrigation, { 
      'drip irrigation': 1, 
      'sprinkler irrigation': 0.9,
      'subsurface irrigation': 0.95,
      'center pivot irrigation': 0.85,
      'lateral move irrigation': 0.85,
      'surface irrigation': 0.7,
      'furrow irrigation': 0.75,
      'basin irrigation': 0.7,
      'flood irrigation': 0.6,
      'manual irrigation': 0.5,
      'none': 0.3 
    }),
    pest_control: getCategoricalScore(input.pest_control, { 'true': 1, 'false': 0.5 }),
    disease_presence: getCategoricalScore(input.disease_presence, { 'false': 1, 'true': 0.3 }),
  };
  
  const factorMap: {[key: string]: keyof AnalyzeCropFactorsInput} = {
    'temperature': 'temperature',
    'rainfall': 'rainfall',
    'humidity': 'humidity',
    'soil ph': 'soil_ph',
    'soil type': 'soil_type',
    'fertilizer use': 'fertilizer_use',
    'irrigation': 'irrigation',
    'pest control': 'pest_control',
    'disease presence': 'disease_presence',
  };

  const impactWeights: {[key: string]: number} = { 'High': 3, 'Moderate': 2, 'Low': 1 };
  let totalWeight = 0;
  let weightedScore = 0;

  analysis.factor_ranking.forEach(item => {
    const factorKey = factorMap[item.factor.toLowerCase()];
    if (factorKey && scores[factorKey] !== undefined) {
      const weight = impactWeights[item.impact] || 1;
      weightedScore += scores[factorKey] * weight;
      totalWeight += weight;
    }
  });

  let finalScore;
  if (totalWeight === 0) {
      const allScores = Object.values(scores).filter(s => s !== undefined);
      finalScore = allScores.reduce((sum, s) => sum + s, 0) / allScores.length;
  } else {
    finalScore = weightedScore / totalWeight;
  }
  
  const simulatedYieldHectare = BASE_YIELD_HECTARE * finalScore;
  const simulatedYieldAcre = simulatedYieldHectare / HECTARE_TO_ACRE;

  return Math.round(simulatedYieldAcre * 10) / 10;
};

// --- Client Actions ---

export async function getAnalysis(input: AnalyzeCropFactorsInput): Promise<AnalysisResult> {
  try {
    const analysis = await analyzeCropFactors(input);
    if (!analysis || !analysis.factor_ranking) {
      throw new Error('AI analysis failed to return valid data.');
    }
    const simulatedYield = calculateSimulatedYield(input, analysis);
    return {
      simulatedYield,
      factorRanking: analysis.factor_ranking,
    };
  } catch (error) {
    console.error("Error in getAnalysis action:", error);
    throw new Error('Failed to get analysis from AI service.');
  }
}

export async function fetchWeather(input: GetWeatherDataInput): Promise<WeatherDataResult> {
  try {
    const weatherData = await getWeatherData(input);
    if (!weatherData) {
        throw new Error('AI weather service failed to return data.');
    }
    return weatherData;
  } catch (error) {
    console.error("Error in fetchWeather action:", error);
    throw new Error('Failed to get weather data from AI service.');
  }
}

export async function reverseGeocode(input: ReverseGeocodeInput): Promise<ReverseGeocodeResult> {
  try {
    const result = await reverseGeocodeFlow(input);
     if (!result || !result.district) {
        throw new Error('AI reverse geocoding service failed to return a district.');
    }
    return result;
  } catch (error) {
    console.error("Error in reverseGeocode action:", error);
    throw new Error('Failed to reverse geocode coordinates.');
  }
}

export async function fetchCropRecommendations(input: GetCropRecommendationsInput): Promise<CropRecommendationResult> {
    try {
        const recommendations = await getCropRecommendations(input);
        if (!recommendations || !recommendations.varieties || recommendations.varieties.length === 0) {
            throw new Error('AI recommendation service failed to return crop varieties.');
        }
        return recommendations;
    } catch (error) {
        console.error("Error in fetchCropRecommendations action:", error);
        throw new Error('Failed to get crop recommendations from AI service.');
    }
}