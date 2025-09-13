# Solusi AR Web dengan Deteksi Floor dan Wall

## 🎯 Solusi Lengkap untuk AR Web

Saya telah membuat solusi lengkap untuk AR web yang mendukung deteksi floorplan dan dinding menggunakan [model-viewer.dev](https://modelviewer.dev/) dan WebXR.

## 🚀 3 Mode AR yang Tersedia

### 1. **Model Viewer AR** (Floor Only)

- Menggunakan `@google/model-viewer`
- Deteksi lantai otomatis
- Mudah digunakan dan stabil
- Cocok untuk furniture yang diletakkan di lantai

### 2. **Wall Detection AR** (Wall Only)

- Menggunakan WebXR dengan hit testing
- Deteksi dinding otomatis
- Cocok untuk poster, lampu dinding, dll

### 3. **Advanced AR** (Floor + Wall)

- Kombinasi deteksi lantai dan dinding
- Switch mode dinamis
- Kontrol penuh atas placement

## 🔧 Cara Menggunakan

### 1. Install Dependencies

```bash
npm install
```

### 2. Jalankan Aplikasi

```bash
# HTTP (untuk testing)
npm start

# HTTPS (untuk AR)
npm run start:https
```

### 3. Pilih Mode AR

1. Pilih model 3D dari panel kontrol
2. Klik "Mode AR"
3. Pilih mode AR yang diinginkan:
   - **Model Viewer AR**: Untuk deteksi lantai
   - **Wall Detection AR**: Untuk deteksi dinding
   - **Advanced AR**: Untuk kedua-duanya

## 📱 Browser Compatibility

### ✅ Supported:

- Chrome Mobile (Android) dengan ARCore
- Safari (iOS) dengan ARKit
- Chrome Desktop dengan WebXR flags

### 🔧 Setup Chrome Desktop:

1. Buka `chrome://flags/`
2. Enable:
   - `#webxr-incubations`
   - `#webxr-runtime`
3. Restart Chrome
4. Gunakan HTTPS

## 🎨 Fitur Utama

### Model Viewer AR

- ✅ Deteksi lantai otomatis
- ✅ AR placement yang mudah
- ✅ Support GLB dan USDZ
- ✅ Stabil dan reliable

### Wall Detection AR

- ✅ Deteksi dinding dengan hit testing
- ✅ Normal vector analysis
- ✅ WebXR native support
- ✅ Real-time placement

### Advanced AR

- ✅ Switch antara floor dan wall mode
- ✅ Hit testing untuk kedua surface
- ✅ Kontrol penuh placement
- ✅ Fallback model jika loading gagal

## 🔍 Teknologi yang Digunakan

### Model Viewer AR

- `@google/model-viewer` - AR framework
- WebXR Device API
- Hit testing untuk floor

### Wall Detection AR

- WebXR Device API
- Hit testing dengan normal analysis
- Three.js untuk 3D rendering
- Custom hit detection algorithm

### Advanced AR

- Kombinasi Model Viewer + WebXR
- Dynamic mode switching
- Advanced hit testing
- Custom placement logic

## 💡 Solusi untuk Deteksi Dinding

### 1. **Normal Vector Analysis**

```javascript
const normal =
  hit.hitTestResults[0].hitTestResult.getPose(referenceSpace).transform
    .orientation;
const isWall = Math.abs(normal.y) < 0.5; // Wall if normal is not mostly vertical
```

### 2. **Hit Testing Strategy**

- Floor: Normal vector Y > 0.5 (mostly vertical)
- Wall: Normal vector Y < 0.5 (mostly horizontal)

### 3. **Placement Logic**

```javascript
if (
  (placementMode === "floor" && !isWall) ||
  (placementMode === "wall" && isWall)
) {
  placeModel(position, orientation);
}
```

## 🎯 Keunggulan Solusi

### 1. **Multi-Mode Support**

- 3 mode AR berbeda
- Switch dinamis
- Sesuai kebutuhan use case

### 2. **Robust Detection**

- Fallback jika detection gagal
- Error handling yang baik
- User feedback yang jelas

### 3. **Easy Integration**

- Component-based architecture
- Props-based configuration
- Easy to customize

### 4. **Cross-Platform**

- WebXR support
- Mobile dan desktop
- Progressive enhancement

## 📋 Cara Implementasi

### 1. **Basic Usage**

```jsx
<ModelViewerAR
  selectedModel={model}
  scale={1.0}
  position={{ x: 0, y: 0, z: 0 }}
  rotation={{ x: 0, y: 0, z: 0 }}
  onPlacement={(placement) => console.log(placement)}
/>
```

### 2. **Wall Detection**

```jsx
<WallDetectionAR
  selectedModel={model}
  scale={1.0}
  position={{ x: 0, y: 0, z: 0 }}
  rotation={{ x: 0, y: 0, z: 0 }}
  onPlacement={(placement) => console.log(placement)}
/>
```

### 3. **Advanced AR**

```jsx
<AdvancedAR
  selectedModel={model}
  scale={1.0}
  position={{ x: 0, y: 0, z: 0 }}
  rotation={{ x: 0, y: 0, z: 0 }}
  onPlacement={(placement) => console.log(placement)}
/>
```

## 🐛 Troubleshooting

### Model Tidak Muncul

- Pastikan file GLB/USDZ valid
- Check console untuk error
- Gunakan fallback model

### AR Tidak Bekerja

- Pastikan HTTPS
- Check WebXR support
- Gunakan browser yang kompatibel

### Deteksi Dinding Gagal

- Pastikan dinding terdeteksi dengan baik
- Check lighting
- Gerakkan kamera perlahan

## 🎉 Hasil Akhir

Aplikasi sekarang memiliki:

- ✅ **3 Mode AR** yang berbeda
- ✅ **Deteksi Floor** dengan model-viewer
- ✅ **Deteksi Wall** dengan WebXR
- ✅ **Advanced AR** dengan kedua fitur
- ✅ **Easy switching** antara mode
- ✅ **Robust error handling**
- ✅ **Cross-platform support**

Solusi ini memberikan fleksibilitas maksimal untuk AR web dengan deteksi floor dan wall yang akurat!
