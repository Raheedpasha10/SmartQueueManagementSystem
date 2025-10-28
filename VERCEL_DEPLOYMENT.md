# 🚀 Vercel Deployment Guide

## Prerequisites
✅ Code pushed to GitHub: https://github.com/Raheedpasha10/SmartQueueManagementSystem.git
✅ Supabase project configured
✅ Environment variables ready

---

## 📋 Step-by-Step Deployment

### 1. Import Project to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import from GitHub: `Raheedpasha10/SmartQueueManagementSystem`
4. Click **"Import"**

### 2. Configure Project Settings
- **Framework Preset:** Next.js
- **Root Directory:** `./` (leave as default)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### 3. Add Environment Variables
Click **"Environment Variables"** and add the following:

#### Required Variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### Optional (for full functionality):
```env
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key
EMERGENT_API_KEY=your_emergent_api_key
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=MediQueue <onboarding@resend.dev>
NEXT_PUBLIC_APP_NAME=MediQueue
```

**Important:** 
- Copy values from your local `.env.local` file
- Don't include quotes around values
- Make sure all `NEXT_PUBLIC_` variables are added for client-side access

### 4. Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your app will be live at: `https://your-project-name.vercel.app`

---

## 🔧 Post-Deployment Configuration

### Update Supabase Settings
1. Go to your Supabase Dashboard
2. Navigate to **Authentication > URL Configuration**
3. Add your Vercel URL to:
   - **Site URL:** `https://your-project-name.vercel.app`
   - **Redirect URLs:**
     - `https://your-project-name.vercel.app/auth/callback`
     - `https://your-project-name.vercel.app/login`
     - `https://your-project-name.vercel.app/dashboard`

### Update Environment Variables
If needed, update `NEXT_PUBLIC_APP_URL`:
```env
NEXT_PUBLIC_APP_URL=https://your-project-name.vercel.app
```

---

## ✅ Verification Checklist

After deployment, test:
- [ ] Landing page loads
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard accessible
- [ ] Hospital search works
- [ ] Appointment booking works
- [ ] Profile page works
- [ ] Mock hospitals display correctly

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Check that `typescript.ignoreBuildErrors: true` is in `next.config.mjs`

### Authentication Issues
- Verify Supabase redirect URLs are correct
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Ensure Site URL matches your Vercel domain

### API Errors
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check that API routes are working by testing `/api/hospitals/search`

### Database Connection Issues
- Confirm Supabase project is active
- Check database tables are created (run SQL files from repo)
- Verify RLS policies are set up correctly

---

## 🔄 Continuous Deployment

Vercel automatically redeploys when you push to `main` branch:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

---

## 📊 Performance Optimization

Vercel automatically provides:
- ✅ Edge Network CDN
- ✅ Automatic HTTPS
- ✅ Image Optimization
- ✅ Code Splitting
- ✅ Static Generation

---

## 🎯 Custom Domain (Optional)

1. Go to Vercel Dashboard > Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update Supabase redirect URLs with new domain

---

## 📝 Notes

- First deployment may take 3-5 minutes
- Subsequent deployments typically take 1-2 minutes
- Build logs available in Vercel dashboard
- All console.log statements are automatically removed in production
- Static assets are cached aggressively

---

## 🆘 Need Help?

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- GitHub Repo: https://github.com/Raheedpasha10/SmartQueueManagementSystem

---

**Ready to deploy! 🚀**

