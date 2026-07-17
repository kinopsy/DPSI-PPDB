# SoT-1: Software Requirements Specification (SRS)

**Document Version:** v1.0  
**Project:** Sistem Informasi Penerimaan Peserta Didik Baru (PPDB)  
**Status:** Approved  
**Author:** System Analyst  

## 1. INTRODUCTION
### 1.1 Purpose
Dokumen ini mendefinisikan kebutuhan fungsional dan non-fungsional untuk Aplikasi PPDB Web. Dokumen ini berfungsi sebagai *source of truth* pertama yang menjadi acuan utama bagi seluruh dokumen turunan berikutnya.

### 1.2 Scope
- **In Scope:** Registrasi akun, pengisian biodata dasar, upload berkas persyaratan (KK & Akta), upload bukti transfer manual, verifikasi berkas oleh Panitia, manajemen kuota dinamis, verifikasi kelulusan, konfigurasi tarif dan validasi pembayaran oleh Bendahara, serta dashboard ringkasan untuk Kepala Sekolah.
- **Out of Scope:** Sistem pembayaran otomatis (Payment Gateway), sistem akademik pasca-PPDB.

### 1.3 Stakeholders
- Calon Siswa / Orang Tua (Pendaftar)
- Panitia PPDB (Admin Sekolah)
- Bendahara (Keuangan)
- Kepala Sekolah (Eksekutif)

## 2. PRODUCT OVERVIEW
### 2.1 User Types
1. Calon Siswa/Orang Tua
2. Admin Sekolah (Panitia PPDB)
3. Bendahara / Bagian Keuangan
4. Kepala Sekolah

### 2.2 Operating Environment
- **Platform:** Responsive Web Application
- **Frontend:** HTML5, CSS3, JavaScript
- **Backend/Database:** Server terpusat dengan basis data relasional.

## 3. SYSTEM FEATURES & FEATURE INVENTORY
- **F001:** Manajemen Akun Pendaftar (Registrasi, Login, Reset)
- **F002:** Pengisian Formulir & Unggah Berkas Wajib
- **F003:** Verifikasi Berkas Pendaftaran (Setujui / Tolak Catatan)
- **F004:** Pengaturan Kuota Dinamis & Batas Waktu (Bisa diubah tengah jalan)
- **F005:** Pengelolaan Status Kelulusan
- **F006:** Manajemen Pengumuman Massal
- **F007:** Unggah Bukti Transfer Manual (Tanpa form teks rumit)
- **F008:** Verifikasi Pembayaran Manual oleh Bendahara
- **F009:** Pengaturan Komponen Biaya / Tarif PPDB
- F010 s.d F013: Notifikasi otomatis, Audit Log Keuangan, dan Dashboard Ringkasan.

## 4. PERMISSIONS AND ACCESS CONTROL
- Pendaftar: Mengisi biodata, unggah berkas, unggah bukti transfer, melihat status kelulusan.
- Panitia: Verifikasi berkas, kelola kuota dinamis, kelola status kelulusan, kirim pengumuman.
- Bendahara: Atur tarif biaya, validasi pembayaran (Lunas/Ditolak), audit log keuangan.
- Kepala Sekolah: Melihat satu halaman ringkasan eksekutif secara real-time.
