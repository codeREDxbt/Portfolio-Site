# 🚀 Vercel Deployment Guide

## Your Site: https://coderedxbt.vercel.app

This guide explains how to deploy the security updates to your live Vercel site.

---

## 📋 Overview

Your site is currently live on Vercel. We've created **Vercel Serverless Functions** (in the `/api` folder) that provide all the security features without needing a dedicated server.

### What Changed:
- ✅ **Serverless API Functions** - Security built into Vercel's infrastructure
- ✅ **Rate Limiting** - Protects all endpoints from abuse
- ✅ **Input Validation** - Server-side validation on all forms
- ✅ **Security Headers** - Configured in `vercel.json`
- ✅ **Environment Variables** - Secure API key storage in Vercel dashboard

---

## 🚀 Deployment Steps

### Step 1: Commit Your Changes

```powershell
# Add all new files
git add .

# Commit with message
git commit -m "Add security: rate limiting, input validation, API protection"

# Push to GitHub
git push origin main
```

**Vercel will automatically deploy!** ✨

---

### Step 2: Configure Environment Variables in Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `Portfolio Site` (coderedxbt)
3. **Go to Settings** → **Environment Variables**
4. **Add these variables**:

```
COUNT_API_URL = https://api.countapi.xyz/hit/codeREDxbt-portfolio/visitors
```

Optional (for future enhancements):
```
GITHUB_TOKEN = your_github_token_here
EMAIL_API_KEY = your_sendgrid_or_mailgun_key
```

5. **Click "Save"**
6. **Redeploy**: Settings → Deployments → Click "..." on latest → "Redeploy"

---

### Step 3: Update Your Frontend (Already Done!)

The `script.js` file has already been updated to use the new API endpoints:

- `/api/github-contributions` instead of direct GitHub API
- `/api/visitor-increment` instead of direct CountAPI
- `/api/contact` for secure contact form
- `/api/booking` for secure bookings

---

### Step 4: Test Your Deployment

After Vercel deploys (usually 30-60 seconds), test:

#### Test Health Check:
```powershell
curl https://coderedxbt.vercel.app/api/health
```

Expected response:
```json
{
  "status": "success",
  "message": "API is running securely",
  "timestamp": "2026-01-06T..."
}
```

#### Test GitHub API:
```powershell
curl "https://coderedxbt.vercel.app/api/github-contributions?username=codeREDxbt"
```

#### Test Rate Limiting:
```powershell
# Make 31 requests quickly (should get rate limited)
for ($i=1; $i -le 31; $i++) {
    curl https://coderedxbt.vercel.app/api/github-contributions?username=test
}
```

You should see a 429 error after 30 requests.

---

## 📁 File Structure for Vercel

```
Portfolio Site/
├── api/                          # Vercel Serverless Functions
│   ├── health.js                 # Health check endpoint
│   ├── github-contributions.js   # GitHub API (with rate limiting)
│   ├── visitor-increment.js      # Visitor counter (with rate limiting)
│   ├── contact.js               # Contact form (with validation)
│   └── booking.js               # Booking form (with validation)
├── vercel.json                   # Vercel configuration
├── index.html                    # Your site
├── script.js                     # Updated to use new APIs
├── style.css                     # Your styles
└── other files...
```

---

## 🔐 Security Features Active on Vercel

### 1. Rate Limiting ✅
- **GitHub API**: 30 requests/hour per IP
- **Visitor Counter**: 10 requests/5min per IP  
- **Contact Form**: 5 submissions/hour per IP
- **Booking Form**: 5 submissions/hour per IP

### 2. Input Validation ✅
- All user inputs validated server-side
- XSS prevention (HTML tags removed)
- Email format validation
- Length limits enforced
- Spam detection active

### 3. Security Headers ✅
Configured in `vercel.json`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: enabled
- HSTS (Strict-Transport-Security)
- Referrer Policy

### 4. API Key Protection ✅
- Keys stored in Vercel Environment Variables
- Never exposed to client-side
- Secure API proxy pattern

---

## 🎯 What Happens After You Push

1. **GitHub Push** → Triggers Vercel deployment
2. **Vercel Build** → Deploys serverless functions to `/api`
3. **Environment Variables** → Loaded from Vercel dashboard
4. **Deployment Complete** → Site live at coderedxbt.vercel.app
5. **Security Active** → All protections enabled automatically

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Site loads at https://coderedxbt.vercel.app
- [ ] `/api/health` returns success
- [ ] GitHub contributions graph displays
- [ ] Visitor counter increments
- [ ] Contact form accepts valid inputs
- [ ] Contact form rejects invalid inputs (test with `<script>`)
- [ ] Rate limiting works (test by spamming API)
- [ ] No console errors in browser
- [ ] All animations still work
- [ ] Mobile version displays correctly

