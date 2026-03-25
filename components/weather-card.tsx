import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Droplets, Wind, Eye, Gauge } from 'lucide-react';

interface WeatherInsight {
  date: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  wind_speed: number;
  condition: string;
  uv_index: number;
  visibility: number;
  pressure: number;
  recommendations: string[];
}

interface WeatherCardProps {
  weather: WeatherInsight;
  isCurrent?: boolean;
}

export function WeatherCard({ weather, isCurrent = false }: WeatherCardProps) {
  const getWeatherColor = (condition: string) => {
    if (condition.toLowerCase().includes('rain')) return 'text-blue-600';
    if (condition.toLowerCase().includes('sunny') || condition.toLowerCase().includes('clear')) return 'text-yellow-600';
    if (condition.toLowerCase().includes('cloud')) return 'text-gray-600';
    return 'text-gray-600';
  };

  return (
    <Card className={isCurrent ? 'border-[#0A4D3C] border-2' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-[#0A4D3C]">{isCurrent ? 'Current Weather' : weather.date}</CardTitle>
            <CardDescription>{weather.condition}</CardDescription>
          </div>
          <div className="text-4xl font-bold text-[#0A4D3C]">{weather.temperature}°C</div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Weather Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700 mb-1">
              <Droplets className="w-4 h-4" />
              <span className="text-sm font-semibold">Humidity</span>
            </div>
            <p className="text-lg font-bold text-blue-900">{weather.humidity}%</p>
          </div>

          <div className="bg-cyan-50 p-3 rounded border border-cyan-200">
            <div className="flex items-center gap-2 text-cyan-700 mb-1">
              <Cloud className="w-4 h-4" />
              <span className="text-sm font-semibold">Rainfall</span>
            </div>
            <p className="text-lg font-bold text-cyan-900">{weather.rainfall}mm</p>
          </div>

          <div className="bg-purple-50 p-3 rounded border border-purple-200">
            <div className="flex items-center gap-2 text-purple-700 mb-1">
              <Wind className="w-4 h-4" />
              <span className="text-sm font-semibold">Wind Speed</span>
            </div>
            <p className="text-lg font-bold text-purple-900">{weather.wind_speed} km/h</p>
          </div>

          <div className="bg-orange-50 p-3 rounded border border-orange-200">
            <div className="flex items-center gap-2 text-orange-700 mb-1">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-semibold">UV Index</span>
            </div>
            <p className="text-lg font-bold text-orange-900">{weather.uv_index}</p>
          </div>

          <div className="bg-green-50 p-3 rounded border border-green-200">
            <div className="flex items-center gap-2 text-green-700 mb-1">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-semibold">Visibility</span>
            </div>
            <p className="text-lg font-bold text-green-900">{weather.visibility} km</p>
          </div>

          <div className="bg-indigo-50 p-3 rounded border border-indigo-200">
            <div className="flex items-center gap-2 text-indigo-700 mb-1">
              <Gauge className="w-4 h-4" />
              <span className="text-sm font-semibold">Pressure</span>
            </div>
            <p className="text-lg font-bold text-indigo-900">{weather.pressure} hPa</p>
          </div>
        </div>

        {/* Recommendations */}
        {weather.recommendations.length > 0 && (
          <div className="bg-teal-50 p-4 rounded border border-teal-200 mt-4">
            <p className="text-sm font-semibold text-teal-900 mb-2">Farming Recommendations</p>
            <ul className="space-y-1">
              {weather.recommendations.map((rec, idx) => (
                <li key={idx} className="text-sm text-teal-800">• {rec}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
