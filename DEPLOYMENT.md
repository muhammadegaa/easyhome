# 🚀 EasyHome Deployment Guide

Complete guide for deploying EasyHome to production using Vercel (frontend) and Railway (backend).

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Backend Deployment (Railway)](#backend-deployment-railway)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Post-Deployment](#post-deployment)
6. [Alternative Deployment Options](#alternative-deployment-options)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account with repository access
- ✅ Vercel account (free tier works)
- ✅ Railway account (free tier works)
- ✅ Gmail account for SMTP (or alternative email service)
- ✅ Code pushed to GitHub repository

---

## Database Setup

### Option 1: Railway PostgreSQL (Recommended)

Railway provides a free PostgreSQL database in their free tier.

**Steps:**
1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Provision PostgreSQL"
5. Once created, click on the database
6. Go to "Connect" tab
7. Copy the `DATABASE_URL` (PostgreSQL Connection URL)
8. Save this for backend deployment

**Example DATABASE_URL:**
```
postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
```

### Option 2: Supabase (Alternative)

1. Go to [Supabase.com](https://supabase.com)
2. Create new project
3. Copy database connection string from Settings > Database
4. Use the "Connection Pooling" URL for better performance

---

## Backend Deployment (Railway)

### Step 1: Prepare Backend for Deployment

**Create `backend/.env.production` (for reference only, will set in Railway):**
```env
DATABASE_URL=your-railway-database-url
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secret-production-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-production-email@gmail.com
SMTP_PASS=your-gmail-app-password
FRONTEND_URL=https://your-app.vercel.app
```

### Step 2: Deploy to Railway

1. **Create New Project:**
   - Go to [Railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `easyhome` repository
   - Select `backend` directory as root

2. **Configure Settings:**
   - Go to your backend service
   - Click "Settings"
   - Set **Root Directory**: `backend`
   - Set **Start Command**: `npm run start`

3. **Set Environment Variables:**
   - Click "Variables" tab
   - Add all variables from `.env.production`:

   ```
   DATABASE_URL=postgresql://... (from Railway PostgreSQL)
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=<generate-strong-secret-key>
   JWT_EXPIRES_IN=7d
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=<gmail-app-password>
   FRONTEND_URL=https://your-app.vercel.app
   ```

4. **Generate JWT Secret:**
   ```bash
   # Run locally to generate secure secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

5. **Gmail App Password:**
   - Go to Google Account Settings
   - Security > 2-Step Verification
   - App Passwords > Generate
   - Copy the 16-character password

6. **Run Database Migrations:**
   - Railway will automatically install dependencies
   - After deployment, go to service logs
   - Wait for deployment to complete
   - Go to "Deployments" tab
   - Click on latest deployment
   - In the deployment logs, look for build success
   - Then manually run migration using Railway CLI:

   ```bash
   # Install Railway CLI
   npm i -g @railway/cli

   # Login to Railway
   railway login

   # Link to your project
   railway link

   # Run migrations
   railway run npm run db:migrate

   # Seed database (optional)
   railway run npm run db:seed
   ```

7. **Get Backend URL:**
   - Go to "Settings" tab
   - Under "Domains", click "Generate Domain"
   - Copy the URL (e.g., `https://easyhome-backend-production.up.railway.app`)
   - Save this for frontend deployment

### Step 3: Verify Backend Deployment

Test your backend API:
```bash
# Health check
curl https://your-backend-url.railway.app/health

# Test registration
curl -X POST https://your-backend-url.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "phone": "081234567890"
  }'
```

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

**Create `frontend/.env.production` (for reference):**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Step 2: Deploy to Vercel

1. **Import Project:**
   - Go to [Vercel.com](https://vercel.com)
   - Click "Add New..." > "Project"
   - Import `easyhome` repository from GitHub
   - When prompted, select the repository

2. **Configure Project:**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: Click "Edit" and select `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

3. **Set Environment Variables:**
   Click "Environment Variables" and add:

   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

   **Note:** Get Google Maps API Key:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project
   - Enable Maps JavaScript API
   - Create API Key
   - Restrict key to your domain

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Vercel will provide deployment URL

5. **Configure Custom Domain (Optional):**
   - Go to "Settings" > "Domains"
   - Add your custom domain
   - Update DNS records as instructed

### Step 3: Update Backend FRONTEND_URL

After Vercel deployment:
1. Go back to Railway
2. Update `FRONTEND_URL` environment variable with your Vercel URL
3. Redeploy backend

---

## Post-Deployment

### Step 1: Test Complete Flow

1. **Visit your app:**
   ```
   https://your-app.vercel.app
   ```

2. **Test user registration:**
   - Click "Sign Up Free"
   - Register with real email
   - Check email for verification

3. **Test property listing:**
   - Login with verified account
   - Click "List Property"
   - Upload images and create listing

4. **Test search and filters:**
   - Browse properties
   - Use search filters
   - Test favorite functionality

### Step 2: Seed Production Database (Optional)

If you want sample data in production:
```bash
# Using Railway CLI
railway run npm run db:seed
```

### Step 3: Set Up Monitoring

**Railway:**
- Go to "Metrics" tab
- Monitor CPU, memory, and request counts
- Set up alerts for downtime

**Vercel:**
- Go to "Analytics" tab
- Monitor page views and performance
- Check for build errors in "Deployments"

### Step 4: Configure CORS (if needed)

If you encounter CORS errors, update `backend/src/index.js`:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## Alternative Deployment Options

### Backend Alternatives

#### **Option 1: Heroku**

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create easyhome-backend

# Set buildpacks
heroku buildpacks:set heroku/nodejs

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set SMTP_HOST=smtp.gmail.com
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=your-email@gmail.com
heroku config:set SMTP_PASS=your-password
heroku config:set FRONTEND_URL=https://your-app.vercel.app

# Deploy
git subtree push --prefix backend heroku main

# Run migrations
heroku run npm run db:migrate
```

#### **Option 2: Render**

1. Go to [Render.com](https://render.com)
2. Click "New +" > "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run db:generate`
   - **Start Command**: `npm run start`
5. Add environment variables
6. Deploy

#### **Option 3: DigitalOcean App Platform**

1. Go to [DigitalOcean](https://www.digitalocean.com)
2. Create "App"
3. Connect GitHub
4. Select `backend` directory
5. Add PostgreSQL database
6. Configure environment variables
7. Deploy

### Frontend Alternatives

#### **Option 1: Netlify**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend
cd frontend

# Deploy
netlify deploy --prod

# Follow prompts
# Build command: npm run build
# Publish directory: .next
```

#### **Option 2: AWS Amplify**

1. Go to AWS Amplify Console
2. Connect GitHub repository
3. Select `frontend` branch
4. Configure build settings
5. Add environment variables
6. Deploy

---

## Troubleshooting

### Build Failures

**Frontend build fails:**
```bash
# Check logs in Vercel deployment
# Common issues:
# 1. Missing environment variables
# 2. TypeScript errors
# 3. Import path issues

# Test locally first:
cd frontend
npm run build
```

**Backend build fails:**
```bash
# Check Railway logs
# Common issues:
# 1. Missing dependencies in package.json
# 2. Prisma schema issues
# 3. Database connection errors

# Test locally:
cd backend
npm install
npm run db:generate
npm run start
```

### Database Connection Issues

**Error: "Can't reach database server"**
```bash
# Check DATABASE_URL format:
# postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Test connection:
railway run npx prisma db pull
```

**Error: "Prisma schema not found"**
```bash
# Ensure prisma schema is in correct location
# Run in backend directory:
railway run npm run db:generate
```

### CORS Errors

**Frontend can't connect to backend:**

1. Check `NEXT_PUBLIC_API_URL` in Vercel
2. Verify `FRONTEND_URL` in Railway
3. Update CORS configuration in `backend/src/index.js`

### Email Not Sending

**SMTP errors:**

1. Verify Gmail App Password (not regular password)
2. Enable "Less secure app access" if needed
3. Check SMTP credentials in Railway environment variables

### Image Upload Issues

**Images not uploading:**

1. Check file size limits (5MB max)
2. Verify `uploads/` directory exists
3. Consider switching to cloud storage (Cloudinary/AWS S3)

---

## Performance Optimization

### Backend

1. **Enable Database Connection Pooling:**
   ```javascript
   // In DATABASE_URL, add:
   ?connection_limit=10&pool_timeout=20
   ```

2. **Add Redis Caching (optional):**
   - Add Redis on Railway
   - Cache frequent queries

3. **Enable Compression:**
   ```javascript
   // backend/src/index.js
   import compression from 'compression';
   app.use(compression());
   ```

### Frontend

1. **Enable Image Optimization:**
   - Use Next.js `<Image>` component
   - Configure image domains in `next.config.js`

2. **Add Caching Headers:**
   ```javascript
   // next.config.js
   async headers() {
     return [
       {
         source: '/:all*(svg|jpg|png)',
         headers: [
           {
             key: 'Cache-Control',
             value: 'public, max-age=31536000, immutable',
           },
         ],
       },
     ];
   }
   ```

---

## Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (64+ characters)
- [ ] Enable HTTPS only (both Vercel and Railway do this by default)
- [ ] Set secure CORS origins
- [ ] Enable rate limiting on API
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets (never commit)
- [ ] Enable database backups
- [ ] Set up error monitoring (Sentry)
- [ ] Review Prisma schema permissions
- [ ] Test email verification flow
- [ ] Limit file upload sizes
- [ ] Sanitize file uploads

---

## Next Steps

After successful deployment:

1. **Set up monitoring:**
   - [Sentry](https://sentry.io) for error tracking
   - [LogRocket](https://logrocket.com) for session replay
   - Google Analytics for user tracking

2. **Configure backups:**
   - Railway provides automatic PostgreSQL backups
   - Set up additional backup strategy

3. **Set up CI/CD:**
   - Automatic deployments on `git push`
   - Run tests before deployment
   - Preview deployments for PRs

4. **Domain and SSL:**
   - Purchase custom domain
   - Configure DNS
   - SSL is automatic on Vercel and Railway

5. **Scale:**
   - Monitor usage in Railway/Vercel dashboards
   - Upgrade plans as needed
   - Consider multi-region deployment

---

## Cost Estimates

### Free Tier Limits

**Railway (Free Plan):**
- $5 free credit/month
- Enough for small MVP
- Database included

**Vercel (Hobby Plan):**
- Unlimited deployments
- 100GB bandwidth/month
- Perfect for MVP

**Estimated Monthly Cost for MVP:**
- $0 - $10/month (within free tiers)

**Scaling to 1000+ users:**
- Railway Pro: ~$20/month
- Vercel Pro: $20/month
- Total: ~$40/month

---

## Support

**Deployment Issues:**
- Railway: https://railway.app/help
- Vercel: https://vercel.com/support

**EasyHome Repository:**
- GitHub Issues: https://github.com/muhammadegaa/easyhome/issues

---

## Summary

**Quick Deployment Checklist:**

1. ✅ Create Railway account
2. ✅ Provision PostgreSQL database
3. ✅ Deploy backend to Railway
4. ✅ Set environment variables
5. ✅ Run database migrations
6. ✅ Get backend URL
7. ✅ Create Vercel account
8. ✅ Deploy frontend to Vercel
9. ✅ Set NEXT_PUBLIC_API_URL
10. ✅ Update backend FRONTEND_URL
11. ✅ Test complete user flow
12. ✅ Monitor and optimize

**Estimated Time:** 30-45 minutes for first deployment

---

🎉 **Congratulations! Your EasyHome MVP is now live!**
