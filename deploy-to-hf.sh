#!/bin/bash

# Manual Deployment Script for Hugging Face Spaces
# Run this script to deploy your React app to HF Spaces manually

set -e

echo "🚀 Starting manual deployment to Hugging Face Spaces..."
echo "=================================================="

# Check if HF_TOKEN is set
if [ -z "$HF_TOKEN" ]; then
    echo "❌ Error: HF_TOKEN environment variable is not set."
    echo "Please set your Hugging Face token:"
    echo "export HF_TOKEN=your_token_here"
    exit 1
fi

# Navigate to frontend and build
echo "📦 Building React application..."
cd frontend
npm run build
cd ..

# Create deployment directory
echo "📂 Preparing deployment files..."
rm -rf deploy-temp
mkdir -p deploy-temp

# Copy built files
cp -r frontend/build/* deploy-temp/

# Create README.md for HF Spaces
cat > deploy-temp/README.md << 'EOF'
---
title: Air Quality Health
emoji: 🌍
colorFrom: blue
colorTo: green
sdk: static
pinned: false
license: mit
short_description: Air Quality and Health Visualization Dashboard
---

# Air Quality Health Dashboard

Interactive dashboard for visualizing air quality data and its impact on health across different countries and time periods.

## Features

- 🗺️ Interactive world map with clickable countries
- 📊 Dynamic bubble and bar charts  
- 📈 Timeline scrolling (1990-2020)
- 🔮 Health burden predictions using ML models
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend**: React.js + D3.js
- **UI Framework**: Material-UI (MUI)
- **Data Visualization**: D3.js
- **Data Source**: Hugging Face Datasets

## How to Use

1. **Explore the Map**: Click on any country to see detailed health impact data
2. **Timeline Navigation**: Use the year slider to explore data from 1990-2020
3. **Chart Switching**: Toggle between bubble chart and bar chart views
4. **Pollutant Selection**: Choose different pollutants (PM2.5, Ozone, HAP)
5. **Predictions**: Get AI-powered health burden predictions

## Team: Safety Windy

- **Phong Tran** (104334842)
- **Khanh Toan Nguyen** (104180605) 
- **Mai An Nguyen** (103824070)

**Course**: COS30049 Computing Technology Innovation Project  
**Institution**: Swinburne University of Technology

---

*This dashboard provides insights into global air quality trends and their health impacts, supporting data-driven environmental and health policy decisions.*
EOF

# Install huggingface_hub if not already installed
echo "🔧 Installing Hugging Face Hub..."
pip3 install huggingface_hub --quiet

# Deploy using Python script
echo "🚀 Deploying to Hugging Face Spaces..."

python3 << EOF
import os
from huggingface_hub import HfApi
import datetime

# Initialize HF API
api = HfApi()
token = os.environ.get('HF_TOKEN')

# Repository details
repo_id = "cos30049-safetywindy/air_quality_health"
repo_type = "space"

try:
    # Check if repository exists
    try:
        repo_info = api.repo_info(repo_id=repo_id, repo_type=repo_type, token=token)
        print(f"✅ Repository exists: {repo_info.id}")
    except:
        print("🔄 Creating new repository...")
        api.create_repo(repo_id=repo_id, repo_type=repo_type, token=token, private=False)
        print("✅ Repository created successfully")
    
    # Upload files
    print("📤 Uploading files...")
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    api.upload_folder(
        folder_path="./deploy-temp",
        repo_id=repo_id,
        repo_type=repo_type,
        token=token,
        commit_message=f"🚀 Manual deploy - {current_time}"
    )
    
    print("✅ Deployment completed successfully!")
    print(f"🌐 Your app is available at: https://huggingface.co/spaces/{repo_id}")
    
except Exception as e:
    print(f"❌ Deployment failed: {str(e)}")
    exit(1)
EOF

# Cleanup
echo "🧹 Cleaning up temporary files..."
rm -rf deploy-temp

echo ""
echo "🎉 Deployment completed successfully!"
echo "📝 Your app should be available at: https://huggingface.co/spaces/cos30049-safetywindy/air_quality_health"
echo "🔄 It may take a few minutes for the space to build and become available."
echo "=================================================="
