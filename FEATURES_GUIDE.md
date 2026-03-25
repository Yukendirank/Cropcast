# CropCast Features Guide

This document outlines all the features implemented in the CropCast application.

## Core Features

### 1. Crop Yield Prediction (`/predict`)
**Status:** Core Feature

Provides AI-powered crop yield predictions based on environmental and soil data.

**Key Features:**
- Form-based data entry with multiple input fields
- Real-time AI analysis using Gemini API
- Confidence scoring for predictions
- Risk factors and recommendations
- Guest-friendly with optional login for saving

**Components:**
- `app/predict/page.tsx` - Main prediction page
- `components/prediction-form.tsx` - Input form
- `components/prediction-results.tsx` - Results display
- `app/api/predict/route.ts` - API endpoint

**Environment Variables:** `NEXT_PUBLIC_GEMINI_API_KEY`

---

### 2. Weather Insights (`/weather`)
**Status:** Core Feature

Real-time weather data with farming-specific insights and recommendations.

**Key Features:**
- Auto-detect location using geolocation API
- Manual city search functionality
- Current weather display with multiple metrics
- Farming-specific recommendations based on conditions
- Visual weather icons and indicators
- Support for multiple locations

**Components:**
- `app/weather/page.tsx` - Main weather page
- `components/weather-card.tsx` - Weather data display component
- `app/api/weather/route.ts` - API endpoint for weather data

**Environment Variables:** `OPENWEATHER_API_KEY`

**API Integration:** OpenWeatherMap API

---

### 3. Fertilizer Suggestion (`/fertilizer`)
**Status:** Beta Feature

Intelligent fertilizer recommendations based on soil nutrients and crop type.

**Key Features:**
- Soil nutrient input (NPK values in mg/kg)
- Crop type selection
- Soil type specification
- Detailed fertilizer recommendations
- Application methods and timing
- Safety precautions and warnings
- Secondary nutrients and micronutrient suggestions

**Components:**
- `app/fertilizer/page.tsx` - Main fertilizer page
- `components/fertilizer-results.tsx` - Results display with NPK breakdown
- `app/api/fertilizer/route.ts` - API endpoint

**Form Inputs:**
- Nitrogen level (0-300 mg/kg)
- Phosphorus level (0-100 mg/kg)
- Potassium level (0-300 mg/kg)
- Crop type (rice, wheat, corn, sugarcane, vegetables, cotton, groundnut)
- Soil type (loamy, clay, sandy, laterite)

**Environment Variables:** `NEXT_PUBLIC_GEMINI_API_KEY`

---

### 4. Crop Recommendation (`/recommend-crop`)
**Status:** New Feature

AI-powered crop recommendations based on environmental conditions.

**Key Features:**
- Location-based analysis
- Climate and soil compatibility checking
- Suitability scoring (0-100%)
- Seasonal recommendations
- Expected yield predictions
- Farming tips for each crop
- Multi-crop recommendations ranked by suitability

**Components:**
- `app/recommend-crop/page.tsx` - Main recommendation page
- `components/crop-recommendation-card.tsx` - Individual crop card display
- `app/api/recommend-crop/route.ts` - API endpoint

**Form Inputs:**
- Location (text input)
- Temperature range (°C)
- Rainfall amount (mm)
- Soil type (loamy, clay, sandy, laterite)

**Environment Variables:** `NEXT_PUBLIC_GEMINI_API_KEY`

---

### 5. AI Chat Assistant (`/chatbot`)
**Status:** Core Feature

Interactive AI chatbot for farming advice and general questions.

**Key Features:**
- Multi-turn conversation support
- Conversation history tracking
- Optional context inputs (crop type, location)
- Real-time message streaming
- User-friendly chat interface
- Typing indicators for bot responses
- Message timestamps

**Components:**
- `app/chatbot/page.tsx` - Main chatbot page
- `components/chat-message.tsx` - Message display component
- `app/api/chat/route.ts` - API endpoint

