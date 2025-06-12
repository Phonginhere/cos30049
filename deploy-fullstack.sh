#!/bin/bash

# Deploy Full-Stack App (Frontend + Backend) to Hugging Face Spaces
# This creates separate spaces for frontend and backend

set -e

echo "🚀 Deploying Full-Stack Air Quality Health Dashboard"
echo "=================================================="

# Check if HF_TOKEN is set
if [ -z "$HF_TOKEN" ]; then
    echo "❌ Error: HF_TOKEN environment variable is not set."
    echo "Please set your Hugging Face token:"
    echo "export HF_TOKEN=your_token_here"
    exit 1
fi

# Install required packages
echo "📦 Installing required packages..."
pip3 install huggingface_hub gradio fastapi uvicorn --quiet

# Create backend deployment
echo "🔧 Preparing backend deployment..."
mkdir -p deploy-backend
cp -r backend/* deploy-backend/

# Create app.py for Gradio + FastAPI integration
cat > deploy-backend/app.py << 'EOF'
import gradio as gr
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import threading
import time

# Import your existing FastAPI app
from main import app as fastapi_app

# Configure CORS for Hugging Face Spaces
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Start FastAPI in a separate thread
def start_fastapi():
    uvicorn.run(fastapi_app, host="0.0.0.0", port=8000)

# Start FastAPI server in background
threading.Thread(target=start_fastapi, daemon=True).start()
time.sleep(2)  # Wait for server to start

# Create Gradio interface for API documentation and testing
def predict_health_burden(iso3, exposure_mean, pollutant):
    """Test the prediction API endpoint"""
    import requests
    try:
        response = requests.post("http://localhost:8000/predict", json={
            "iso3": iso3,
            "exposure_mean": float(exposure_mean),
            "pollutant": pollutant
        })
        if response.status_code == 200:
            result = response.json()
            return f"Predicted Health Burden: {result['predicted_burden_mean']:.2f}"
        else:
            return f"Error: {response.text}"
    except Exception as e:
        return f"Error: {str(e)}"

def get_pollutants():
    """Get available pollutants"""
    import requests
    try:
        response = requests.get("http://localhost:8000/pollutants")
        if response.status_code == 200:
            result = response.json()
            return str(result)
        else:
            return f"Error: {response.text}"
    except Exception as e:
        return f"Error: {str(e)}"

# Create Gradio interface
with gr.Blocks(title="Air Quality Health API") as demo:
    gr.Markdown("# 🌍 Air Quality Health Prediction API")
    gr.Markdown("Backend API for the Air Quality Health Dashboard")
    
    with gr.Tab("Prediction"):
        with gr.Row():
            iso3_input = gr.Textbox(label="Country Code (ISO3)", placeholder="USA")
            exposure_input = gr.Number(label="Exposure Mean", value=25.0)
            pollutant_input = gr.Dropdown(
                choices=["pm25", "ozone", "hap"], 
                label="Pollutant", 
                value="pm25"
            )
        
        predict_btn = gr.Button("Predict Health Burden")
        prediction_output = gr.Textbox(label="Result")
        
        predict_btn.click(
            predict_health_burden,
            inputs=[iso3_input, exposure_input, pollutant_input],
            outputs=prediction_output
        )
    
    with gr.Tab("API Info"):
        gr.Markdown("""
        ## API Endpoints
        
        **Base URL:** `https://cos30049-safetywindy-air-quality-health-api.hf.space`
        
        ### 1. Prediction Endpoint
        ```
        POST /predict
        Content-Type: application/json
        
        {
            "iso3": "USA",
            "exposure_mean": 25.0,
            "pollutant": "pm25"
        }
        ```
        
        ### 2. Pollutants Endpoint
        ```
        GET /pollutants
        ```
        
        ### 3. Health Check
        ```
        GET /
        ```
        """)
        
        pollutants_btn = gr.Button("Get Available Pollutants")
        pollutants_output = gr.Textbox(label="Available Pollutants")
        
        pollutants_btn.click(get_pollutants, outputs=pollutants_output)

# Launch with public access
if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860, share=False)
EOF

# Create requirements.txt for backend
cat > deploy-backend/requirements.txt << 'EOF'
fastapi
uvicorn
gradio
requests
pydantic
sqlalchemy
pandas  
scikit-learn==1.5.2
huggingface_hub
EOF

# Create README for backend space
cat > deploy-backend/README.md << 'EOF'
---
title: Air Quality Health API
emoji: 🔧
colorFrom: green
colorTo: blue
sdk: gradio
sdk_version: 4.44.0
app_file: app.py
pinned: false
license: mit
short_description: Backend API for Air Quality Health Dashboard
---

# Air Quality Health Prediction API

Backend API server for the Air Quality Health Dashboard, providing machine learning predictions for health burden based on air quality data.

## API Endpoints

### Base URL
```
https://cos30049-safetywindy-air-quality-health-api.hf.space
```

### 1. Health Burden Prediction
```http
POST /predict
Content-Type: application/json

{
    "iso3": "USA",
    "exposure_mean": 25.0,
    "pollutant": "pm25"
}
```

**Response:**
```json
{
    "predicted_burden_mean": 1234.56
}
```

### 2. Available Pollutants
```http
GET /pollutants
```

**Response:**
```json
{
    "pollutants": [
        {"key": "pm25", "display": "Particulate Matter 2.5 (PM)"},
        {"key": "ozone", "display": "Ozone"},
        {"key": "hap", "display": "Hazardous Air Pollutants (HAP)"}
    ]
}
```

### 3. Health Check
```http
GET /
```

## Usage with Frontend

The frontend React app should update its API calls to use this backend:

```javascript
// Update in PredictionForm.js
const response = await axios.post(
    'https://cos30049-safetywindy-air-quality-health-api.hf.space/predict', 
    payload
);
```

## Tech Stack

- **Framework:** FastAPI
- **ML Library:** scikit-learn
- **Interface:** Gradio
- **Data Processing:** pandas
- **Deployment:** Hugging Face Spaces

## Team: Safety Windy

- **Phong Tran** (104334842)
- **Khanh Toan Nguyen** (104180605) 
- **Mai An Nguyen** (103824070)

**Course:** COS30049 Computing Technology Innovation Project  
**Institution:** Swinburne University of Technology
EOF

# Deploy backend to HF Spaces
echo "🚀 Deploying backend to Hugging Face Spaces..."

python3 << EOF
import os
from huggingface_hub import HfApi
import datetime

# Initialize HF API
api = HfApi()
token = os.environ.get('HF_TOKEN')

# Repository details for backend
repo_id = "cos30049-safetywindy/air-quality-health-api"
repo_type = "space"

try:
    # Create backend repository
    try:
        repo_info = api.repo_info(repo_id=repo_id, repo_type=repo_type, token=token)
        print(f"✅ Backend repository exists: {repo_info.id}")
    except:
        print("🔄 Creating backend repository...")
        api.create_repo(repo_id=repo_id, repo_type=repo_type, token=token, private=False)
        print("✅ Backend repository created successfully")
    
    # Upload backend files
    print("📤 Uploading backend files...")
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    api.upload_folder(
        folder_path="./deploy-backend",
        repo_id=repo_id,
        repo_type=repo_type,
        token=token,
        commit_message=f"🚀 Deploy backend API - {current_time}"
    )
    
    print("✅ Backend deployment completed!")
    print(f"🔧 Backend API URL: https://huggingface.co/spaces/{repo_id}")
    
except Exception as e:
    print(f"❌ Backend deployment failed: {str(e)}")
    exit(1)
EOF

# Now deploy updated frontend
echo "🎨 Preparing frontend with backend integration..."
mkdir -p deploy-frontend
cd frontend
npm run build
cd ..
cp -r frontend/build/* deploy-frontend/

# Update frontend to use deployed backend
cat > deploy-frontend/config.js << 'EOF'
// Backend API configuration
window.API_BASE_URL = 'https://cos30049-safetywindy-air-quality-health-api.hf.space';
EOF

# Create updated README for frontend
cat > deploy-frontend/README.md << 'EOF'
---
title: Air Quality Health Dashboard
emoji: 🌍
colorFrom: blue
colorTo: green
sdk: static
pinned: false
license: mit
short_description: Interactive Air Quality and Health Visualization Dashboard
---

# Air Quality Health Dashboard

Interactive dashboard for visualizing air quality data and its impact on health across different countries and time periods.

## 🌐 Live Application

**Frontend:** https://cos30049-safetywindy-air-quality-health.hf.space  
**Backend API:** https://cos30049-safetywindy-air-quality-health-api.hf.space

## Features

- 🗺️ **Interactive World Map** - Click on any country to explore detailed data
- 📊 **Dynamic Charts** - Bubble and bar charts with real-time updates
- 📈 **Timeline Navigation** - Explore data from 1990-2020
- 🔮 **AI Predictions** - Machine learning-powered health burden predictions
- 📱 **Responsive Design** - Works on all devices

## How to Use

1. **Explore the Map**: Click on any country to see detailed health impact data
2. **Timeline Navigation**: Use the year slider to explore historical data (1990-2020)
3. **Chart Switching**: Toggle between bubble chart and bar chart views
4. **Pollutant Selection**: Choose different pollutants (PM2.5, Ozone, HAP)
5. **Get Predictions**: Use the prediction form for AI-powered health burden forecasts

## Technical Architecture

### Frontend
- **Framework**: React.js
- **Visualization**: D3.js
- **UI Components**: Material-UI (MUI)
- **Data Source**: Hugging Face Datasets

### Backend API
- **Framework**: FastAPI
- **ML Models**: scikit-learn
- **Interface**: Gradio
- **Base URL**: `https://cos30049-safetywindy-air-quality-health-api.hf.space`

## API Integration

The dashboard integrates with our custom backend API for predictions:

```javascript
// Example API call
const response = await fetch(
    'https://cos30049-safetywindy-air-quality-health-api.hf.space/predict',
    {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            iso3: 'USA',
            exposure_mean: 25.0,
            pollutant: 'pm25'
        })
    }
);
```

## Team: Safety Windy

- **Phong Tran** (104334842)
- **Khanh Toan Nguyen** (104180605) 
- **Mai An Nguyen** (103824070)

**Course**: COS30049 Computing Technology Innovation Project  
**Institution**: Swinburne University of Technology

---

*This dashboard provides insights into global air quality trends and their health impacts, supporting data-driven environmental and health policy decisions.*
EOF

# Deploy updated frontend
echo "🎨 Deploying updated frontend..."

python3 << EOF
import os
from huggingface_hub import HfApi
import datetime

# Initialize HF API
api = HfApi()
token = os.environ.get('HF_TOKEN')

# Repository details for frontend
repo_id = "cos30049-safetywindy/air-quality-health"
repo_type = "space"

try:
    # Upload frontend files
    print("📤 Uploading frontend files...")
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    api.upload_folder(
        folder_path="./deploy-frontend",
        repo_id=repo_id,
        repo_type=repo_type,
        token=token,
        commit_message=f"🚀 Deploy frontend with backend integration - {current_time}"
    )
    
    print("✅ Frontend deployment completed!")
    print(f"🌐 Frontend URL: https://huggingface.co/spaces/{repo_id}")
    
except Exception as e:
    print(f"❌ Frontend deployment failed: {str(e)}")
    exit(1)
EOF

# Cleanup
echo "🧹 Cleaning up..."
rm -rf deploy-backend deploy-frontend

echo ""
echo "🎉 FULL-STACK DEPLOYMENT COMPLETED!"
echo "=================================================="
echo "🌐 Frontend Dashboard: https://huggingface.co/spaces/cos30049-safetywindy/air-quality-health"
echo "🔧 Backend API:       https://huggingface.co/spaces/cos30049-safetywindy/air-quality-health-api"
echo ""
echo "📋 Test URLs:"
echo "   • Main Dashboard:  https://cos30049-safetywindy-air-quality-health.hf.space"
echo "   • API Endpoint:    https://cos30049-safetywindy-air-quality-health-api.hf.space"
echo "   • API Docs:        https://cos30049-safetywindy-air-quality-health-api.hf.space/docs"
echo ""
echo "🔄 Note: It may take 2-3 minutes for the spaces to build and become available."
echo "=================================================="
