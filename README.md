# Web AR Furniture Visualization

Aplikasi Web AR untuk visualisasi furniture menggunakan WebXR, React.js, dan Three.js. Aplikasi ini memungkinkan pengguna untuk melihat dan menempatkan model 3D furniture di lingkungan AR dengan deteksi floorplan dan wall.

## 🚀 Fitur Utama

- **3D Model Viewer**: Preview model 3D sebelum masuk ke mode AR
- **WebXR AR Support**: Menampilkan model 3D di dunia nyata menggunakan AR
- **Floorplan & Wall Detection**: Deteksi lantai dan dinding untuk penempatan model
- **Scale Controls**: Kontrol ukuran model dengan slider
- **Position Controls**: Kontrol posisi model (X, Y, Z)
- **Rotation Controls**: Kontrol rotasi model (X, Y, Z)
- **File Format Support**: Mendukung file GLB dan USDZ
- **Model Upload**: Upload model 3D custom
- **Responsive Design**: UI yang responsif untuk mobile dan desktop

## 🛠️ Teknologi yang Digunakan

- **React.js** - Framework frontend
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer untuk Three.js
- **@react-three/drei** - Helper components untuk Three.js
- **@react-three/xr** - WebXR support untuk React Three Fiber
- **WebXR** - AR/VR web standard

## 📦 Instalasi

1. Clone repository ini
2. Install dependencies:

   ```bash
   npm install
   ```

3. Jalankan aplikasi:

   **Untuk Development (HTTP):**

   ```bash
   npm start
   ```

   Buka browser dan akses `http://localhost:3000`

   **Untuk WebXR AR (HTTPS):**

   ```bash
   npm run start:https
   ```

   Buka browser dan akses `https://localhost:3000`

   **Atau gunakan ngrok untuk HTTPS:**

   ```bash
   npm install -g ngrok
   npm start
   # Di terminal lain:
   ngrok http 3000
   ```

   Gunakan URL HTTPS yang diberikan ngrok

## 🎮 Cara Penggunaan

### 1. Pilih Model 3D

- Klik "Pilih Model" untuk memilih dari model sample
- Atau klik "Upload" untuk upload model GLB/USDZ custom

### 2. Atur Model

- Gunakan slider "Skala Model" untuk mengubah ukuran
- Atur posisi dengan input X, Y, Z
- Atur rotasi dengan input X, Y, Z (dalam derajat)
- Klik "Reset" untuk mengembalikan ke pengaturan default

### 3. Mode AR

- Klik "Masuk ke Mode AR" untuk masuk ke mode AR
- Pastikan browser mendukung WebXR (Chrome mobile recommended)
- Gerakkan kamera untuk scan area
- Tap di lantai untuk menempatkan model
- Gunakan gesture untuk memutar/zoom model

## 📱 Browser Compatibility

### Recommended:

- Chrome Mobile (Android) dengan ARCore
- Safari (iOS) dengan ARKit
- Chrome Desktop dengan WebXR emulation

### Minimum Requirements:

- WebXR support
- WebGL 2.0
- HTTPS connection (required for WebXR)

## 📁 Struktur Project

```
src/
├── components/
│   ├── ARScene.js          # AR scene component
│   ├── ARPlacement.js      # AR placement system
│   ├── ModelViewer.js      # 3D model viewer
│   └── ControlsPanel.js    # UI controls
├── utils/
│   └── modelLoader.js      # Model loading utilities
├── App.js                  # Main app component
├── App.css                 # Styles
└── index.js                # Entry point
```

## 🎨 Model 3D Requirements

### Format yang Didukung:

- **GLB** (recommended) - Binary glTF format
- **USDZ** - Universal Scene Description format

### Spesifikasi Model:

- Maksimal ukuran file: 50MB
- Optimasi untuk web (low poly jika memungkinkan)
- Material yang kompatibel dengan Three.js
- Posisi model di center (0,0,0)

## 🔧 Konfigurasi

### Environment Variables:

```env
REACT_APP_WEBXR_ENABLED=true
REACT_APP_MAX_MODEL_SIZE=52428800  # 50MB in bytes
```

### Model Sample:

Tambahkan model sample di folder `public/models/`:

- `chair.glb`
- `table.glb`
- `sofa.glb`
- `lamp.glb`

## 🐛 Troubleshooting

### WebXR Tidak Didukung:

- Pastikan menggunakan HTTPS
- Gunakan browser yang mendukung WebXR
- Enable WebXR di browser flags (Chrome)

### Model Tidak Muncul:

- Periksa format file (harus GLB atau USDZ)
- Pastikan ukuran file < 50MB
- Periksa console untuk error messages

### AR Tidak Bekerja:

- Pastikan device mendukung ARCore/ARKit
- Periksa permission kamera
- Pastikan lighting cukup terang

## 📄 License

MIT License - lihat file LICENSE untuk detail.

## 🤝 Contributing

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## 📞 Support

Jika mengalami masalah atau ada pertanyaan, silakan buat issue di repository ini.

---

**Note**: Aplikasi ini memerlukan browser yang mendukung WebXR dan device yang kompatibel dengan AR untuk fungsi AR yang optimal.