**Context Parameters:**
- Crop type (optional)
- Location (optional)
- Full conversation history

**Environment Variables:** `NEXT_PUBLIC_GEMINI_API_KEY`

---

## Authentication & Access Control

### Protected Routes
- `/dashboard` - Requires authentication
- `/history` - Requires authentication

### Guest-Accessible Features
All features are accessible without login:
- `/` - Home page
- `/features` - Features overview
- `/predict` - Crop prediction
- `/weather` - Weather insights
- `/fertilizer` - Fertilizer suggestions
- `/recommend-crop` - Crop recommendations
- `/chatbot` - AI assistant

### Soft Prompts
Guest users see non-blocking prompts encouraging them to sign in to:
- Save prediction results
- Track history over time
- Access personalized recommendations

---

## API Routes

### Prediction API
**Endpoint:** `POST /api/predict`

**Request:**
```json
{
  "rainfall": "number",
  "temperature": "number",
  "humidity": "number",
  "soilType": "string",
  "soilPh": "number",
  "fertilizerUse": "string",
  "irrigation": "string",
  "pestControl": "boolean",
  "cropVariety": "string",
  "diseasePresence": "boolean"
}
```

### Weather API
**Endpoint:** `POST /api/weather`

**Request:**
```json
{
  "latitude": "number (optional)",
  "longitude": "number (optional)",
  "city": "string (optional)"
}
```

### Fertilizer API
**Endpoint:** `POST /api/fertilizer`

**Request:**
```json
{
  "nitrogen": "number",
  "phosphorus": "number",
  "potassium": "number",
  "cropType": "string",
  "soilType": "string"
}
```

### Crop Recommendation API
**Endpoint:** `POST /api/recommend-crop`

**Request:**
```json
{
  "location": "string",
  "temperature": "number",
  "rainfall": "number",
  "soilType": "string"
}
```

### Chat API
**Endpoint:** `POST /api/chat`

**Request:**
```json
{
  "message": "string",
  "crop": "string (optional)",
  "location": "string (optional)",
  "conversationHistory": [
    {
      "role": "user | model",
      "content": "string"
    }
  ]
}
```

---

## User Experience Flows

### Prediction Flow
1. User navigates to `/predict`
2. Enters crop and environmental data
3. Receives instant AI-powered prediction with confidence score
4. Views detailed recommendations and risk factors
5. **If guest:** Sees optional "Save prediction" prompt to sign in
6. **If authenticated:** Results are automatically saved to dashboard

### Weather Flow
1. User navigates to `/weather`
2. Browser prompts for location permission (optional)
3. If permitted, shows current weather and 7-day forecast
4. Can manually search for other locations
5. Receives farming-specific recommendations for current conditions

### Recommendation Flow
1. User navigates to `/recommend-crop`
2. Enters location and environmental parameters
3. Receives ranked list of crop recommendations
4. Each crop shows suitability score, seasonal info, and farming tips
5. Can expand each recommendation for detailed information

### Chat Flow
1. User navigates to `/chatbot`
2. Optional: Enters crop type and location for context
3. Types questions or requests for farming advice
4. Receives conversational responses from AI
5. Chat history is maintained during session

---

## Environment Variables Required

```
# Gemini API (Required for most features)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# OpenWeather API (Required for weather feature)
OPENWEATHER_API_KEY=your_openweather_api_key
```

---

## Responsive Design

All features are fully responsive:
- **Mobile:** Single column, touch-optimized
- **Tablet:** 2-column layouts where applicable
- **Desktop:** Full multi-column layouts with optimal spacing

---

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Future Enhancements

- Historical data tracking for authenticated users
- Custom alerts and notifications
- Integration with farmer networks
- Real-time market prices
- Pest and disease detection with image recognition
- Multi-language support
- Offline functionality for mobile app

---

## Support & Documentation

For issues or questions, please refer to:
- Authentication setup: `AUTH_SETUP_GUIDE.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`
