# Crop Yield Prediction System - Setup Guide

## Overview
This AI-Powered Crop Yield Prediction System consists of:
- **Frontend**: Next.js React application with forms and data visualization
- **Backend**: Python FastAPI server with ML models
- **Fallback**: Next.js API routes for offline operation

## Quick Start

### 1. Environment Setup
Add the following environment variable to your Vercel project:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:8000
\`\`\`

### 2. Start the Python Backend
The Python backend runs the ML models and provides predictions:

\`\`\`bash
# Install dependencies (if running locally)
pip install fastapi uvicorn scikit-learn pandas numpy

# Start the backend server
python scripts/backend_app.py
\`\`\`

The backend will:
- Automatically train the ML model on startup
- Serve predictions at `http://localhost:8000/predict`
- Provide health checks at `http://localhost:8000/health`

### 3. Train the ML Model
Run the training script to generate the model:
\`\`\`bash
python scripts/train_model.py
\`\`\`

### 4. Test the API Connection
Verify everything works:
\`\`\`bash
python scripts/test_api.py
\`\`\`

## System Architecture

### Frontend (Next.js)
- **Main Page**: Landing page with system overview
- **Prediction Form**: `/predict` - Input forms for crop data
- **Dashboard**: `/dashboard` - Analytics and visualizations
- **API Status**: Real-time connection monitoring

### Backend (Python FastAPI)
- **Health Check**: `GET /health` - System status
- **Prediction**: `POST /predict` - ML yield predictions  
- **Model Info**: `GET /model-info` - Model details

### Fallback System
If the Python backend is unavailable, the system automatically falls back to:
- Next.js API routes (`/api/predict`)
- Mock prediction algorithms
- Graceful degradation with user notifications

## API Endpoints

### Python Backend Endpoints

#### Health Check
\`\`\`http
GET http://localhost:8000/health
\`\`\`
Response:
\`\`\`json
{
  "status": "healthy",
  "model_loaded": true
}
\`\`\`

#### Predict Yield
\`\`\`http
POST http://localhost:8000/predict
Content-Type: application/json

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

Response:
\`\`\`json
{
  "predicted_yield_kg_per_hectare": 3250,
  "confidence_score": 0.87,
  "model_used": "Random Forest",
  "factors_analyzed": 10
}
\`\`\`

## Features

### Input Parameters
- **Weather**: Rainfall, temperature, humidity
- **Soil**: Type, pH level
- **Management**: Fertilizer use, irrigation method
- **Crop**: Variety, pest control, disease presence

### ML Model Features
- **Algorithm**: Random Forest Regressor
- **Training Data**: Synthetic agricultural dataset
- **Features**: 10 input parameters
- **Output**: Yield prediction with confidence score

### Visualization
- Input factor analysis charts
- Confidence gauges
- Historical comparisons
- Risk assessments
- System analytics dashboard

## Troubleshooting

### Backend Connection Issues
1. Check if Python backend is running on port 8000
2. Verify `NEXT_PUBLIC_API_URL` environment variable
3. Check the API status indicator in the UI
4. Review browser console for connection errors

### Model Training Issues
1. Ensure all Python dependencies are installed
2. Check that the training script completes successfully
3. Verify model files are generated

### Fallback Mode
If you see "using fallback predictions":
- The Python backend is offline
- Predictions will use simplified algorithms
- Restart the Python backend to restore full functionality

## Development

### Running Locally
1. Start the Python backend: `python scripts/backend_app.py`
2. Start the Next.js frontend: `npm run dev`
3. Access the application at `http://localhost:3000`

### Production Deployment
1. Deploy the Next.js app to Vercel
2. Deploy the Python backend to your preferred hosting service
3. Update `NEXT_PUBLIC_API_URL` to point to your production backend
4. Ensure CORS is properly configured for cross-origin requests
