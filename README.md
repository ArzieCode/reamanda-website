# Rea Manda — Platform Manajemen Situs & Bisnis Terpadu

Sistem web terpadu untuk brand **Rea Manda** yang mencakup tiga lini usaha santun:
1. **Busana Muslimah** (E-Commerce, varian ukuran & warna, manajemen stok per varian).
2. **Kost Eksklusif Wanita / D’Rhea Syariah Guest House** (ketersediaan kamar, penawaran lelang & reservasi kunjungan).
3. **Katering & Perjamuan Adat** (katalog hidangan, paket perjamuan, serta form konsultasi menu).

---

## 👥 Akun Demo & Peran (Role-Based Access)

Sistem telah dilengkapi dengan data demo lokal siap pakai. Akun-akun ini dapat langsung diuji coba melalui tombol **"Isi Akun Demo Cepat"** di modal Masuk atau menggunakan kredensial berikut:

| Peran | Nama | Surel / Email | Kata Sandi Demo | Hak Akses Utama |
|---|---|---|---|---|
| **Owner** | Hj. Amanda Rhea | `owner@reamanda.id` | `Owner123#` | Akses penuh: keuangan & omset, kelola akun staf & admin, pengaturan situs, ekspor/impor. |
| **Admin** | Siti Rahmah | `admin@reamanda.id` | `Admin123#` | Edit konten (CMS), kelola produk, stok, pesanan, dan pelanggan. *Tidak dapat melihat omset atau mengelola akun staf.* |
| **Staf** | Fatimah Zahra | `staf@reamanda.id` | `Staf123#` | Operasional pesanan dan inquiry katering/kost. *Tidak dapat menghapus data, mengedit konten, atau melihat ringkasan omset.* |
| **Pelanggan 1** | Cut Nyak Annisa | `annisa@customer.id` | `Cust123#` | Belanja busana, riwayat pesanan & timeline, buku alamat tersimpan. |
| **Pelanggan 2** | Dewi Sartika | `dewi@customer.id` | `Cust123#` | Konsultasi katering perjamuan, riwayat inquiry. |
| **Pelanggan 3** | Nasywa Putri | `nasywa@customer.id` | `Cust123#` | Pengajuan survei kost D’Rhea Syariah & penawaran kamar. |

> ℹ️ **Catatan Keamanan Demo**:
> Seluruh akun dan data sesi saat ini tersimpan di browser lokal (`sessionStorage`, `localStorage`, dan `IndexedDB`). Di lingkungan produksi, gantikan implementasi `LocalAuthService` di `src/services/auth.ts` dengan REST/GraphQL API backend Anda.

---

## 🔒 Arsitektur Keamanan & Otentikasi

1. **Web Crypto PBKDF2**: Kata sandi di-hash menggunakan algoritma standar industri PBKDF2 (SHA-256, 100.000 iterasi) dengan *salt* unik kriptografis 16-byte per pengguna. Kata sandi tidak pernah disimpan dalam format teks polos.
2. **Brute-Force Lockout**: Akun otomatis dikunci selama **5 menit** jika terjadi **5 kali kegagalan masuk berturut-turut**.
3. **Penyimpanan Sesi**:
   - Sesi standar menggunakan `sessionStorage`.
   - Opsi *"Ingat Saya"* menggunakan token bertanda tangan kriptografis dengan masa kedaluwarsa 30 hari di `localStorage`.
4. **Verifikasi Izin di Service Layer**: Pemeriksaan hak akses (`hasPermission`) tidak hanya dilakukan di antarmuka (UI), melainkan juga divalidasi langsung di service layer sebelum mutasi data dilakukan.
5. **Reset Kata Sandi Aman**:
   - **Pemilik (Owner)** dapat melakukan reset kata sandi staf langsung di menu Pengaturan > Akun Staf (kata sandi sementara ditampilkan satu kali di layar).
   - **Pelanggan** dapat menggunakan fitur *"Lupa Kata Sandi"* dengan kode verifikasi demo instan di layar.

---

## 🎨 Manajemen Konten Langsung (Live CMS)

Ketika staf yang berwenang mengaktifkan tombol **"Mode Edit Langsung"** pada Admin Bar atas:
- **Penyuntingan Teks Sejajar (Inline Text Editing)**: Setiap judul, paragraf, nilai statistik, dan teks tombol memiliki garis putus-putus `--caramel` saat diarahkan. Klik untuk menyunting, tekan Enter untuk menyimpan, Esc untuk membatalkan, dan tombol riwayat versi (menyimpan hingga 20 versi terakhir dengan fitur *"Kembalikan Versi"*).
- **Manajemen Foto & Galeri (`<ImageField>` & `<GalleryField>`)**:
   - Unggah berkas melalui seret-lepas (drag & drop), pemilihan file, paste, atau tautan URL.
   - Kompresi dan penyesuaian ukuran otomatis di sisi klien (maksimal lebar 1800px).
   - Penentuan titik fokus visual (*focal point* x%/y%) dan teks alternatif (alt text).
   - Penyimpanan gambar resolusi tinggi di IndexedDB (IDB).
