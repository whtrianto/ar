# 🚀 Panduan Deploy Web AR Furniture ke Vercel

Panduan lengkap untuk deploy aplikasi Web AR Furniture ke Vercel dengan konfigurasi optimal.

## 📋 Prerequisites

Sebelum deploy, pastikan:

- [ ] Node.js 18+ terinstall
- [ ] Git terinstall dan terkonfigurasi
- [ ] Akun Vercel (gratis)
- [ ] Project sudah di-push ke GitHub/GitLab/Bitbucket

## 🛠️ Persiapan Project

### 1. Install Vercel CLI (Opsional)

```bash
npm install -g vercel
```

### 2. Test Build Lokal

```bash
# Test build production
npm run build

# Test preview build
npx serve -s build
```

### 3. Pastikan File Konfigurasi Ada

- ✅ `vercel.json` - Konfigurasi Vercel
- ✅ `.gitignore` - File yang diabaikan Git
- ✅ `env.example` - Template environment variables

## 🌐 Metode Deploy

### Metode 1: Deploy via Vercel Dashboard (Recommended)

#### Langkah 1: Push ke Repository

```bash
# Inisialisasi Git (jika belum)
git init

# Add semua file
git add .

# Commit
git commit -m "Initial commit: Web AR Furniture App"

# Push ke GitHub/GitLab/Bitbucket
git remote add origin https://github.com/username/web-ar-furniture.git
git push -u origin main
```

#### Langkah 2: Deploy di Vercel

1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub/GitLab/Bitbucket
3. Klik **"New Project"**
4. Import repository `web-ar-furniture`
5. Vercel akan auto-detect React project
6. Klik **"Deploy"**

#### Langkah 3: Konfigurasi Environment Variables

Di Vercel Dashboard:

1. Masuk ke project settings
2. Pilih **"Environment Variables"**
3. Tambahkan:
   ```
   REACT_APP_WEBXR_ENABLED=true
   REACT_APP_MAX_MODEL_SIZE=52428800
   REACT_APP_APP_NAME=Web AR Furniture
   ```
4. Redeploy project

### Metode 2: Deploy via Vercel CLI

#### Langkah 1: Login Vercel

```bash
vercel login
```

#### Langkah 2: Deploy

```bash
# Di root project
vercel

# Follow prompts:
# ? Set up and deploy "web-ar-furniture"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [N/y] n
# ? What's your project's name? web-ar-furniture
# ? In which directory is your code located? ./
```

#### Langkah 3: Set Environment Variables

```bash
vercel env add REACT_APP_WEBXR_ENABLED
# Enter value: true

vercel env add REACT_APP_MAX_MODEL_SIZE
# Enter value: 52428800

vercel env add REACT_APP_APP_NAME
# Enter value: Web AR Furniture
```

#### Langkah 4: Deploy Production

```bash
vercel --prod
```

## ⚙️ Konfigurasi Vercel

### Build Settings

- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### Environment Variables

```env
REACT_APP_WEBXR_ENABLED=true
REACT_APP_MAX_MODEL_SIZE=52428800
REACT_APP_APP_NAME=Web AR Furniture
REACT_APP_VERSION=1.0.0
```

### Custom Domain (Opsional)

1. Di Vercel Dashboard → Project Settings
2. Pilih **"Domains"**
3. Add custom domain
4. Follow DNS configuration instructions

## 🔧 Troubleshooting

### Build Error

```bash
# Clear cache dan rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### WebXR Tidak Bekerja

- Pastikan menggunakan HTTPS (Vercel otomatis HTTPS)
- Test di browser yang support WebXR
- Check console untuk error messages

### Model 3D Tidak Load

- Pastikan file model ada di `public/models/`
- Check file size (max 50MB)
- Pastikan format GLB/USDZ valid

### Performance Issues

- Optimasi model 3D (reduce poly count)
- Compress texture images
- Enable Vercel's CDN caching

## 📱 Testing Setelah Deploy

### 1. Test Basic Functionality

- [ ] App loads tanpa error
- [ ] Model viewer berfungsi
- [ ] Controls panel responsive
- [ ] File upload bekerja

### 2. Test WebXR AR

- [ ] WebXR detection berfungsi
- [ ] AR mode dapat diakses
- [ ] Model placement di AR
- [ ] Gesture controls bekerja

### 3. Test Mobile

- [ ] Responsive di mobile
- [ ] Touch controls smooth
- [ ] AR performance baik

## 🚀 Auto-Deploy Setup

### GitHub Integration

1. Connect repository ke Vercel
2. Enable **"Automatic Deployments"**
3. Setiap push ke `main` branch akan auto-deploy

### Branch Strategy

- `main` → Production (auto-deploy)
- `develop` → Preview (auto-deploy)
- `feature/*` → Preview (manual deploy)

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Enable Vercel Analytics di project
2. Monitor performance metrics
3. Track user interactions

### Error Tracking

```bash
# Install error tracking (opsional)
npm install @sentry/react @sentry/tracing
```

## 🔄 Update & Maintenance

### Deploy Update

```bash
# Update code
git add .
git commit -m "Update: fix AR performance"
git push origin main

# Vercel akan auto-deploy
```

### Rollback

1. Di Vercel Dashboard
2. Pilih **"Deployments"**
3. Klik **"Promote to Production"** pada deployment yang diinginkan

## 📞 Support

Jika mengalami masalah:

1. Check Vercel logs di dashboard
2. Test build lokal dulu
3. Check browser console untuk errors
4. Pastikan semua dependencies terinstall

---

**🎉 Selamat! Aplikasi Web AR Furniture Anda sudah live di Vercel!**

**URL Production**: `https://your-app-name.vercel.app`
