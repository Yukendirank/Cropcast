import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface FertilizerResult {
  crop_type: string;
  soil_ph: number;
  nitrogen_recommendation: string;
  phosphorus_recommendation: string;
  potassium_recommendation: string;
  secondary_nutrients: string[];
  application_method: string;
  timing: string;
  precautions: string[];
}

interface FertilizerResultsProps {
  results: FertilizerResult;
}

export function FertilizerResults({ results }: FertilizerResultsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0A4D3C]">Fertilizer Recommendations</CardTitle>
          <CardDescription>For {results.crop_type} with soil pH {results.soil_ph}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* NPK Recommendations */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Nitrogen (N)</h4>
              <p className="text-sm text-blue-800">{results.nitrogen_recommendation}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Phosphorus (P)</h4>
              <p className="text-sm text-green-800">{results.phosphorus_recommendation}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-900 mb-2">Potassium (K)</h4>
              <p className="text-sm text-orange-800">{results.potassium_recommendation}</p>
            </div>
          </div>

          {/* Secondary Nutrients */}
          {results.secondary_nutrients.length > 0 && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Secondary Nutrients & Micronutrients
              </h4>
              <ul className="space-y-2">
                {results.secondary_nutrients.map((nutrient, idx) => (
                  <li key={idx} className="text-sm text-purple-800 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {nutrient}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Application Method */}
          <div className="border-l-4 border-[#0A4D3C] pl-4">
            <h4 className="font-semibold text-[#0A4D3C] mb-2">Application Method</h4>
            <p className="text-gray-700">{results.application_method}</p>
          </div>

          {/* Timing */}
          <div className="border-l-4 border-[#0A4D3C] pl-4">
            <h4 className="font-semibold text-[#0A4D3C] mb-2">Timing</h4>
            <p className="text-gray-700">{results.timing}</p>
          </div>

          {/* Precautions */}
          {results.precautions.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Important Precautions
              </h4>
              <ul className="space-y-2">
                {results.precautions.map((precaution, idx) => (
                  <li key={idx} className="text-sm text-red-800">• {precaution}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
