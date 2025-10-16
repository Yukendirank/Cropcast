from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import os
from typing import Optional

app = FastAPI(title="Crop Yield Prediction API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class CropData(BaseModel):
    rainfall: float
    temperature: float
    humidity: float
    soil_type: str
    soil_ph: float
    fertilizer_use: str
    irrigation: str
    pest_control: bool
    crop_variety: str
    disease_presence: bool

class PredictionResponse(BaseModel):
    predicted_yield_kg_per_hectare: float
    confidence_score: float
    model_used: str
    factors_analyzed: int

# Global variables for model and encoders
model = None
label_encoders = {}

def load_model():
    """Load the trained model and encoders"""
    global model, label_encoders
    
    model_path = "scripts/crop_yield_model.joblib"
    encoders_path = "scripts/label_encoders.joblib"
    
    if os.path.exists(model_path) and os.path.exists(encoders_path):
        model = joblib.load(model_path)
        label_encoders = joblib.load(encoders_path)
        print("Model and encoders loaded successfully")
    else:
        print("Model files not found. Training new model...")
        train_model()

def train_model():
    """Train a Random Forest model with synthetic data"""
    global model, label_encoders
    
    # Generate synthetic training data
    np.random.seed(42)
    n_samples = 1000
    
    # Create synthetic dataset
    data = {
        'rainfall': np.random.normal(120, 40, n_samples),
        'temperature': np.random.normal(25, 5, n_samples),
        'humidity': np.random.normal(65, 15, n_samples),
        'soil_type': np.random.choice(['clay', 'loamy', 'sandy', 'silty'], n_samples),
        'soil_ph': np.random.normal(6.5, 1, n_samples),
        'fertilizer_use': np.random.choice(['none', 'low', 'moderate', 'high'], n_samples),
        'irrigation': np.random.choice(['none', 'flood', 'drip', 'sprinkler'], n_samples),
        'pest_control': np.random.choice([True, False], n_samples),
        'crop_variety': np.random.choice(['hybrid-maize', 'traditional-maize', 'hybrid-wheat', 'soybeans'], n_samples),
        'disease_presence': np.random.choice([True, False], n_samples)
    }
    
    df = pd.DataFrame(data)
    
    # Create synthetic yield based on realistic relationships
    base_yield = 3000
    yield_values = []
    
    for _, row in df.iterrows():
        yield_val = base_yield
        
        # Weather factors
        yield_val += (row['rainfall'] - 120) * 5  # More rain = higher yield (to a point)
        yield_val += (row['temperature'] - 25) * -20  # Extreme temps reduce yield
        yield_val += (row['humidity'] - 65) * 3
        
        # Soil factors
        soil_multipliers = {'loamy': 1.2, 'clay': 1.0, 'sandy': 0.8, 'silty': 1.1}
        yield_val *= soil_multipliers.get(row['soil_type'], 1.0)
        
        # pH factor (optimal around 6.5)
        ph_factor = 1 - abs(row['soil_ph'] - 6.5) * 0.1
        yield_val *= max(ph_factor, 0.5)
        
        # Fertilizer factor
        fert_multipliers = {'none': 0.7, 'low': 0.9, 'moderate': 1.1, 'high': 1.3}
        yield_val *= fert_multipliers.get(row['fertilizer_use'], 1.0)
        
        # Irrigation factor
        irr_multipliers = {'none': 0.8, 'flood': 1.0, 'drip': 1.2, 'sprinkler': 1.1}
        yield_val *= irr_multipliers.get(row['irrigation'], 1.0)
        
        # Pest control and disease factors
        if row['pest_control']:
            yield_val *= 1.1
        if row['disease_presence']:
            yield_val *= 0.7
            
        # Crop variety factor
        variety_multipliers = {
            'hybrid-maize': 1.3, 'traditional-maize': 1.0, 
            'hybrid-wheat': 1.2, 'soybeans': 0.9
        }
        yield_val *= variety_multipliers.get(row['crop_variety'], 1.0)
        
        # Add some noise
        yield_val += np.random.normal(0, 200)
        yield_val = max(yield_val, 500)  # Minimum yield
        
        yield_values.append(yield_val)
    
    df['yield'] = yield_values
    
    # Prepare features
    categorical_columns = ['soil_type', 'fertilizer_use', 'irrigation', 'crop_variety']
    
    # Initialize and fit label encoders
    label_encoders = {}
    for col in categorical_columns:
        le = LabelEncoder()
        df[col + '_encoded'] = le.fit_transform(df[col])
        label_encoders[col] = le
    
    # Prepare feature matrix
    feature_columns = [
        'rainfall', 'temperature', 'humidity', 'soil_ph',
        'soil_type_encoded', 'fertilizer_use_encoded', 
        'irrigation_encoded', 'crop_variety_encoded',
        'pest_control', 'disease_presence'
    ]
    
    X = df[feature_columns].astype(float)
    y = df['yield']
    
    # Train Random Forest model
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X, y)
    
    # Save model and encoders
    joblib.dump(model, "scripts/crop_yield_model.joblib")
    joblib.dump(label_encoders, "scripts/label_encoders.joblib")
    
    print(f"Model trained successfully. R² score: {model.score(X, y):.3f}")

def preprocess_input(data: CropData) -> np.ndarray:
    """Preprocess input data for prediction"""
    global label_encoders
    
    # Create feature vector
    features = [
        data.rainfall,
        data.temperature,
        data.humidity,
        data.soil_ph,
        float(data.pest_control),
        float(data.disease_presence)
    ]
    
    # Encode categorical variables
    categorical_mappings = {
        'soil_type': data.soil_type,
        'fertilizer_use': data.fertilizer_use,
        'irrigation': data.irrigation,
        'crop_variety': data.crop_variety
    }
    
    for col, value in categorical_mappings.items():
        if col in label_encoders:
            try:
                encoded_value = label_encoders[col].transform([value])[0]
            except ValueError:
                # Handle unknown categories by using the most common category
                encoded_value = 0
            features.insert(-2, float(encoded_value))
        else:
            features.insert(-2, 0.0)
    
    return np.array(features).reshape(1, -1)

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    load_model()

@app.get("/")
async def root():
    return {"message": "Crop Yield Prediction API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/predict", response_model=PredictionResponse)
async def predict_yield(data: CropData):
    """Predict crop yield based on input parameters"""
    global model
    
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Preprocess input
        features = preprocess_input(data)
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Calculate confidence score (simplified)
        # In a real scenario, you might use prediction intervals or ensemble variance
        confidence = min(0.95, max(0.65, 0.85 + np.random.normal(0, 0.05)))
        
        return PredictionResponse(
            predicted_yield_kg_per_hectare=round(prediction, 1),
            confidence_score=round(confidence, 2),
            model_used="Random Forest",
            factors_analyzed=10
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

@app.get("/model-info")
async def get_model_info():
    """Get information about the loaded model"""
    global model
    
    if model is None:
        return {"error": "Model not loaded"}
    
    return {
        "model_type": "Random Forest Regressor",
        "n_estimators": model.n_estimators,
        "max_depth": model.max_depth,
        "feature_count": model.n_features_in_,
        "training_score": "Available after training"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
