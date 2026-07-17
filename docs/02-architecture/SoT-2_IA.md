# SoT-2: Information Architecture (IA)

**Document Version:** v1.0  
**Project:** Sistem Informasi Penerimaan Peserta Didik Baru (PPDB)  
**Status:** Approved  

## 1. PRODUCT STRUCTURE
### 1.1 Product Modules
- **M001: Public Module** (Halaman sebelum login: Beranda, Informasi Alur, Pengumuman Umum, Login/Daftar)
- **M002: Applicant Module** (Dashboard Calon Siswa: Biodata, Dokumen, Pembayaran, Status Hasil)
- **M003: Admin/Panitia Module** (Dashboard Panitia: Verifikasi Berkas, Kuota Dinamis, Konsol Kelulusan, Pengumuman)
- **M004: Finance Module** (Dashboard Bendahara: Verifikasi Bayar, Tarif Biaya, Log Jurnal)
- **M005: Executive Module** (Dashboard Kepala Sekolah: Ringkasan Statistik Real-time)

## 2. SITE MAP & ROUTING CONVENTIONS
- `/` -> Public Beranda
- `/auth/login` -> Gerbang Masuk
- `/pendaftar/dashboard` -> Beranda Utama Orang Tua
- `/panitia/dashboard` -> Konsol Kerja Panitia
- `/bendahara/dashboard` -> Konsol Kerja Bendahara
- `/kepsek/dashboard` -> Satu Halaman Ringkasan Eksekutif

## 3. ROUTING RULES
- Pengguna unauthenticated yang memaksa masuk rute internal otomatis dialihkan ke `/auth/login`.
- Hak akses lintas peran ditolak dengan respon Error 403 (Access Denied).
