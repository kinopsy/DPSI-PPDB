# SoT-2: Validated Information Architecture (IA)

**Document Version:** v1.0

**Project:** SIPDB — Sistem Informasi Penerimaan Peserta Didik Baru

**Product:** Web-Based PPDB Management System (Next.js + Firebase)

**Status:** Validated

**Last Updated:** 2026-07-23

**Source:** Derived from SoT-1 (Validated SRS) and validasi source code (`ppdb-next/src/components/Sidebar.tsx`, `ppdb-next/src/app/`)

---

## 1. Product Structure

### 1.1 Product Modules

| ID | Modul | Deskripsi | Target Pengguna |
|---|---|---|---|
| M-01 | Public Module | Halaman sebelum login: Beranda, Pengumuman, Login/Daftar | Semua pengunjung |
| M-02 | Applicant Module | Dashboard pendaftar: Biodata, Dokumen, Pembayaran, Status | Pendaftar |
| M-03 | Admin/Panitia Module | Dashboard panitia: Verifikasi Berkas, Kuota, Kelulusan, Pengumuman | Panitia |
| M-04 | Finance Module | Dashboard bendahara: Verifikasi Pembayaran, Tarif, Audit Log | Bendahara |
| M-05 | Executive Module | Dashboard kepsek: Ringkasan Statistik Real-time (Read-Only) | Kepala Sekolah |

---

## 2. Site Map & Routing Conventions

### 2.1 Complete Route Map

| Route | Modul | Halaman | Akses |
|---|---|---|---|
| `/` | Public | Beranda utama | Semua |
| `/pengumuman` | Public | Pengumuman publik | Semua |
| `/auth/login` | Public | Formulir login | Public |
| `/auth/register` | Public | Formulir registrasi | Public |
| `/pendaftar/dashboard` | Applicant | Dashboard pendaftar | Pendaftar |
| `/pendaftar/biodata` | Applicant | Formulir biodata siswa | Pendaftar |
| `/pendaftar/dokumen` | Applicant | Upload berkas | Pendaftar |
| `/pendaftar/pembayaran` | Applicant | Upload bukti bayar | Pendaftar |
| `/pendaftar/status` | Applicant | Status pendaftaran | Pendaftar |
| `/panitia/dashboard` | Admin | Dashboard panitia | Panitia |
| `/panitia/verifikasi-berkas` | Admin | Verifikasi berkas | Panitia |
| `/panitia/kuota-dinamis` | Admin | Pengaturan kuota | Panitia |
| `/panitia/kelulusan` | Admin | Penentuan kelulusan | Panitia |
| `/panitia/pengumuman` | Admin | Buat pengumuman | Panitia |
| `/bendahara/dashboard` | Finance | Dashboard bendahara | Bendahara |
| `/bendahara/verifikasi-pembayaran` | Finance | Validasi pembayaran | Bendahara |
| `/bendahara/tarif-biaya` | Finance | Pengaturan tarif | Bendahara |
| `/bendahara/audit-log` | Finance | Jejak audit | Bendahara |
| `/kepsek/dashboard` | Executive | Dashboard eksekutif | Kepsek |

### 2.2 Navigation Structure

```
Sidebar Navigation (per role):
├── Pendaftar
│   ├── Dashboard → /pendaftar/dashboard
│   ├── Biodata → /pendaftar/biodata
│   ├── Dokumen → /pendaftar/dokumen
│   ├── Pembayaran → /pendaftar/pembayaran
│   └── Status → /pendaftar/status
├── Panitia
│   ├── Dashboard → /panitia/dashboard
│   ├── Verifikasi Berkas → /panitia/verifikasi-berkas
│   ├── Kuota Dinamis → /panitia/kuota-dinamis
│   ├── Kelulusan → /panitia/kelulusan
│   └── Buat Pengumuman → /panitia/pengumuman
├── Bendahara
│   ├── Dashboard → /bendahara/dashboard
│   ├── Verifikasi Pembayaran → /bendahara/verifikasi-pembayaran
│   ├── Tarif Biaya → /bendahara/tarif-biaya
│   └── Audit Log → /bendahara/audit-log
└── Kepsek
    └── Dashboard → /kepsek/dashboard
```

---

## 3. Routing Rules

| Aturan | Deskripsi |
|---|---|
| Unauthenticated Access | Pengguna yang belum login dan mengakses rute internal otomatis dialihkan ke `/auth/login` |
| Role-Based Access | Hak akses lintas peran ditolak — sidebar hanya menampilkan menu sesuai role |
| Post-Login Redirect | Setelah login, pengguna dialihkan ke dashboard sesuai role (`pendaftar` → `/pendaftar/dashboard`, dll.) |
| Logout | Menghapus session Firebase Auth, redirect ke `/` |
| Public Pages | `/`, `/pengumuman`, `/auth/login`, `/auth/register` dapat diakses tanpa login |

---

## 4. Content Architecture

### 4.1 Public Pages

| Halaman | Konten |
|---|---|
| Beranda (`/`) | Informasi PPDB, alur pendaftaran, CTA login/daftar |
| Pengumuman (`/pengumuman`) | Daftar pengumuman resmi (sorted by date descending) |
| Login (`/auth/login`) | Form email + password |
| Register (`/auth/register`) | Form nama + email + password |

### 4.2 Pendaftar Pages

| Halaman | Konten |
|---|---|
| Dashboard | Status pendaftaran, antrian berkas, info kuota |
| Biodata | Form data siswa (NISN, NIK, nama, lahir, alamat, asal sekolah) |
| Dokumen | Upload grid berkas (KK, Akta, SKL, Foto) dengan status verifikasi |
| Pembayaran | Upload bukti transfer + status pembayaran |
| Status | Ringkasan lengkap: biodata, berkas, pembayaran, kelulusan |

### 4.3 Panitia Pages

| Halaman | Konten |
|---|---|
| Dashboard | Ringkasan: jumlah pendaftar, berkas perlu diverifikasi, kuota |
| Verifikasi Berkas | Tabel antrian berkas — aksi Setujui/Tolak + catatan |
| Kuota Dinamis | Pengaturan kuota per program (IPA, IPS, Bahasa) + deadline |
| Kelulusan | Daftar siswa terverifikasi — aksi Lulus/Tidak Lulus |
| Pengumuman | Form buat pengumuman baru (judul + konten) |

### 4.4 Bendahara Pages

| Halaman | Konten |
|---|---|
| Dashboard | Rekap pembayaran: total, pending, lunas, ditolak |
| Verifikasi Pembayaran | Tabel bukti bayar — aksi Lunas/Ditolak |
| Tarif Biaya | CRUD komponen biaya (nama, nominal, deskripsi) |
| Audit Log | Tabel jejak aktivitas verifikasi dan perubahan tarif |

### 4.5 Kepsek Pages

| Halaman | Konten |
|---|---|
| Dashboard | Satu halaman ringkasan eksekutif — statistik agregat, kuota, dana masuk (read-only) |

---

## 5. Validation Status

| Aspek | Status | Keterangan |
|---|---|---|
| Module Structure | ✅ Validated | 5 modul sesuai dengan 4 role + public |
| Route Map | ✅ Validated | 19 routes sesuai dengan file `page.tsx` di `src/app/` |
| Navigation | ✅ Validated | Sesuai dengan `Sidebar.tsx` NAV_ITEMS |
| Content Pages | ✅ Validated | Setiap route memiliki page.tsx implementasi |
| Routing Rules | ✅ Validated | Sesuai dengan `AuthContext.tsx` dan middleware |
