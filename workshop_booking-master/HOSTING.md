# 🌐 Free Hosting Solutions — GitHub Student Developer Pack

Complete guide to deploying the FOSSEE Workshop Booking Portal **completely free** using your **GitHub Student Developer Pack** benefits.

---

## 📊 Hosting Architecture

```
┌─────────────────────────────────────────────────────┐
│         Frontend (React/Vite SPA — ~115 KB)         │
│  Deploy: GitHub Pages / Netlify / Vercel            │
│  Custom Domain: namecheap.com (free with .edu)      │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS, API calls to /api/*
                     ▼
┌─────────────────────────────────────────────────────┐
│      Backend (Django + DRF — PostgreSQL)            │
│  Deploy: Render / Railway / Oracle Always Free      │
│  Database: PostgreSQL (Render free tier)            │
│  Email: SendGrid (Student Pack credits)             │
└─────────────────────────────────────────────────────┘
```

---

## 1️⃣ Frontend Hosting (Choose One)

### Option A: GitHub Pages (Recommended for simplicity)

**Cost:** Free ✅  
**Storage:** Unlimited  
**Bandwidth:** Unlimited  
**Custom domain:** Yes  
**Setup Time:** 5 minutes

#### Setup Steps:

```bash
# 1. Build the frontend
cd frontend
npm run build

# 2. Create/use GitHub repository
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/workshop_booking.git
git push -u origin main

# 3. Configure GitHub Pages
# Go to: GitHub repo → Settings → Pages
# → Deploy from branch → main → /root (or /docs)
```

**Domain:** `https://YOUR_USERNAME.github.io/workshop_booking`

**Pros:**
- No additional account needed (GitHub repo = hosting)
- Automatic HTTPS/SSL
- Version control + hosting combined
- Perfect for SPA-only deployment

**Cons:**
- Static files only (no Node.js backend)
- Cannot run server-side code

---

### Option B: Netlify (Best developer experience)

**Cost:** Free tier + $150 Student Pack credit  
**Build time:** 300 minutes/month free  
**Bandwidth:** 100 GB/month  
**Global CDN:** Yes  

#### Setup Steps:

```bash
# 1. Link GitHub repo
# Visit: https://app.netlify.com → "New site from Git"
# Select your GitHub repository
# Build command: npm run build
# Publish directory: dist

# 2. Auto-deploy on push
git push origin main
# Netlify automatically builds and deploys

# 3. Custom domain (optional)
# Free: yourapp.netlify.app
# Paid: Connect your own domain (~$10/year on Namecheap)
```

**Domain:** `https://YOUR_PROJECT.netlify.app`

**Pros:**
- Zero-config GitHub integration
- Automatic preview URLs for PRs
- Faster global CDN
- Free SSL certificate
- Production-grade platform

**Cons:**
- Requires Netlify account
- Build minutes limited (but generous free tier)

**Student Pack Benefit:** $150 credit = extra resources beyond free tier

---

### Option C: Vercel (Optimized for React/Next.js)

**Cost:** Free tier + $150 Student Pack credits  
**Deployments:** Unlimited  
**Bandwidth:** Unlimited  
**Analytics:** Free  

#### Setup Steps:

```bash
# 1. Connect GitHub
# Visit: https://vercel.com → "Import Project"
# Select your GitHub repository

# 2. Configure deployment
# Framework Preset: Vite
# Build Command: npm run build
# Output Directory: dist

# 3. Deploy
git push origin main
# Auto-deploys on every push
```

**Domain:** `https://YOUR_PROJECT.vercel.app`

**Pros:**
- Optimized for React/Vite projects
- One-click GitHub integration
- Free domain forwarding
- Edge functions available
- Fastest deployment for React

**Cons:**
- Slightly more complex for non-Next.js projects

**Student Pack Benefit:** $150 credit for additional features

---

### Option D: Cloudflare Pages (Free forever, no limits)

**Cost:** Free forever (completely free)  
**Build time:** Unlimited  
**Bandwidth:** Unlimited  
**Global CDN:** Cloudflare network (fastest globally)

#### Setup Steps:

```bash
# Method 1: GitHub integration
# Visit: https://dash.cloudflare.com → Pages
# → Create project → Connect GitHub
# → Select your repo
# → Build command: npm run build
# → Output: dist

# Method 2: CLI deployment
npm install -g wrangler
# Build locally
npm run build
# Deploy
wrangler pages deploy dist --project-name=workshop-booking
```

**Domain:** `https://workshop-booking.pages.dev`

**Pros:**
- Completely free forever (no time limit)
- Unlimited everything (bandwidth, build time)
- Fastest global CDN (Cloudflare backbone)
- No credits needed

