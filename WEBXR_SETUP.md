# WebXR Setup Guide

## Masalah: "WebXR AR tidak didukung di browser ini"

Jika Anda melihat pesan ini, berikut adalah solusinya:

## 🔧 Solusi 1: Gunakan HTTPS

WebXR memerlukan HTTPS untuk berfungsi. Jalankan aplikasi dengan HTTPS:

```bash
npm run start:https
```

Kemudian buka `https://localhost:3000` di browser.

## 🔧 Solusi 2: Gunakan ngrok (Recommended)

1. Install ngrok:

   ```bash
   npm install -g ngrok
   ```

2. Jalankan aplikasi normal:

   ```bash
   npm start
   ```

3. Di terminal lain, jalankan ngrok:

   ```bash
   ngrok http 3000
   ```

4. Gunakan URL HTTPS yang diberikan ngrok (contoh: `https://abc123.ngrok.io`)

## 🔧 Solusi 3: Gunakan Chrome Mobile

1. Buka Chrome di Android/iOS
2. Akses aplikasi melalui HTTPS
3. Pastikan device mendukung ARCore (Android) atau ARKit (iOS)

## 🔧 Solusi 4: Enable WebXR di Chrome Desktop

1. Buka Chrome
2. Ketik `chrome://flags/` di address bar
3. Cari "WebXR" dan enable:
   - `#webxr-incubations`
   - `#webxr-runtime`
4. Restart Chrome
5. Akses aplikasi melalui HTTPS

## 🔧 Solusi 5: Gunakan Chrome Canary

1. Download Chrome Canary
2. Enable WebXR flags (sama seperti di atas)
3. Akses aplikasi melalui HTTPS

## 📱 Browser Compatibility

### ✅ Supported:

- Chrome Mobile (Android) dengan ARCore
- Safari (iOS) dengan ARKit
- Chrome Desktop dengan WebXR flags enabled
- Chrome Canary dengan WebXR flags enabled

### ❌ Not Supported:

- Firefox (belum mendukung WebXR AR)
- Edge (terbatas support)
- Chrome tanpa HTTPS
- Browser tanpa WebXR support

## 🐛 Troubleshooting

### Error: "WebXR tidak dapat diakses"

- Pastikan menggunakan HTTPS
- Pastikan browser mendukung WebXR
- Coba restart browser

### Error: "WebXR AR tidak didukung"

- Gunakan Chrome Mobile
- Enable WebXR flags di Chrome Desktop
- Pastikan device mendukung ARCore/ARKit

### Error: "WebXR memerlukan HTTPS"

- Gunakan `npm run start:https`
- Atau gunakan ngrok
- Pastikan URL dimulai dengan `https://`

## 💡 Tips

1. **Untuk Testing**: Gunakan ngrok untuk mendapatkan HTTPS URL
2. **Untuk Production**: Deploy ke server dengan HTTPS
3. **Untuk Mobile**: Gunakan Chrome Mobile untuk hasil terbaik
4. **Untuk Desktop**: Enable WebXR flags di Chrome

## 📞 Support

Jika masih mengalami masalah, periksa:

1. Console browser untuk error messages
2. Pastikan menggunakan HTTPS
3. Pastikan browser mendukung WebXR
4. Pastikan device mendukung AR
