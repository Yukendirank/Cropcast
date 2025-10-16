"""
Test script for the crop yield prediction API
"""

import requests
import json

# API endpoint
BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the health check endpoint"""
    response = requests.get(f"{BASE_URL}/health")
    print("Health Check:", response.json())

def test_prediction():
    """Test the prediction endpoint"""
    # Sample data matching the original requirements
    test_data = {
        "rainfall": 120,
        "temperature": 28,
        "humidity": 65,
        "soil_type": "loamy",
        "soil_ph": 6.8,
        "fertilizer_use": "moderate",
        "irrigation": "drip",
        "pest_control": True,
        "crop_variety": "hybrid-maize",
        "disease_presence": False
    }
    
    response = requests.post(f"{BASE_URL}/predict", json=test_data)
    
    if response.status_code == 200:
        result = response.json()
        print("Prediction Result:")
        print(json.dumps(result, indent=2))
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

def test_model_info():
    """Test the model info endpoint"""
    response = requests.get(f"{BASE_URL}/model-info")
    print("Model Info:", response.json())

if __name__ == "__main__":
    print("Testing Crop Yield Prediction API...")
    
    try:
        test_health_check()
        test_model_info()
        test_prediction()
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to API. Make sure the server is running.")
        print("Run: python scripts/backend_app.py")
