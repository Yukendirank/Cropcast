import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, AlertTriangle, Leaf } from 'lucide-react';

interface CropRecommendation {
  crop_name: string;
  suitability_score: number;
  rainfall_requirement: string;
  temperature_range: string;
  soil_type_preference: string;
  season: string;
  yield_potential: string;
  advantages: string[];
  challenges: string[];
  estimated_duration: string;
}

interface CropRecommendationCardProps {
  crop: CropRecommendation;
  rank: number;
}

export function CropRecommendationCard({ crop, rank }: CropRecommendationCardProps) {
  const scorePercentage = Math.min(crop.suitability_score * 100, 100);
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-[#0A4D3C]" />
              <CardTitle className="text-[#0A4D3C]">{crop.crop_name}</CardTitle>
            </div>
            <CardDescription>Rank #{rank}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#0A4D3C]">{Math.round(scorePercentage)}%</div>
            <p className="text-xs text-gray-600">Suitability</p>
          </div>
        </div>

        {/* Suitability Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#0A4D3C] h-2 rounded-full transition-all"
            style={{ width: `${scorePercentage}%` }}
          ></div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-600">Season</p>
            <p className="font-semibold text-gray-900">{crop.season}</p>
          </div>
          <div>
            <p className="text-gray-600">Duration</p>
            <p className="font-semibold text-gray-900">{crop.estimated_duration}</p>
          </div>
          <div>
            <p className="text-gray-600">Temperature</p>
            <p className="font-semibold text-gray-900">{crop.temperature_range}</p>
          </div>
          <div>
            <p className="text-gray-600">Rainfall</p>
            <p className="font-semibold text-gray-900">{crop.rainfall_requirement}</p>
          </div>
        </div>

        {/* Soil & Yield */}
        <div className="space-y-2 border-t pt-4">
          <div>
            <p className="text-sm text-gray-600">Soil Type Preference</p>
            <p className="text-sm text-gray-900">{crop.soil_type_preference}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Yield Potential
            </p>
            <p className="text-sm text-gray-900">{crop.yield_potential}</p>
          </div>
        </div>

        {/* Advantages */}
        <div className="bg-green-50 p-3 rounded border border-green-200">
          <p className="text-sm font-semibold text-green-900 mb-2">Advantages</p>
          <ul className="space-y-1">
            {crop.advantages.slice(0, 3).map((advantage, idx) => (
              <li key={idx} className="text-xs text-green-800">✓ {advantage}</li>
            ))}
          </ul>
        </div>

        {/* Challenges */}
        {crop.challenges.length > 0 && (
          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
            <p className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Challenges
            </p>
            <ul className="space-y-1">
              {crop.challenges.slice(0, 2).map((challenge, idx) => (
                <li key={idx} className="text-xs text-yellow-800">• {challenge}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
