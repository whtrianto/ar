# Sample 3D Models

Folder ini berisi model 3D sample untuk aplikasi Web AR Furniture.

## Format yang Didukung

- **GLB** (recommended) - Binary glTF format
- **USDZ** - Universal Scene Description format

## Cara Menambahkan Model

1. Download atau buat model 3D dalam format GLB atau USDZ
2. Pastikan ukuran file < 50MB
3. Letakkan file di folder ini
4. Update `sample-models.json` dengan informasi model baru

## Spesifikasi Model

### Optimasi untuk Web:

- Gunakan low-poly geometry jika memungkinkan
- Kompres texture dengan ukuran yang wajar
- Pastikan model ter-center di origin (0,0,0)
- Gunakan material yang kompatibel dengan Three.js

### Posisi dan Skala:

- Model harus ter-center di (0,0,0)
- Skala default 1.0
- Rotasi default (0,0,0)

## Model Sample yang Tersedia

1. **chair.glb** - Kursi modern
2. **table.glb** - Meja makan
3. **sofa.glb** - Sofa L-shaped
4. **lamp.glb** - Lampu lantai

## Sumber Model Gratis

- [Sketchfab](https://sketchfab.com) - Model 3D gratis dan premium
- [Poly by Google](https://poly.google.com) - Model 3D gratis
- [Free3D](https://free3d.com) - Model 3D gratis
- [TurboSquid](https://turbosquid.com) - Model 3D premium

## Konversi Format

Jika Anda memiliki model dalam format lain, gunakan tools berikut:

### Blender (Gratis):

1. Import model
2. File > Export > glTF 2.0
3. Pilih format Binary (.glb)

### Online Converters:

- [glTF Viewer](https://gltf-viewer.donmccurdy.com/)
- [Three.js Editor](https://threejs.org/editor/)

## Troubleshooting

### Model Tidak Muncul:

- Periksa format file (harus GLB atau USDZ)
- Pastikan ukuran file < 50MB
- Periksa console browser untuk error

### Model Terlalu Besar:

- Gunakan Blender untuk mengurangi polygon
- Kompres texture
- Hapus material yang tidak perlu

### Model Tidak Ter-center:

- Gunakan Blender untuk center model
- Atau atur posisi di aplikasi
