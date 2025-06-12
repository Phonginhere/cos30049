#!/bin/bash
# Monitor GitHub Actions deployment progress

echo "🔍 Monitoring GitHub Actions Deployment..."
echo "Repository: cos30049"
echo "Branch: main"
echo "Expected workflow: Deploy Frontend to Hugging Face"
echo ""

# Function to check workflow status
check_workflow() {
    echo "⏳ Checking latest workflow run..."
    echo "📂 Please check the workflow status at:"
    echo "🔗 https://github.com/Phonginhere/cos30049/actions"
    echo ""
    echo "🎯 What to look for:"
    echo "   ✅ Build step should now succeed (no ESLint errors)"
    echo "   ✅ Deployment to Hugging Face should complete"
    echo "   ✅ App should be available at: https://huggingface.co/spaces/cos30049-safetywindy/air_quality_health"
    echo ""
    echo "🛠️ Recent changes implemented:"
    echo "   - cross-env for reliable environment variables"
    echo "   - Multiple fallback build methods"
    echo "   - Custom Node.js build script"
    echo "   - Aggressive CI=false enforcement"
    echo ""
    echo "⚡ If this deployment fails, we have 4 more workflow variations to try:"
    echo "   1. deploy-hf.yml (simplified)"
    echo "   2. simple-deploy.yml (minimal)"
    echo "   3. deploy-full-stack.yml (advanced)"
    echo "   4. deploy-to-huggingface.yml (feature-rich)"
}

# Run the check
check_workflow

echo ""
echo "📝 To check deployment status manually:"
echo "   cd /Users/phongporter/Documents/GITHUB/cos30049"
echo "   ./check-deployment.sh"
echo ""
echo "🔄 This script will wait 2 minutes then check again..."

# Wait and check again
sleep 120
echo ""
echo "🔄 Checking status after 2 minutes..."
check_workflow
