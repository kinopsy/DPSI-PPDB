# SoT-1: Software Requirements Specification (SRS)

**Document Version:** v2.0

**Project:** SIPDB — Sistem Informasi Penerimaan Peserta Didik Baru

**Product:** Web-Based PPDB Management System (Next.js + Firebase)

**Status:** Validated

**Last Updated:** 2026-07-24


---

## 1. Introduction

### 1.1 Purpose

Dokumen ini mendefinisikan kebutuhan fungsional dan non-fungsional untuk sistem SIPDB (Sistem Informasi Penerimaan Peserta Didik Baru) di SD Muhammadiyah Karangkajen. Dokumen ini berfungsi sebagai *Source of Truth* pertama yang menjadi acuan utama bagi seluruh dokumen turunan berikutnya.

### 1.2 Scope

**In Scope:**
- Registrasi dan autentikasi akun (Firebase Authentication)
- Pengisian biodata calon siswa baru (NISN 10 digit, NIK 16 digit)
- Upload berkas persyaratan pendaftaran (KK, Akta Kelahiran, SKHUN, SKL)
- Upload bukti transfer pembayaran manual (Rp 250.000)
- Verifikasi berkas oleh Panitia PPDB
- Pengaturan kuota dinamis per program (Kelas Reguler, Tahfidz, Bilingual)
- Penentuan dan pengelolaan status kelulusan
- Konfigurasi tarif dan komponen biaya oleh Bendahara
- Validasi pembayaran oleh Bendahara
- Pengelolaan pengumuman resmi
- Dashboard ringkasan eksekutif untuk Kepala Sekolah
- Jejak audit (audit log) untuk setiap perubahan status

**Out of Scope:**
- Sistem pembayaran otomatis (Payment Gateway)
- Sistem akademik pasca-PPDB
- Manajemen siswa aktif
- Integrasi dengan Dapodik atau sistem pemerintah

### 1.3 Stakeholders

| Stakeholder | Peran | Kebutuhan Utama |
|---|---|---|
| Calon Siswa / Orang Tua | Pendaftar | Mendaftar, upload berkas, bayar, cek status |
| Panitia PPDB | Admin Sekolah | Verifikasi berkas, kelola kuota, kelola kelulusan |
| Bendahara | Keuangan | Validasi pembayaran, atur tarif, audit log |
| Kepala Sekolah | Eksekutif | Pantau ringkasan statistik real-time |

---

## 2. Product Overview

### 2.1 User Types

| # | Tipe Pengguna | Role ID | Deskripsi |
|---|---|---|---|
| 1 | Calon Siswa/Orang Tua | `pendaftar` | Pengguna utama yang mendaftarkan anak |
| 2 | Panitia PPDB | `panitia` | Admin sekolah yang mengelola proses seleksi |
| 3 | Bendahara | `bendahara` | Petugas keuangan yang memvalidasi pembayaran |
| 4 | Kepala Sekolah | `kepsek` | Pimpinan yang memantau secara agregat |

### 2.2 Operating Environment

| Komponen | Teknologi |
|---|---|
| Platform | Responsive Web Application |
| Frontend Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Bahasa | TypeScript 5 |
| CSS Framework | Tailwind CSS 4 |
| Autentikasi | Firebase Authentication (email + password) |
| Database | Firebase Firestore (NoSQL, cloud-hosted) |
| File Storage | Cloudinary (cloud) |
| Project Firebase | `dpsi-ppdb` |

### 2.3 Program Studi

| Program | Kuota | Deskripsi |
|---|---|---|
| Kelas Reguler (A) | 120 siswa | Kurikulum nasional dengan pendekatan modern |
| Kelas Tahfidz (B) | 80 siswa | Integrasi kurikulum nasional dengan tahfidz Qur'an |
| Kelas Bilingual (C) | 40 siswa | Pembelajaran dengan metode bilingual Indonesia-Inggris |

---

## 3. System Features & Feature Inventory

