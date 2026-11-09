# BingkaiKeren — aplikasi twibbon 100% di perangkat

Aplikasi statis (tanpa backend, tanpa database server, tanpa login). Semua proyek disimpan di IndexedDB browser masing-masing pengguna.

## Isi paket
- `index.html` — seluruh aplikasi (HTML + CSS + JavaScript dalam satu file)
- `manifest.webmanifest` — agar bisa di-install sebagai PWA
- `sw.js` — service worker untuk mode offline
- `icons/` — ikon aplikasi (192, 512, maskable, apple-touch)

## Cara online-kan (pilih satu)
1. **Netlify Drop**: buka app.netlify.com/drop, seret folder ini. Selesai.
2. **GitHub Pages**: unggah isi folder ke repo, aktifkan Pages.
3. **Hosting sekolah / cPanel**: unggah semua file ke satu folder di `public_html`.

Wajib HTTPS agar PWA (install + offline) aktif. Membuka `index.html` langsung dari file (file://) tetap bisa dipakai untuk mengedit, tetapi tidak bisa di-install dan tidak offline.

## Link kampanye (opsional)
Taruh PNG frame di hosting yang sama, misalnya `frames/hgn2026.png`, lalu bagikan:

    https://situs-anda.example/?frame=frames/hgn2026.png&title=Hari%20Guru%20Nasional%202026

Link ini membuka editor dengan frame tersebut langsung siap pakai. Isi juga alamat frame di *Edit campaign → Configure → Frame link* supaya tombol Share memberi link ini.

## Uji coba yang sudah dijalankan
Buat kampanye → unggah frame PNG → unggah foto → geser & zoom → unduh PNG 1080×1080 → muat ulang browser, proyek tetap ada → ekspor ZIP → impor ZIP → tampilan HP 390 px.
Yang perlu Anda uji sendiri di perangkat nyata: install PWA di Android, offline setelah dibuka sekali, dan Web Share di HP.
