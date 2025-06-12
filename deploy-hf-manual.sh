#!/bin/bash

# Manual Hugging Face Deployment Script
# Run this if GitHub Actions deployment fails

set -e

echo "🚀 Manual Hugging Face Spaces Deployment"
echo "========================================"

# Check if HF_TOKEN is set
if [ -z "$HF_TOKEN" ]; then
    echo "❌ Error: HF_TOKEN environment variable not set"
    echo "Please run: export HF_TOKEN=your_token_here"
    exit 1
fi

# Build the React app
echo "📦 Building React application..."
cd frontend
npm ci
npm run build
cd ..

# Prepare deployment directory
echo "🔧 Preparing deployment files..."
rm -rf hf-deploy
mkdir hf-deploy
cp -r frontend/build/* hf-deploy/

# Create HF Spaces README
cat > hf-deploy/README.md << 'EOF'
---
title: Air Quality Health
emoji: 🌍
colorFrom: blue
colorTo: green
sdk: static
pinned: false
license: mit
short_description: Air Quality and Health Dashboard
---

# Air Quality Health Dashboard

Interactive dashboard for air quality and health data visualization.

## Team: Safety Windy
- Phong Tran (104334842)
- Khanh Toan Nguyen (104180605) 
- Mai An Nguyen (103824070)

COS30049 - Swinburne University of Technology
EOF

# Configure git
git config --global user.email "manual@deploy.com"
git config --global user.name "Manual Deploy"

# Clean up any existing temp repo
rm -rf temp-hf-repo

# Clone and deploy
echo "📡 Deploying to Hugging Face Spaces..."
git clone https://huggingface.co/spaces/cos30049-safetywindy/air_quality_health temp-hf-repo

cd temp-hf-repo

# Pull latest changes
git pull origin main || true

# Create a backup branch first
git checkout -b backup-$(date +%Y%m%d-%H%M%S) || true
git checkout main

# Remove old files but preserve important ones
find . -type f ! -path './.git/*' ! -name '.gitattributes' -delete 2>/dev/null || true

# Copy new files
cp -r ../hf-deploy/* .

# Add and commit changes
git add -A

if git diff --staged --quiet; then
    echo "✅ No changes to deploy"
else
    git commit -m "Manual deployment $(date)"
    
    # Try normal push first
    if git push https://user:$HF_TOKEN@huggingface.co/spaces/cos30049-safetywindy/air_quality_health main; then
        echo "✅ Deployment successful!"
    else
        echo "⚠️  Normal push failed, trying force push..."
        git push --force https://user:$HF_TOKEN@huggingface.co/spaces/cos30049-safetywindy/air_quality_health main
        echo "✅ Force push successful!"
    fi
fi

cd ..
rm -rf temp-hf-repo hf-deploy

echo ""
echo "🎉 Deployment Complete!"
echo "📍 URL: https://cos30049-safetywindy-air-quality-health.hf.space"
echo "📚 API: https://cos30049-safetywindy-air-quality-health-api.hf.space"
echo ""
echo "⏱️  It may take 2-3 minutes for changes to appear live."
