#!/bin/bash

# Final verification and setup for Hugging Face Spaces deployment
set -e

echo "🔍 Final Deployment Verification"
echo "================================"

# Check GitHub Actions workflows
echo "📋 Checking GitHub Actions workflows..."
if [ -d ".github/workflows" ]; then
    echo "✅ GitHub Actions directory exists"
    echo "📄 Available workflows:"
    ls -la .github/workflows/
else
    echo "❌ No GitHub Actions workflows found"
    exit 1
fi

# Check if frontend builds
echo ""
echo "🔨 Testing frontend build..."
cd frontend
npm ci --silent
npm run build --silent
cd ..
echo "✅ Frontend builds successfully"

# Check current git status
echo ""
echo "📊 Git status:"
git status --short

# Provide final instructions
echo ""
echo "🎯 Final Setup Instructions:"
echo "============================"
echo ""
echo "1. 🔑 ENSURE HF_TOKEN IS SET:"
echo "   - Go to: https://github.com/Phonginhere/cos30049/settings/secrets/actions"
echo "   - Verify 'HF_TOKEN' secret exists with Write permissions"
echo ""
echo "2. 🚀 TRIGGER DEPLOYMENT:"
echo "   - Go to: https://github.com/Phonginhere/cos30049/actions"
echo "   - Select 'Deploy Frontend to Hugging Face' workflow"
echo "   - Click 'Run workflow' → Select 'main' branch → Click 'Run workflow'"
echo ""
echo "3. 📊 MONITOR PROGRESS:"
echo "   - Watch workflow progress in GitHub Actions tab"
echo "   - Check deployment status and logs"
echo "   - Visit your space: https://huggingface.co/spaces/cos30049-safetywindy/air_quality_health"
echo ""
echo "4. ✅ VERIFY DEPLOYMENT:"
echo "   - Your app should be live within 2-3 minutes"
echo "   - Future pushes to 'frontend/' will auto-deploy"
echo ""
echo "🌍 Your URLs:"
echo "   📍 HF Space: https://huggingface.co/spaces/cos30049-safetywindy/air_quality_health"
echo "   📍 Direct App: https://cos30049-safetywindy-air-quality-health.hf.space"
echo ""
echo "🎉 Setup Complete! Your Air Quality Health Dashboard is ready for auto-deployment!"
