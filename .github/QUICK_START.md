# 🚀 Quick Start: Auto-Deploy to Hugging Face Spaces

## ⚡ 5-Minute Setup

### 1. Get Your Hugging Face Token
1. Visit [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Click "New token" 
3. Name: `GitHub Actions`
4. Type: **Write** 
5. Copy the token (starts with `hf_`)

### 2. Add Token to GitHub
1. Go to your GitHub repo: [github.com/Phonginhere/cos30049](https://github.com/Phonginhere/cos30049)
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret**
4. Name: `HF_TOKEN`
5. Value: Paste your token
6. **Add secret**

### 3. That's it! 🎉

Now whenever you push changes to your `frontend/` folder, GitHub will automatically:
- ✅ Build your React app
- ✅ Deploy to Hugging Face Spaces  
- ✅ Update https://huggingface.co/spaces/cos30049-safetywindy/air_quality_health

## 🧪 Test Your Setup

### Automatic Test (Recommended)
1. Make a small change to any file in `frontend/src/`
2. Commit and push to `main` branch
3. Go to **Actions** tab in GitHub to watch the deployment
4. Check your Hugging Face Space in ~2-3 minutes

### Manual Test
1. Go to **Actions** tab in your GitHub repo
2. Click **"Deploy Frontend to Hugging Face"**
3. Click **"Run workflow"** 
4. Select `main` branch
5. Click **"Run workflow"**

## 📁 Files Created

I've created several workflow files for different needs:

- `deploy-frontend.yml` - **Main workflow** (recommended)
- `simple-deploy.yml` - Minimal version  
- `deploy-full-stack.yml` - Advanced with backend support
- `deploy-to-huggingface.yml` - Feature-rich version

You can delete the ones you don't need, or keep them all as options.

## 🆘 Need Help?

Check the detailed guide: [`.github/DEPLOYMENT.md`](.github/DEPLOYMENT.md)

### Common Issues:
- **"Authentication failed"** → Check HF_TOKEN secret is set correctly
- **"Build failed"** → Make sure `cd frontend && npm run build` works locally
- **"No changes"** → This is normal if nothing changed

## 🎯 Your URLs

After deployment:
- **Space**: https://huggingface.co/spaces/cos30049-safetywindy/air_quality_health
- **Direct**: https://cos30049-safetywindy-air-quality-health.hf.space
