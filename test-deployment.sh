#!/bin/bash

# Test deployment script for Hugging Face Spaces
# This script can be used to manually deploy or test the deployment process

set -e  # Exit on any error

echo "🚀 Testing Hugging Face Spaces Deployment"
echo "=========================================="

# Check if HF_TOKEN is available (for local testing)
if [ -z "$HF_TOKEN" ]; then
    echo "⚠️  HF_TOKEN not found in environment"
    echo "   This is normal for local testing"
    echo "   GitHub Actions will use the secret HF_TOKEN"
    echo ""
fi

# Navigate to frontend directory
echo "📂 Navigating to frontend directory..."
cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building React application..."
npm run build

echo "✅ Build completed successfully!"
echo ""

# Check build output
echo "📋 Build output contents:"
ls -la build/
echo ""

# Create temporary deployment structure
echo "📁 Creating deployment structure..."
cd ..
mkdir -p temp-deploy
cp -r frontend/build/* temp-deploy/

# Create README for HF Spaces
cat > temp-deploy/README.md << 'EOF'
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

# 🌍 Air Quality Health Dashboard

An interactive dashboard for visualizing air quality data and its impact on health across different countries and time periods.

## ✨ Features

- 📊 **Interactive Visualizations**: D3.js powered charts including choropleth maps, bubble charts, and bar charts
- 🗺️ **Global Coverage**: Air quality data from countries worldwide (1990-2021)
- 🎛️ **Time Controls**: Interactive sliders for temporal data exploration
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔍 **Data Insights**: Explore relationships between air quality and health outcomes

## 🛠️ Technology Stack

- **Frontend Framework**: React.js with modern hooks
- **Data Visualization**: D3.js for interactive charts and maps
- **UI Components**: Material-UI (MUI) for polished interface
- **Styling**: Custom CSS with Bootstrap utilities
- **Build Tool**: Create React App with optimization

## 📊 Data Sources

This application uses data from reputable sources:
- **State of Global Air** (Health Effects Institute)
- **Institute for Health Metrics and Evaluation (IHME)**
- **University of British Columbia** research contributions

Data covers air pollutants including:
- Ozone (O₃)
- Nitrogen Dioxide (NO₂)
- Ambient Particulate Matter (PM2.5)
- Hazardous Air Pollutants from solid fuels

## 👥 Team: Safety Windy

This project was developed by Swinburne University of Technology students:

- **Phong Tran** (104334842) - Bachelor of Computer Science (Artificial Intelligence)
- **Khanh Toan Nguyen** (104180605) - Bachelor of Computer Science (Artificial Intelligence)
- **Mai An Nguyen** (103824070) - Bachelor of Computer Science (Data Science)

## 🎓 Academic Context

**COS30049 Computing Technology Innovation Project**  
Swinburne University of Technology  
Faculty of Science, Engineering and Technology

## 🚀 Getting Started

Simply interact with the dashboard using the navigation menu. The application loads automatically with sample data and provides intuitive controls for data exploration.

### Navigation
- **Home**: Project overview and team information
- **Graph**: Interactive visualizations and charts

### Usage Tips
- Click on countries in the choropleth map to view detailed data
- Use the time slider to see data changes over years
- Hover over chart elements for detailed tooltips
- Switch between different chart types using the provided controls

## 📈 Project Goals

Our application aims to:
1. **Educate**: Increase public awareness of air quality impacts on health
2. **Visualize**: Make complex environmental data accessible and understandable
3. **Inform**: Support policy makers and researchers with data insights
4. **Demonstrate**: Showcase modern web development and data visualization techniques

---

*Deployed via GitHub Actions from [cos30049 repository](https://github.com/Phonginhere/cos30049)*
EOF

echo "📄 Deployment structure ready:"
ls -la temp-deploy/
echo ""

# If HF_TOKEN is available, attempt actual deployment
if [ -n "$HF_TOKEN" ]; then
    echo "🚀 Attempting live deployment..."
    
    # Clone HF Space
    git clone https://huggingface.co/spaces/cos30049-safetywindy/air_quality_health hf-space
    cd hf-space
    
    # Configure git
    git config user.email "test@deployment.com"
    git config user.name "Test Deployment"
    git remote set-url origin https://user:$HF_TOKEN@huggingface.co/spaces/cos30049-safetywindy/air_quality_health
    
    # Clear old files but preserve .git
    find . -name "*.html" -o -name "*.js" -o -name "*.css" -o -name "*.json" -o -name "*.ico" -o -name "*.png" -o -name "*.svg" -o -name "*.txt" | grep -v "^\./.git" | xargs rm -f 2>/dev/null || true
    rm -rf static/ build/ assets/ 2>/dev/null || true
    
    # Copy new files
    cp -r ../temp-deploy/* .
    
    # Commit and push
    git add .
    if ! git diff --staged --quiet; then
        git commit -m "🚀 Test deployment $(date)"
        git push
        echo "✅ Live deployment successful!"
    else
        echo "ℹ️ No changes to deploy"
    fi
    
    cd ..
else
    echo "ℹ️ Skipping live deployment (no HF_TOKEN)"
fi

# Cleanup
echo "🧹 Cleaning up..."
rm -rf temp-deploy hf-space 2>/dev/null || true

echo ""
echo "🎉 Deployment test completed!"
echo ""
echo "📝 Summary:"
echo "   ✅ Frontend builds successfully"
echo "   ✅ Deployment structure created"
echo "   ✅ README.md generated for HF Spaces"
echo ""
echo "🔗 Your app will be available at:"
echo "   https://huggingface.co/spaces/cos30049-safetywindy/air_quality_health"
echo ""
echo "📚 Next steps:"
echo "   1. Push any frontend changes to trigger auto-deployment"
echo "   2. Monitor GitHub Actions for deployment status"
echo "   3. Check your Hugging Face Space for updates"