- **Entitas Bagian & Daftar**:
   - Tombol kartu **"+ Tambah"** berbentuk garis putus-putus di setiap akhir grid/daftar.
   - Toolbar tindakan kartu saat hover / menu sentuh: **Sunting**, **Duplikat**, **Tampilkan/Sembunyikan**, dan **Hapus** (disertai konfirmasi dan toast "Urungkan").
- **Pratinjau Pengunjung**: Tombol *"Pratinjau sebagai pengunjung"* untuk menyembunyikan semua kontrol admin secara instan guna memastikan tampilan visual presisi.

---

## 📦 Manajemen Produk & Inventaris (`/admin/produk`)

- **Tabel & Filter Lengkap**: Pencarian nama/SKU, filter kategori, koleksi, status publikasi (Aktif/Draf), status stok (Semua, Sisa Rendah, Habis), serta pengurutan harga/stok.
- **Drawer Form Produk**:
   - Tab Info Dasar (nama, kategori, koleksi, deskripsi, bahan, perawatan).
   - Tab Harga & Diskon (harga normal, harga coret/sale, masa promo).
   - Tab Varian Dinamis (kombinasi ukuran S-XXL dan pilihan warna, stok per varian, SKU generator).
   - Tab Galeri Foto & SEO metadata.
- **Pengurangan Stok Otomatis**: Stok varian berkurang saat pesanan dibuat dan otomatis dikembalikan saat pesanan berstatus *Dibatalkan*.
- **Log Mutasi Stok (Stock Movements)**: Mencatat riwayat masuk, keluar, penyesuaian manual, dan referensi pesanan.
- **Badge Status**: Lencana *"Sisa 3"* atau *"Habis"* tampil di katalog toko dan modal Quick View.

---

## 🧾 Alur Pesanan & Faktur Cetak (`/admin/pesanan`)

- **Manajemen Status**:
   - *Busana*: Menunggu Pembayaran ➔ Dibayar ➔ Diproses ➔ Dikirim ➔ Selesai (atau Dibatalkan).
   - *Katering*: Menunggu Konfirmasi ➔ Dikonfirmasi ➔ Diproses ➔ Diantar ➔ Selesai.
- **Drawer Rincian Pesanan**: Timeline status interaktif, nomor resi kurir, catatan internal staf, dan tombol update cepat.
- **Faktur Penjualan Siap Cetak (`/admin/pesanan/:id/invoice`)**: Halaman faktur bersih berstandar komersial dengan nomor invoice, detail pemesan, alamat pengiriman, rincian barang, ongkos kirim, diskon, dan tombol cetak (`window.print`).
- **Ekspor CSV**: Mengunduh seluruh rekap pesanan ke file CSV dalam satu klik.

---

## 📊 Dasbor Analitik Penjualan (`/admin`)

- Dihitung secara murni melalui pure function di `src/services/analytics.ts` dengan pengujian unit otomatis (`analytics.test.ts`).
- **Pengecualian Omset**: Status *Menunggu Pembayaran*, *Menunggu Konfirmasi*, dan *Dibatalkan* **tidak pernah** dihitung sebagai omset pendapatan.
- **Skema Warna Desain**: Menggunakan token resmi (`--charcoal`, `--caramel-deep`, `--indigo`, `--status-available`, `--sand`) tanpa warna merah muda/pink.
- **4 Kartu KPI**: Total Pendapatan, Pesanan Berhasil, Total Pelanggan, dan Rata-rata Nilai Pesanan (AOV) beserta persentase perbandingan periode sebelumnya.
- **Kalimat Ringkasan Otomatis**: Ringkasan performa bisnis dalam bahasa Indonesia lugas.
- **5 Grafik Analitik**: Tren harian, produk terlaris, sebaran kategori, item butuh tindakan (stok menipis & pesanan perlu dikirim), dan kontribusi lini usaha.

---

## ⚙️ Cadangan & Pemulihan Data (Backup & Restore)

Di menu **Pengaturan**:
- **Ekspor Data**: Mengunduh seluruh basis data (produk, pesanan, konten, pengguna, setting, dan aset gambar IndexedDB) dalam bentuk 1 file JSON utuh.
- **Impor Data**: Memulihkan situs dari berkas cadangan JSON.
- **Reset Data Demo**: Mengembalikan database ke status awal benih (*seed data*) bawaan.
