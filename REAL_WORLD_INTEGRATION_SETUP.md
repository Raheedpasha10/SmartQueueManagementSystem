# 🌐 Real-World Data Integration - Setup Guide

## ✅ **STEP 1: Add API Keys to Environment**

Open `.env.local` and add these lines at the bottom:

```bash
# Google Maps API (for real hospital data & maps)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyCU7qMbHqeJztF74UduhOUHCTXoxYxFU24

# Emergent AI (Claude Sonnet 4.5 for AI features)
EMERGENT_API_KEY=sk-emergent-dDeB51fOc40CfC5A87
EMERGENT_API_URL=https://api.emergent.ai/v1
```

Save the file and restart your dev server:
```bash
# Stop server (Ctrl+C) then restart:
npm run dev
```

---

## ✅ **STEP 2: Sync Real Hospital Data**

### **Option A: Auto-sync on First Load** (Recommended)

The hospitals page will automatically fetch real hospitals based on user location.

### **Option B: Manual Sync via API**

Call the sync API to populate your database with real hospitals:

```bash
# Sync hospitals near Bangalore
curl "http://localhost:3000/api/hospitals/sync?lat=12.9716&lng=77.5946&radius=10000"

# Sync hospitals near Mumbai
curl "http://localhost:3000/api/hospitals/sync?lat=19.0760&lng=72.8777&radius=10000"

# Sync hospitals near Delhi
curl "http://localhost:3000/api/hospitals/sync?lat=28.7041&lng=77.1025&radius=10000"
```

Or visit in browser:
```
http://localhost:3000/api/hospitals/sync?lat=12.9716&lng=77.5946
```

---

## ✅ **STEP 3: Test AI Features**

### **1. Emergency Triage**

Go to: `http://localhost:3000/emergency`

Fill out the form and submit. The AI will:
- Analyze symptoms
- Recommend triage level
- Suggest immediate actions
- Determine if ambulance is needed

### **2. Symptom Checker**

Test the API directly:

```bash
curl -X POST http://localhost:3000/api/ai/symptoms \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["chest pain", "shortness of breath", "dizziness"]}'
```

---

## 🎯 **WHAT YOU GET**

### **Real Hospital Data:**
- ✅ Actual hospitals from Google Maps
- ✅ Real addresses and locations
- ✅ Phone numbers and websites
- ✅ Ratings and reviews
- ✅ Operating hours

### **AI-Powered Features:**
- ✅ Emergency triage analysis
- ✅ Symptom checking
- ✅ Doctor recommendations
- ✅ Smart queue prioritization
- ✅ Intelligent decision-making

---

## 📊 **API Usage & Costs**

### **Google Places API:**
- **Free Tier**: $200/month credit
- **Cost**: $17 per 1,000 requests
- **Your Usage**: ~50 requests for demo = **FREE**

### **Emergent AI:**
- Check your plan for details
- Typical cost: Very low for demo usage
- **Estimated**: <$1 for entire demo

---

## 🔧 **Features Now Available**

### **1. Hospital Search**
```typescript
// Find hospitals near user
const hospitals = await searchNearbyHospitals(lat, lng, 5000);

// Get detailed info
const details = await getHospitalDetails(placeId);
```

### **2. AI Triage**
```typescript
// Analyze emergency
const analysis = await analyzeEmergencyTriage({
  symptoms: ["chest pain"],
  chiefComplaint: "Severe chest pain",
  painLevel: 8,
  consciousness: "alert",
  breathing: "difficulty"
});
```

### **3. Symptom Checker**
```typescript
// Check symptoms
const analysis = await analyzeSymptoms([
  "fever", "cough", "fatigue"
]);
```

### **4. Doctor Recommendations**
```typescript
// Get best doctor for condition
const recommendation = await recommendDoctor(
  "heart attack",
  availableDoctors
);
```

---

## 🧪 **Testing Checklist**

- [ ] Restart dev server with new API keys
- [ ] Visit `/hospitals` - should show loading then real hospitals
- [ ] Visit `/emergency` - fill form and check AI analysis
- [ ] Book appointment - test full flow
- [ ] Check console for API calls
- [ ] Verify database has real hospital data

---

## 🚨 **Troubleshooting**

### **"No hospitals found"**
- Check browser console for errors
- Verify API key is correct in `.env.local`
- Try manual sync via API endpoint
- Check location permissions in browser

### **"AI analysis failed"**
- Verify Emergent API key in `.env.local`
- Check console for detailed error
- System will use fallback logic automatically

### **"Google Maps quota exceeded"**
- You've used free $200 credit
- Hospitals are cached in database
- Use cached data from previous syncs

---

## 💡 **Pro Tips**

1. **Cache Real Data**: Once synced, hospitals stay in DB
2. **Smart Refresh**: Only re-sync weekly/monthly
3. **Location-Based**: Ask user for location permission
4. **Fallback Logic**: Always have backup data
5. **Demo Mode**: Pre-sync data before presentation

---

## 🎬 **For Your Demo**

### **Before Presentation:**

1. Sync hospitals for your city:
```bash
curl "http://localhost:3000/api/hospitals/sync?lat=YOUR_LAT&lng=YOUR_LNG"
```

2. Test emergency triage with realistic scenarios

3. Show AI analysis in real-time

4. Highlight the Google Maps integration

### **During Presentation:**

1. **Show Real Data**: "These are actual hospitals from Google Maps"
2. **Demonstrate AI**: "Our AI analyzes symptoms using Claude Sonnet 4.5"
3. **Explain Intelligence**: "The system prioritizes based on severity"
4. **Highlight Innovation**: "Real-world data + AI = Smart healthcare"

---

## 📈 **What Makes This Special**

### **Real-World Integration:**
- Not just fake demo data
- Actual hospitals people can visit
- Live, accurate information

### **AI-Powered:**
- Medical triage assistance
- Intelligent recommendations
- Automated decision-making

### **Production-Ready:**
- Error handling
- Fallback mechanisms
- Cached data
- Scalable architecture

---

## 🎯 **Next Steps**

After setup, you'll have:
- ✅ Real hospitals in your database
- ✅ AI-powered triage system
- ✅ Smart features throughout app
- ✅ Impressive demo material

**Your project will stand out because it uses REAL data and AI! 🚀**