| ID | Fitur | Modul | Prioritas |
|---|---|---|---|
| F-01 | Registrasi akun pendaftar | Auth | Must Have |
| F-02 | Login autentikasi (email + password) | Auth | Must Have |
| F-03 | Pengisian biodata calon siswa (NISN 10 digit, NIK 16 digit) | Pendaftar | Must Have |
| F-04 | Upload berkas persyaratan (KK, Akta, SKHUN, SKL) | Pendaftar | Must Have |
| F-05 | Upload bukti transfer pembayaran (Rp 250.000) | Pendaftar | Must Have |
| F-06 | Monitoring status pendaftaran | Pendaftar | Must Have |
| F-07 | Dashboard pendaftar (progres, status, menu cepat) | Pendaftar | Must Have |
| F-08 | Verifikasi berkas (Setujui/Tolak + catatan) | Panitia | Must Have |
| F-09 | Pengaturan kuota dinamis per program | Panitia | Must Have |
| F-10 | Pengelolaan status kelulusan | Panitia | Must Have |
| F-11 | Pembuatan pengumuman resmi | Panitia | Must Have |
| F-12 | Dashboard panitia (ringkasan, aksi cepat) | Panitia | Must Have |
| F-13 | Verifikasi pembayaran (Lunas/Ditolak) | Bendahara | Must Have |
| F-14 | Pengaturan komponen biaya / tarif | Bendahara | Must Have |
| F-15 | Audit log keuangan | Bendahara | Must Have |
| F-16 | Dashboard bendahara (rekap pembayaran) | Bendahara | Must Have |
| F-17 | Dashboard eksekutif (ringkasan real-time) | Kepsek | Must Have |
| F-18 | Lihat pengumuman publik | Public | Should Have |

---

## 4. Permissions and Access Control

| Aksi | Pendaftar | Panitia | Bendahara | Kepsek |
|---|---|---|---|---|
| Registrasi akun | ✅ | ❌ | ❌ | ❌ |
| Login | ✅ | ✅ | ✅ | ✅ |
| Isi biodata siswa | ✅ (sendiri) | ✅ (manual) | ❌ | ❌ |
| Upload berkas | ✅ | ❌ | ❌ | ❌ |
| Upload bukti bayar | ✅ | ❌ | ❌ | ❌ |
| Verifikasi berkas | ❌ | ✅ | ❌ | ❌ |
| Ubah kuota | ❌ | ✅ | ❌ | ❌ |
| Tentukan kelulusan | ❌ | ✅ | ❌ | ❌ |
| Buat pengumuman | ❌ | ✅ | ❌ | ❌ |
| Validasi pembayaran | ❌ | ❌ | ✅ | ❌ |
| Atur tarif biaya | ❌ | ❌ | ✅ | ❌ |
| Lihat audit log | ❌ | ❌ | ✅ | ❌ |
| Dashboard eksekutif | ❌ | ❌ | ❌ | ✅ (read-only) |
| Lihat pengumuman | ✅ | ✅ | ✅ | ✅ |

---

## 5. Non-Functional Requirements

| ID | Kategori | Deskripsi |
|---|---|---|
| NF-01 | Keamanan | Autentikasi via Firebase Authentication (min. 6 karakter) |
| NF-02 | Keamanan | Data sensitif tidak disimpan di Firestore (password dikelola Firebase Auth) |
| NF-03 | Keamanan | Jejak audit (audit log) otomatis tercatat untuk setiap perubahan status |
| NF-04 | Performa | Aplikasi harus responsif (mobile-friendly) |
| NF-05 | Ketersediaan | Firebase Cloud — 99.9% uptime |
| NF-06 | Skalabilitas | Firestore NoSQL — scale otomatis sesuai traffic |
| NF-07 | Integrasi | File storage via Cloudinary (upload gambar/berkas, max 2MB) |
| NF-08 | Kemudahan | Interface intuitif — orang tua tanpa tech-savvy dapat menggunakannya |

---

## 6. Business Rules

### 6.1 Aturan Pendaftaran
- Pendaftar wajib mengisi biodata lengkap sebelum upload berkas.
- Status pendaftaran default: `menunggu_verifikasi`.
- `user_id` pada siswa bisa `null` jika pendaftaran dilakukan manual oleh panitia.