**Cons:**
- Less GitHub UI integration than Netlify/Vercel

**Best Choice:** If you want truly unlimited free hosting forever

---

### Comparison Table: Frontend Hosting

| Feature | GitHub Pages | Netlify | Vercel | Cloudflare |
|---------|-------------|---------|---------|-----------|
| **Cost** | Free | Free + $150 | Free + $150 | Free |
| **Build Min/Mo** | Unlimited | 300 | Unlimited | Unlimited |
| **Bandwidth** | Unlimited | 100 GB | Unlimited | Unlimited |
| **SSL** | Free | Free | Free | Free |
| **GitHub Integration** | Built-in | Excellent | Excellent | Good |
| **Global CDN** | Yes | Yes | Yes | Yes (Fastest) |
| **Preview URLs** | No | Yes | Yes | Yes |
| **Setup Time** | 5 min | 5 min | 5 min | 10 min |
| **Best For** | Simple projects | Production apps | React apps | Forever free |

**Recommended:** **Netlify** (best balance of features + student credits)

---

## 2️⃣ Backend Hosting (Choose One)

### Option A: Render (Recommended for Django)

**Cost:** Free tier + Student Pack optional  
**Database:** PostgreSQL included free  
**Memory:** 512 MB  
**CPU:** Shared  
**Perfect for:** Django/Python apps  

#### Setup Steps:

```bash
# 1. Sign up with GitHub
# Visit: https://render.com
# → Click "Sign up with GitHub"

# 2. Create Web Service
# → Dashboard → New → Web Service
# → Connect your GitHub repository
# → Runtime: Python
# → Build command: pip install -r requirements.txt
# → Start command: gunicorn workshop_portal.wsgi:application

# 3. Add environment variables
# → Environment tab → Add environment variable
DJANGO_SECRET_KEY=your_secret_key_here
ALLOWED_HOSTS=your-app.onrender.com
DEBUG=False
DATABASE_URL=postgresql://username:password@host:5432/dbname

# 4. Add PostgreSQL database
# → Resources tab → Add → PostgreSQL
# (Auto-generates DATABASE_URL)

# 5. Deploy
git push origin main
# Auto-deploys automatically
```

**Domain:** `https://your-app.onrender.com`

**Post-Deployment:**
```bash
# SSH into Render and run migrations
render logs  # View deployment logs
# Or use Render's shell in dashboard
python manage.py migrate
python manage.py createsuperuser
```

**Pros:**
- PostgreSQL database included free
- Auto-deploys from GitHub with zero config
- Django-optimized setup
- Perfect for this exact project
- Easy environment variable management

**Cons:**
- Free tier "sleeps" after 15 minutes inactivity
- Plan: Upgrade to Starter ($7/month) to prevent sleep

**Sleep Timeout Workaround:**
```bash
# Option 1: Upgrade to paid ($7/month)
# Option 2: Use Railway instead (see below)
# Option 3: Use monitoring service to ping site every 10 min
# Option 4: Use Oracle Always Free (no sleep limit)
```

---

### Option B: Railway (Student Pack $50/month credit)

**Cost:** $5/month (but $50 Student Pack credit = 10 months free)  
**Database:** PostgreSQL included  
**Memory:** 512 MB free tier  
**Perfect for:** Full-stack apps with no sleep limit  

#### Setup Steps:

```bash
# 1. Sign up with GitHub
# Visit: https://railway.app
# → "Start a new project"
# → "Deploy from GitHub repo"

# 2. Select your Django repository
# Railway auto-detects Python/Django
# Creates Procfile automatically

# 3. Add PostgreSQL database
# → Resources tab → + New Resource → PostgreSQL
# → Creates DATABASE_URL automatically

# 4. Environment variables (auto-loaded)
# Railway sets DATABASE_URL automatically
# Add manually:
DJANGO_SECRET_KEY=your_secret_key
ALLOWED_HOSTS=your-app.railway.app
DEBUG=False

# 5. Deploy
git push origin main
```

**Domain:** `https://your-app.railway.app`

**Pros:**
- No sleep timeout (runs 24/7 free tier)
- $50/month Student Pack credit (~10 months free)
- Clean, simple interface
- PostgreSQL included
- Auto-deploys from GitHub

**Cons:**
- Will be $5/month after credits expire (or upgrade)
- Paid long-term (but still cheapest paid option)

**Best if:** You want guaranteed 24/7 uptime without sleeping

---

### Option C: Oracle Always Free Tier (Completely free forever)

