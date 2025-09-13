# 🏠 Panduan Deploy ke Hostinger

Panduan lengkap untuk deploy Web AR Furniture ke Hostinger shared hosting.

## ⚠️ Keterbatasan Hostinger

### Yang TIDAK Bekerja:

- ❌ **WebXR AR** - Tidak support di shared hosting
- ❌ **AR Mode** - Akan error atau tidak muncul
- ❌ **File Upload** - Perlu backend untuk handle upload
- ❌ **HTTPS WebXR** - Shared hosting biasanya HTTP

### Yang BISA Bekerja:

- ✅ **3D Model Viewer** - Three.js viewer
- ✅ **Model Gallery** - Pilih model dari gallery
- ✅ **UI/UX** - Semua tampilan dan interaksi
- ✅ **Static Files** - HTML, CSS, JS, images

## 🚀 Cara Deploy ke Hostinger

### 1. Build Project

```bash
npm run build
```

### 2. Upload ke Hostinger

1. **Login ke Hostinger cPanel**
2. **Buka File Manager**
3. **Masuk ke public_html/**
4. **Upload semua file dari folder build/**
5. **Extract jika dalam zip**

### 3. Struktur File di Hostinger

```
public_html/
├── index.html
├── static/
│   ├── css/
│   │   └── main.[hash].css
│   └── js/
│       └── main.[hash].js
├── models/
│   └── sample-chair.glb
└── manifest.json
```

### 4. Test Aplikasi

- Buka domain Anda
- Test 3D model viewer
- Test model gallery
- AR mode akan menampilkan pesan "AR Not Supported"

## 🔧 Optimasi untuk Hostinger

### 1. Disable AR Mode

```javascript
// Di App.js, set AR mode disabled
const [isWebXRSupported, setIsWebXRSupported] = useState(false);
```

### 2. Static Model Gallery

- Gunakan model yang sudah ada
- Tidak ada file upload
- Model disimpan di folder public/models/

### 3. Simplified UI

- Hapus AR button
- Fokus pada 3D viewer
- Optimasi untuk desktop

## 📱 Browser Compatibility

### Desktop:

- ✅ **Chrome** - 3D viewer berfungsi
- ✅ **Firefox** - 3D viewer berfungsi
- ✅ **Safari** - 3D viewer berfungsi
- ✅ **Edge** - 3D viewer berfungsi

### Mobile:

- ✅ **Chrome Mobile** - 3D viewer berfungsi
- ✅ **Safari Mobile** - 3D viewer berfungsi
- ❌ **AR Mode** - Tidak berfungsi di shared hosting

## 🎯 Fitur yang Tersedia

### 3D Model Viewer:

- Interactive 3D models
- Mouse/touch controls
- Model gallery
- Search dan filter
- Responsive design

### UI/UX:

- Premium design
- Smooth animations
- Mobile responsive
- Modern interface

## 💡 Rekomendasi

### Untuk Production:

1. **Gunakan Vercel/Netlify** - Untuk AR functionality
2. **Hostinger** - Hanya untuk 3D viewer
3. **Hybrid** - 3D viewer di Hostinger, AR di Vercel

### Untuk Development:

1. **Local testing** - npm start
2. **Hostinger** - Test static version
3. **Vercel** - Test full AR version

## 🔄 Update Process

### Setiap Update:

1. **Build project** - npm run build
2. **Upload ke Hostinger** - Replace files
3. **Test functionality** - Cek semua fitur
4. **Clear cache** - Browser cache

## 📞 Support

Jika ada masalah:

1. **Cek console** - Browser developer tools
2. **Test local** - npm start dulu
3. **Check files** - Pastikan semua file ter-upload
4. **Clear cache** - Browser dan server cache

---

**Note**: Hostinger cocok untuk 3D viewer, tapi untuk AR functionality penuh, gunakan Vercel atau platform yang support WebXR.