---

## 🐛 Troubleshooting

### "API endpoint returns 404"
**Solution**: Make sure `/api` folder is committed to git:
```powershell
git add api/
git commit -m "Add API functions"
git push
```

### "Environment variables not working"
**Solution**: 
1. Check Vercel Dashboard → Settings → Environment Variables
2. Make sure variables are set for "Production"
3. Redeploy after adding variables

### "CORS errors in browser"
**Solution**: The CORS origins are set to `coderedxbt.vercel.app`. If you have a custom domain, update the `allowedOrigins` array in each API file.

### "Rate limiting too strict"
**Solution**: Edit the rate limit values in the API files:
- `RATE_LIMIT_MAX` - Number of requests allowed
- `RATE_LIMIT_WINDOW` - Time window in milliseconds

---

## 🔄 Making Changes After Deployment

1. **Edit files locally**
2. **Test locally** (optional - using `npm start` with Express server)
3. **Commit and push**:
   ```powershell
   git add .
   git commit -m "Update: description of changes"
   git push
   ```
4. **Vercel auto-deploys** (30-60 seconds)
5. **Test live site**

---

## 📊 Monitor Your Site

### Vercel Analytics (Built-in)
- Go to: https://vercel.com/dashboard
- Select your project
- Click "Analytics" tab
- View traffic, errors, and performance

### Check Function Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click "Functions" tab
4. Click on any function to see logs and invocations

### Monitor Rate Limits
Function logs will show when users hit rate limits:
```
Rate limit exceeded for IP: xxx.xxx.xxx.xxx
```

---

## 🎨 Custom Domain (Optional)

If you want to use your own domain:

1. **Add Domain in Vercel**:
   - Settings → Domains
   - Add your domain
   - Follow DNS configuration instructions

2. **Update CORS Origins**:
   - Edit each file in `/api/`
   - Update `allowedOrigins` array:
   ```javascript
   const allowedOrigins = [
     'https://coderedxbt.vercel.app',
     'https://yourdomain.com',
     'http://localhost:3000'
   ];
   ```

3. **Commit and push**

---

## 📈 Performance Tips

### Caching Strategy
The serverless functions already implement caching:
- GitHub API: 1 hour cache
- Visitor counter: 5 minutes cache

### Cold Starts
- Vercel functions have ~1 second cold start
- First request may be slower
- Subsequent requests are fast

### Optimize if Needed
If you hit Vercel's free tier limits:
- Upgrade to Pro plan
- Implement more aggressive caching
- Use Vercel Edge Functions (faster cold starts)

---

## 💰 Vercel Free Tier Limits

**You're well within free tier limits:**
- 100 GB bandwidth/month
- 100k serverless function invocations/month
- Unlimited static hosting

Your portfolio will likely use:
- ~1-10 GB bandwidth
- ~1,000-10,000 function calls/month

**You're good!** ✅

---

## 🚀 Quick Commands Reference

```powershell
# Deploy changes
git add .
git commit -m "Your message"
git push

# Test health endpoint
curl https://coderedxbt.vercel.app/api/health

# Test GitHub API
curl "https://coderedxbt.vercel.app/api/github-contributions?username=codeREDxbt"

# Test rate limiting (31 rapid requests)
for ($i=1; $i -le 31; $i++) {
    curl https://coderedxbt.vercel.app/api/github-contributions?username=test
}

# Check Vercel deployment status
vercel ls

# View function logs
vercel logs
```

---

## 📞 Need Help?

### Vercel Resources
- Documentation: https://vercel.com/docs
- Support: https://vercel.com/support
- Status: https://vercel-status.com

### Common Issues
- **Build failing**: Check Vercel deployment logs
- **Functions not working**: Verify `vercel.json` is committed
- **Env vars missing**: Add in Vercel dashboard, then redeploy

---

## ✨ You're All Set!

Your security updates are ready to deploy. Simply:

1. **Commit and push** to GitHub
2. **Wait 30-60 seconds** for Vercel to deploy
3. **Test your site** at https://coderedxbt.vercel.app
4. **Monitor** via Vercel dashboard

**Your site will be secure and production-ready!** 🔒

---

**Deployed with ❤️ on Vercel** 🚀
