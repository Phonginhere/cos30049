#!/bin/bash

# Deployment monitoring script
echo "🔍 Checking Deployment Status"
echo "============================="

# Check last commit
echo "📝 Last commit:"
git log --oneline -1

echo ""
echo "🔗 Monitor deployment at:"
echo "   GitHub Actions: https://github.com/Phonginhere/cos30049/actions"
echo "   Hugging Face: https://huggingface.co/spaces/cos30049-safetywindy/air_quality_health"

echo ""
echo "⏰ Expected deployment time: 3-4 minutes"
echo "🎯 Check for:"
echo "   ✅ Green checkmark in GitHub Actions"
echo "   ✅ Updated timestamp in HF Space"
echo "   ✅ Live app functionality"

echo ""
echo "📱 Quick tests once deployed:"
echo "   1. Visit your app URL"
echo "   2. Check if charts load"
echo "   3. Test interactive features"
echo "   4. Verify README shows team info"

echo ""
echo "🎉 If successful, your deployment pipeline is complete!"
