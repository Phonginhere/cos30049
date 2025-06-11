# 🚀 Hugging Face Spaces Deployment Guide

This guide explains how to set up automatic deployment from your GitHub repository to Hugging Face Spaces using GitHub Actions.

## 📋 Prerequisites

1. ✅ GitHub repository with your code (cos30049)
2. ✅ Hugging Face Spaces repository (cos30049-safetywindy/air_quality_health)
3. 🔑 Hugging Face Access Token with write permissions

## 🔐 Setup Hugging Face Token

### Step 1: Create Hugging Face Access Token

1. Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Click "New token"
3. Name: `GitHub Actions Deploy`
4. Type: Select **"Write"** access
5. Copy the generated token (starts with `hf_...`)

### Step 2: Add Token to GitHub Secrets

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/cos30049`
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: `HF_TOKEN`
5. Value: Paste your Hugging Face token
6. Click **"Add secret"**

## 📁 Workflow Files Explanation

I've created three workflow files for different use cases:

### 1. `simple-deploy.yml` (Recommended)
- **Purpose**: Simple, reliable deployment of frontend only
- **Triggers**: Push to main/master when frontend files change, or manual trigger
- **Best for**: Getting started quickly

### 2. `deploy-to-huggingface.yml` (Feature-rich)
- **Purpose**: Comprehensive frontend deployment with detailed logging
- **Features**: Better error handling, deployment summaries
- **Best for**: Production use with monitoring

### 3. `deploy-full-stack.yml` (Advanced)
- **Purpose**: Deploy both frontend and backend as a full-stack app
- **Features**: Can deploy static frontend or full Gradio app with FastAPI backend
- **Best for**: When you want to deploy the ML prediction API too

## 🎯 How to Use

### Option A: Frontend Only (Recommended)

Your React app will be deployed as a static site to Hugging Face Spaces.

1. Make changes to your frontend code
2. Commit and push to `main` or `master` branch
3. GitHub Actions will automatically:
   - Build your React app
   - Deploy to Hugging Face Spaces
   - Update the live site

### Option B: Full Stack Deployment

To deploy both frontend and backend:

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **"Deploy Full Stack App to Hugging Face"**
4. Click **"Run workflow"**
5. Select **"full-stack"** from the dropdown
6. Click **"Run workflow"**

## 📂 File Structure After Deployment

### Static Deployment Structure:
```
Hugging Face Space/
├── index.html          # Your React app entry point
├── static/             # CSS, JS, and other assets
├── manifest.json       # PWA manifest
├── favicon.ico         # App icon
└── README.md          # HF Space configuration
```

### Full-Stack Deployment Structure:
```
Hugging Face Space/
├── app.py             # Gradio app wrapping your FastAPI
├── main.py            # Your FastAPI backend
├── requirements.txt   # Python dependencies
├── static/            # Built React frontend
│   ├── index.html
│   └── assets/
└── README.md         # HF Space configuration
```

## 🔧 Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check if `HF_TOKEN` secret is correctly set
   - Verify token has "Write" permissions
   - Make sure token hasn't expired

2. **"Build failed"**
   - Check if frontend builds locally: `cd frontend && npm run build`
   - Verify package.json exists in frontend directory
   - Check GitHub Actions logs for specific errors

3. **"No changes to deploy"**
   - This is normal if no files changed
   - Use manual trigger to force deployment

### Manual Deployment

If automatic deployment fails, you can trigger manually:

1. Go to **Actions** tab in your GitHub repo
2. Select the workflow you want to run
3. Click **"Run workflow"**
4. Choose your branch and click **"Run workflow"**

### Checking Deployment Status

1. **GitHub Actions**: Check the Actions tab for workflow status
2. **Hugging Face Spaces**: Visit your space URL to see if changes are live
3. **Logs**: Check GitHub Actions logs for detailed error messages

## 🌐 Your Deployment URLs

After successful deployment, your app will be available at:

- **Main Space**: https://huggingface.co/spaces/cos30049-safetywindy/air_quality_health
- **Direct App**: https://cos30049-safetywindy-air-quality-health.hf.space

## 📝 Customization

### Modify Deployment Triggers

Edit the workflow files to change when deployment happens:

```yaml
on:
  push:
    branches: [ main, master ]
    paths:
      - 'frontend/**'        # Only deploy when frontend changes
      - 'backend/**'         # Also deploy when backend changes
```

### Change Hugging Face Space Settings

Modify the README.md frontmatter in the workflow:

```yaml
---
title: Your Custom Title
emoji: 🚀
colorFrom: blue
colorTo: red
sdk: static
pinned: true              # Pin to your profile
license: mit
---
```

## 🎉 Success!

Once set up, your deployment pipeline will:

1. ✅ Automatically deploy when you push frontend changes
2. ✅ Build and optimize your React app
3. ✅ Update your Hugging Face Space
4. ✅ Provide deployment status and links
5. ✅ Support manual deployments when needed

Your Air Quality Health dashboard will now be automatically deployed to Hugging Face Spaces every time you make changes! 🌍📊