### 6.2 Aturan Validasi Input
- NISN harus tepat 10 digit.
- NIK harus tepat 16 digit.
- Password minimal 6 karakter.
- File upload maksimal 2MB.
- Format file: PDF, JPG, PNG (berkas); JPG, PNG (bukti bayar).

### 6.3 Aturan Berkas
- Jenis berkas: KK (`kk`), Akta Kelahiran (`akta`), SKHUN (`skhun`), SKL (`skl`).
- Menggunakan pola upsert: jika `student_id` + `file_type` sudah ada, berkas diperbarui.
- Jika semua berkas `disetujui` → siswa otomatis `terverifikasi`.
- Jika ada berkas `ditolak` → siswa otomatis `belum_lengkap`.

### 6.4 Aturan Pembayaran
- Biaya pendaftaran: **Rp 250.000** (transfer ke BCA 1234567890 a.n SD Muhammadiyah Karangkajen).
- Pendaftar cukup upload foto bukti transfer (tanpa form teks tambahan).
- Menggunakan pola upsert: satu siswa hanya memiliki satu catatan pembayaran.
- Bendahara memvalidasi berdasarkan mutasi rekening sekolah.

### 6.5 Aturan Kuota
- Kuota dapat diubah di tengah jalan saat pendaftaran aktif.
- Perubahan kuota ke angka yang lebih rendah dari jumlah siswa yang sudah dinyatakan lulus otomatis ditolak sistem.

### 6.6 Aturan Kelulusan
- Hanya panitia yang dapat menentukan kelulusan.
- Status kelulusan: `lulus` — dinyatakan oleh panitia.

---

## 7. Validation Status

| Aspek | Status | Keterangan |
|---|---|---|
| Feature Inventory | ✅ Validated | Sesuai dengan source code `types.ts` dan `api.ts` |
| Roles & Permissions | ✅ Validated | Sesuai dengan `Sidebar.tsx` NAV_ITEMS dan `AuthContext.tsx` |
| Business Rules | ✅ Validated | Sesuai dengan implementasi `apiVerifyDocument`, `apiCreatePayment`, `apiVerifyPayment` |
| Tech Stack | ✅ Validated | Sesuai dengan `firebase.ts`, `package.json` |
| Routes | ✅ Validated | 19 page routes sesuai dengan struktur `src/app/` |
| Doc Types | ✅ Validated | Sesuai dengan `DOC_TYPES` di `dokumen/page.tsx`: kk, akta, skhun, skl |
| Programs | ✅ Validated | Sesuai dengan landing page: Kelas Reguler (A), Tahfidz (B), Bilingual (C) |
| Payment | ✅ Validated | Sesuai dengan `pembayaran/page.tsx`: Rp 250.000, BCA 1234567890 |

---

## 8. Traceability

| Fitur | Kebutuhan Asal | Implementasi |
|---|---|---|
| F-01: Registrasi | Wawancara — pendaftar daftar online | `AuthContext.tsx` → `createUserWithEmailAndPassword` |
| F-02: Login | Wawancara — autentikasi user | `AuthContext.tsx` → `signInWithEmailAndPassword` |
| F-03: Biodata | Analisis Kebutuhan — form data siswa | `apiCreateStudent`, `apiUpdateStudent` + validasi NISN/NIK |
| F-04: Upload Berkas | Analisis Kebutuhan — persyaratan berkas | `apiUpsertDocument` (kk, akta, skhun, skl) |
| F-05: Bukti Bayar | Wawancara — upload bukti transfer | `apiCreatePayment` (Rp 250.000) |
| F-08: Verifikasi Berkas | Analisis Kebutuhan — panitia verifikasi | `apiVerifyDocument` |
| F-09: Kuota Dinamis | Wawancara — kuota bisa diubah | `apiUpdateQuota` |
| F-13: Validasi Bayar | Wawancara — bendahara validasi | `apiVerifyPayment` |
| F-14: Tarif Biaya | Wawancara — kelola komponen biaya | `apiCreateTariff`, `apiUpdateTariff` |
| F-17: Dashboard Kepsek | Wawancara — satu halaman ringkasan | `kepsek/dashboard/page.tsx` |
