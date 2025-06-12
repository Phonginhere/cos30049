# 🌐 COMPLETE DEPLOYMENT GUIDE & TESTING URLS

## 📍 **DEPLOYMENT URLS AFTER COMPLETION**

### **Frontend Dashboard (React App)**
- **URL:** https://cos30049-safetywindy-air-quality-health.hf.space
- **Alternative:** https://huggingface.co/spaces/cos30049-safetywindy/air-quality-health
- **Type:** Static React Application
- **Features:** Interactive charts, maps, visualizations

### **Backend API (FastAPI Server)**
- **URL:** https://cos30049-safetywindy-air-quality-health-api.hf.space
- **Alternative:** https://huggingface.co/spaces/cos30049-safetywindy/air-quality-health-api
- **Type:** FastAPI + Gradio Interface
- **Features:** ML predictions, data API endpoints

---

## 🚀 **DEPLOYMENT STEPS**

### **Quick Deployment (Full-Stack):**
```bash
# Set your Hugging Face token
export HF_TOKEN=your_huggingface_token_here

# Run the full-stack deployment script
./deploy-fullstack.sh
```

### **Manual Deployment:**

**1. Backend First:**
```bash
export HF_TOKEN=your_token
cd backend
# Deploy backend separately (see detailed steps below)
```

**2. Frontend Second:**
```bash
cd frontend
npm run build
# Deploy frontend with updated API URLs
```

---

## 🔧 **API ENDPOINTS FOR TESTING**

### **Base API URL:**
```
https://cos30049-safetywindy-air-quality-health-api.hf.space
```

### **1. Health Check**
```http
GET https://cos30049-safetywindy-air-quality-health-api.hf.space/
```
**Expected Response:**
```json
{"message": "Welcome to the Air Quality Health API"}
```

### **2. Get Available Pollutants**
```http
GET https://cos30049-safetywindy-air-quality-health-api.hf.space/pollutants
```
**Expected Response:**
```json
{
  "pollutants": [
    {"key": "pm25", "display": "Particulate Matter 2.5 (PM)"},
    {"key": "ozone", "display": "Ozone"},
    {"key": "hap", "display": "Hazardous Air Pollutants (HAP)"}
  ]
}
```

### **3. Health Burden Prediction**
```http
POST https://cos30049-safetywindy-air-quality-health-api.hf.space/predict
Content-Type: application/json

{
    "iso3": "USA",
    "exposure_mean": 25.0,
    "pollutant": "pm25"
}
```
**Expected Response:**
```json
{
    "predicted_burden_mean": 1234.56
}
```

### **4. API Documentation (Interactive)**
```
https://cos30049-safetywindy-air-quality-health-api.hf.space/docs
```

---

## 🧪 **TESTING PROCEDURES**

### **Frontend Testing:**

1. **Open Dashboard:**
   ```
   https://cos30049-safetywindy-air-quality-health.hf.space
   ```

2. **Test Interactive Features:**
   - ✅ Click on countries in the choropleth map
   - ✅ Use the year slider (1990-2020)
   - ✅ Switch between bubble and bar charts
   - ✅ Try the prediction form

3. **Check Browser Console:**
   - No errors should appear
   - API calls should succeed

### **Backend Testing:**

1. **Test API Health:**
   ```bash
   curl https://cos30049-safetywindy-air-quality-health-api.hf.space/
   ```

2. **Test Pollutants Endpoint:**
   ```bash
   curl https://cos30049-safetywindy-air-quality-health-api.hf.space/pollutants
   ```

3. **Test Prediction Endpoint:**
   ```bash
   curl -X POST "https://cos30049-safetywindy-air-quality-health-api.hf.space/predict" \
        -H "Content-Type: application/json" \
        -d '{"iso3": "USA", "exposure_mean": 25.0, "pollutant": "pm25"}'
   ```

4. **Interactive Testing (Gradio Interface):**
   ```
   https://cos30049-safetywindy-air-quality-health-api.hf.space
   ```

---

## 📱 **MOBILE TESTING URLs**

The same URLs work on mobile devices:

- **Mobile Dashboard:** https://cos30049-safetywindy-air-quality-health.hf.space
- **Mobile API Interface:** https://cos30049-safetywindy-air-quality-health-api.hf.space

---

## 🔍 **TROUBLESHOOTING GUIDE**

### **If Frontend Doesn't Load:**
1. Check build status on HF Spaces page
2. Verify all static files are uploaded
3. Check browser console for errors

### **If Backend API Fails:**
1. Check API health endpoint first
2. Verify Gradio interface loads
3. Test endpoints individually
4. Check Hugging Face Spaces logs

### **If Integration Fails:**
1. Verify API URLs in frontend code
2. Check CORS configuration
3. Test API endpoints manually
4. Check network connectivity

---

## 📊 **MONITORING & LOGS**

### **Frontend Logs:**
- Browser Developer Tools → Console
- Hugging Face Spaces → Build Logs

### **Backend Logs:**
- Hugging Face Spaces → Logs tab
- Gradio interface → Console output

### **API Monitoring:**
```bash
# Test API availability
curl -I https://cos30049-safetywindy-air-quality-health-api.hf.space/

# Monitor response times
time curl https://cos30049-safetywindy-air-quality-health-api.hf.space/pollutants
```

---

## 🎯 **FINAL TESTING CHECKLIST**

### **Frontend (Dashboard):**
- [ ] Page loads successfully
- [ ] Choropleth map displays countries
- [ ] Countries are clickable
- [ ] Year slider works (1990-2020)
- [ ] Charts switch properly (Bubble ↔ Bar)
- [ ] Prediction form submits successfully
- [ ] Mobile responsive design works

### **Backend (API):**
- [ ] Health check endpoint responds
- [ ] Pollutants endpoint returns data
- [ ] Prediction endpoint accepts requests
- [ ] API documentation loads
- [ ] Gradio interface is accessible
- [ ] CORS headers allow frontend access

### **Integration:**
- [ ] Frontend can call backend APIs
- [ ] Predictions work from dashboard
- [ ] No CORS errors in console
- [ ] Error handling works properly

---

## 🚀 **DEPLOYMENT TIMELINE**

1. **Deploy Backend** (2-3 minutes)
   - Upload FastAPI + Gradio app
   - Install dependencies
   - Start services

2. **Deploy Frontend** (1-2 minutes)
   - Build React app
   - Upload static files
   - Configure API URLs

3. **Testing Phase** (5 minutes)
   - Verify all endpoints
   - Test integration
   - Check mobile compatibility

**Total Time:** ~10 minutes for complete deployment

---

## 📞 **SUPPORT & DOCUMENTATION**

### **API Documentation:**
- **Interactive Docs:** https://cos30049-safetywindy-air-quality-health-api.hf.space/docs
- **Gradio Interface:** https://cos30049-safetywindy-air-quality-health-api.hf.space

### **Source Code:**
- **GitHub Repository:** https://github.com/your-username/cos30049
- **Frontend Code:** `/frontend/src/components/`
- **Backend Code:** `/backend/app/`

---

**Ready to deploy? Run the full-stack deployment script:**
```bash
export HF_TOKEN=your_token_here
./deploy-fullstack.sh
```

**Your complete Air Quality Health Dashboard will be live at:**
🌐 **https://cos30049-safetywindy-air-quality-health.hf.space**
