#!/bin/bash

echo "🚀 Checking GitHub Actions and Hugging Face deployment status..."
echo "=============================================================="

# Get the latest commit hash
LATEST_COMMIT=$(git rev-parse HEAD)
echo "📝 Latest commit: $LATEST_COMMIT"

# Check GitHub Actions status (if gh CLI is available)
if command -v gh &> /dev/null; then
    echo "📊 GitHub Actions Status:"
    gh run list --limit 3
else
    echo "💡 Install GitHub CLI (gh) to check workflow status automatically"
    echo "   Or visit: https://github.com/Phonginhere/cos30049/actions"
fi

echo ""
echo "🌐 Deployment URLs to check:"
echo "   Frontend: https://cos30049-safetywindy-air-quality-health.hf.space/"
echo "   Repository: https://github.com/Phonginhere/cos30049"
echo "   Actions: https://github.com/Phonginhere/cos30049/actions"

echo ""
echo "🔍 Recent fixes implemented:"
echo "   ✅ Fixed BarChart data filtering (USA instead of WORLD)"
echo "   ✅ Added fallback logic for country/year selection"
echo "   ✅ Enhanced chart styling and error handling"
echo "   ✅ Improved debugging and data validation"
echo "   ✅ Added CSS styling for better visibility"

echo ""
echo "⏰ Checking Hugging Face Space status..."
curl -s -I https://cos30049-safetywindy-air-quality-health.hf.space/ | head -1

echo ""
echo "📈 Monitoring complete. Check the URLs above for live status."
