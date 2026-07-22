# SoT-1: Software Requirements Specification (SRS)

**Document Version:** v1.0

**Project:** SIPDB — Sistem Informasi Penerimaan Peserta Didik Baru

**Product:** Web-Based PPDB Management System (Next.js + Firebase)

**Status:** Validated

**Last Updated:** 2026-07-23

**Source:** Derived from Analisis Kebutuhan (`docs/AK/analisis_kebutuhan.md`), Wawancara (`docs/observasi/detail_wawancara.md`), and validasi source code (`ppdb-next/src/`)

---

## 1. Introduction

### 1.1 Purpose

Dokumen ini mendefinisikan kebutuhan fungsional dan non-fungsional untuk sistem SIPDB (Sistem Informasi Penerimaan Peserta Didik Baru) di SD Muhammadiyah Karangkajen. Dokumen ini berfungsi sebagai *Source of Truth* pertama yang menjadi acuan utama bagi seluruh dokumen turunan berikutnya.

### 1.2 Scope

**In Scope:**
- Registrasi dan autentikasi akun (Firebase Authentication)
- Pengisian biodata calon siswa baru
- Upload berkas persyaratan pendaftaran (KK, Akta Kelahiran, SKL, Foto)
- Upload bukti transfer pembayaran manual
- Verifikasi berkas oleh Panitia PPDB
- Pengaturan kuota dinamis per program studi
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

---

## 3. System Features & Feature Inventory

| ID | Fitur | Modul | Prioritas |
|---|---|---|---|
| F-01 | Registrasi akun pendaftar | Auth | Must Have |
| F-02 | Login autentikasi (email + password) | Auth | Must Have |
| F-03 | Pengisian biodata calon siswa | Pendaftar | Must Have |
| F-04 | Upload berkas persyaratan (KK, Akta, SKL, Foto) | Pendaftar | Must Have |
| F-05 | Upload bukti transfer pembayaran | Pendaftar | Must Have |
| F-06 | Monitoring status pendaftaran | Pendaftar | Must Have |
| F-07 | Dashboard pendaftar (antrian, status, kuota) | Pendaftar | Must Have |
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
| NF-07 | Integrasi | File storage via Cloudinary (upload gambar/berkas) |
| NF-08 | Kemudahan | Interface intuitif — orang tua tanpa tech-savvy dapat menggunakannya |

---

## 6. Business Rules

### 6.1 Aturan Pendaftaran
- Pendaftar wajib mengisi biodata lengkap sebelum upload berkas.
- Status pendaftaran default: `menunggu_verifikasi`.
- `user_id` pada siswa bisa `null` jika pendaftaran dilakukan manual oleh panitia.

### 6.2 Aturan Berkas
- Menggunakan pola upsert: jika `student_id` + `file_type` sudah ada, berkas diperbarui.
- Jika semua berkas `disetujui` → siswa otomatis `terverifikasi`.
- Jika ada berkas `ditolak` → siswa otomatis `belum_lengkap`.

### 6.3 Aturan Pembayaran
- Pendaftar cukup upload foto bukti transfer (tanpa form teks tambahan).
- Menggunakan pola upsert: satu siswa hanya memiliki satu catatan pembayaran.
- Bendahara memvalidasi berdasarkan mutasi rekening sekolah.

### 6.4 Aturan Kuota
- Kuota dapat diubah di tengah jalan saat pendaftaran aktif.
- Perubahan kuota ke angka yang lebih rendah dari jumlah siswa yang sudah dinyatakan lulus otomatis ditolak sistem.

### 6.5 Aturan Kelulusan
- Hanya panitia yang dapat menentukan kelulusan.
- Status kelulusan: `lulus` — dinyatakan oleh kepala sekolah/panitia.

---

## 7. Validation Status

| Aspek | Status | Keterangan |
|---|---|---|
| Feature Inventory | ✅ Validated | Sesuai dengan source code `types.ts` dan `api.ts` |
| Roles & Permissions | ✅ Validated | Sesuai dengan `Sidebar.tsx` NAV_ITEMS dan `AuthContext.tsx` |
| Business Rules | ✅ Validated | Sesuai dengan implementasi `apiVerifyDocument`, `apiCreatePayment`, `apiVerifyPayment` |
| Tech Stack | ✅ Validated | Sesuai dengan `firebase.ts`, `package.json` |
| Routes | ✅ Validated | 19 page routes sesuai dengan struktur `src/app/` |

---

## 8. Traceability

| Fitur | Kebutuhan Asal | Implementasi |
|---|---|---|
| F-01: Registrasi | Wawancara — pendaftar daftar online | `AuthContext.tsx` → `createUserWithEmailAndPassword` |
| F-02: Login | Wawancara — autentikasi user | `AuthContext.tsx` → `signInWithEmailAndPassword` |
| F-03: Biodata | Analisis Kebutuhan — form data siswa | `apiCreateStudent`, `apiUpdateStudent` |
| F-04: Upload Berkas | Analisis Kebutuhan — persyaratan berkas | `apiUpsertDocument` |
| F-05: Bukti Bayar | Wawancara — upload bukti transfer | `apiCreatePayment` |
| F-08: Verifikasi Berkas | Analisis Kebutuhan — panitia verifikasi | `apiVerifyDocument` |
| F-09: Kuota Dinamis | Wawancara — kuota bisa diubah | `apiUpdateQuota` |
| F-13: Validasi Bayar | Wawancara — bendahara validasi | `apiVerifyPayment` |
| F-14: Tarif Biaya | Wawancara — kelola komponen biaya | `apiCreateTariff`, `apiUpdateTariff` |
| F-17: Dashboard Kepsek | Wawancara — satu halaman ringkasan | `kepsek/dashboard/page.tsx` |
