# ✅ Vercel Environment Variables Checklist

## 🚨 **Why Deployment is Failing:**
Missing environment variables in Vercel configuration.

## 🔧 **How to Fix:**

### Step 1: Go to Vercel Dashboard
1. Open [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `smart-queue-management-system`
3. Navigate to: **Settings** → **Environment Variables**

### Step 2: Add These Required Variables

#### **Supabase (Required)**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### **Application URL (Required)**
```
NEXT_PUBLIC_APP_URL=https://your-deployed-app.vercel.app
```
*Note: Use your actual Vercel deployment URL*

#### **Google Places API (Required)**
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

#### **Emergent AI (Required)**
```
EMERGENT_API_KEY=your_emergent_ai_key
EMERGENT_API_URL=https://api.emergent.ai/v1
```

#### **Email Service (Required)**
```
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=MediQueue <noreply@yourdomain.com>
EMAIL_REPLY_TO=support@yourdomain.com
```

#### **Optional (for additional features)**
```
CRON_SECRET=your_secure_random_string
NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_key
```

### Step 3: Configure Each Variable
For each variable:
1. Click **"Add New"**
2. Enter the **Name** (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
3. Enter the **Value** (copy from your local `.env.local` file)
4. Select all three: ✓ **Production** ✓ **Preview** ✓ **Development**
5. Click **"Save"**

### Step 4: Trigger Redeploy
1. Go to **Deployments** tab
2. Click on the failed deployment
3. Click **"Redeploy"** button
4. Wait 2-3 minutes for build to complete

---

## 🎯 **Quick Copy-Paste Template**

If you have a `.env.local` file, copy the values from there:

```bash
# Copy values from your local .env.local file
# DO NOT copy this template as-is, use your actual values!
```

---

## ✅ **After Adding Variables:**

1. All variables should show in Settings → Environment Variables
2. Redeploy the project
3. Check build logs for any errors
4. Deployment should succeed! 🎉

---

## 🔍 **Troubleshooting:**

**If build still fails:**
1. Check build logs in Vercel deployment page
2. Verify all variable names are spelled correctly (case-sensitive!)
3. Make sure no trailing spaces in values
4. Ensure Supabase URL format: `https://xxxxx.supabase.co`

**If deployment succeeds but features don't work:**
- Check browser console for errors
- Verify API keys are valid and have correct permissions
- Test each integration individually

---

## 📝 **Notes:**

- **NEXT_PUBLIC_*** variables are exposed to the browser
- Keep **SERVICE_ROLE_KEY** and **API_KEYS** secure
- Use production-ready API keys, not test keys
- Update `NEXT_PUBLIC_APP_URL` after first deployment

---

**Build Status:** Once all variables are added, your build should succeed! ✨