**Cost:** FREE forever (not a trial)  
**Memory:** 2 GB RAM  
**CPU:** 2 OCPU  
**Storage:** 20 GB  
**Database:** PostgreSQL or MySQL free  
**Perfect for:** Long-term hosting with full control  

#### Setup Steps:

```bash
# 1. Create Oracle Cloud account
# Visit: https://www.oracle.com/cloud/free/
# → Sign up (requires credit card for verification, but not charged)
# → Create Always Free account

# 2. Create VM Instance
# → Compute → Instances → Create Instance
# → Image: Ubuntu 22.04 LTS
# → Shape: e2.1.micro (Always Free eligible)
# → Size: 4 GB RAM, 1 CPU (free)
# → Download SSH key

# 3. SSH into instance
ssh -i ~/.ssh/oracle_key ubuntu@YOUR_PUBLIC_IP

# 4. Install dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install python3-pip python3-venv python3-dev git
sudo apt install postgresql postgresql-contrib nginx supervisor

# 5. Clone and deploy Django
git clone https://github.com/YOUR_USERNAME/workshop_booking.git
cd workshop_booking
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 6. Configure Django
# Edit settings.py:
# ALLOWED_HOSTS = ['YOUR_PUBLIC_IP', 'your-domain.com']
# DEBUG = False
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'workshop_booking',
#         'USER': 'postgres',
#         'PASSWORD': 'your_secure_password',
#         'HOST': 'localhost',
#         'PORT': '5432',
#     }
# }

# 7. Collect static files and migrate
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput

# 8. Create systemd service for auto-start
sudo nano /etc/systemd/system/workshop.service
# [Unit]
# Description=FOSSEE Workshop Booking
# After=network.target
# [Service]
# Type=notify
# User=ubuntu
# WorkingDirectory=/home/ubuntu/workshop_booking
# ExecStart=/home/ubuntu/workshop_booking/venv/bin/gunicorn workshop_portal.wsgi:application --bind 0.0.0.0:8000
# [Install]
# WantedBy=multi-user.target

sudo systemctl daemon-reload
sudo systemctl enable workshop
sudo systemctl start workshop

# 9. Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/workshop
# server {
#     listen 80;
#     server_name YOUR_PUBLIC_IP;
#     location / {
#         proxy_pass http://127.0.0.1:8000;
#         proxy_set_header Host $host;
#         proxy_set_header X-Real-IP $remote_addr;
#     }
# }
sudo ln -s /etc/nginx/sites-available/workshop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 10. Enable HTTPS with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly -d your-domain.com --nginx
# Update Nginx config with SSL cert paths
```

**Domain:** Custom domain required (~$10/year on Namecheap)

**Pros:**
- Completely free forever (not a trial, real account)
- Generous resources (2 GB RAM, 2 CPU)
- Full server control (root access)
- PostgreSQL database included locally
- Real Linux server experience
- No sleep limits

**Cons:**
- Requires manual setup (no one-click deploy)
- You manage OS updates and security
- No automatic backups (you set up)
- Requires understanding of Linux/Nginx

**Best if:** You're comfortable with Linux and want complete control

---

### Option D: PythonAnywhere (Beginner-friendly, no credit card)

**Cost:** Free tier  
**Memory:** Limited but sufficient  
**Database:** MySQL free  
**Perfect for:** Beginners, simplest setup  

#### Setup Steps:

```bash
# 1. Sign up at https://www.pythonanywhere.com/
# → No credit card required

# 2. Upload code
# → Web tab → Add new web app → Django
# → Select Python version
# → Select Django option

# 3. Configure database
# → Databases tab → Create new MySQL database
# → Get connection details

# 4. Update Django settings
# settings.py:
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'yourname$yourdbname',
#         'USER': 'yourname',
#         'PASSWORD': 'your_password',
#         'HOST': 'yourname.mysql.pythonanywhere-services.com',
#     }
# }

# 5. Run migrations via web console
# → Web console → manage.py migrate
```

**Domain:** `https://your-username.pythonanywhere.com`

**Pros:**
- Beginner-friendly
- No credit card required
- Works out of the box
- Simple dashboard

**Cons:**
- Slower performance (shared resources)
- Limited customization
- MySQL only (PostgreSQL requires paid tier)

---

### Comparison Table: Backend Hosting

