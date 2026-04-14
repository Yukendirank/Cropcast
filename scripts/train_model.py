"""
Standalone script to train the crop yield prediction model
Run this script to generate the initial model files
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import matplotlib.pyplot as plt

def generate_synthetic_data(n_samples=2000):
    """Generate synthetic crop yield data for training"""
    np.random.seed(42)
    
    # Weather data
    rainfall = np.random.gamma(2, 60)  # Gamma distribution for rainfall
    temperature = np.random.normal(25, 6, n_samples)
    humidity = np.random.beta(2, 2, n_samples) * 100  # Beta distribution scaled to 0-100
    
    # Soil data
    soil_types = ['clay', 'loamy', 'sandy', 'silty', 'peaty', 'chalky']
    soil_type = np.random.choice(soil_types, n_samples, p=[0.2, 0.3, 0.2, 0.15, 0.1, 0.05])
    soil_ph = np.random.normal(6.5, 1.2, n_samples)
    soil_ph = np.clip(soil_ph, 4.0, 9.0)  # Realistic pH range
    
    # Management practices
    fertilizer_levels = ['none', 'low', 'moderate', 'high']
    fertilizer_use = np.random.choice(fertilizer_levels, n_samples, p=[0.1, 0.3, 0.4, 0.2])
    
    irrigation_methods = ['none', 'flood', 'drip', 'sprinkler', 'furrow']
    irrigation = np.random.choice(irrigation_methods, n_samples, p=[0.2, 0.2, 0.3, 0.2, 0.1])
    
    pest_control = np.random.choice([True, False], n_samples, p=[0.7, 0.3])
    disease_presence = np.random.choice([True, False], n_samples, p=[0.2, 0.8])
    
    # Crop varieties
    crop_varieties = [
        'hybrid-maize', 'traditional-maize', 'hybrid-wheat', 'traditional-wheat',
        'hybrid-rice', 'traditional-rice', 'soybeans', 'cotton'
    ]
    crop_variety = np.random.choice(crop_varieties, n_samples)
    
    # Create DataFrame
    data = pd.DataFrame({
        'rainfall': rainfall,
        'temperature': temperature,
        'humidity': humidity,
        'soil_type': soil_type,
        'soil_ph': soil_ph,
        'fertilizer_use': fertilizer_use,
        'irrigation': irrigation,
        'pest_control': pest_control,
        'crop_variety': crop_variety,
        'disease_presence': disease_presence
    })
    
    return data

def calculate_yield(df):
    """Calculate synthetic yield based on realistic agricultural relationships"""
    yields = []
    
    # Base yields by crop type (kg/hectare)
    base_yields = {
        'hybrid-maize': 4500, 'traditional-maize': 3200,
        'hybrid-wheat': 3800, 'traditional-wheat': 2800,
        'hybrid-rice': 5200, 'traditional-rice': 3600,
        'soybeans': 2800, 'cotton': 1200
    }
    
    for _, row in df.iterrows():
        base_yield = base_yields.get(row['crop_variety'], 3000)
        yield_val = base_yield
        
        # Weather impact
        # Optimal rainfall around 100-150mm
        rainfall_factor = 1.0
        if row['rainfall'] < 50:
            rainfall_factor = 0.6
        elif row['rainfall'] > 200:
            rainfall_factor = 0.8
        elif 100 <= row['rainfall'] <= 150:
            rainfall_factor = 1.2
        
        yield_val *= rainfall_factor
        
        # Temperature impact (optimal around 20-30°C)
        if row['temperature'] < 15 or row['temperature'] > 35:
            yield_val *= 0.7
        elif 20 <= row['temperature'] <= 30:
            yield_val *= 1.1
        
        # Humidity impact
        if row['humidity'] < 40 or row['humidity'] > 80:
            yield_val *= 0.9
        
        # Soil type impact
        soil_multipliers = {
            'loamy': 1.3, 'silty': 1.2, 'clay': 1.0, 
            'sandy': 0.8, 'peaty': 0.9, 'chalky': 0.7
        }
        yield_val *= soil_multipliers.get(row['soil_type'], 1.0)
        
        # Soil pH impact (optimal 6.0-7.0)
        ph_optimal = 6.5
        ph_deviation = abs(row['soil_ph'] - ph_optimal)
        ph_factor = max(0.6, 1.0 - ph_deviation * 0.15)
        yield_val *= ph_factor
        
        # Fertilizer impact
        fert_multipliers = {'none': 0.7, 'low': 0.9, 'moderate': 1.2, 'high': 1.4}
        yield_val *= fert_multipliers.get(row['fertilizer_use'], 1.0)
        
        # Irrigation impact
        irr_multipliers = {
            'none': 0.8, 'flood': 1.0, 'drip': 1.3, 
            'sprinkler': 1.2, 'furrow': 1.1
        }
        yield_val *= irr_multipliers.get(row['irrigation'], 1.0)
        
        # Management practices
        if row['pest_control']:
            yield_val *= 1.15
        
        if row['disease_presence']:
            yield_val *= 0.6
        
        # Add realistic noise
        noise = np.random.normal(0, yield_val * 0.1)
        yield_val += noise
        
        # Ensure minimum yield
        yield_val = max(yield_val, 200)
        
        yields.append(yield_val)
    
    return yields

def train_models():
    """Train multiple models and select the best one"""
    print("Generating synthetic training data...")
    df = generate_synthetic_data(2000)
    df['yield'] = calculate_yield(df)
    
    print(f"Dataset created with {len(df)} samples")
    print(f"Yield statistics: Mean={df['yield'].mean():.1f}, Std={df['yield'].std():.1f}")
    
    # Encode categorical variables
    categorical_columns = ['soil_type', 'fertilizer_use', 'irrigation', 'crop_variety']
    label_encoders = {}
    
    for col in categorical_columns:
        le = LabelEncoder()
        df[col + '_encoded'] = le.fit_transform(df[col])
        label_encoders[col] = le
    
    # Prepare features
    feature_columns = [
        'rainfall', 'temperature', 'humidity', 'soil_ph',
        'soil_type_encoded', 'fertilizer_use_encoded', 
        'irrigation_encoded', 'crop_variety_encoded',
        'pest_control', 'disease_presence'
    ]
    
    X = df[feature_columns].astype(float)
    y = df['yield']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train multiple models
    models = {
        'Random Forest': RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42),
        'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, max_depth=8, random_state=42)
    }
    
    best_model = None
    best_score = -float('inf')
    best_name = ""
    
    for name, model in models.items():
        print(f"\nTraining {name}...")
        model.fit(X_train, y_train)
        
        # Evaluate
        train_score = model.score(X_train, y_train)
        test_score = model.score(X_test, y_test)
        cv_scores = cross_val_score(model, X_train, y_train, cv=5)
        
        y_pred = model.predict(X_test)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        
        print(f"Train R²: {train_score:.3f}")
        print(f"Test R²: {test_score:.3f}")
        print(f"CV R² (mean±std): {cv_scores.mean():.3f}±{cv_scores.std():.3f}")
        print(f"RMSE: {rmse:.1f} kg/ha")
        
        if test_score > best_score:
            best_score = test_score
            best_model = model
            best_name = name
    
    print(f"\nBest model: {best_name} (R² = {best_score:.3f})")
    
    # Save best model and encoders
    joblib.dump(best_model, "scripts/crop_yield_model.joblib")
    joblib.dump(label_encoders, "scripts/label_encoders.joblib")
    
    print("Model and encoders saved successfully!")
    
    # Feature importance (if Random Forest)
    if hasattr(best_model, 'feature_importances_'):
        feature_importance = pd.DataFrame({
            'feature': feature_columns,
            'importance': best_model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\nFeature Importance:")
        print(feature_importance)
    
    return best_model, label_encoders

if __name__ == "__main__":
    model, encoders = train_models()
    print("\nModel training completed!")
