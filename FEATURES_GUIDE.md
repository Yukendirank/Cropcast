# CropCast Advanced Features Guide

This document outlines all 7 advanced features implemented in CropCast and how to use them.

## Table of Contents
1. [Forgot Password with Email OTP](#1-forgot-password-with-email-otp)
2. [Prediction History Dashboard](#2-prediction-history-dashboard)
3. [Weather Integration](#3-weather-integration)
4. [Crop Recommendation Engine](#4-crop-recommendation-engine)
5. [Fertilizer Recommendation Engine](#5-fertilizer-recommendation-engine)
6. [AI Chatbot Assistant](#6-ai-chatbot-assistant)
7. [Smart Alerts System](#7-smart-alerts-system)

---

## 1. Forgot Password with Email OTP

### Overview
Secure password recovery system using email-based one-time passwords (OTP).

### Components
- **Pages:** `/forgot-password`, `/verify-otp`, `/reset-password`
- **Components:** `ForgotPasswordForm`, `VerifyOtpForm`, `ResetPasswordForm`

### How It Works
1. User navigates to `/forgot-password`
2. Enters email address
3. System sends OTP to email (10-minute expiration)
4. User enters OTP on `/verify-otp`
5. System validates and generates reset token
6. User creates new password on `/reset-password`
7. User can login with new credentials

### Features
- Email validation
- 6-digit OTP with countdown timer
- Password strength validation (min 8 chars, uppercase, lowercase, number)
- Token-based reset security
- Error handling and retry logic

### Backend Integration
Requires these .NET endpoints:
- `POST /api/auth/forgot-password` - Send OTP
- `POST /api/auth/verify-otp` - Validate OTP
- `POST /api/auth/reset-password` - Reset password

---

## 2. Prediction History Dashboard

### Overview
Track all past predictions with analytics, filtering, and export capabilities.

### Pages
- `/predictions` - Full-page predictions history

### Components
- `PredictionHistoryTable` - Sortable, filterable prediction table
- `PredictionStats` - Statistics cards (total, average yield, confidence)

### Features
- View all past predictions with detailed parameters
- Sort by crop type, yield, or date
- Filter by crop type
- Search predictions
- Export to CSV
- Real-time statistics
- Confidence percentage indicators

### Data Structure
```typescript
interface Prediction {
  id: string
  cropType: string
  soilMoisture: number
  temperature: number
  humidity: number
  rainfall: number
  predictedYield: number
  confidence: number
  createdAt: string
}
```

### Backend Integration
Requires: `GET /api/predictions` - Get user's prediction history

---

## 3. Weather Integration

### Overview
Real-time weather data and 7-day forecast integration using OpenWeatherMap API.

### Components
- `WeatherWidget` - Current weather display
- `WeatherForecast` - 7-day forecast

### Features
- Current temperature, humidity, rainfall, wind speed
- 7-day weather forecast
- Auto-geolocation or manual city/coordinates
- Weather icons and descriptions
- Integration with prediction form (auto-populate weather data)

### Configuration
Add to `.env.local`:
```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

Get free API key from: https://openweathermap.org/api

### Usage
```tsx
import { WeatherWidget } from "@/components/weather-widget"
import { WeatherForecast } from "@/components/weather-forecast"

// Auto-detect location
<WeatherWidget />

// Specific location
<WeatherWidget city="New Delhi" />

// Coordinates
<WeatherWidget latitude={28.7041} longitude={77.1025} />
```

### Data Structure
```typescript
interface CurrentWeather {
  temperature: number
  humidity: number
  rainfall: number
  windSpeed: number
  description: string
  icon: string
  feelsLike: number
}

interface WeatherForecastDay {
  date: string
  temperature: number
  humidity: number
  rainfall: number
  description: string
  icon: string
}
```

---

## 4. Crop Recommendation Engine

### Overview
AI-powered crop recommendations based on climate and soil conditions.

### Components
- `CropRecommendations` - Interactive recommendation display

### Features
- Analyzes temperature, soil moisture, and rainfall
- Recommends top 5 suitable crops
- Shows suitability percentage for each crop
- Displays benefits and risks
- Optimal condition ranges
- Browse all 10+ crops in database
- Filter by search term

### Crops Supported
Wheat, Rice, Corn, Cotton, Sugarcane, Soybean, Tomato, Potato, Groundnut, Cabbage

### Usage
```tsx
import { CropRecommendations } from "@/components/crop-recommendations"

<CropRecommendations
  temperature={25}
  soilMoisture={55}
  rainfall={600}
  onSelectCrop={(cropName) => console.log(cropName)}
/>
```

### Recommendation Algorithm
- 40% weight: Temperature match
- 30% weight: Soil moisture match
- 30% weight: Rainfall match

---

## 5. Fertilizer Recommendation Engine

### Overview
Intelligent fertilizer recommendations based on crop type and preferences.

### Components
- `FertilizerRecommendations` - Complete fertilizer management interface

### Features
- **Tabs:**
  - Recommendations: Top fertilizers for crop
  - Schedule: Application timeline
  - Details: Detailed fertilizer information

- **Nutrient Info:** NPK content display
- **Cost Calculation:** Estimate fertilizer costs
- **Application Guide:** Dosage, timing, method
- **Organic Filtering:** Option to show only organic fertilizers
- **Compatibility:** Shows which crops each fertilizer suits

### Fertilizers in Database
- NPK fertilizers: 10:26:26, Urea, SSP, MOP
- Organic: Farmyard Manure, Vermicompost, Neem Cake
- Bio: Bio-Fertilizers (Azotobacter)
- Micronutrients: Zinc Sulfate, Boron

### Application Schedule
1. Pre-sowing (2-3 weeks before)
2. At sowing
3. Growth stage (45-60 days)
4. Flowering stage

### Usage
```tsx
import { FertilizerRecommendations } from "@/components/fertilizer-recommendations"

<FertilizerRecommendations
  cropType="wheat"
  areaHectares={5}
  organicPreference={true}
/>
```

---

## 6. AI Chatbot Assistant

### Overview
AI-powered agriculture expert providing real-time farming guidance.

### Pages
- `/chat` - Full-page chat interface

### Components
- `ChatWidget` - Main chat display
- `ChatMessage` - Individual message rendering
- `ChatInput` - Message input field

### Context
- `ChatProvider` - Global chat state management
- `useChat()` - Hook for chat operations

### Features
- Real-time AI responses powered by Gemini API
- Conversation history maintained
- Clear chat history option
- Loading states with typing indicators
- Error handling with user-friendly messages
- Agricultural expertise prompting

### Usage
```tsx
import { ChatProvider } from "@/lib/chat-context"
import { useChat } from "@/lib/chat-context"

function MyComponent() {
  const { sendMessage, messages, isLoading } = useChat()

  return (
    <ChatProvider>
      {/* Chat interface */}
    </ChatProvider>
  )
}
```

### Example Questions
- "What crops should I plant in winter?"
- "How do I manage pest infestation in wheat?"
- "What's the best fertilizer for tomatoes?"
- "How should I irrigate during dry season?"

---

## 7. Smart Alerts System

### Overview
Proactive monitoring system that alerts farmers to potential issues.

### Components
- `AlertsDisplay` - Alert management and display interface

### Alert Types
1. **Weather** - Temperature, rainfall alerts
2. **Pest** - Pest risk notifications
3. **Disease** - Disease risk based on conditions
4. **Soil** - Soil health alerts
5. **Irrigation** - Water management alerts
6. **Prediction** - Yield prediction warnings

### Alert Severity Levels
- **Critical**: Immediate action required (red)
- **High**: Urgent attention needed (orange)
- **Medium**: Important to address (yellow)
- **Low**: Monitor closely (blue)

### Alert Generation Logic
```typescript
interface AlertThresholds {
  temperatureMin: number        // Default: 10°C
  temperatureMax: number        // Default: 35°C
  humidityMax: number          // Default: 90%
  soilMoistureMin: number      // Default: 30%
  rainfallMax: number          // Default: 100mm
}
```

### Features
- Real-time monitoring
- Automated alert generation
- Actionable recommendations
- Alert status tracking (new, acknowledged, resolved)
- Tab-based severity filtering
- Dismiss or mark as resolved

### Usage
```tsx
import { AlertsDisplay } from "@/components/alerts-display"
import { generateAlerts } from "@/lib/alerts-system"

const alerts = generateAlerts(
  temperature,
  humidity,
  soilMoisture,
  rainfall,
  cropType
)

<AlertsDisplay
  alerts={alerts}
  onDismiss={(alertId) => console.log(alertId)}
  onResolve={(alertId) => console.log(alertId)}
/>
```

### Pest and Disease Detection
- Automatically identifies pest risk conditions
- Shows likely pests based on crop and weather
- Triggers disease alerts for high humidity + moderate temps
- Lists prevention and management recommendations

---

## Integration Points

### Dashboard Integration
Add these features to your dashboard:
```tsx
import { WeatherWidget } from "@/components/weather-widget"
import { CropRecommendations } from "@/components/crop-recommendations"
import { FertilizerRecommendations } from "@/components/fertilizer-recommendations"
import { AlertsDisplay } from "@/components/alerts-display"

// In your dashboard page
<WeatherWidget city="Your Location" />
<CropRecommendations {...conditions} />
<FertilizerRecommendations cropType={selectedCrop} />
<AlertsDisplay alerts={alerts} />
```

### Prediction Form Enhancement
Add weather data auto-population:
```tsx
import { WeatherWidget } from "@/components/weather-widget"

const handleWeatherLoaded = (weather) => {
  // Auto-populate form fields
  setFormData({
    ...formData,
    temperature: weather.temperature,
    humidity: weather.humidity,
    rainfall: weather.rainfall,
  })
}

<WeatherWidget onWeatherLoaded={handleWeatherLoaded} />
```

---

## Environment Variables Required

```env
# Required for OpenWeather API
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key_here

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5090

# Authentication
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
```

---

## Testing Checklist

- [ ] Forgot password flow works end-to-end
- [ ] OTP expires correctly (10 minutes)
- [ ] Prediction history loads and displays
- [ ] CSV export works properly
- [ ] Weather widget fetches location correctly
- [ ] Crop recommendations calculate accurately
- [ ] Fertilizer costs are calculated
- [ ] Chat bot responds to questions
- [ ] Alerts generate for threshold violations
- [ ] All components are responsive on mobile

---

## Future Enhancements

1. Push notifications for critical alerts
2. Email alerts for important weather changes
3. Pest identification using image recognition
4. Historical trend analysis
5. Yield prediction improvements
6. Multi-language support
7. Offline functionality
8. Mobile app version

---

## Support

For issues or questions:
1. Check the [DEBUG_CHECKLIST.md](./DEBUG_CHECKLIST.md)
2. Review [BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md)
3. Consult [SETUP_GUIDE.md](./SETUP_GUIDE.md)