| Feature | Render | Railway | Oracle | PythonAnywhere |
|---------|--------|---------|--------|----------------|
| **Cost** | Free | Free + $50/mo | Free | Free |
| **Database** | PostgreSQL ✅ | PostgreSQL ✅ | PostgreSQL ✅ | MySQL |
| **Sleep Timeout** | 15 min | Never | Never | No |
| **Setup Time** | 5 min | 5 min | 30 min | 10 min |
| **Auto-deploy** | GitHub ✅ | GitHub ✅ | Manual | Manual |
| **Memory** | 512 MB | 512 MB | 2 GB | Limited |
| **Difficulty** | Easy | Easy | Medium | Very Easy |
| **Long-term** | Paid ($7) | Paid ($5) | Free | Free |
| **Best For** | Django apps | No sleep | Control freaks | Beginners |

**Recommended:** **Render** (best for Django, simple setup, affordable upgrade)

---

## 3️⃣ Database Hosting

All backend options above **include PostgreSQL for free**:

| Provider | Included with | Type | Backups |
|----------|---------------|------|---------|
| **Render** | Backend service | PostgreSQL | Daily |
| **Railway** | Backend service | PostgreSQL | Daily |
| **Oracle** | VM instance | Local PostgreSQL | Manual |
| **PythonAnywhere** | Backend service | MySQL | Daily |

**Recommendation:** Use PostgreSQL (Render/Railway/Oracle) over MySQL

---

## 4️⃣ Email Sending (SendGrid + Student Pack)

**Setup:**

```bash
# 1. Claim SendGrid from Student Developer Pack
# Visit: https://education.github.com/pack
# → Find "SendGrid"
# → Claim $200 Free Credit
# → Click through to activate

# 2. Create SendGrid API key
# Login to https://app.sendgrid.com
# → Settings → API Keys
# → Create new key
# → Copy (save in secure location)

# 3. Add to Django settings.py
import os

EMAIL_BACKEND = 'sendgrid_backend.SendgridBackend'
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
DEFAULT_FROM_EMAIL = 'noreply@workshop-booking.com'
SENDGRID_SANDBOX_MODE_IN_DEBUG = False

# 4. Install sendgrid package
pip install sendgrid django-sendgrid-v5

# 5. Set environment variable
# On Render/Railway/PythonAnywhere:
# → Add env var: SENDGRID_API_KEY=SG.your_key_here

# 6. Send emails in code
from django.core.mail import send_mail

send_mail(
    'Workshop Confirmation',
    'Your workshop proposal has been accepted!',
    'noreply@workshop-booking.com',
    ['instructor@example.com'],
    fail_silently=False,
)
```

**Student Pack Benefits:**
- **$200 credit** = ~10,000 emails/month
- Valid for 24 months
- More than enough for workshop notifications

**Cost Breakdown:**
- 1 email template × 2,000 coordinators/instructors = 2,000 emails
- 5 notifications per workshop × 200 workshops/month = 1,000 emails
- Monthly usage: ~3,000 emails = free with Student Pack

---

## 🚀 Complete Deployment Checklist

### Frontend Deployment

- [ ] Choose frontend host (Netlify recommended)
- [ ] Create account and authenticate GitHub
- [ ] Configure build settings:
  - Build command: `npm run build`
  - Output directory: `dist`
  - Node version: 18.x or higher
- [ ] Update `frontend/vite.config.js` API proxy:
  ```javascript
  server: {
    proxy: {
      '/api': {
        target: 'https://your-backend.onrender.com',
        changeOrigin: true,
      }
    }
  }
  ```
- [ ] Deploy: `git push origin main`
- [ ] Verify HTTPS working
- [ ] Check frontend loads in browser
- [ ] Test API calls from browser console

### Backend Deployment

- [ ] Choose backend host (Render recommended)
- [ ] Create account and authenticate GitHub
- [ ] Configure deployment settings:
  - Build command: `pip install -r requirements.txt`
  - Start command: `gunicorn workshop_portal.wsgi:application --bind 0.0.0.0:8000`
- [ ] Add PostgreSQL database
- [ ] Set environment variables:
  - `DJANGO_SECRET_KEY`: Generate new with `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
  - `ALLOWED_HOSTS`: `your-backend.onrender.com`
  - `DEBUG`: `False`
  - `DATABASE_URL`: Auto-generated
- [ ] Deploy: `git push origin main`
- [ ] After deployment, run in shell:
  ```bash
  python manage.py migrate
  python manage.py createsuperuser
  ```
- [ ] Test API endpoint: `curl https://your-backend.onrender.com/api/auth/me/`

### Domain Setup (Optional)

- [ ] Buy domain (Namecheap, GoDaddy, etc.) — ~$10/year
- [ ] Point DNS A record to hosting provider's IP
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Enable SSL certificate (auto-provisioned)
- [ ] Test HTTPS: `https://your-domain.com`

### Email Setup

