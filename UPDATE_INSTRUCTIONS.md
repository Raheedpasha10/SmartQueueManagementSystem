# 🔧 CRITICAL: Manual Steps Required

## STEP 1: Add API Keys ⚡

Open `.env.local` and add these lines:

```bash
# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyCU7qMbHqeJztF74UduhOUHCTXoxYxFU24

# Emergent AI  
EMERGENT_API_KEY=sk-emergent-dDeB51fOc40CfC5A87
EMERGENT_API_URL=https://api.emergent.ai/v1
```

## STEP 2: Restart Server

```bash
# Stop server (Ctrl+C) then:
npm run dev
```

## STEP 3: Sync Real Hospitals

Visit this URL in your browser:
```
http://localhost:3000/api/hospitals/sync?lat=12.9716&lng=77.5946
```

This will fetch real hospitals from Google Maps and save to your database!

---

**DO THIS NOW before 
continuing!**
