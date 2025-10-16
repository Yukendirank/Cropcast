# AI-Powered Crop Yield Prediction System

A comprehensive web-based application that uses Google Gemini AI to predict crop yields based on weather conditions, soil properties, and farming practices.

## 🌾 Features

### Frontend (React.js/Next.js)
- **Interactive Input Forms**: Comprehensive forms for weather data, soil properties, and crop management details
- **AI-Powered Predictions**: Google Gemini AI provides intelligent yield predictions with personalized recommendations
- **Data Visualization**: Interactive charts showing input factor analysis, confidence levels, and historical comparisons
- **Smart Recommendations**: AI-generated farming advice and risk assessments
- **Responsive Design**: Agricultural-themed UI that works on all devices
- **Real-time Analysis**: Instant yield predictions with detailed explanations

### AI Backend (Google Gemini)
- **Advanced AI Model**: Google Gemini 2.0 Flash for sophisticated agricultural analysis
- **Contextual Understanding**: AI considers complex relationships between agricultural factors
- **Personalized Recommendations**: Tailored farming advice based on input conditions
- **Risk Assessment**: Identifies potential threats and mitigation strategies
- **Fallback System**: Mathematical model backup for reliability

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ for the frontend
- Google Gemini API key
- Modern web browser

### Quick Setup

1. **Set Environment Variable**:
   Add `GOOGLE_GEMINI_API_KEY=your_api_key_here` to your Vercel project settings

2. **Get Your Gemini API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/apikey)
   - Sign in with your Google account
   - Generate a new API key
   - Copy the key for use in your environment variables

3. **Start Using the System**:
   - Navigate to the prediction form
   - Enter your crop and environmental data
   - Get AI-powered predictions with recommendations

### Frontend Setup
1. The frontend runs automatically in the v0 environment
2. Navigate to `/predict` to start making predictions
3. The system will automatically use Gemini AI for intelligent predictions

## 📊 API Integration

### Gemini AI Integration
The system uses Google's Gemini 2.0 Flash model with specialized agricultural prompts to provide:
- Accurate yield predictions (1000-8000 kg/ha range)
- Confidence scores (60-95% range)
- Personalized farming recommendations
- Risk factor identification
- Contextual agricultural advice

### Sample Prediction Request
\`\`\`json
{
  "rainfall": 120,
  "temperature": 28,
  "humidity": 65,
  "soil_type": "loamy",
  "soil_ph": 6.8,
  "fertilizer_use": "moderate",
  "irrigation": "drip",
  "pest_control": true,
  "crop_variety": "hybrid-maize",
  "disease_presence": false
}
\`\`\`

### Sample AI Response
\`\`\`json
{
  "predicted_yield_kg_per_hectare": 3820,
  "confidence_score": 0.87,
  "model_used": "Gemini AI Agricultural Model",
  "factors_analyzed": 10,
  "recommendations": [
    "Consider increasing fertilizer application during flowering stage",
    "Monitor soil moisture levels closely with current irrigation setup",
    "Implement preventive disease management practices"
  ],
  "risk_factors": [
    "Moderate rainfall may require supplemental irrigation",
    "Monitor for common maize diseases in current conditions"
  ]
}
\`\`\`

## 🔄 System Architecture

### AI-First Architecture
1. **Primary**: Frontend → Gemini AI → Intelligent Predictions
2. **Fallback**: Frontend → Mathematical Model → Basic Predictions
3. **Enhancement**: AI provides recommendations and risk assessments

### Fault Tolerance
- Automatic fallback to mathematical predictions if Gemini API is unavailable
- Graceful error handling with user notifications
- Retry mechanisms for API calls
- Comprehensive logging for debugging

## 🧠 AI Model Capabilities

### Gemini AI Features
- **Advanced Reasoning**: Understands complex agricultural relationships
- **Contextual Analysis**: Considers regional and seasonal factors
- **Personalized Advice**: Tailored recommendations for specific conditions
- **Risk Assessment**: Identifies potential challenges and solutions
- **Continuous Learning**: Benefits from Google's ongoing AI improvements

### Input Analysis
- **Weather Factors**: Rainfall, temperature, humidity optimization
- **Soil Properties**: Type-specific recommendations and pH adjustments
- **Management Practices**: Fertilizer, irrigation, and pest control optimization
- **Crop Selection**: Variety-specific advice and yield expectations

### Output Intelligence
- Yield predictions with confidence intervals
- Specific farming recommendations
- Risk factor identification
- Seasonal timing advice
- Resource optimization suggestions

## 🎨 Design System

### Color Palette
- **Primary**: Warm coral (#E07A5F) - Agricultural warmth
- **Secondary**: Sage green (#81B29A) - Natural growth
- **Accent**: Golden (#F2CC8F) - Harvest abundance
- **Background**: Cream (#FAF7F0) - Earth tones

### Typography
- **Headings**: Geist Sans - Modern, professional
- **Body**: Geist Sans - Clean, readable

## 🔧 Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **AI Integration**: Google Generative AI SDK
- **Styling**: Tailwind CSS v4 with custom agricultural theme
- **Components**: shadcn/ui component library
- **Charts**: Recharts for data visualization
- **State**: React hooks for form and API state management

### AI Integration Stack
- **AI Model**: Google Gemini 2.0 Flash
- **SDK**: @google/generative-ai
- **Prompting**: Specialized agricultural analysis prompts
- **Response Parsing**: JSON-structured AI responses
- **Error Handling**: Comprehensive fallback systems

### Data Flow
1. User inputs crop parameters via React form
2. Frontend validates and transforms data
3. Structured prompt sent to Gemini AI
4. AI analyzes agricultural context and returns predictions
5. Results displayed with recommendations and visualizations
6. Fallback to mathematical model if AI unavailable

## 🛠️ Troubleshooting

### API Key Issues
- Ensure `GOOGLE_GEMINI_API_KEY` is set in Project Settings
- Verify API key is valid and has proper permissions
- Check Google AI Studio for API usage limits

### AI Response Issues
- Monitor browser console for API errors
- System automatically falls back to mathematical predictions
- Check network connectivity for API calls

### Fallback Mode
If you see "Fallback Model" in results:
- Gemini AI is temporarily unavailable
- Predictions use simplified mathematical algorithms
- AI functionality will restore automatically when available

## 📈 Future Enhancements

- **Satellite Integration**: Incorporate satellite imagery analysis with Gemini Vision
- **Weather API**: Real-time weather data integration
- **Historical Data**: Connect to agricultural databases for better context
- **Mobile App**: React Native mobile application
- **Advanced Prompting**: More sophisticated AI prompts for specialized crops
- **Multi-language**: Support for local languages with Gemini's multilingual capabilities

## 🤝 Contributing

This is a demonstration project showcasing AI-powered agricultural applications using Google Gemini. The system provides a solid foundation for real-world agricultural prediction systems.

## 📄 License

This project is for educational and demonstration purposes.