- [ ] Claim SendGrid from Student Pack
- [ ] Create API key
- [ ] Add `SENDGRID_API_KEY` to backend environment variables
- [ ] Test sending email from Django admin

---

## 📋 Total Cost for 12 Months

| Component | Provider | Cost |
|-----------|----------|------|
| **Frontend** | Netlify | Free |
| **Backend** | Render | Free |
| **Database** | Render | Free |
| **Domain** | Namecheap | $0 (with .edu email) |
| **Email** | SendGrid (Student Pack) | Free ($200 credit) |
| **SSL Certificate** | Render | Free |
| **Monitoring** | Sentry | Free (Student Pack) |
| **TOTAL** | | **$0** 🎉 |

---

## ⚠️ Important Configuration Notes

### CORS Configuration

If frontend and backend on different domains:

```python
# Django settings.py
from corsheaders.middleware import CorsMiddleware

INSTALLED_APPS = [
    'corsheaders',
    # ... other apps
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ... other middleware
]

CORS_ALLOWED_ORIGINS = [
    "https://yourapp.netlify.app",
    "https://your-domain.com",
    "http://localhost:3000",  # Development
]

CORS_ALLOW_CREDENTIALS = True  # Allow cookies
```

### Render Sleep Timeout Prevention

**Problem:** Render free tier sleeps after 15 minutes inactivity

**Solution 1: Upgrade to Starter ($7/month)**
```
Render → Pricing → Upgrade plan
```

**Solution 2: Use Railway ($5/month) instead**
```
No sleep timeout on Railway
```

**Solution 3: Use Oracle Always Free**
```
No sleep timeout (completely free)
```

**Solution 4: Monitoring service (no cost)**
```bash
# Use UptimeRobot (free) to ping your API every 10 minutes
# Visit: https://uptimerobot.com
# → Add monitor
# → HTTP(S): https://your-backend.onrender.com/api/health/
# → Interval: 5 minutes
```

### Environment Variables Template

Create `.env.example`:

```
# Backend
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-app.onrender.com
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Email
SENDGRID_API_KEY=SG.your_api_key_here
DEFAULT_FROM_EMAIL=noreply@workshop-booking.com

# CORS
ALLOWED_FRONTEND_URL=https://yourapp.netlify.app

# Security
CSRF_TRUSTED_ORIGINS=https://yourapp.netlify.app
```

---

## 🎯 Quick Start (Fastest Deployment)

**Total time: 30 minutes**

```bash
# 1. Frontend to Netlify (5 min)
cd frontend
npm run build
git add dist/
git commit -m "Build production"
git push origin main
# → Visit app.netlify.com → New → GitHub → select repo → auto-deploys

# 2. Backend to Render (15 min)
# → Visit render.com → New Web Service → GitHub
# → Settings:
#    - Build: pip install -r requirements.txt
#    - Start: gunicorn workshop_portal.wsgi:application --bind 0.0.0.0:8000
# → Add PostgreSQL → gets DATABASE_URL
# → Add env vars (SECRET_KEY, ALLOWED_HOSTS, DEBUG=False)
# → Deploy
git push origin main

# 3. Setup after deploy (10 min)
# → Render shell: python manage.py migrate
# → Render shell: python manage.py createsuperuser
# → Test: curl https://your-app.onrender.com/api/auth/me/
# ✓ Done!
```

---

## 🔗 Useful Links

**Frontend Hosts:**
- [Netlify](https://netlify.com/) — Recommended
- [Vercel](https://vercel.com/) — React-optimized
- [GitHub Pages](https://pages.github.com/) — Simplest
- [Cloudflare Pages](https://pages.cloudflare.com/) — Free forever

**Backend Hosts:**
- [Render](https://render.com/) — Recommended
- [Railway](https://railway.app/) — No sleep
- [Oracle Cloud](https://www.oracle.com/cloud/free/) — Powerful & free
- [PythonAnywhere](https://www.pythonanywhere.com/) — Beginner-friendly

**Student Developer Pack:**
- [GitHub Education Pack](https://education.github.com/pack) — Claims & benefits

**Domain Names:**
- [Namecheap](https://www.namecheap.com/) — Cheapest
- [GoDaddy](https://www.godaddy.com/) — Popular
- [Google Domains](https://domains.google/) — Reliable

**Email:**
- [SendGrid](https://sendgrid.com/) — Professional email

**Monitoring:**
- [UptimeRobot](https://uptimerobot.com/) — Keep app awake (free)
- [Sentry](https://sentry.io/) — Error tracking (free + Student Pack)

---

**Last Updated:** April 2026  
**Status:** Production Ready  
**Total Cost:** $0/month (using free tiers + Student Pack)
